"""
Enhanced video processing utilities with proper MoviePy method calls
"""

import os
import logging
import shutil
from pathlib import Path
from typing import Optional, List

logger = logging.getLogger(__name__)

def ensure_ffmpeg_available():
    """Ensure FFmpeg is available and properly configured"""
    if shutil.which('ffmpeg'):
        return True
    
    # Try to find and add FFmpeg to PATH
    winget_path = os.path.expanduser(
        r"~\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe"
    )
    
    possible_paths = [
        r"C:\ffmpeg\bin",
        r"C:\Program Files\FFmpeg\bin",
        os.path.join(winget_path, "ffmpeg-7.1.1-essentials_build", "bin") if os.path.exists(winget_path) else None,
    ]
    
    for path in possible_paths:
        if path and os.path.exists(path) and os.path.exists(os.path.join(path, 'ffmpeg.exe')):
            os.environ['PATH'] = path + os.pathsep + os.environ.get('PATH', '')
            logger.info(f"Added FFmpeg to PATH: {path}")
            return True
    
    return False

def extract_audio(video_path: str) -> Optional[str]:
    """
    Extract audio from video with enhanced error handling and FFmpeg validation
    """
    try:
        # Ensure FFmpeg is available
        if not ensure_ffmpeg_available():
            logger.error("FFmpeg not available for audio extraction")
            return None
        
        video_path = Path(video_path)
        
        # Validate input
        if not video_path.exists():
            logger.error(f"Video file not found: {video_path}")
            return None
        
        if video_path.stat().st_size == 0:
            logger.error(f"Video file is empty: {video_path}")
            return None
        
        logger.info(f"Extracting audio from: {video_path}")
        
        # Import moviepy after ensuring FFmpeg is available
        from moviepy.video.io.VideoFileClip import VideoFileClip
        
        # Generate output path
        audio_path = video_path.with_suffix('.wav')
        
        # Process video
        with VideoFileClip(str(video_path)) as video:
            if video.audio is None:
                logger.error("No audio track found in video")
                return None
            
            # Extract audio with optimal settings for Whisper
            video.audio.write_audiofile(
                str(audio_path),
                logger=None,
                codec='pcm_s16le',  # Uncompressed for better compatibility
                ffmpeg_params=['-ar', '16000']  # 16kHz sample rate (Whisper optimized)
            )
        
        # Validate output
        if not audio_path.exists():
            logger.error(f"Audio file was not created: {audio_path}")
            return None
        
        if audio_path.stat().st_size < 1000:  # Less than 1KB indicates failure
            logger.error(f"Audio file too small: {audio_path} ({audio_path.stat().st_size} bytes)")
            return None
        
        logger.info(f"Audio extraction successful: {audio_path} ({audio_path.stat().st_size} bytes)")
        return str(audio_path)
        
    except ImportError as e:
        logger.error(f"MoviePy import failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Audio extraction failed: {e}", exc_info=True)
        return None

def clip_key_segments(video_path: str, max_clips: int = 1) -> List[str]:
    """
    Generate video clips with proper MoviePy method calls
    """
    try:
        # Ensure FFmpeg is available
        if not ensure_ffmpeg_available():
            logger.error("FFmpeg not available for clip generation")
            return []
        
        video_path = Path(video_path)
        
        if not video_path.exists():
            logger.error(f"Video file not found: {video_path}")
            return []
        
        logger.info(f"Generating clips from: {video_path}")
        
        # Import moviepy after ensuring FFmpeg is available
        from moviepy.video.io.VideoFileClip import VideoFileClip
        
        clips = []
        
        try:
            with VideoFileClip(str(video_path)) as video:
                duration = video.duration
                
                if duration < 5:  # Too short for meaningful clips
                    logger.info("Video too short for clip generation")
                    return []
                
            # Create a single 5-second clip from the beginning
            try:
                clip_end = min(5, duration)
                
                # Use subclipped method for MoviePy 2.1.2
                subclip = video.subclipped(0, clip_end)
                
                # Check if subclip was created successfully
                if subclip is None:
                    logger.warning("Subclipped operation returned None")
                    return []
                
                clip_path = video_path.parent / f"{video_path.stem}_clip_0-{int(clip_end)}.mp4"
                
                # Try to write the video file
                subclip.write_videofile(
                    str(clip_path),
                    codec='libx264',
                    audio_codec='aac',
                    logger=None,
                    preset='medium',
                    ffmpeg_params=['-crf', '23']
                )
                
                # Close the subclip to free resources
                subclip.close()
                
                clips.append(str(clip_path))
                logger.info(f"Generated clip: {clip_path}")
                
            except Exception as e:
                logger.warning(f"Failed to generate clip: {e}")
                # Skip clip generation if it fails, don't return empty list
                pass
        
        except Exception as e:
            logger.error(f"Failed to open video file: {e}")
            return []
        
        return clips
        
    except ImportError as e:
        logger.error(f"MoviePy import failed: {e}")
        return []
    except Exception as e:
        logger.error(f"Clip generation failed: {e}", exc_info=True)
        return []