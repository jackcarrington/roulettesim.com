import { atom, map } from 'nanostores';
import type { RouletteGame, RouletteVariant } from '../types/game.ts';

export const currentGame = atom<RouletteGame | null>(null);
export const gameLibrary = atom<RouletteGame[]>([]);
export const isGameLoading = atom<boolean>(false);

export const userPreferences = map({
  preferredVariant: 'european' as RouletteVariant,
  sessionStartTime: Date.now(),
  educationProgress: {} as Record<string, number>,
});

export const conversionState = map({
  showRecommendations: false,
  engagementLevel: 0,
  conversionSignals: [] as any[],
});