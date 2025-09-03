import type { RouletteVariant } from './game.ts';

export interface UserSession {
  sessionId: string;
  gamePreferences: {
    variant: RouletteVariant;
    playDuration: number;
    frequency: number;
  }[];
  educationalEngagement: {
    contentSlug: string;
    timeSpent: number;
    completionRate: number;
    returnVisits: number;
  }[];
  conversionSignals: {
    type: 'game-engagement' | 'education-completion' | 'casino-interest';
    strength: number;
    timestamp: Date;
  }[];
  createdAt: Date;
  lastActivity: Date;
}

export interface SessionEvent {
  sessionId: string;
  type: 'game-start' | 'game-end' | 'education-view' | 'casino-click';
  data?: Record<string, any>;
  timestamp: Date;
}