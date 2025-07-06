"""
Production-grade quiz generation using current Gemini AI models
"""

import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini API
def initialize_gemini():
    """Initialize Gemini API with current working models"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment")
            return None, None
        
        genai.configure(api_key=api_key)
        
        # Use the best available models based on test results
        model_names = [
            "gemini-1.5-flash",           # ✅ Working, fast, cost-effective
            "models/gemini-1.5-flash",    # ✅ Working alternative format
            "gemini-2.0-flash-exp",       # ✅ Working experimental
            "models/gemini-1.5-pro",      # Available but may hit quota
            "models/gemini-2.5-flash",    # Latest available
            "models/gemini-2.0-flash",    # Stable 2.0 version
        ]
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                # Test the model with a simple request
                test_response = model.generate_content("Say 'test' in one word.")
                if test_response and hasattr(test_response, 'text'):
                    logger.info(f"✅ Gemini API initialized successfully with model: {model_name}")
                    return model, model_name
            except Exception as e:
                logger.warning(f"❌ Failed to initialize {model_name}: {e}")
                continue
        
        logger.error("❌ All Gemini models failed to initialize")
        return None, None
    
    except Exception as e:
        logger.error(f"❌ Gemini initialization failed: {e}")
        return None, None

# Initialize at module level
model, model_name = initialize_gemini()

def generate_quiz(summary: str) -> str:
    """
    Generate 5 multiple choice questions from the given summary
    
    Args:
        summary: Text summary to generate quiz from
        
    Returns:
        Formatted quiz questions or error message
    """
    if not summary or len(summary.strip()) < 20:
        return "Summary too short to generate meaningful quiz questions."
    
    if not model:
        return "Quiz generation unavailable: Gemini API not configured properly."
    
    prompt = f"""Based on the following content, create 5 multiple choice questions to test understanding:

CONTENT:
{summary}

REQUIREMENTS:
- Generate exactly 5 questions
- Each question should have 4 options: (A), (B), (C), (D)
- Mark the correct answer clearly
- Questions should test different aspects of the content
- Make questions clear and unambiguous
- Focus on key concepts and facts

FORMAT:
Question 1: [Your question here]
(A) First option
(B) Second option
(C) Third option
(D) Fourth option
Correct Answer: (X)

[Continue for all 5 questions]

Please ensure all questions are based on the provided content."""

    try:
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text') and response.text:
            quiz_text = response.text.strip()
            logger.info(f"✅ Quiz generated successfully using {model_name}")
            return quiz_text
        else:
            logger.error("❌ No quiz content returned from Gemini")
            return "Quiz generation failed: No content returned from AI model."
    
    except Exception as e:
        logger.error(f"❌ Quiz generation failed with {model_name}: {e}")
        return f"Quiz generation error: {str(e)}"

def test_gemini_connection() -> dict:
    """Test Gemini API connection with current model"""
    if not model:
        return {"status": "failed", "error": "Model not initialized", "model": "none"}
    
    try:
        response = model.generate_content("Hello")
        return {
            "status": "success", 
            "response": response.text if hasattr(response, 'text') else "No response",
            "model": model_name
        }
    except Exception as e:
        return {"status": "failed", "error": str(e), "model": model_name}

def list_available_models():
    """List currently available Gemini models"""
    try:
        if not os.getenv("GEMINI_API_KEY"):
            return {"error": "API key not configured"}
        
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        models = genai.list_models()
        
        available_models = []
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                available_models.append({
                    "name": m.name,
                    "display_name": m.display_name,
                    "description": m.description
                })
        
        return {"models": available_models}
    
    except Exception as e:
        logger.error(f"Failed to list models: {e}")
        return {"error": str(e)}