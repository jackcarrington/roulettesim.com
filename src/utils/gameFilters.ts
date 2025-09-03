import type { RouletteGame, RouletteVariant, GameFilters } from '../types/game.ts';

export function filterGames(games: RouletteGame[], filters: GameFilters): RouletteGame[] {
  let filtered = [...games];

  if (filters.variant) {
    filtered = filtered.filter(game => game.variant === filters.variant);
  }

  if (filters.provider) {
    filtered = filtered.filter(game => 
      game.provider.toLowerCase().includes(filters.provider!.toLowerCase())
    );
  }

  if (filters.minBet !== undefined) {
    filtered = filtered.filter(game => game.metadata.minBet >= filters.minBet!);
  }

  if (filters.maxBet !== undefined) {
    filtered = filtered.filter(game => game.metadata.maxBet <= filters.maxBet!);
  }

  return filtered;
}

export function sortGamesByPopularity(games: RouletteGame[]): RouletteGame[] {
  return games.sort((a, b) => b.metadata.popularity - a.metadata.popularity);
}

export function getVariantDisplayName(variant: RouletteVariant): string {
  switch (variant) {
    case 'european': return 'European Roulette';
    case 'american': return 'American Roulette';
    case 'french': return 'French Roulette';
    default: return 'Roulette';
  }
}

export function getVariantDescription(variant: RouletteVariant): string {
  switch (variant) {
    case 'european': 
      return 'Single zero wheel with 2.7% house edge - best odds for players';
    case 'american': 
      return 'Double zero wheel with 5.26% house edge - classic American style';
    case 'french': 
      return 'Single zero with La Partage rule - lowest house edge at 1.35%';
    default: 
      return 'Classic casino roulette game';
  }
}