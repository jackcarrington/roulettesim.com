import { getCollection } from 'astro:content';
import type { CasinoRecommendation } from '../types/casino.ts';
import type { UserSession, RouletteVariant } from '../types/analytics.ts';

class CasinoService {
  private casinos: CasinoRecommendation[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const casinoEntries = await getCollection('casinos');
      this.casinos = casinoEntries.map(entry => ({
        ...entry.data,
        matchingScore: 0, // Will be calculated per user
        conversionData: {
          clickThroughRate: 0.12, // Default CTR
          conversionRate: 0.08,   // Default conversion rate
          lastUpdated: new Date(),
        },
      }));
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load casinos:', error);
      this.casinos = [];
    }
  }

  // Main recommendation algorithm
  async getRecommendations(session: UserSession | null, userLocation?: string): Promise<CasinoRecommendation[]> {
    await this.initialize();
    
    if (!session) {
      // Return default recommendations for new users
      return this.getDefaultRecommendations(userLocation);
    }

    const recommendations = this.casinos
      .filter(casino => this.isGeographicallyAvailable(casino, userLocation))
      .map(casino => ({
        ...casino,
        matchingScore: this.calculateMatchingScore(casino, session),
      }))
      .sort((a, b) => b.matchingScore - a.matchingScore)
      .slice(0, 5); // Top 5 recommendations

    return recommendations;
  }

  private calculateMatchingScore(casino: CasinoRecommendation, session: UserSession): number {
    let score = 0;
    let factors = 0;

    // Factor 1: Variant preference alignment (40% weight)
    const preferredVariants = this.getPreferredVariants(session);
    const variantMatch = preferredVariants.filter(variant => 
      casino.supportedVariants.includes(variant)
    ).length / Math.max(preferredVariants.length, 1);
    
    score += variantMatch * 0.4;
    factors++;

    // Factor 2: Engagement level alignment (30% weight)
    const engagementLevel = this.calculateEngagementLevel(session);
    
    if (engagementLevel === 'high' && casino.features.liveDealers) {
      score += 0.3; // High engagement users prefer live dealers
    } else if (engagementLevel === 'medium' && casino.features.mobileApp) {
      score += 0.25; // Medium users value mobile accessibility
    } else if (engagementLevel === 'low') {
      score += 0.2; // Low engagement gets basic recommendation
    }
    factors++;

    // Factor 3: Casino reputation (20% weight)
    score += (casino.features.reputation / 10) * 0.2;
    factors++;

    // Factor 4: Conversion signals (10% weight)
    const conversionReadiness = this.getConversionReadiness(session);
    if (conversionReadiness > 0.7 && casino.conversionPriority <= 2) {
      score += 0.1; // High conversion readiness gets premium casinos
    } else if (conversionReadiness > 0.4) {
      score += 0.05;
    }
    factors++;

    // Normalize score
    return Math.min(1, score / factors);
  }

  private getPreferredVariants(session: UserSession): RouletteVariant[] {
    return session.gamePreferences
      .sort((a, b) => (b.playDuration + b.frequency * 60000) - (a.playDuration + a.frequency * 60000))
      .map(p => p.variant)
      .slice(0, 2); // Top 2 preferred variants
  }

  private calculateEngagementLevel(session: UserSession): 'low' | 'medium' | 'high' {
    const totalPlayTime = session.gamePreferences.reduce((sum, p) => sum + p.playDuration, 0);
    const totalSessions = session.gamePreferences.reduce((sum, p) => sum + p.frequency, 0);
    
    if (totalPlayTime > 600000 && totalSessions > 10) return 'high';    // 10+ minutes, 10+ sessions
    if (totalPlayTime > 180000 && totalSessions > 3) return 'medium';   // 3+ minutes, 3+ sessions
    return 'low';
  }

  private getConversionReadiness(session: UserSession): number {
    const recentSignals = session.conversionSignals.filter(
      signal => Date.now() - signal.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    if (recentSignals.length === 0) return 0;

    return recentSignals.reduce((sum, signal) => sum + signal.strength, 0) / recentSignals.length;
  }

  private isGeographicallyAvailable(casino: CasinoRecommendation, userLocation?: string): boolean {
    if (!userLocation) return true; // Allow all if location unknown
    return casino.geographicAvailability.includes(userLocation);
  }

  private getDefaultRecommendations(userLocation?: string): CasinoRecommendation[] {
    return this.casinos
      .filter(casino => this.isGeographicallyAvailable(casino, userLocation))
      .sort((a, b) => a.conversionPriority - b.conversionPriority)
      .slice(0, 3)
      .map(casino => ({ ...casino, matchingScore: 0.5 })); // Neutral score for new users
  }

  // Get explanation for why casino was recommended
  getRecommendationRationale(casino: CasinoRecommendation, session: UserSession | null): string[] {
    const reasons: string[] = [];

    if (!session) {
      reasons.push('Highly rated casino with excellent reputation');
      reasons.push(`Supports ${casino.supportedVariants.join(', ')} roulette variants`);
      return reasons;
    }

    const preferredVariants = this.getPreferredVariants(session);
    const variantMatches = preferredVariants.filter(variant => 
      casino.supportedVariants.includes(variant)
    );

    if (variantMatches.length > 0) {
      reasons.push(`Offers your preferred ${variantMatches.join(' and ')} roulette`);
    }

    const engagementLevel = this.calculateEngagementLevel(session);
    if (engagementLevel === 'high' && casino.features.liveDealers) {
      reasons.push('Features live dealers for experienced players');
    }

    if (casino.features.reputation >= 8) {
      reasons.push(`High reputation score (${casino.features.reputation}/10)`);
    }

    if (casino.features.mobileApp) {
      reasons.push('Excellent mobile app for on-the-go play');
    }

    if (casino.features.bonusOffering) {
      reasons.push(`Generous welcome bonus: ${casino.features.bonusOffering}`);
    }

    return reasons;
  }
}

export const casinoService = new CasinoService();