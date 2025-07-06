# # from transformers import pipeline

# # # Initialize Hugging Face summarizer pipeline (downloads model first time)
# # summarizer = pipeline("summarization", model="t5-small")

# # def summarize_text(text):
# #     # Optional: limit input text if too long (T5-small accepts ~512 tokens max)
# #     trimmed_text = text[:1000]  

# #     # Generate summary
# #     summary = summarizer(trimmed_text, max_length=150, min_length=30, do_sample=False)
    
# #     return summary[0]['summary_text']

# from transformers import pipeline

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# def summarize_text(text):
#     trimmed_text = text[:1024]  # bart-large accepts up to ~1024 tokens
#     summary = summarizer(trimmed_text, max_length=180, min_length=40, do_sample=False)
#     return summary[0]['summary_text']


"""
Production-grade text summarization with proper error handling
"""

import logging
from transformers import pipeline
import torch

logger = logging.getLogger(__name__)

# Initialize summarizer with error handling
def initialize_summarizer():
    """Initialize the summarization pipeline with fallbacks"""
    try:
        device = 0 if torch.cuda.is_available() else -1
        
        # Try BART first (better quality)
        summarizer = pipeline(
            "summarization", 
            model="facebook/bart-large-cnn",
            framework="pt",
            device=device
        )
        logger.info("✅ BART summarizer loaded successfully")
        return summarizer, "bart"
        
    except Exception as e:
        logger.warning(f"BART failed, trying T5: {e}")
        try:
            # Fallback to T5
            summarizer = pipeline(
                "summarization", 
                model="t5-small",
                framework="pt",
                device=device
            )
            logger.info("✅ T5 summarizer loaded as fallback")
            return summarizer, "t5"
            
        except Exception as e2:
            logger.error(f"All summarization models failed: {e2}")
            return None, None

# Initialize at module level
summarizer, model_type = initialize_summarizer()

def summarize_text(text: str) -> str:
    """
    Summarize the given text using the loaded model
    
    Args:
        text: Input text to summarize
        
    Returns:
        Summarized text or error message
    """
    if not text or len(text.strip()) < 10:
        return "Text too short to summarize."
    
    if not summarizer:
        return "Summarization model not available."
    
    try:
        # Prepare text based on model type
        if model_type == "t5":
            # T5 requires "summarize: " prefix
            input_text = f"summarize: {text}"
            max_input_length = 512
        else:
            # BART doesn't need prefix
            input_text = text
            max_input_length = 1024
        
        # Limit input length
        if len(input_text) > max_input_length:
            input_text = input_text[:max_input_length]
        
        # Generate summary
        summary_result = summarizer(
            input_text, 
            max_length=180, 
            min_length=40, 
            do_sample=False
        )
        
        if summary_result and len(summary_result) > 0:
            summary = summary_result[0]['summary_text']
            logger.info(f"✅ Summarization successful: {len(summary)} characters")
            return summary
        else:
            return "Summarization produced no output."
    
    except Exception as e:
        logger.error(f"❌ Summarization failed: {e}")
        return f"Summarization error: {str(e)}"

def get_summarizer_info() -> dict:
    """Get information about the loaded summarizer"""
    return {
        "available": summarizer is not None,
        "model_type": model_type,
        "device": "GPU" if torch.cuda.is_available() else "CPU"
    }