import React from 'react';

const AboutUs = ({ onBackToHome }) => {
  const teamMembers = [
    {
      name: "Pradeep Kumar",
      role: "Lead Developer & AI Architect",
      image: "👨‍💻",
      description: "Passionate about creating intelligent learning solutions that transform education through AI.",
      skills: ["AI/ML", "Full Stack", "Python", "React"]
    },
    {
      name: "Team Pradeep",
      role: "Innovation Squad",
      image: "🚀",
      description: "A dedicated team of developers, designers, and AI enthusiasts building the future of education.",
      skills: ["Collaboration", "Innovation", "Quality", "User Experience"]
    }
  ];

  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Learning",
      description: "Leverage cutting-edge AI models like Whisper and Gemini to transform videos into interactive learning experiences."
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description: "Break language barriers with intelligent translation supporting Hindi, French, and more languages."
    },
    {
      icon: "🧠",
      title: "Interactive Quizzes",
      description: "Generate intelligent quizzes automatically from video content to test and reinforce learning."
    },
    {
      icon: "⚡",
      title: "Real-Time Processing",
      description: "Fast and efficient video processing with live progress tracking and instant results."
    },
    {
      icon: "🎨",
      title: "Beautiful Interface",
      description: "Modern glassmorphism design with smooth animations and responsive layout for all devices."
    },
    {
      icon: "🔒",
      title: "Privacy Focused",
      description: "Your data stays secure with client-side processing and no permanent storage of personal content."
    }
  ];

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
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {/* Home */}
            </button>
            
            <div className="inline-flex items-center gap-4 mb-6 ml-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl transform rotate-3 hover:rotate-6 transition-transform duration-300 shadow-2xl">
                👥
              </div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
                About Us
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Revolutionizing education through 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold"> artificial intelligence </span>
              and innovative learning technologies
            </p>
          </div>

          {/* Mission Statement */}
          <div className="glass-card mb-8 animate-slide-up">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                At SnapStudy, we believe that learning should be accessible, engaging, and personalized for everyone. 
                Our mission is to harness the power of artificial intelligence to transform traditional educational 
                content into interactive, multilingual learning experiences that adapt to each learner's needs.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="glass-card mb-8 animate-slide-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-member-card">
                    <div className="team-avatar mb-4">
                      <span className="text-6xl">{member.image}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-purple-400 font-semibold mb-4">{member.role}</p>
                    <p className="text-slate-300 leading-relaxed mb-4">{member.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="glass-card mb-8 animate-slide-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">What We Built</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon mb-4">
                      <span className="text-4xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="glass-card mb-8 animate-slide-up">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-8">Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "React", icon: "⚛️" },
                  { name: "Python", icon: "🐍" },
                  { name: "Flask", icon: "🌶️" },
                  { name: "Whisper AI", icon: "🎤" },
                  { name: "Gemini", icon: "💎" },
                  { name: "MoviePy", icon: "🎬" },
                  { name: "TailwindCSS", icon: "💨" },
                  { name: "FFmpeg", icon: "🎵" }
                ].map((tech, index) => (
                  <div key={index} className="tech-card">
                    <span className="text-3xl mb-2 block">{tech.icon}</span>
                    <span className="text-white font-semibold">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass-card mb-8 animate-slide-up">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
                Have ideas, feedback, or want to collaborate? We'd love to hear from you!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:team@snapstudy.ai" className="contact-btn">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
                <a href="https://github.com/teampradeep" className="contact-btn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-slate-500 text-sm">
        <p>Built with ❤️ by Team Pradeep • SnapStudy v1.0 • Transforming Education with AI</p>
      </div>
    </div>
  );
};

export default AboutUs;