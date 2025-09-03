export interface RouletteGame {
  id: string;
  name: string;
  provider: string;
  variant: string; // Dynamic - discovered from API responses
  thumbnail: string;
  iframeUrl: string;
  isAvailable: boolean;
  metadata: {
    minBet: number;
    maxBet: number;
    features: string[];
    popularity: number;
  };
  cacheTimestamp: number;
}

// Keep common variants as type for backwards compatibility, but allow discovery
export type RouletteVariant = 'european' | 'american' | 'french' | string;

export interface GameFilters {
  variant?: RouletteVariant;
  provider?: string;
  minBet?: number;
  maxBet?: number;
}

export interface SlotsLaunchApiResponse {
  games: RouletteGame[];
  notice?: string;
  error?: string;
}