import { useState, useMemo } from 'react';
import type { RouletteGame } from '../types/game';

export interface SearchFilters {
  query: string;
  variant?: string;
  provider?: string;
  minBet?: number;
  maxBet?: number;
}

export function useGameSearch(games: RouletteGame[], initialFilters: SearchFilters = { query: '' }) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const filteredGames = useMemo(() => {
    let result = games;

    // Text search across multiple fields
    if (filters.query.trim()) {
      const searchTerm = filters.query.toLowerCase().trim();
      result = result.filter(game => 
        game.name.toLowerCase().includes(searchTerm) ||
        game.provider.toLowerCase().includes(searchTerm) ||
        game.variant.toLowerCase().includes(searchTerm) ||
        game.metadata.features.some(feature => 
          feature.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Variant filter
    if (filters.variant) {
      result = result.filter(game => game.variant === filters.variant);
    }

    // Provider filter
    if (filters.provider) {
      result = result.filter(game => 
        game.provider.toLowerCase().includes(filters.provider!.toLowerCase())
      );
    }

    // Betting range filters
    if (filters.minBet !== undefined) {
      result = result.filter(game => game.metadata.minBet >= filters.minBet!);
    }

    if (filters.maxBet !== undefined) {
      result = result.filter(game => game.metadata.maxBet <= filters.maxBet!);
    }

    return result;
  }, [games, filters]);

  // Generate autocomplete suggestions based on current query
  const suggestions = useMemo(() => {
    if (!filters.query.trim() || filters.query.length < 2) return [];

    const searchTerm = filters.query.toLowerCase();
    const suggestions = new Set<string>();

    games.forEach(game => {
      // Game name suggestions
      if (game.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(game.name);
      }

      // Provider suggestions
      if (game.provider.toLowerCase().includes(searchTerm)) {
        suggestions.add(game.provider);
      }

      // Variant suggestions
      if (game.variant.toLowerCase().includes(searchTerm)) {
        suggestions.add(`${game.variant} roulette`);
      }

      // Feature suggestions
      game.metadata.features.forEach(feature => {
        if (feature.toLowerCase().includes(searchTerm)) {
          suggestions.add(feature);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  }, [games, filters.query]);

  const updateQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ query: '' });
  };

  return {
    filteredGames,
    suggestions,
    filters,
    updateQuery,
    updateFilters,
    clearFilters,
    hasActiveFilters: Boolean(
      filters.query ||
      filters.variant ||
      filters.provider ||
      filters.minBet !== undefined ||
      filters.maxBet !== undefined
    )
  };
}