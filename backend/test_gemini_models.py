"""
Test script to check available Gemini models and find working ones
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini_models():
    """Test which Gemini models are currently available"""
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment")
        return
    
    print(f"🔑 Using API Key: {api_key[:10]}...{api_key[-4:]}")
    
    try:
        genai.configure(api_key=api_key)
        print("✅ API configured successfully")
        
        # List all available models
        print("\n📋 Listing all available models:")
        try:
            models = genai.list_models()
            print(f"Found {len(list(models))} total models")
            
            # Reset generator and filter for content generation models
            models = genai.list_models()
            content_models = []
            
            for model in models:
                if 'generateContent' in model.supported_generation_methods:
                    content_models.append(model)
                    print(f"  ✅ {model.name} - {model.display_name}")
                    print(f"      Description: {model.description}")
                    print(f"      Methods: {model.supported_generation_methods}")
                    print()
            
            if not content_models:
                print("❌ No models support generateContent")
                return
            
        except Exception as e:
            print(f"❌ Failed to list models: {e}")
            return
        
        # Test specific models that should work
        test_models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro", 
            "gemini-2.0-flash-exp",
            "models/gemini-1.5-flash",
            "models/gemini-1.5-pro"
        ]
        
        print("\n🧪 Testing specific models:")
        working_models = []
        
        for model_name in test_models:
            try:
                print(f"\nTesting: {model_name}")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content("Say hello in one word")
                
                if response and hasattr(response, 'text') and response.text:
                    print(f"  ✅ WORKING: {model_name}")
                    print(f"  Response: {response.text.strip()}")
                    working_models.append(model_name)
                else:
                    print(f"  ❌ Failed: No valid response")
                    
            except Exception as e:
                print(f"  ❌ Failed: {str(e)}")
        
        print(f"\n🎉 Summary:")
        print(f"Working models: {len(working_models)}")
        for model in working_models:
            print(f"  - {model}")
        
        if working_models:
            print(f"\n💡 Recommendation: Use '{working_models[0]}' in your app")
        else:
            print("\n❌ No working models found!")
            
    except Exception as e:
        print(f"❌ Setup failed: {e}")

if __name__ == "__main__":
    test_gemini_models()