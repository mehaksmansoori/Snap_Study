import React, { useState, useEffect } from 'react';

const InteractiveQuiz = ({ quizData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [clickIndicator, setClickIndicator] = useState(null);

  useEffect(() => {
    if (quizData && typeof quizData === 'string') {
      parseQuizData(quizData);
    }
  }, [quizData]);

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
        
        if (line.match(/^Question\s*\d+:/i)) {
          if (currentQ) parsedQuestions.push(currentQ);
          currentQ = {
            question: line.replace(/^Question\s*\d+:\s*/i, ''),
            options: [],
            correctAnswer: '',
            id: parsedQuestions.length
          };
        }
        else if (line.match(/^\([A-D]\)/)) {
          if (currentQ) {
            const option = {
              letter: line.charAt(1),
              text: line.substring(4).trim()
            };
            currentQ.options.push(option);
          }
        }
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
    if (percentage >= 80) return 'mumbai-text-green';
    if (percentage >= 60) return 'mumbai-text-yellow';
    return 'mumbai-text-red';
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
      <div className="mumbai-quiz-container">
        <div className="mumbai-quiz-header">
          <h3 className="mumbai-quiz-title">🧠 Knowledge Quiz</h3>
          <div className="mumbai-quiz-badge mumbai-error">Error</div>
        </div>
        <div className="mumbai-quiz-content">
          <div className="mumbai-error-state">
            <svg className="mumbai-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mumbai-error-text">Unable to parse quiz questions. Please try uploading the video again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="mumbai-quiz-container">
        <div className="mumbai-quiz-header">
          <h3 className="mumbai-quiz-title">🧠 Knowledge Quiz</h3>
          <div className="mumbai-quiz-badge">{questions.length} Questions</div>
        </div>
        <div className="mumbai-quiz-content">
          <div className="mumbai-quiz-start">
            <div className="mumbai-start-icon">
              <svg className="mumbai-icon-large" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="mumbai-start-title">Ready to Test Your Knowledge?</h4>
            <p className="mumbai-start-description">
              Challenge yourself with {questions.length} questions based on the video content. 
              Track your progress and see how well you understood the material!
            </p>
            <div className="mumbai-start-features">
              <div className="mumbai-feature-item">
                <div className="mumbai-feature-dot mumbai-blue"></div>
                <span className="mumbai-feature-text">{questions.length} Questions</span>
              </div>
              <div className="mumbai-feature-item">
                <div className="mumbai-feature-dot mumbai-green"></div>
                <span className="mumbai-feature-text">Multiple Choice</span>
              </div>
              <div className="mumbai-feature-item">
                <div className="mumbai-feature-dot mumbai-purple"></div>
                <span className="mumbai-feature-text">Instant Results</span>
              </div>
            </div>
            <button 
              onClick={() => setQuizStarted(true)}
              className="mumbai-start-button"
            >
              <svg className="mumbai-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="mumbai-quiz-container">
        <div className="mumbai-quiz-header">
          <h3 className="mumbai-quiz-title">🎉 Quiz Results</h3>
          <div className={`mumbai-quiz-badge ${getScoreColor()}`}>
            {score}/{questions.length}
          </div>
        </div>
        <div className="mumbai-quiz-content">
          <div className="mumbai-results-summary">
            <div className="mumbai-score-circle">
              <div className={`mumbai-score-number ${getScoreColor()}`}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="mumbai-score-label">Your Score</p>
            </div>
            
            <h4 className="mumbai-results-message">
              {getScoreMessage()}
            </h4>
            <p className="mumbai-results-summary-text">
              You got {score} out of {questions.length} questions correct.
            </p>
          </div>

          {/* FIXED: Question Review with UNIQUE classes and proper scrolling */}
          <div className="newyork-review-section">
            <h5 className="newyork-review-header">
              📝 Question Review
            </h5>
            
            {/* CRITICAL: Scrollable container with unique styling */}
            <div className="newyork-scroll-container">
              <div className="newyork-scroll-content">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`delhi-question-card ${isCorrect ? 'delhi-correct' : 'delhi-incorrect'}`}>
                      <div className="delhi-question-header">
                        <div className={`delhi-result-icon ${isCorrect ? 'delhi-correct-icon' : 'delhi-incorrect-icon'}`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="delhi-question-content">
                          <p className="delhi-question-text">
                            <span className="delhi-question-number">Q{index + 1}:</span> {question.question}
                          </p>
                          <div className="delhi-answers-section">
                            <div className={`delhi-user-answer ${isCorrect ? 'delhi-correct-answer' : 'delhi-wrong-answer'}`}>
                              <span className="delhi-answer-label">Your answer:</span>
                              <span className="delhi-answer-choice">({userAnswer})</span>
                              <span className="delhi-answer-text">{question.options.find(opt => opt.letter === userAnswer)?.text}</span>
                            </div>
                            {!isCorrect && (
                              <div className="delhi-correct-answer-display">
                                <span className="delhi-answer-label">Correct answer:</span>
                                <span className="delhi-answer-choice">({question.correctAnswer})</span>
                                <span className="delhi-answer-text">{question.options.find(opt => opt.letter === question.correctAnswer)?.text}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Scroll indicator */}
              {/* {questions.length > 3 && (
                <div className="newyork-scroll-indicator">
                  
                </div>
              )} */}
            </div>
          </div>

          <div className="mumbai-results-actions">
            <button onClick={resetQuiz} className="mumbai-retake-button">
              <svg className="mumbai-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mumbai-quiz-container">
      <div className="mumbai-quiz-header">
        <h3 className="mumbai-quiz-title">🧠 Knowledge Quiz</h3>
        <div className="mumbai-quiz-badge">
          {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      
      <div className="mumbai-progress-section">
        <div className="mumbai-progress-bar">
          <div 
            className="mumbai-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mumbai-quiz-content">
        <div className="mumbai-question-section">
          <h4 className="mumbai-question-text">
            {currentQ.question}
          </h4>
          
          {clickIndicator && (
            <div className="mumbai-click-indicator">
              ✓ Clicked: {clickIndicator}
            </div>
          )}
          
          <div className="mumbai-options-container">
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
                  className={`bangalore-quiz-option ${isSelected ? 'bangalore-selected' : ''}`}
                >
                  <div className="bangalore-option-letter">
                    {option.letter}
                  </div>
                  <div className="bangalore-option-text">
                    {option.text}
                  </div>
                  {isSelected && (
                    <div className="bangalore-option-check">
                      <svg className="bangalore-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mumbai-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="mumbai-nav-button mumbai-previous"
          >
            <svg className="mumbai-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="mumbai-question-counter">
            <p className="mumbai-counter-text">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ.id]}
            className="mumbai-nav-button mumbai-next"
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <svg className="mumbai-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Finish Quiz
              </>
            ) : (
              <>
                Next
                <svg className="mumbai-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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