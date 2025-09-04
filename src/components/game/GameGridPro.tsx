import React, { useState } from 'react';
import type { RouletteGame } from '../../types/game';
import { generateGameSlug } from '../../utils/slugHelpers';
import { useGameSearch } from '../../hooks/useGameSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from '@components/components/ui/pagination';
import GameSearchBar from '../search/GameSearchBar';
import { Play, Star } from 'lucide-react';

interface GameGridProProps {
  games: RouletteGame[];
  variant?: string;
  itemsPerPage?: number;
}

export default function GameGridPro({ games, variant, itemsPerPage = 20 }: GameGridProProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize search with variant filter if specified
  const initialFilters = variant ? { query: '', variant } : { query: '' };
  const { 
    filteredGames, 
    suggestions, 
    filters, 
    updateQuery, 
    updateFilters 
  } = useGameSearch(games, initialFilters);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = filteredGames.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of games section
    document.querySelector('.game-grid-section')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Reset to page 1 when search/filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === 1}
            onClick={(e) => { e.preventDefault(); handlePageChange(1); }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === totalPages}
              onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  if (filteredGames.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No games available</h3>
          <p className="text-gray-600">Please check back later or try a different variant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-grid-section">
      {/* Search Bar */}
      <div className="mb-8">
        <GameSearchBar
          onSearch={updateQuery}
          onFiltersChange={updateFilters}
          suggestions={suggestions}
          filters={filters}
          className="mb-6"
        />
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentGames.map((game) => (
          <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={game.thumbnail} 
                alt={`${game.name} thumbnail`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  game.variant === 'european' ? 'bg-green-100 text-green-800' :
                  game.variant === 'american' ? 'bg-red-100 text-red-800' :
                  game.variant === 'french' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {game.variant}
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{game.name}</CardTitle>
              <CardDescription className="flex items-center justify-between text-sm">
                <span>{game.provider}</span>
                {game.metadata.popularity > 70 && (
                  <div className="flex items-center text-yellow-600">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="ml-1 text-xs">Popular</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Betting Range:</span>
                  <span className="font-medium">${game.metadata.minBet} - ${game.metadata.maxBet}</span>
                </div>
                
                {game.metadata.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {game.metadata.features.slice(0, 3).map((feature: string) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <a 
                href={`/games/${generateGameSlug(game)}`}
                className="button w-full justify-center has-icon"
              >
                <Play className="w-4 h-4" />
                Play Game
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  />
                </PaginationItem>
              )}
              
              {renderPaginationItems()}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* Results Summary */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredGames.length)} of {filteredGames.length} games
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>
    </div>
  );
}