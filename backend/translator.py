"""
Production-grade text translation with error handling
"""

import logging
from deep_translator import GoogleTranslator

logger = logging.getLogger(__name__)

def translate_text(text: str, target_lang: str = 'hi', **kwargs) -> str:
    """
    Translate text to the specified target language
    
    Args:
        text: Text to translate
        target_lang: Target language code (default: 'hi' for Hindi)
        
    Returns:
        Translated text or error message
    """
    if not text or len(text.strip()) < 3:
        return "Text too short to translate."
    
    try:
        # Initialize translator
        translator = GoogleTranslator(source='auto', target=target_lang)
        
        # Handle long text by chunking if necessary
        max_length = 5000  # Google Translate limit
        if len(text) > max_length:
            # Split into chunks and translate each
            chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]
            translated_chunks = []
            
            for chunk in chunks:
                translated_chunk = translator.translate(chunk)
                translated_chunks.append(translated_chunk)
            
            result = ' '.join(translated_chunks)
        else:
            result = translator.translate(text)
        
        if result:
            logger.info(f"✅ Translation successful: {len(result)} characters")
            return result
        else:
            return "Translation produced no output."
    
    except Exception as e:
        logger.error(f"❌ Translation failed: {e}")
        return f"Translation error: {str(e)}"

def get_supported_languages() -> dict:
    """Get list of supported language codes"""
    try:
        return GoogleTranslator.get_supported_languages(as_dict=True)
    except Exception as e:
        logger.error(f"Failed to get supported languages: {e}")
        return {"error": str(e)}

def detect_language(text: str) -> str:
    """Detect the language of input text"""
    try:
        translator = GoogleTranslator(source='auto', target='en')
        detected = translator.detect(text)
        return detected
    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        return "unknown"