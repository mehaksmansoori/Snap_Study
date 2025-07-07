import React, { useState, useRef, useEffect } from "react";
import InteractiveQuiz from './components/InteractiveQuiz';
import AboutUs from './components/AboutUs';
import CustomLanguageDropdown from './components/CustomLanguageDropdown';
import "./index.css"; 

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("summary");
  const [typingText, setTypingText] = useState("");
  const [hasTyped, setHasTyped] = useState(false); 
  const [currentPage, setCurrentPage] = useState("home"); 
  const [selectedLanguage, setSelectedLanguage] = useState("hi"); 
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // EXPANDED LANGUAGE OPTIONS
  const languageOptions = [
    // Most Popular Languages
    { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
    { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
    { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
    { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
    // { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
    // { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
    
    // Additional Popular Languages
    // { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
    // { code: "pt", name: "Portuguese", flag: "🇵🇹", native: "Português" },
    // { code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
    // { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
    // { code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
    // { code: "tr", name: "Turkish", flag: "🇹🇷", native: "Türkçe" },
    
    // Indian Languages
    { code: "bn", name: "Bengali", flag: "🇧🇩", native: "বাংলা" },
    { code: "te", name: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
    { code: "mr", name: "Marathi", flag: "🇮🇳", native: "मराठी" },
    { code: "ta", name: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", flag: "🇮🇳", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳", native: "മലയാളം" },
    { code: "pa", name: "Punjabi", flag: "🇮🇳", native: "ਪੰਜਾਬੀ" },
    
    // Other Popular Languages
    // { code: "nl", name: "Dutch", flag: "🇳🇱", native: "Nederlands" },
    // { code: "pl", name: "Polish", flag: "🇵🇱", native: "Polski" },
    // { code: "sv", name: "Swedish", flag: "🇸🇪", native: "Svenska" },
    // { code: "da", name: "Danish", flag: "🇩🇰", native: "Dansk" },
    // { code: "no", name: "Norwegian", flag: "🇳🇴", native: "Norsk" },
    // { code: "fi", name: "Finnish", flag: "🇫🇮", native: "Suomi" },
    // { code: "th", name: "Thai", flag: "🇹🇭", native: "ไทย" },
    // { code: "vi", name: "Vietnamese", flag: "🇻🇳", native: "Tiếng Việt" },
    // { code: "he", name: "Hebrew", flag: "🇮🇱", native: "עברית" },
    // { code: "id", name: "Indonesian", flag: "🇮🇩", native: "Bahasa Indonesia" },
    // { code: "ms", name: "Malay", flag: "🇲🇾", native: "Bahasa Melayu" },
    // { code: "uk", name: "Ukrainian", flag: "🇺🇦", native: "Українська" },
    // { code: "cs", name: "Czech", flag: "🇨🇿", native: "Čeština" },
    // { code: "hu", name: "Hungarian", flag: "🇭🇺", native: "Magyar" },
    // { code: "ro", name: "Romanian", flag: "🇷🇴", native: "Română" },
    // { code: "bg", name: "Bulgarian", flag: "🇧🇬", native: "Български" },
    // { code: "hr", name: "Croatian", flag: "🇭🇷", native: "Hrvatski" },
    // { code: "sk", name: "Slovak", flag: "🇸🇰", native: "Slovenčina" },
    // { code: "sl", name: "Slovenian", flag: "🇸🇮", native: "Slovenščina" },
    // { code: "et", name: "Estonian", flag: "🇪🇪", native: "Eesti" },
    // { code: "lv", name: "Latvian", flag: "🇱🇻", native: "Latviešu" },
    // { code: "lt", name: "Lithuanian", flag: "🇱🇹", native: "Lietuvių" }
  ];

  // Animated progress simulation during upload
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 8;
        });
      }, 400);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [loading]);

  // Typing animation for results - only run once per response
  useEffect(() => {
    if (response && activeTab === "summary" && !hasTyped) {
      setTypingText("");
      let i = 0;
      const text = response.summary;
      const interval = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setHasTyped(true);
        }
      }, 20);
      return () => clearInterval(interval);
    } else if (response && activeTab === "summary" && hasTyped) {
      setTypingText(response.summary);
    }
  }, [response, activeTab, hasTyped]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a valid video file");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid video file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_lang", selectedLanguage);

    setLoading(true);
    setError("");
    setResponse(null);
    setUploadProgress(0);
    setHasTyped(false);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setTimeout(() => {
        setResponse(data);
        setActiveTab("summary");
      }, 800);

    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Failed to process video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResponse(null);
    setError("");
    setUploadProgress(0);
    setTypingText("");
    setHasTyped(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: "summary", label: "Summary", icon: "📄", color: "emerald" },
    { id: "transcript", label: "Transcript", icon: "📝", color: "blue" },
    { id: "quiz", label: "Quiz", icon: "🧠", color: "amber" },
    { id: "translation", label: "Translation", icon: "🌍", color: "rose" }
  ];

  // Navigation functions
  const goToAboutUs = () => setCurrentPage("about");
  const goToHome = () => setCurrentPage("home");

  // Get selected language info
  const getSelectedLanguageInfo = () => {
    return languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0];
  };

  // Render About Us page
  if (currentPage === "about") {
    return <AboutUs onBackToHome={goToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-background"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl transform rotate-3 hover:rotate-6 transition-transform duration-300 shadow-2xl">
                🎓
              </div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
                SnapStudy
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Transform your videos into 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold"> interactive learning experiences </span>
              with AI-powered summarization, quizzes, and translations
            </p>
            <div className="mt-8 flex justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                AI-Powered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                {languageOptions.length}+ Languages
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Interactive
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="glass-card mb-8 animate-slide-up">
            <div
              className={`upload-zone ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <div className="text-center">
                  <div className="upload-icon mb-6">
                    <svg className="w-16 h-16 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Drop your video here</h3>
                  <p className="text-slate-400 mb-4">or click to browse your files</p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-1 bg-slate-800 rounded">MP4</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">AVI</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">MOV</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">MKV</span>
                    <span className="px-2 py-1 bg-slate-800 rounded">Max 500MB</span>
                  </div>
                </div>
              ) : (
                <div className="file-preview">
                  {file.type.startsWith("video/") && (
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(file)}
                      controls
                      className="max-w-full max-h-48 rounded-xl mb-4 shadow-2xl"
                      preload="metadata"
                      onLoadedMetadata={() => {
                        if (videoRef.current && !videoRef.current.dataset.logged) {
                          console.log("Video duration:", formatDuration(videoRef.current.duration));
                          videoRef.current.dataset.logged = "true";
                        }
                      }}
                    />
                  )}
                  <div className="file-info">
                    <h4 className="text-xl font-semibold text-white mb-2">{file.name}</h4>
                    <div className="flex justify-center gap-4 text-slate-400 text-sm">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.type.split('/')[1].toUpperCase()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                    className="remove-file-btn mt-4"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Beautiful Custom Language Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                🌐 Translation Language ({languageOptions.length} languages supported)
              </label>
              <CustomLanguageDropdown
                languageOptions={languageOptions}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="primary-btn flex-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="loading-spinner"></div>
                    <span>Processing Magic...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Transform Video</span>
                  </div>
                )}
              </button>
              
              {file && (
                <button onClick={resetUpload} className="secondary-btn">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Start Over</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="progress-container mt-6">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-slate-400 mt-3 font-medium">
                  {uploadProgress < 20 ? "🎵 Extracting audio..." : 
                   uploadProgress < 50 ? "🎯 Transcribing content..." :
                   uploadProgress < 70 ? "📝 Generating summary..." :
                   uploadProgress < 90 ? "🧠 Creating quiz..." : "✨ Finalizing..."}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-alert mt-6">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          {response && !loading && (
            <div className="results-container animate-fade-in">
              {/* Tab Navigation */}
              <div className="tab-navigation mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  >
                    <span className="text-2xl mb-1">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "summary" && (
                  <div className="content-card summary-card">
                    <div className="card-header">
                      <h3>📝 Smart Summary</h3>
                      <div className="word-count">
                        {response.summary.split(' ').length} words
                      </div>
                    </div>
                    <div className="card-content">
                      <p className="leading-relaxed">
                        {typingText || response.summary}
                        {typingText && typingText.length < response.summary.length && (
                          <span className="animate-pulse">|</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "transcript" && (
                  <div className="content-card transcript-card">
                    <div className="card-header">
                      <h3>🗣️ Full Transcript</h3>
                      <div className="word-count">
                        {response.transcript.split(' ').length} words
                      </div>
                    </div>
                    <div className="card-content">
                      <p className="leading-relaxed">{response.transcript}</p>
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <InteractiveQuiz quizData={response.quiz} />
                )}

                {activeTab === "translation" && (
                  <div className="content-card translation-card">
                    <div className="card-header">
                      <h3>🌍 Translation</h3>
                      <div className="language-badge">
                        {getSelectedLanguageInfo().flag} {getSelectedLanguageInfo().name}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                        <p className="text-sm text-slate-400 mb-1">Translated to:</p>
                        <p className="text-purple-400 font-medium">
                          {getSelectedLanguageInfo().name} ({getSelectedLanguageInfo().native})
                        </p>
                      </div>
                      <p className="leading-relaxed translation-text" 
                         style={{ 
                           fontFamily: ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'].includes(selectedLanguage) 
                             ? "'Noto Sans Devanagari', 'Mukti', sans-serif" 
                             : ['zh', 'ja', 'ko'].includes(selectedLanguage)
                             ? "'Noto Sans CJK', sans-serif"
                             : ['ar', 'he'].includes(selectedLanguage)
                             ? "'Noto Sans Arabic', sans-serif"
                             : "inherit",
                           direction: ['ar', 'he'].includes(selectedLanguage) ? 'rtl' : 'ltr'
                         }}>
                        {response.translated_summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="relative z-10 text-center py-8 text-slate-500 text-sm">
        <p>
          Made with ❤️ by{" "}
          <button 
            onClick={goToAboutUs}
            className="underline hover:text-purple-400 transition-colors cursor-pointer"
          >
            Team Pradeep
          </button>
          {" "}• SnapStudy v1.0
        </p>
      </div> */}
    </div>
  );
}

export default App;