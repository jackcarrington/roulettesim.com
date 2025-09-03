import type { RouletteGame, GameFilters } from '../types/game.ts';
import type { SessionEvent } from '../types/analytics.ts';
import type { CasinoRecommendation } from '../types/casino.ts';

export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

class RouletteSimAPI {
  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      // Client-side: use current origin
      return `${window.location.origin}/api`;
    }
    // Server-side: use environment variable or localhost
    return import.meta.env.PUBLIC_SITE_URL ? `${import.meta.env.PUBLIC_SITE_URL}/api` : 'http://localhost:4321/api';
  }
  
  async getRouletteGames(filters: GameFilters = {}): Promise<RouletteGame[]> {
    try {
      const params = new URLSearchParams();
      if (filters.variant) params.set('variant', filters.variant);
      if (filters.provider) params.set('provider', filters.provider);
      
      const response = await fetch(`${this.getBaseUrl()}/games?${params}`);
      
      if (!response.ok) {
        throw new APIError(`Failed to fetch games: ${response.status}`, response.status);
      }
      
      const data = await response.json();
      return data.games || [];
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('API failed, using mock data:', error);
      const { getRouletteGames } = await import('./mockGameService.ts');
      const games = await getRouletteGames();
      
      let filtered = games;
      if (filters.variant) {
        filtered = filtered.filter(game => game.variant === filters.variant);
      }
      if (filters.provider) {
        filtered = filtered.filter(game => 
          game.provider.toLowerCase().includes(filters.provider!.toLowerCase())
        );
      }
      
      return filtered;
    }
  }
  
  async getGameIframeUrl(gameId: string): Promise<string> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/games`);
      
      if (!response.ok) {
        throw new APIError(`Failed to fetch games: ${response.status}`, response.status);
      }
      
      const data = await response.json();
      const game = data.games.find((g: RouletteGame) => g.id === gameId);
      
      if (!game) {
        throw new APIError('Game not found', 404);
      }
      
      return game.iframeUrl;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('API failed, using mock data for game URL:', error);
      const { getGameById } = await import('./mockGameService.ts');
      const game = await getGameById(gameId);
      
      if (!game) {
        throw new APIError('Game not found', 404);
      }
      
      return game.iframeUrl;
    }
  }
  
  async trackUserBehavior(event: SessionEvent): Promise<void> {
    try {
      await fetch(`${this.getBaseUrl()}/analytics/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      // Don't throw - analytics failures shouldn't break user experience
    }
  }
  
  async getCasinoRecommendations(sessionId: string): Promise<CasinoRecommendation[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        return []; // Graceful degradation for recommendations
      }
      
      return response.json();
    } catch (error) {
      console.error('Recommendations failed:', error);
      return [];
    }
  }
}

export const api = new RouletteSimAPI();