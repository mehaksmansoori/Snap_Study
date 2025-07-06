# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("gemini-pro")

# def generate_quiz(summary: str) -> str:
#     """
#     Generates 5 MCQs from the given summary using Gemini API.
#     Returns a string with formatted questions.
#     """
#     prompt = f"Generate 5 multiple choice questions based on this summary:\n\n{summary}\n\nEach question should have 4 options and highlight the correct answer."
#     response = model.generate_content(prompt)
#     return response.text


import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize model correctly
model = genai.GenerativeModel("models/gemini-pro")

def generate_quiz(summary: str) -> str:
    """
    Uses Gemini to generate 5 MCQs from the given summary.
    """
    prompt = (
        "Generate 5 multiple choice questions based on the following summary:\n\n"
        f"{summary}\n\n"
        "Each question should have exactly 4 options labeled (A), (B), (C), (D), "
        "and the correct answer should be clearly marked."
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else "[Error] No content returned."
    except Exception as e:
        print(f"[ERROR] Quiz generation failed: {e}")
        return "Error generating quiz."

