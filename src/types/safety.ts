// Core safety-related types for the Safe Gaming Center

export interface SupportResource {
  id: string;
  name: string;
  description: string;
  type: 'crisis' | 'counseling' | 'family' | 'support-group' | 'treatment-program';
  contact: {
    phone?: string;
    website?: string;
    email?: string;
    address?: string;
  };
  availability: '24/7' | 'business-hours' | 'scheduled' | 'by-appointment';
  location?: {
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  languages: string[];
  specialties: string[];
  cost: 'free' | 'insurance' | 'sliding-scale' | 'fee-for-service';
  verified: boolean;
  lastUpdated: Date;
}

export interface ResourceSearchFilters {
  type?: SupportResource['type'][];
  location?: string;
  availability?: SupportResource['availability'][];
  language?: string;
  cost?: SupportResource['cost'][];
  maxDistance?: number; // in miles
}

export interface ResourceSearchResult {
  resources: SupportResource[];
  totalCount: number;
  searchLocation?: string;
  fallbackUsed: boolean;
  lastUpdated: Date;
}

// Assessment-related types (extending what's in safetyState.ts)
export interface SafetyAssessment {
  id: string;
  userId?: string;
  responses: AssessmentResponse[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  completedAt: Date;
  followUpScheduled?: Date;
}

export interface AssessmentResponse {
  questionId: string;
  selectedValue: number;
  selectedText: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PersonalLimits {
  timeLimit: number; // minutes per session
  sessionLimit: number; // number of sessions per day
  coolDownPeriod: number; // minutes between sessions
  lastUpdate: Date;
  acknowledgedAt: Date;
  reminderFrequency: 'session' | 'daily' | 'weekly';
}

// Safety alert types
export interface SafetyAlert {
  id: string;
  type: 'educational-tip' | 'self-check-reminder' | 'crisis-support';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  dismissedAt?: Date;
  persistent: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Educational content types for safety content
export interface SafetyContent {
  title: string;
  description: string;
  content: string;
  category: 'risk-education' | 'tools' | 'support' | 'family';
  rouletteSpecific: boolean;
  author: {
    name: string;
    credentials: string;
  };
  supportLevel: 'educational' | 'moderate-concern' | 'crisis';
  publishDate: Date;
  tags: string[];
  readingTime: number; // estimated minutes
}

// API response types
export interface SafetyApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  fallbackUsed?: boolean;
}

// Location and geolocation types
export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  accuracy?: number;
  source: 'gps' | 'ip' | 'manual';
}

// Safety service types
export interface SafetyServiceOptions {
  enableGeolocation: boolean;
  fallbackToGeneral: boolean;
  cacheTimeout: number; // minutes
  maxResults: number;
}

// Crisis intervention types
export interface CrisisIntervention {
  id: string;
  triggeredAt: Date;
  userRiskLevel: 'medium' | 'high';
  interventionType: 'soft-popup' | 'modal-block' | 'redirect-support';
  resourcesProvided: SupportResource[];
  userResponse?: 'dismissed' | 'accessed-help' | 'called-hotline';
  followUpScheduled?: Date;
}

// Analytics types (privacy-compliant)
export interface SafetyAnalyticsEvent {
  eventType: 'assessment-started' | 'assessment-completed' | 'resource-accessed' | 'crisis-intervention' | 'limits-set';
  riskLevel?: 'low' | 'medium' | 'high';
  resourceType?: SupportResource['type'];
  timestamp: Date;
  sessionId?: string; // anonymous session tracking
  // No personal identifiers stored
}

// Session tracking for safety integration
export interface SafetySession {
  sessionId: string;
  startTime: Date;
  totalPlayTime: number; // minutes
  breaksTotal: number;
  assessmentsDue: boolean;
  limitsExceeded: boolean;
  riskSignals: number;
  interventionsTriggered: CrisisIntervention[];
}

// Validation schemas (these would be used with Zod in actual implementation)
export const VALID_RESOURCE_TYPES = ['crisis', 'counseling', 'family', 'support-group', 'treatment-program'] as const;
export const VALID_AVAILABILITY = ['24/7', 'business-hours', 'scheduled', 'by-appointment'] as const;
export const VALID_COST_TYPES = ['free', 'insurance', 'sliding-scale', 'fee-for-service'] as const;
export const VALID_RISK_LEVELS = ['low', 'medium', 'high'] as const;
export const VALID_SUPPORT_LEVELS = ['educational', 'moderate-concern', 'crisis'] as const;

// Default/fallback resources
export const FALLBACK_CRISIS_RESOURCES: SupportResource[] = [
  {
    id: 'ncpg-helpline',
    name: 'National Problem Gambling Helpline',
    description: '24/7 confidential support for problem gambling issues',
    type: 'crisis',
    contact: {
      phone: '1-800-522-4700',
      website: 'https://www.ncpgambling.org'
    },
    availability: '24/7',
    languages: ['English', 'Spanish'],
    specialties: ['Problem Gambling', 'Crisis Support', 'Referrals'],
    cost: 'free',
    verified: true,
    lastUpdated: new Date('2024-01-01')
  },
  {
    id: 'gamblersanonymous',
    name: 'Gamblers Anonymous',
    description: 'Fellowship of people who share experience, strength and hope to help solve gambling problems',
    type: 'support-group',
    contact: {
      website: 'https://www.gamblersanonymous.org',
      phone: '1-626-960-3500'
    },
    availability: 'scheduled',
    languages: ['English'],
    specialties: ['Support Groups', 'Peer Support', 'Long-term Recovery'],
    cost: 'free',
    verified: true,
    lastUpdated: new Date('2024-01-01')
  },
  {
    id: 'smart-recovery',
    name: 'SMART Recovery',
    description: 'Self-help program for people with addictions, including gambling',
    type: 'support-group',
    contact: {
      website: 'https://www.smartrecovery.org',
      phone: '1-440-951-5357'
    },
    availability: 'scheduled',
    languages: ['English'],
    specialties: ['CBT-based', 'Self-help Tools', 'Online Meetings'],
    cost: 'free',
    verified: true,
    lastUpdated: new Date('2024-01-01')
  }
];