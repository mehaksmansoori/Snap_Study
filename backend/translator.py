from deep_translator import GoogleTranslator

def translate_text(text, target_lang='hi'):
    """
    Translates the given text into the target language (default Hindi).
    Returns the translated string.
    """
    try:
        translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"[ERROR] Translation failed: {e}")
        return f"[Translation Error]: {text}"
