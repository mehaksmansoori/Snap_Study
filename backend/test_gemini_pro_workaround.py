"""
Test script to check if gemini-pro works with various workarounds
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini_pro_workarounds():
    """Test different approaches to access gemini-pro"""
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found")
        return
    
    genai.configure(api_key=api_key)
    
    # Different ways to try gemini-pro
    gemini_pro_variants = [
        "gemini-pro",
        "models/gemini-pro", 
        "models/gemini-1.0-pro",
        "gemini-1.0-pro",
        "models/gemini-1.0-pro-latest",
        "gemini-1.0-pro-latest"
    ]
    
    print("🧪 Testing gemini-pro workarounds:\n")
    
    working_variants = []
    
    for variant in gemini_pro_variants:
        try:
            print(f"Testing: {variant}")
            model = genai.GenerativeModel(variant)
            response = model.generate_content("Say hello in one word")
            
            if response and hasattr(response, 'text') and response.text:
                print(f"  ✅ SUCCESS: {variant}")
                print(f"  Response: '{response.text.strip()}'")
                working_variants.append(variant)
            else:
                print(f"  ❌ No valid response")
                
        except Exception as e:
            error_msg = str(e)
            if "404" in error_msg:
                print(f"  ❌ Not found (404)")
            elif "429" in error_msg:
                print(f"  ⚠️  Rate limited (429)")
            else:
                print(f"  ❌ Error: {error_msg}")
        
        print()
    
    print("🎯 Summary:")
    if working_variants:
        print(f"✅ Found {len(working_variants)} working gemini-pro variants:")
        for variant in working_variants:
            print(f"  - {variant}")
        print(f"\n💡 Use '{working_variants[0]}' in your code")
    else:
        print("❌ No gemini-pro variants are working")
        print("📝 Recommendation: Stick with gemini-1.5-flash")
        
    # Also test if we can list the exact model names
    print("\n📋 Checking exact model availability:")
    try:
        models = genai.list_models()
        gemini_models = [m for m in models if 'gemini' in m.name.lower() and 'pro' in m.name.lower()]
        
        print("Available Gemini Pro models:")
        for model in gemini_models:
            if 'generateContent' in model.supported_generation_methods:
                print(f"  ✅ {model.name} - {model.display_name}")
                if 'deprecated' in model.description.lower():
                    print(f"      ⚠️  DEPRECATED: {model.description}")
    except Exception as e:
        print(f"❌ Failed to list models: {e}")

if __name__ == "__main__":
    test_gemini_pro_workarounds()