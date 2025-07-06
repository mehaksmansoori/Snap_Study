import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ API key not found in environment.")
    exit()

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("models/gemini-pro")
    response = model.generate_content("Say hello in 2 lines")
    print("✅ API Key is working!\n")
    print(response.text)
except Exception as e:
    print("❌ API Key is invalid or expired:\n", e)
