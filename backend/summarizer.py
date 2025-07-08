

"""
Production-grade text summarization with proper error handling
"""

import logging
from transformers import pipeline, AutoTokenizer
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
        tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
        logger.info("✅ BART summarizer loaded successfully")
        return summarizer, "bart", tokenizer

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
            tokenizer = AutoTokenizer.from_pretrained("t5-small")
            logger.info("✅ T5 summarizer loaded as fallback")
            return summarizer, "t5", tokenizer

        except Exception as e2:
            logger.error(f"All summarization models failed: {e2}")
            return None, None, None

# Initialize at module level
summarizer, model_type, tokenizer = initialize_summarizer()

def clean_summary(summary: str) -> str:
    """Clean filler or awkward phrases from summary"""
    endings_to_remove = [
        "Back to the page you came from.",
        "Let us now explore",
        "In this article",
        "Now let us learn",
        "So let us learn"
    ]
    for phrase in endings_to_remove:
        summary = summary.replace(phrase, "")
    return summary.strip()

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
    
    if not summarizer or not tokenizer:
        return "Summarization model not available."
    
    try:
        # Prepare text based on model type
        if model_type == "t5":
            input_text = f"summarize: {text}"
            max_input_length = 512
        else:
            input_text = text
            max_input_length = 1024

        # Tokenizer-based truncation
        inputs = tokenizer.encode(
            input_text, 
            return_tensors="pt", 
            max_length=max_input_length, 
            truncation=True
        )
        input_text = tokenizer.decode(inputs[0], skip_special_tokens=True)

        # Generate summary
        summary_result = summarizer(
            input_text, 
            max_length=300, 
            min_length=100, 
            do_sample=False
        )

        if summary_result and len(summary_result) > 0:
            summary = summary_result[0]['summary_text']
            summary = clean_summary(summary)
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
