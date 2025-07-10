"""
SnapStudy Backend - Fixed version with proper FFmpeg PATH handling
"""

import os
import sys
import logging
import traceback
from typing import Optional, Dict, Any
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Fix FFmpeg PATH issues before importing any video libraries
def setup_ffmpeg_path():
    """Ensure FFmpeg is available in PATH for all subprocesses"""
    import subprocess
    import shutil
    
    # Check if ffmpeg is already in PATH
    if shutil.which('ffmpeg'):
        logging.info("FFmpeg found in PATH")
        return True
    
    # Common FFmpeg installation paths on Windows
    possible_paths = [
        r"C:\ffmpeg\bin",
        r"C:\Program Files\FFmpeg\bin",
        r"C:\tools\ffmpeg\bin",
        os.path.expanduser(r"~\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-7.1.1-essentials_build\bin")
    ]
    
    for path in possible_paths:
        if os.path.exists(path) and os.path.exists(os.path.join(path, 'ffmpeg.exe')):
            logging.info(f"Found FFmpeg at: {path}")
            os.environ['PATH'] = path + os.pathsep + os.environ['PATH']
            return True
    
    # Try to find FFmpeg using where command
    try:
        result = subprocess.run(['where', 'ffmpeg'], capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            ffmpeg_path = Path(result.stdout.strip()).parent
            os.environ['PATH'] = str(ffmpeg_path) + os.pathsep + os.environ['PATH']
            logging.info(f"Found FFmpeg using 'where': {ffmpeg_path}")
            return True
    except Exception as e:
        logging.warning(f"Failed to locate FFmpeg with 'where': {e}")
    
    logging.error("FFmpeg not found in any common locations")
    return False

# Setup FFmpeg path before importing other modules
setup_ffmpeg_path()

# Now import video processing libraries
import whisper
from video_utils import extract_audio, clip_key_segments
from summarizer import summarize_text
from quiz_generator import generate_quiz
from translator import translate_text

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SnapStudyApp:
    """Enhanced application class with better error handling"""
    
    def __init__(self):
        self.app = None
        self.whisper_model = None
        self.setup_environment()
        self.setup_flask()
        self.setup_whisper()
        
    def setup_environment(self) -> None:
        """Setup environment variables and validate dependencies"""
        load_dotenv()
        
        # Validate FFmpeg availability
        import shutil
        if not shutil.which('ffmpeg'):
            logger.error("FFmpeg not found in PATH after setup")
            raise EnvironmentError(
                "FFmpeg not found. Please install FFmpeg and ensure it's in your PATH.\n"
                "Install: winget install 'FFmpeg (Essentials Build)'"
            )
        
        # Validate required environment variables
        if not os.getenv('GEMINI_API_KEY'):
            logger.warning("GEMINI_API_KEY not found - quiz generation may fail")
            
        logger.info("Environment configuration validated")
    
    def setup_flask(self) -> None:
        """Configure Flask application"""
        self.app = Flask(
            __name__, 
            static_folder="../frontend/build", 
            static_url_path="/"
        )
        
        CORS(self.app, origins=["http://localhost:3000", "http://localhost:3003", "http://127.0.0.1:3000", "http://127.0.0.1:3003"])
        self.app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB
        
        self.setup_routes()
        logger.info("Flask application configured")
        
    def setup_whisper(self) -> None:
        """Initialize Whisper model with enhanced error handling"""
        try:
            logger.info("Loading Whisper model...")
            self.whisper_model = whisper.load_model("base")
            logger.info("Whisper model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            self.whisper_model = None
            
    def setup_routes(self) -> None:
        """Define application routes"""
        
        @self.app.route("/")
        def serve_react():
            return send_from_directory(self.app.static_folder, "index.html")
            
        @self.app.errorhandler(404)
        def not_found(e):
            return send_from_directory(self.app.static_folder, "index.html")
            
        @self.app.route("/health", methods=["GET"])
        def health_check():
            import shutil
            return jsonify({
                "status": "healthy",
                "ffmpeg_available": shutil.which('ffmpeg') is not None,
                "whisper_available": self.whisper_model is not None,
                "version": "1.0.0"
            })
            
        @self.app.route("/upload", methods=["POST"])
        def process_video():
            return self._process_video_request()
            
    def _process_video_request(self) -> tuple[Dict[str, Any], int]:
        """Enhanced video processing with detailed error tracking"""
        try:
            # Validate request
            if "file" not in request.files:
                return jsonify({"error": "No file uploaded"}), 400
                
            file = request.files["file"]
            if not file or file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            
            # Get target language for translation
            target_lang = request.form.get("target_lang", "hi")
                
            logger.info(f"Processing video: {file.filename}, target language: {target_lang}")
            
            # Create temp directory and save file
            temp_dir = Path("temp")
            temp_dir.mkdir(exist_ok=True)
            
            # Sanitize filename
            safe_filename = self._sanitize_filename(file.filename)
            filepath = temp_dir / safe_filename
            file.save(str(filepath))
            
            logger.info(f"File saved: {filepath} ({filepath.stat().st_size} bytes)")
            
            # Process video
            results = self._enhanced_processing_pipeline(str(filepath), target_lang)
            
            # Cleanup
            self._cleanup_files(str(filepath))
            
            return jsonify(results), 200
            
        except Exception as e:
            logger.error(f"Request processing failed: {e}", exc_info=True)
            return jsonify({"error": f"Processing failed: {str(e)}"}), 500
            
    def _enhanced_processing_pipeline(self, filepath: str, target_lang: str = "hi") -> Dict[str, Any]:
        """Enhanced processing pipeline with better error isolation"""
        results = {
            "transcript": "",
            "summary": "",
            "quiz": "",
            "translated_summary": "",
            "clips": []
        }
        
        try:
            # Step 1: Audio extraction
            logger.info("Step 1: Extracting audio")
            audio_path = extract_audio(filepath)
            if not audio_path or not Path(audio_path).exists():
                raise RuntimeError("Audio extraction failed - no audio file created")
            
            logger.info(f"Audio extracted successfully: {audio_path}")
            
            # Step 2: Transcription
            logger.info("Step 2: Starting transcription")
            results["transcript"] = self._safe_transcribe(audio_path)
            
            # Step 3: Summarization
            logger.info("Step 3: Generating summary")
            if results["transcript"] and "failed" not in results["transcript"].lower():
                results["summary"] = self._safe_execute(
                    summarize_text, results["transcript"]
                )
            else:
                results["summary"] = "Cannot summarize - transcription failed"
            
            # Step 4: Quiz generation
            logger.info("Step 4: Generating quiz")
            if results["summary"] and "failed" not in results["summary"].lower():
                results["quiz"] = self._safe_execute(
                    generate_quiz, results["summary"]
                )
            else:
                results["quiz"] = "Cannot generate quiz - summary unavailable"
            
            # Step 5: Translation
            logger.info("Step 5: Translating summary")
            if results["summary"] and "failed" not in results["summary"].lower():
                results["translated_summary"] = self._safe_execute(
                    translate_text, results["summary"], target_lang=target_lang
                )
            else:
                results["translated_summary"] = "Cannot translate - summary unavailable"
            
            # Step 6: Clip generation (optional)
            logger.info("Step 6: Generating clips")
            results["clips"] = self._safe_execute(
                clip_key_segments, filepath
            ) or []
            
            logger.info("Processing pipeline completed successfully")
            return results
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}", exc_info=True)
            results["transcript"] = f"Processing failed: {str(e)}"
            return results
            
    def _safe_transcribe(self, audio_path: str) -> str:
        """Enhanced transcription with better error handling"""
        if not self.whisper_model:
            return "Transcription unavailable: Whisper model not loaded"
        
        try:
            # Verify audio file exists and is readable
            if not os.path.exists(audio_path):
                return f"Transcription failed: Audio file not found at {audio_path}"
            
            file_size = os.path.getsize(audio_path)
            if file_size < 1000:  # Less than 1KB
                return f"Transcription failed: Audio file too small ({file_size} bytes)"
            
            logger.info(f"Transcribing audio file: {audio_path} ({file_size} bytes)")
            
            # Set environment variables for FFmpeg
            env = os.environ.copy()
            
            # Transcribe with error handling
            result = self.whisper_model.transcribe(audio_path)
            transcript = result.get("text", "").strip()
            
            if not transcript:
                return "Transcription completed but no text was detected"
            
            logger.info(f"Transcription successful: {len(transcript)} characters")
            return transcript
            
        except FileNotFoundError as e:
            logger.error(f"File not found during transcription: {e}")
            return f"Transcription failed: Required file not found - {str(e)}"
        except Exception as e:
            logger.error(f"Transcription failed: {e}", exc_info=True)
            return f"Transcription failed: {str(e)}"
            
    def _safe_execute(self, func, *args, **kwargs) -> str:
        """Safely execute functions with comprehensive error handling"""
        try:
            result = func(*args, **kwargs)
            return result if result else "Operation completed but returned no result"
        except Exception as e:
            logger.error(f"Function {func.__name__} failed: {e}", exc_info=True)
            return f"{func.__name__} failed: {str(e)}"
            
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for security"""
        import re
        safe_name = re.sub(r'[^\w\-_\.]', '_', filename)
        return safe_name[:100]
        
    def _cleanup_files(self, filepath: str) -> None:
        """Clean up temporary files"""
        try:
            files_to_clean = [
                filepath,
                filepath.replace('.mp4', '.wav'),
                filepath.replace('.avi', '.wav'),
                filepath.replace('.mov', '.wav'),
            ]
            
            for file_path in files_to_clean:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up: {file_path}")
                    
        except Exception as e:
            logger.warning(f"Cleanup failed: {e}")
            
    def run(self, host="127.0.0.1", port=5000, debug=False):
        """Run the application"""
        logger.info(f"Starting SnapStudy server on {host}:{port}")
        self.app.run(host=host, port=port, debug=debug, use_reloader=False)


if __name__ == "__main__":
    try:
        app_instance = SnapStudyApp()
        app_instance.run(debug=True)
    except Exception as e:
        logger.critical(f"Failed to start application: {e}", exc_info=True)
        print(f"\n❌ Startup failed: {e}")
        print("\nPlease ensure:")
        print("1. FFmpeg is installed: winget install 'FFmpeg (Essentials Build)'")
        print("2. Restart PowerShell after FFmpeg installation")
        print("3. All Python dependencies are installed: pip install -r requirements.txt")
        sys.exit(1)
# expose app instance for gunicorn
app_instance = SnapStudyApp()
app = app_instance.app
