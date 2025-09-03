import type { RouletteGame } from '../types/game.ts';

export const mockRouletteGames: RouletteGame[] = [
  {
    id: 'european-roulette-1',
    name: 'Classic European Roulette',
    provider: 'Evolution Gaming',
    variant: 'european',
    thumbnail: '/accessible-components.webp',
    iframeUrl: 'https://slotslaunch.com/iframe/european-roulette-1',
    isAvailable: true,
    metadata: {
      minBet: 1,
      maxBet: 1000,
      features: ['Live Dealer', 'HD Stream', 'Multi-Camera'],
      popularity: 95
    },
    cacheTimestamp: Date.now()
  },
  {
    id: 'american-roulette-1',
    name: 'American Roulette Gold',
    provider: 'NetEnt',
    variant: 'american',
    thumbnail: '/wcag-compliant.webp', 
    iframeUrl: 'https://slotslaunch.com/iframe/american-roulette-1',
    isAvailable: true,
    metadata: {
      minBet: 0.5,
      maxBet: 500,
      features: ['Double Zero', 'Fast Play', 'Statistics'],
      popularity: 78
    },
    cacheTimestamp: Date.now()
  },
  {
    id: 'french-roulette-1',
    name: 'French Roulette Pro',
    provider: 'Microgaming',
    variant: 'french',
    thumbnail: '/social-preview-image.png',
    iframeUrl: 'https://slotslaunch.com/iframe/french-roulette-1', 
    isAvailable: true,
    metadata: {
      minBet: 2,
      maxBet: 2000,
      features: ['La Partage', 'En Prison', 'Call Bets'],
      popularity: 67
    },
    cacheTimestamp: Date.now()
  }
];

export async function getRouletteGames(): Promise<RouletteGame[]> {
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockRouletteGames;
}

export async function getGameById(id: string): Promise<RouletteGame | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockRouletteGames.find(game => game.id === id) || null;
}