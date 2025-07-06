# from moviepy.editor import VideoFileClip
# import os

# def extract_audio(video_path):
#     try:
#         video = VideoFileClip(video_path)
#         audio_path = os.path.splitext(video_path)[0] + ".wav"
#         video.audio.write_audiofile(audio_path)
#         video.close()  # close the video clip
#         return audio_path
#     except Exception as e:
#         print(f"Error extracting audio: {e}")
#         return None

# def clip_key_segments(video_path):
#     # Placeholder function for actual clip detection
#     return ["clip1.mp4", "clip2.mp4"]
# video_utils.py

import os
from moviepy.video.io.VideoFileClip import VideoFileClip

def extract_audio(video_path: str) -> str | None:
    """
    Extracts audio from a video file and saves it as a .wav file.
    Returns the path to the saved audio file or None if error occurs.
    """
    try:
        with VideoFileClip(video_path) as video:
            audio_path = os.path.splitext(video_path)[0] + ".wav"
            video.audio.write_audiofile(audio_path)
        return audio_path
    except Exception as e:
        print(f"[ERROR] Failed to extract audio: {e}")
        return None


def clip_key_segments(video_path: str) -> list[str]:
    """
    Placeholder: Returns short clips from the video.
    For now, this returns trimmed segments (e.g., first 5 seconds, etc.).
    """
    try:
        with VideoFileClip(video_path) as video:
            duration = video.duration

            # Let's split the video into 5-second clips
            clips = []
            for start in range(0, int(duration), 5):
                end = min(start + 5, duration)
                clip = video.subclip(start, end)
                clip_path = f"{os.path.splitext(video_path)[0]}_clip_{start}-{int(end)}.mp4"
                clip.write_videofile(clip_path, codec="libx264", audio_codec="aac", logger=None)
                clips.append(clip_path)

        return clips
    except Exception as e:
        print(f"[ERROR] Failed to generate clips: {e}")
        return []
