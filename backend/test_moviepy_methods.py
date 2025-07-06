"""
Test script to check available MoviePy methods
"""

try:
    from moviepy.video.io.VideoFileClip import VideoFileClip
    
    # Check available methods
    methods = [method for method in dir(VideoFileClip) if 'clip' in method.lower()]
    print("Available clip-related methods in VideoFileClip:")
    for method in methods:
        print(f"  - {method}")
    
    # Check specifically for subclip
    if hasattr(VideoFileClip, 'subclip'):
        print("\n✅ subclip method is available")
    else:
        print("\n❌ subclip method is NOT available")
        
    if hasattr(VideoFileClip, 'subclipped'):
        print("✅ subclipped method is available")
    else:
        print("❌ subclipped method is NOT available")
        
    # Check MoviePy version
    import moviepy
    print(f"\nMoviePy version: {moviepy.__version__}")
    
except ImportError as e:
    print(f"Failed to import MoviePy: {e}")