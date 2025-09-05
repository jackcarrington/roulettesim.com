import { atom, map } from 'nanostores';

// Risk assessment types
export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
  category: 'behavior' | 'emotion' | 'control' | 'consequences';
  rouletteSpecific: boolean;
}

export interface AssessmentOption {
  value: number;
  text: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AssessmentResponse {
  questionId: string;
  selectedValue: number;
  selectedText: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface AssessmentResult {
  id: string;
  responses: AssessmentResponse[];
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  completedAt: Date;
  followUpScheduled?: Date;
}

export interface PersonalLimits {
  timeLimit: number; // minutes per session
  sessionLimit: number; // number of sessions per day
  coolDownPeriod: number; // minutes between sessions
  lastUpdate: Date;
  acknowledgedAt: Date;
  reminderFrequency: 'session' | 'daily' | 'weekly';
}

// Current assessment state
export const currentAssessment = map({
  isActive: false,
  currentQuestionIndex: 0,
  responses: [] as AssessmentResponse[],
  variant: 'comprehensive' as 'quick-check' | 'comprehensive' | 'periodic',
  startedAt: null as Date | null,
});

// Assessment results
export const assessmentResults = atom<AssessmentResult | null>(null);
export const assessmentHistory = atom<AssessmentResult[]>([]);

// Personal safety limits
export const personalLimits = map<PersonalLimits>({
  timeLimit: 60, // Default 60 minutes
  sessionLimit: 3, // Default 3 sessions per day
  coolDownPeriod: 30, // Default 30 minutes cool down
  lastUpdate: new Date(),
  acknowledgedAt: new Date(),
  reminderFrequency: 'session',
});

// Safety alerts and reminders
export const safetyAlerts = atom<Array<{
  id: string;
  type: 'educational-tip' | 'self-check-reminder' | 'crisis-support';
  title: string;
  message: string;
  actionUrl?: string;
  dismissedAt?: Date;
  persistent: boolean;
}>>([]);

// User consent and preferences
export const safetyConsent = map({
  hasConsented: false,
  consentDate: null as Date | null,
  trackingEnabled: true,
  reminderEnabled: true,
  dataRetentionAgreed: false,
});

// Current session tracking for integration with game state
export const safetySessionState = map({
  sessionStartTime: null as Date | null,
  totalPlayTime: 0, // minutes
  sessionsToday: 0,
  lastBreakTime: null as Date | null,
  needsCoolDown: false,
  riskTriggersToday: 0,
});

// Roulette-specific assessment questions
export const rouletteAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'roulette-time-perception',
    question: 'When playing roulette, how aware are you of the time passing?',
    category: 'behavior',
    rouletteSpecific: true,
    options: [
      { value: 1, text: 'I always track time and stick to my planned session length', riskLevel: 'low' },
      { value: 2, text: 'I usually notice time but sometimes play longer than intended', riskLevel: 'medium' },
      { value: 3, text: 'Time seems to fly by when I\'m playing roulette', riskLevel: 'high' },
      { value: 4, text: 'I lose complete track of time during roulette sessions', riskLevel: 'high' }
    ]
  },
  {
    id: 'house-edge-understanding',
    question: 'How well do you understand the house edge in roulette?',
    category: 'control',
    rouletteSpecific: true,
    options: [
      { value: 1, text: 'I fully understand that the house always has a mathematical advantage', riskLevel: 'low' },
      { value: 2, text: 'I know the house has an edge but sometimes think I can overcome it', riskLevel: 'medium' },
      { value: 3, text: 'I believe I can find systems to beat the house edge', riskLevel: 'high' },
      { value: 4, text: 'I think roulette can be beaten with the right strategy', riskLevel: 'high' }
    ]
  },
  {
    id: 'betting-patterns',
    question: 'How would you describe your betting patterns in roulette?',
    category: 'behavior',
    rouletteSpecific: true,
    options: [
      { value: 1, text: 'I stick to predetermined bet sizes and patterns', riskLevel: 'low' },
      { value: 2, text: 'I mostly stick to my plan but sometimes adjust based on results', riskLevel: 'medium' },
      { value: 3, text: 'I frequently change my betting strategy during play', riskLevel: 'high' },
      { value: 4, text: 'I chase losses by increasing bet sizes or changing strategies', riskLevel: 'high' }
    ]
  },
  {
    id: 'emotional-response',
    question: 'How do you typically feel after losing several spins in a row at roulette?',
    category: 'emotion',
    rouletteSpecific: true,
    options: [
      { value: 1, text: 'I accept it as normal variance and continue with my strategy', riskLevel: 'low' },
      { value: 2, text: 'I feel frustrated but stick to my predetermined limits', riskLevel: 'medium' },
      { value: 3, text: 'I feel compelled to keep playing to recover the losses', riskLevel: 'high' },
      { value: 4, text: 'I feel angry and increase my bets to win back quickly', riskLevel: 'high' }
    ]
  },
  {
    id: 'system-beliefs',
    question: 'What do you think about betting systems in roulette (Martingale, D\'Alembert, etc.)?',
    category: 'control',
    rouletteSpecific: true,
    options: [
      { value: 1, text: 'I understand they don\'t change the mathematical odds', riskLevel: 'low' },
      { value: 2, text: 'I know they don\'t work long-term but find them entertaining', riskLevel: 'medium' },
      { value: 3, text: 'I think some systems can improve your chances if used correctly', riskLevel: 'high' },
      { value: 4, text: 'I believe I can develop or find a winning system', riskLevel: 'high' }
    ]
  }
];

// Quick check questions (subset for faster assessment)
export const quickCheckQuestions: AssessmentQuestion[] = rouletteAssessmentQuestions.slice(0, 3);

// Assessment utilities
export function calculateRiskScore(responses: AssessmentResponse[]): {
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
} {
  const totalScore = responses.reduce((sum, response) => sum + response.selectedValue, 0);
  const maxPossibleScore = responses.length * 4;
  const riskPercentage = (totalScore / maxPossibleScore) * 100;
  
  let riskLevel: 'low' | 'medium' | 'high';
  let recommendations: string[];
  
  if (riskPercentage <= 40) {
    riskLevel = 'low';
    recommendations = [
      'Your roulette play appears to be well-controlled. Keep tracking your time and sticking to limits.',
      'Continue learning about responsible gambling practices.',
      'Consider periodic self-assessments to maintain awareness.'
    ];
  } else if (riskPercentage <= 70) {
    riskLevel = 'medium';
    recommendations = [
      'Consider setting stricter time and spending limits before playing.',
      'Take regular breaks during roulette sessions.',
      'Review educational materials about house edge and betting psychology.',
      'Consider taking our comprehensive assessment for more detailed insights.'
    ];
  } else {
    riskLevel = 'high';
    recommendations = [
      'Consider speaking with a gambling counselor about your roulette play.',
      'Implement cooling-off periods between sessions.',
      'Review crisis support resources and professional help options.',
      'Consider self-exclusion tools if you feel you cannot control your play.'
    ];
  }
  
  return { totalScore, riskLevel, recommendations };
}

// Local storage integration with user consent
export function saveAssessmentResult(result: AssessmentResult): void {
  const consent = safetyConsent.get();
  if (!consent.hasConsented || !consent.dataRetentionAgreed) {
    return;
  }
  
  try {
    const existingResults = JSON.parse(localStorage.getItem('roulettesim-assessments') || '[]');
    const updatedResults = [...existingResults, result].slice(-10); // Keep last 10 results
    localStorage.setItem('roulettesim-assessments', JSON.stringify(updatedResults));
    assessmentHistory.set(updatedResults);
  } catch (error) {
    console.error('Failed to save assessment result:', error);
  }
}

export function loadAssessmentHistory(): AssessmentResult[] {
  const consent = safetyConsent.get();
  if (!consent.hasConsented) {
    return [];
  }
  
  try {
    const results = JSON.parse(localStorage.getItem('roulettesim-assessments') || '[]');
    assessmentHistory.set(results);
    return results;
  } catch (error) {
    console.error('Failed to load assessment history:', error);
    return [];
  }
}

export function savePersonalLimits(limits: PersonalLimits): void {
  const consent = safetyConsent.get();
  if (!consent.hasConsented) {
    return;
  }
  
  try {
    localStorage.setItem('roulettesim-safety-limits', JSON.stringify(limits));
    personalLimits.set(limits);
  } catch (error) {
    console.error('Failed to save personal limits:', error);
  }
}

export function loadPersonalLimits(): PersonalLimits | null {
  const consent = safetyConsent.get();
  if (!consent.hasConsented) {
    return null;
  }
  
  try {
    const limits = JSON.parse(localStorage.getItem('roulettesim-safety-limits') || 'null');
    if (limits) {
      personalLimits.set(limits);
    }
    return limits;
  } catch (error) {
    console.error('Failed to load personal limits:', error);
    return null;
  }
}