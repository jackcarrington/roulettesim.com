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
  affiliateUrl: string;
  geographicAvailability: string[];
  conversionData: {
    clickThroughRate: number;
    conversionRate: number;
    lastUpdated: Date;
  };
}