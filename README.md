# 🎓 SnapStudy - AI-Powered Learning Platform

<div align="center">

![SnapStudy Logo](https://img.shields.io/badge/SnapStudy-AI%20Learning-purple?style=for-the-badge&logo=graduation-cap)

**Transform your videos into interactive learning experiences with AI**

[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://reactjs.org)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![AI](https://img.shields.io/badge/AI-Whisper%20%7C%20Gemini-purple?style=flat-square)](https://openai.com/whisper)

</div>

## ✨ Features

- 🎤 **AI Transcription** - Extract text from video using OpenAI Whisper
- 📝 **Smart Summarization** - Generate concise summaries using BART/T5 models
- 🧠 **Interactive Quizzes** - AI-generated multiple choice questions with scoring
- 🌍 **Multi-language Translation** - Support for 6+ languages (Hindi, French, Spanish, etc.)
- ✂️ **Video Clipping** - Automatic key segment extraction
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Demo

![SnapStudy Demo](https://via.placeholder.com/800x400/6366f1/ffffff?text=SnapStudy+Demo)

*Upload a video → Get transcript, summary, quiz, and translation in seconds!*

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework
- **OpenAI Whisper** - Speech-to-text
- **Transformers** - Text summarization
- **Google Gemini** - Quiz generation
- **MoviePy** - Video processing
- **Deep Translator** - Multi-language support

### Frontend
- **React 18** - UI framework
- **TailwindCSS** - Styling
- **Modern JavaScript** - ES6+ features

### AI Models
- **Whisper Base** - Audio transcription
- **BART Large CNN** - Text summarization
- **Gemini 1.5 Flash** - Quiz generation

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm
- **FFmpeg** installed and in PATH
- **Google Gemini API Key** (free tier available)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/snapstudy.git
cd snapstudy
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
GEMINI_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Build for production (optional)
npm run build
```

### 4. Install FFmpeg

**Windows:**
```bash
winget install "FFmpeg (Essentials Build)"
```