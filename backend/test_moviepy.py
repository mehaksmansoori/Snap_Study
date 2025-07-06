"""
Test script to check MoviePy AudioFileClip.write_audiofile parameters
"""

import inspect
from moviepy.audio.io.AudioFileClip import AudioFileClip

def test_moviepy_parameters():
    """Test which parameters are supported by write_audiofile"""
    
    # Get the signature of write_audiofile method
    sig = inspect.signature(AudioFileClip.write_audiofile)
    
    print("Available parameters for write_audiofile:")
    for param_name, param in sig.parameters.items():
        print(f"  {param_name}: {param.default}")
    
    # Check if verbose parameter exists
    has_verbose = 'verbose' in sig.parameters
    print(f"\nSupports 'verbose' parameter: {has_verbose}")
    
    # Test moviepy version
    try:
        import moviepy
        print(f"MoviePy version: {moviepy.__version__}")
    except AttributeError:
        print("MoviePy version: Unknown")

if __name__ == "__main__":
    test_moviepy_parameters()