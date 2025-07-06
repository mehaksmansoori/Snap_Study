import React, { useState, useEffect } from 'react';

const InteractiveQuiz = ({ quizData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [clickIndicator, setClickIndicator] = useState(null); // For visual feedback

  useEffect(() => {
    if (quizData && typeof quizData === 'string') {
      parseQuizData(quizData);
    }
  }, [quizData]);

  // Clear click indicator after a short time
  useEffect(() => {
    if (clickIndicator) {
      const timer = setTimeout(() => setClickIndicator(null), 500);
      return () => clearTimeout(timer);
    }
  }, [clickIndicator]);

  const parseQuizData = (rawQuiz) => {
    try {
      const lines = rawQuiz.split('\n').filter(line => line.trim());
      const parsedQuestions = [];
      let currentQ = null;

      for (let line of lines) {
        line = line.trim();
        
        // Check for question
        if (line.match(/^Question\s*\d+:/i)) {
          if (currentQ) parsedQuestions.push(currentQ);
          currentQ = {
            question: line.replace(/^Question\s*\d+:\s*/i, ''),
            options: [],
            correctAnswer: '',
            id: parsedQuestions.length
          };
        }
        // Check for options
        else if (line.match(/^\([A-D]\)/)) {
          if (currentQ) {
            const option = {
              letter: line.charAt(1),
              text: line.substring(4).trim()
            };
            currentQ.options.push(option);
          }
        }
        // Check for correct answer
        else if (line.match(/^Correct Answer:\s*\([A-D]\)/i)) {
          if (currentQ) {
            currentQ.correctAnswer = line.match(/\(([A-D])\)/)[1];
          }
        }
      }
      
      if (currentQ) parsedQuestions.push(currentQ);
      setQuestions(parsedQuestions.filter(q => q.options.length === 4));
    } catch (error) {
      console.error('Error parsing quiz:', error);
      setQuestions([]);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    console.log(`Handle answer select called: Q${questionId}, Option: ${selectedOption}`);
    
    // Visual feedback
    setClickIndicator(`${questionId}-${selectedOption}`);
    
    setSelectedAnswers(prev => {
      const newState = {
        ...prev,
        [questionId]: selectedOption
      };
      console.log('Updated selectedAnswers:', newState);
      return newState;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setQuizStarted(false);
    setClickIndicator(null);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return '🎉 Excellent! Outstanding performance!';
    if (percentage >= 80) return '👏 Great job! Well done!';
    if (percentage >= 70) return '👍 Good work! Keep it up!';
    if (percentage >= 60) return '📚 Not bad! Room for improvement!';
    return '💪 Keep studying! You can do better!';
  };

  if (!questions.length) {
    return (
      <div className="content-card quiz-card">
        <div className="card-header">
          <h3>🧠 Knowledge Quiz</h3>
          <div className="quiz-badge error">Error</div>
        </div>
        <div className="card-content">
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400">Unable to parse quiz questions. Please try uploading the video again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="content-card quiz-card">
        <div className="card-header">
          <h3>🧠 Knowledge Quiz</h3>
          <div className="quiz-badge">{questions.length} Questions</div>
        </div>
        <div className="card-content">
          <div className="text-center py-8">
            <div className="quiz-start-icon-static mb-6">
              <svg className="w-20 h-20 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h4>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Challenge yourself with {questions.length} questions based on the video content. 
              Track your progress and see how well you understood the material!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-400">{questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400">Multiple Choice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-400">Instant Results</span>
              </div>
            </div>
            <button 
              onClick={() => setQuizStarted(true)}
              className="primary-btn px-8 py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="content-card quiz-card">
        <div className="card-header">
          <h3>🎉 Quiz Results</h3>
          <div className={`quiz-badge ${getScoreColor()}`}>
            {score}/{questions.length}
          </div>
        </div>
        <div className="card-content">
          <div className="text-center py-6">
            <div className="score-circle mb-6">
              <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-slate-400">Your Score</p>
            </div>
            
            <h4 className="text-xl font-semibold text-white mb-2">
              {getScoreMessage()}
            </h4>
            <p className="text-slate-400 mb-6">
              You got {score} out of {questions.length} questions correct.
            </p>

            {/* Question Review */}
            <div className="text-left space-y-4 mb-6 max-h-60 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">Q{index + 1}: {question.question}</p>
                        <div className="text-sm space-y-1">
                          <p className={`${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            Your answer: ({userAnswer}) {question.options.find(opt => opt.letter === userAnswer)?.text}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-400">
                              Correct answer: ({question.correctAnswer}) {question.options.find(opt => opt.letter === question.correctAnswer)?.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={resetQuiz} className="secondary-btn">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="content-card quiz-card">
      <div className="card-header">
        <h3>🧠 Knowledge Quiz</h3>
        <div className="quiz-badge">
          {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="progress-bar mb-4">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="card-content">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h4>
          
          {/* Click indicator for debugging */}
          {clickIndicator && (
            <div className="mb-4 text-center text-green-400 text-sm">
              ✓ Clicked: {clickIndicator}
            </div>
          )}
          
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswers[currentQ.id] === option.letter;
              return (
                <button
                  key={option.letter}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Selecting option: ${option.letter}`);
                    handleAnswerSelect(currentQ.id, option.letter);
                  }}
                  className={`quiz-option ${isSelected ? 'selected' : ''}`}
                  style={{ 
                    pointerEvents: 'auto',
                    userSelect: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div className="option-letter">
                    {option.letter}
                  </div>
                  <div className="option-text">
                    {option.text}
                  </div>
                  {isSelected && (
                    <div className="option-check">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ.id]}
            className="primary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Finish Quiz
              </>
            ) : (
              <>
                Next
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQuiz;