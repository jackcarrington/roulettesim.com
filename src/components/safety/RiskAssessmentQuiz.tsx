import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  currentAssessment,
  assessmentResults,
  safetyConsent,
  rouletteAssessmentQuestions,
  quickCheckQuestions,
  calculateRiskScore,
  saveAssessmentResult,
  type AssessmentResponse,
  type AssessmentResult
} from '../../stores/safetyState';

interface Props {
  variant?: 'quick-check' | 'comprehensive' | 'periodic';
  onComplete?: (result: AssessmentResult) => void;
  className?: string;
}

export default function RiskAssessmentQuiz({ 
  variant = 'comprehensive', 
  onComplete,
  className = '' 
}: Props) {
  const assessment = useStore(currentAssessment);
  const result = useStore(assessmentResults);
  const consent = useStore(safetyConsent);
  
  const [showConsent, setShowConsent] = useState(!consent.hasConsented);
  
  const questions = variant === 'quick-check' ? quickCheckQuestions : rouletteAssessmentQuestions;
  const currentQuestion = questions[assessment.currentQuestionIndex];
  const progress = ((assessment.currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Initialize assessment when component mounts
    if (!assessment.isActive && !result) {
      startAssessment();
    }
  }, []);

  const startAssessment = () => {
    currentAssessment.setKey('isActive', true);
    currentAssessment.setKey('currentQuestionIndex', 0);
    currentAssessment.setKey('responses', []);
    currentAssessment.setKey('variant', variant);
    currentAssessment.setKey('startedAt', new Date());
    assessmentResults.set(null);
  };

  const handleConsentAccept = () => {
    safetyConsent.setKey('hasConsented', true);
    safetyConsent.setKey('consentDate', new Date());
    safetyConsent.setKey('dataRetentionAgreed', true);
    setShowConsent(false);
  };

  const handleConsentDecline = () => {
    safetyConsent.setKey('hasConsented', true);
    safetyConsent.setKey('consentDate', new Date());
    safetyConsent.setKey('dataRetentionAgreed', false);
    safetyConsent.setKey('trackingEnabled', false);
    setShowConsent(false);
  };

  const handleAnswerSelect = (optionValue: number, optionText: string, riskLevel: 'low' | 'medium' | 'high') => {
    const response: AssessmentResponse = {
      questionId: currentQuestion.id,
      selectedValue: optionValue,
      selectedText: optionText,
      riskLevel
    };

    const updatedResponses = [...assessment.responses, response];
    currentAssessment.setKey('responses', updatedResponses);

    if (assessment.currentQuestionIndex + 1 < questions.length) {
      // Move to next question
      currentAssessment.setKey('currentQuestionIndex', assessment.currentQuestionIndex + 1);
    } else {
      // Complete assessment
      completeAssessment(updatedResponses);
    }
  };

  const completeAssessment = (responses: AssessmentResponse[]) => {
    const { totalScore, riskLevel, recommendations } = calculateRiskScore(responses);
    
    const assessmentResult: AssessmentResult = {
      id: `assessment-${Date.now()}`,
      responses,
      totalScore,
      riskLevel,
      recommendations,
      completedAt: new Date(),
      followUpScheduled: riskLevel === 'high' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
    };

    // Save result if user consented
    if (consent.dataRetentionAgreed) {
      saveAssessmentResult(assessmentResult);
    }

    // Update state
    assessmentResults.set(assessmentResult);
    currentAssessment.setKey('isActive', false);
    
    // Call completion callback
    onComplete?.(assessmentResult);
  };

  const restartAssessment = () => {
    startAssessment();
  };

  const goToPreviousQuestion = () => {
    if (assessment.currentQuestionIndex > 0) {
      currentAssessment.setKey('currentQuestionIndex', assessment.currentQuestionIndex - 1);
      const updatedResponses = assessment.responses.slice(0, -1);
      currentAssessment.setKey('responses', updatedResponses);
    }
  };

  if (showConsent) {
    return (
      <div className={`risk-assessment-quiz consent-screen ${className}`}>
        <div className="consent-content">
          <div className="consent-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          
          <h3>Privacy & Data Consent</h3>
          <p>
            This self-assessment helps you understand your roulette playing habits. We respect your privacy:
          </p>
          
          <ul className="consent-details">
            <li>Your responses can be saved locally to track progress (optional)</li>
            <li>No personal information is collected or shared</li>
            <li>You can delete your data at any time</li>
            <li>Assessment works without saving data if you prefer</li>
          </ul>
          
          <div className="consent-actions">
            <button onClick={handleConsentAccept} className="button consent-accept">
              Accept & Save Progress
            </button>
            <button onClick={handleConsentDecline} className="button color-secondary">
              Continue Without Saving
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const riskColors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#ef4444'
    };

    return (
      <div className={`risk-assessment-quiz results-screen ${className}`}>
        <div className="results-content">
          <div className="results-header">
            <div className="risk-indicator" style={{ borderColor: riskColors[result.riskLevel] }}>
              <div 
                className="risk-level"
                style={{ color: riskColors[result.riskLevel] }}
              >
                {result.riskLevel.toUpperCase()} RISK
              </div>
              <div className="risk-score">
                {result.totalScore}/{questions.length * 4}
              </div>
            </div>
            
            <h3>Assessment Complete</h3>
            <p>Based on your responses about roulette playing habits</p>
          </div>

          <div className="recommendations-section">
            <h4>Personalized Recommendations</h4>
            <ul className="recommendations-list">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          {result.riskLevel === 'high' && (
            <div className="crisis-support-section">
              <div className="crisis-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                  <strong>Professional support recommended</strong>
                  <p>Consider speaking with a counselor: 1-800-522-4700 (24/7)</p>
                </div>
              </div>
              
              <a href="/safe-gaming-center/get-support" className="button crisis-support-button">
                Get Professional Help
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          )}

          <div className="results-actions">
            <button onClick={restartAssessment} className="button color-secondary">
              Take Assessment Again
            </button>
            <a href="/safe-gaming-center/safety-tools" className="button">
              Explore Safety Tools
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment.isActive || !currentQuestion) {
    return (
      <div className={`risk-assessment-quiz loading-screen ${className}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`risk-assessment-quiz question-screen ${className}`}>
      <div className="quiz-header">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {assessment.currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="question-content">
        <div className="question-category">
          {currentQuestion.category.replace('-', ' ').toUpperCase()}
          {currentQuestion.rouletteSpecific && (
            <span className="roulette-specific-badge">Roulette Specific</span>
          )}
        </div>
        
        <h3 className="question-text">{currentQuestion.question}</h3>
        
        <div className="answer-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`answer-option risk-${option.riskLevel}`}
              onClick={() => handleAnswerSelect(option.value, option.text, option.riskLevel)}
            >
              <span className="option-number">{index + 1}</span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        {assessment.currentQuestionIndex > 0 && (
          <button 
            onClick={goToPreviousQuestion}
            className="button color-secondary nav-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Previous
          </button>
        )}
      </div>
    </div>
  );
}

// Styles are included as a separate CSS module or in the component
const styles = `
.risk-assessment-quiz {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-l);
  background: var(--background-color);
  border-radius: var(--radius-l);
  border: 2px solid var(--border-color-subtle);
}

.consent-screen .consent-content {
  text-align: center;
  padding: var(--space-xl);
}

.consent-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto var(--space-l);
  color: var(--color-primary-500);
}

.consent-details {
  text-align: left;
  max-width: 500px;
  margin: var(--space-l) auto;
  list-style: none;
  padding: 0;
}

.consent-details li {
  position: relative;
  padding-left: var(--space-l);
  margin-bottom: var(--space-s);
  color: var(--color-neutral-700);
}

.consent-details li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary-500);
  font-weight: bold;
}

.consent-actions {
  display: flex;
  gap: var(--space-m);
  justify-content: center;
  margin-top: var(--space-xl);
}

.quiz-header {
  margin-bottom: var(--space-xl);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: var(--space-m);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-neutral-300);
  border-radius: var(--radius-s);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-500);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size--1);
  font-weight: 600;
  color: var(--color-neutral-600);
  white-space: nowrap;
}

.question-category {
  font-size: var(--font-size--2);
  font-weight: 700;
  color: var(--color-primary-500);
  margin-bottom: var(--space-s);
  display: flex;
  align-items: center;
  gap: var(--space-s);
}

.roulette-specific-badge {
  background: var(--color-secondary-200);
  color: var(--color-secondary-800);
  padding: var(--space-5xs) var(--space-xs);
  border-radius: var(--radius-s);
  font-size: var(--font-size--2);
}

.question-text {
  font-size: var(--font-size-2);
  color: var(--foreground-color);
  margin-bottom: var(--space-xl);
  line-height: 1.4;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  margin-bottom: var(--space-xl);
}

.answer-option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-m);
  padding: var(--space-m);
  background: transparent;
  border: 2px solid var(--border-color-subtle);
  border-radius: var(--radius-m);
  cursor: pointer;
  text-align: left;
  transition: all var(--animation-speed-fast) var(--cubic-bezier);
}

.answer-option:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-100);
  transform: translateY(-1px);
}

.option-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: var(--color-neutral-200);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size--1);
  color: var(--color-neutral-700);
}

.option-text {
  flex: 1;
  line-height: 1.5;
  color: var(--foreground-color);
}

.risk-low:hover { border-color: #22c55e; background: #f0fdf4; }
.risk-medium:hover { border-color: #f59e0b; background: #fffbeb; }
.risk-high:hover { border-color: #ef4444; background: #fef2f2; }

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.results-screen .results-content {
  text-align: center;
  padding: var(--space-xl);
}

.risk-indicator {
  width: 120px;
  height: 120px;
  border: 4px solid;
  border-radius: 50%;
  margin: 0 auto var(--space-l);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
}

.risk-level {
  font-weight: 700;
  font-size: var(--font-size-0);
}

.risk-score {
  font-size: var(--font-size--1);
  color: var(--color-neutral-600);
  margin-top: var(--space-5xs);
}

.recommendations-section {
  text-align: left;
  margin: var(--space-xl) 0;
  padding: var(--space-l);
  background: var(--color-neutral-200);
  border-radius: var(--radius-m);
}

.recommendations-list {
  list-style: none;
  padding: 0;
}

.recommendations-list li {
  position: relative;
  padding-left: var(--space-l);
  margin-bottom: var(--space-s);
  line-height: 1.6;
}

.recommendations-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary-500);
  font-weight: bold;
}

.crisis-support-section {
  background: #fef2f2;
  border: 2px solid #fca5a5;
  border-radius: var(--radius-m);
  padding: var(--space-l);
  margin: var(--space-xl) 0;
}

.crisis-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-m);
  margin-bottom: var(--space-m);
  color: #991b1b;
}

.crisis-support-button {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.results-actions {
  display: flex;
  gap: var(--space-m);
  justify-content: center;
  margin-top: var(--space-xl);
}

.loading-screen .loading-content {
  text-align: center;
  padding: var(--space-3xl);
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-neutral-300);
  border-top: 3px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-l);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .risk-assessment-quiz {
    padding: var(--space-m);
  }
  
  .consent-actions,
  .results-actions {
    flex-direction: column;
  }
  
  .progress-container {
    flex-direction: column;
    gap: var(--space-s);
  }
  
  .answer-option {
    padding: var(--space-s);
    gap: var(--space-s);
  }
  
  .option-number {
    width: 1.5rem;
    height: 1.5rem;
  }
}
`;

// Inject styles (this would normally be in a separate CSS file)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}