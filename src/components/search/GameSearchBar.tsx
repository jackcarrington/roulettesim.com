import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@components/components/ui/input';
import { Button } from '@components/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/components/ui/popover';
import type { SearchFilters } from '../../hooks/useGameSearch';

interface GameSearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  suggestions: string[];
  filters: SearchFilters;
  placeholder?: string;
  className?: string;
}

export default function GameSearchBar({
  onSearch,
  onFiltersChange,
  suggestions,
  filters,
  placeholder = "Search roulette games, providers, or features...",
  className = ""
}: GameSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(filters.query);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setInputValue(filters.query);
  }, [filters.query]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearch(value);
    setIsOpen(value.length >= 2 && suggestions.length > 0);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
    setIsOpen(false);
  };

  const hasActiveFilters = filters.variant || filters.provider || 
                          filters.minBet !== undefined || filters.maxBet !== undefined;

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base bg-white border-2 border-gray-200 focus:border-blue-500 rounded-lg shadow-sm"
        />
        
        {/* Clear and Filter Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Filter Games</h4>
                
                {/* Variant Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Variant</label>
                  <select 
                    value={filters.variant || ''} 
                    onChange={(e) => onFiltersChange({ variant: e.target.value || undefined })}
                    className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  >
                    <option value="">All Variants</option>
                    <option value="european">European Roulette</option>
                    <option value="american">American Roulette</option>
                    <option value="french">French Roulette</option>
                    <option value="live">Live Roulette</option>
                    <option value="speed">Speed Roulette</option>
                  </select>
                </div>

                {/* Provider Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Provider</label>
                  <Input
                    value={filters.provider || ''}
                    onChange={(e) => onFiltersChange({ provider: e.target.value || undefined })}
                    placeholder="e.g., Evolution Gaming"
                    className="text-sm"
                  />
                </div>

                {/* Betting Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Min Bet</label>
                    <Input
                      type="number"
                      value={filters.minBet || ''}
                      onChange={(e) => onFiltersChange({ 
                        minBet: e.target.value ? parseFloat(e.target.value) : undefined 
                      })}
                      placeholder="$1"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Max Bet</label>
                    <Input
                      type="number"
                      value={filters.maxBet || ''}
                      onChange={(e) => onFiltersChange({ 
                        maxBet: e.target.value ? parseFloat(e.target.value) : undefined 
                      })}
                      placeholder="$1000"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      onFiltersChange({ variant: undefined, provider: undefined, minBet: undefined, maxBet: undefined });
                      setShowFilters(false);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Autocomplete Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <Command className="rounded-lg border shadow-lg bg-white">
            <CommandList className="max-h-64">
              <CommandEmpty>No suggestions found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    value={suggestion}
                    onSelect={() => handleSuggestionSelect(suggestion)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <Search className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.variant && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {filters.variant} roulette
              <button
                onClick={() => onFiltersChange({ variant: undefined })}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.provider && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {filters.provider}
              <button
                onClick={() => onFiltersChange({ provider: undefined })}
                className="hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(filters.minBet !== undefined || filters.maxBet !== undefined) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              ${filters.minBet || 0} - ${filters.maxBet || '∞'}
              <button
                onClick={() => onFiltersChange({ minBet: undefined, maxBet: undefined })}
                className="hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}