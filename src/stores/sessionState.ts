import { atom } from 'nanostores';
import type { UserSession } from '../types/analytics.ts';
import { analyticsService } from '../services/analyticsService.ts';

// Session state management using Nanostores
export const currentSession = atom<UserSession | null>(null);
export const conversionScore = atom<number>(0);
export const gamePreferences = atom<string[]>([]);

// Initialize session state
export function initializeSession(): void {
  const session = analyticsService.getSessionData();
  currentSession.set(session);
  
  if (session) {
    conversionScore.set(analyticsService.getConversionScore());
    gamePreferences.set(analyticsService.getGamePreferences());
  }
}

// Update session data
export function updateSessionState(): void {
  const session = analyticsService.getSessionData();
  currentSession.set(session);
  conversionScore.set(analyticsService.getConversionScore());
  gamePreferences.set(analyticsService.getGamePreferences());
}

// Privacy compliance state
export const analyticsConsent = atom<boolean>(false);

export function setAnalyticsConsent(consent: boolean): void {
  analyticsService.setConsent(consent);
  analyticsConsent.set(consent);
  
  if (consent) {
    initializeSession();
  } else {
    currentSession.set(null);
    conversionScore.set(0);
    gamePreferences.set([]);
  }
}