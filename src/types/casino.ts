import type { RouletteVariant } from './game.ts';

export interface CasinoRecommendation {
  casinoId: string;
  name: string;
  supportedVariants: RouletteVariant[];
  features: {
    liveDealers: boolean;
    mobileApp: boolean;
    bonusOffering: string;
    reputation: number;
  };
  matchingScore: number;
  conversionPriority: number; // Priority for conversion optimization (1-5, lower = higher priority)
  affiliateUrl: string;
  geographicAvailability: string[];
  conversionData: {
    clickThroughRate: number;
    conversionRate: number;
    lastUpdated: Date;
  };
}