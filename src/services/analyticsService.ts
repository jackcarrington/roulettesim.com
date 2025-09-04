import type { UserSession, SessionEvent } from '../types/analytics.ts';
import type { RouletteVariant } from '../types/game.ts';

class AnalyticsService {
  private session: UserSession | null = null;
  private sessionKey = 'roulette_user_session';

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.sessionKey);
      if (stored) {
        this.session = JSON.parse(stored);
      } else {
        this.createNewSession();
      }
    } catch (error) {
      console.warn('Failed to load session, creating new one:', error);
      this.createNewSession();
    }
  }

  private createNewSession(): void {
    this.session = {
      sessionId: crypto.randomUUID(),
      gamePreferences: [],
      educationalEngagement: [],
      conversionSignals: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.saveSession();
  }

  private saveSession(): void {
    if (this.session) {
      try {
        localStorage.setItem(this.sessionKey, JSON.stringify(this.session));
      } catch (error) {
        console.warn('Failed to save session:', error);
      }
    }
  }

  // Game Preference Tracking
  trackGameEngagement(variant: RouletteVariant, duration: number): void {
    if (!this.session) return;

    const existingPref = this.session.gamePreferences.find(p => p.variant === variant);
    if (existingPref) {
      existingPref.playDuration += duration;
      existingPref.frequency += 1;
    } else {
      this.session.gamePreferences.push({
        variant,
        playDuration: duration,
        frequency: 1,
      });
    }

    this.addConversionSignal('game-engagement', this.calculateEngagementStrength(duration));
    this.session.lastActivity = new Date();
    this.saveSession();
  }

  // Educational Content Engagement
  trackEducationalEngagement(contentSlug: string, timeSpent: number, completionRate: number): void {
    if (!this.session) return;

    const existingEngagement = this.session.educationalEngagement.find(e => e.contentSlug === contentSlug);
    if (existingEngagement) {
      existingEngagement.timeSpent += timeSpent;
      existingEngagement.completionRate = Math.max(existingEngagement.completionRate, completionRate);
      existingEngagement.returnVisits += 1;
    } else {
      this.session.educationalEngagement.push({
        contentSlug,
        timeSpent,
        completionRate,
        returnVisits: 1,
      });
    }

    if (completionRate >= 80) {
      this.addConversionSignal('education-completion', completionRate / 100);
    }

    this.session.lastActivity = new Date();
    this.saveSession();
  }

  // Casino Interest Tracking
  trackCasinoInterest(casinoId: string, interactionType: 'view' | 'click' | 'signup'): void {
    if (!this.session) return;

    const strengthMap = { view: 0.3, click: 0.7, signup: 1.0 };
    this.addConversionSignal('casino-interest', strengthMap[interactionType]);

    this.session.lastActivity = new Date();
    this.saveSession();
  }

  // Conversion Signal Management
  private addConversionSignal(type: SessionEvent['type'], strength: number): void {
    if (!this.session) return;

    this.session.conversionSignals.push({
      type,
      strength,
      timestamp: new Date(),
    });

    // Keep only last 50 signals to prevent storage bloat
    if (this.session.conversionSignals.length > 50) {
      this.session.conversionSignals = this.session.conversionSignals.slice(-50);
    }
  }

  private calculateEngagementStrength(duration: number): number {
    // Convert duration to engagement strength (0-1)
    // 5+ minutes = high engagement (0.8+)
    // 2-5 minutes = medium engagement (0.4-0.8)
    // <2 minutes = low engagement (0.1-0.4)
    
    if (duration >= 300000) return 0.9; // 5+ minutes
    if (duration >= 120000) return 0.6; // 2-5 minutes
    if (duration >= 30000) return 0.3;  // 30 seconds - 2 minutes
    return 0.1; // <30 seconds
  }

  // Session Analytics API
  getSessionData(): UserSession | null {
    return this.session;
  }

  getGamePreferences(): RouletteVariant[] {
    if (!this.session) return [];
    
    return this.session.gamePreferences
      .sort((a, b) => (b.playDuration + b.frequency * 60000) - (a.playDuration + a.frequency * 60000))
      .map(p => p.variant);
  }

  getConversionScore(): number {
    if (!this.session) return 0;

    // Calculate conversion readiness based on signals
    const recentSignals = this.session.conversionSignals.filter(
      signal => Date.now() - signal.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    if (recentSignals.length === 0) return 0;

    const avgStrength = recentSignals.reduce((sum, signal) => sum + signal.strength, 0) / recentSignals.length;
    const varietyBonus = new Set(recentSignals.map(s => s.type)).size * 0.1;
    
    return Math.min(1.0, avgStrength + varietyBonus);
  }

  // Privacy Compliance
  hasConsent(): boolean {
    return localStorage.getItem('analytics_consent') === 'true';
  }

  setConsent(consent: boolean): void {
    localStorage.setItem('analytics_consent', consent.toString());
    if (!consent) {
      this.clearSession();
    }
  }

  clearSession(): void {
    this.session = null;
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem('analytics_consent');
  }

  // Event Tracking for Backend Analytics
  async sendEvent(event: Omit<SessionEvent, 'sessionId' | 'timestamp'>): Promise<void> {
    if (!this.session || !this.hasConsent()) return;

    const sessionEvent: SessionEvent = {
      sessionId: this.session.sessionId,
      type: event.type,
      data: event.data,
      timestamp: new Date(),
    };

    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionEvent),
      });
    } catch (error) {
      // Analytics failures shouldn't break user experience
      console.warn('Analytics event failed:', error);
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();