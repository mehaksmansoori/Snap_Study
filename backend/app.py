# from flask_cors import CORS

# import os
# from dotenv import load_dotenv
# load_dotenv()
# from flask import Flask, request, jsonify
# from video_utils import extract_audio, clip_key_segments
# from summarizer import summarize_text
# from quiz_generator import generate_quiz
# from translator import translate_text
# import whisper

# app = Flask(__name__)
# CORS(app)  # Allow CORS for frontend
# model = whisper.load_model("base")
# @app.route("/", methods=["GET"])
# def index():
#     return "✅ SnapStudy backend is running!"

# @app.route("/upload", methods=["POST"])
# def process_video():
#     try:
#         print(">> Received upload request")
#         file = request.files["file"]
#         print(">> File received:", file.filename)

#         filepath = f"./temp/{file.filename}"
#         os.makedirs("temp", exist_ok=True)
#         file.save(filepath)
#         print(">> File saved at:", filepath)

#         #transcript = model.transcribe(filepath)["text"]
#         # ✅ Extract audio from video
#         audio_path = extract_audio(filepath)

# # ✅ Transcribe audio, not the full video
#         transcript = model.transcribe(audio_path)["text"]
#         print(">> Transcription complete")

#         summary = summarize_text(transcript)
#         print(">> Summary generated")

#         quiz = generate_quiz(summary)
#         print(">> Quiz generated")

#         translated = translate_text(summary, "hi")
#         print(">> Translation complete")

#         clips = clip_key_segments(filepath)
#         print(">> Clips generated")

#         return jsonify({
#             "transcript": transcript,
#             "summary": summary,
#             "quiz": quiz,
#             "translated_summary": translated,
#             "clips": clips
#         })

#     except Exception as e:
#         print("❌ ERROR during processing:", str(e))
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# from dotenv import load_dotenv
# import whisper

# # Custom utility modules
# from video_utils import extract_audio, clip_key_segments
# from summarizer import summarize_text
# from quiz_generator import generate_quiz
# from translator import translate_text

# # Load environment variables
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # Load Whisper model once at startup
# model = whisper.load_model("base")

# @app.route("/", methods=["GET"])
# def index():
#     return "✅ SnapStudy backend is running!"

# @app.route("/upload", methods=["POST"])
# def process_video():
#     try:
#         print(">> Received upload request")

#         # Get uploaded file
#         if "file" not in request.files:
#             return jsonify({"error": "No file part in the request"}), 400
#         file = request.files["file"]

#         if file.filename == "":
#             return jsonify({"error": "No selected file"}), 400

#         print(">> File received:", file.filename)

#         # Save file to temp directory
#         os.makedirs("temp", exist_ok=True)
#         filepath = os.path.join("temp", file.filename)
#         file.save(filepath)
#         print(">> File saved at:", filepath)

#         # Extract audio from video
#         audio_path = extract_audio(filepath)
#         print(">> Audio extracted")

#         # Transcribe audio
#         transcript = model.transcribe(audio_path)["text"]
#         print(">> Transcription complete")

#         # Generate summary
#         summary = summarize_text(transcript)
#         print(">> Summary generated")

#         # Generate quiz from summary
#         quiz = generate_quiz(summary)
#         print(">> Quiz generated")

#         # Translate summary to Hindi
#         translated = translate_text(summary, "hi")
#         print(">> Translation complete")

#         # Clip key segments from video
#         clips = clip_key_segments(filepath)
#         print(">> Clips generated")

#         return jsonify({
#             "transcript": transcript,
#             "summary": summary,
#             "quiz": quiz,
#             "translated_summary": translated,
#             "clips": clips
#         })

#     except Exception as e:
#         print("❌ ERROR during processing:", str(e))
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import whisper

# Custom utility modules
from video_utils import extract_audio, clip_key_segments
from summarizer import summarize_text
from quiz_generator import generate_quiz
from translator import translate_text

# Load environment variables
load_dotenv()

# ✅ Setup Flask to serve React frontend from build/
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

# Load Whisper model once at startup
model = whisper.load_model("base")

# ✅ Serve React frontend (index.html) when visiting /
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

# ✅ Serve static files (JS, CSS, etc.) from React build
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

# ✅ Main backend API
@app.route("/upload", methods=["POST"])
def process_video():
    try:
        print(">> Received upload request")

        # Get uploaded file
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        print(">> File received:", file.filename)

        # Save file to temp directory
        os.makedirs("temp", exist_ok=True)
        filepath = os.path.join("temp", file.filename)
        file.save(filepath)
        print(">> File saved at:", filepath)

        # Extract audio
        audio_path = extract_audio(filepath)
        print(">> Audio extracted")

        # Transcribe
        transcript = model.transcribe(audio_path)["text"]
        print(">> Transcription complete")

        # Summarize
        summary = summarize_text(transcript)
        print(">> Summary generated")

        # Quiz
        quiz = generate_quiz(summary)
        print(">> Quiz generated")

        # Translate
        translated = translate_text(summary, "hi")
        print(">> Translation complete")

        # Clips
        clips = clip_key_segments(filepath)
        print(">> Clips generated")

        return jsonify({
            "transcript": transcript,
            "summary": summary,
            "quiz": quiz,
            "translated_summary": translated,
            "clips": clips
        })

    except Exception as e:
        print("❌ ERROR during processing:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
