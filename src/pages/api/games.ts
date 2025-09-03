import type { APIRoute } from 'astro';
import type { RouletteGame } from '../../types/game.ts';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
let cache: Record<string, { data: RouletteGame[], timestamp: number }> = {};

export const GET: APIRoute = async ({ url }) => {
  try {
    // Extract query parameters for filtering
    const searchParams = new URL(url).searchParams;
    const variant = searchParams.get('variant');
    const provider = searchParams.get('provider');
    
    // Check cache first (include filters in cache key)
    const cacheKey = `${variant || 'all'}-${provider || 'all'}`;
    if (cache && cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
      return new Response(JSON.stringify({ games: cache[cacheKey].data }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch from SlotsLaunch API using documented format
    const slotsLaunchToken = import.meta.env.SLOTSLAUNCH_API_TOKEN;
    
    if (!slotsLaunchToken) {
      throw new Error('SLOTSLAUNCH_API_TOKEN not configured');
    }

    // Build API URL with token parameter as documented
    const apiUrl = new URL('https://slotslaunch.com/api/games');
    apiUrl.searchParams.set('token', slotsLaunchToken);
    apiUrl.searchParams.set('per_page', '150'); // Max allowed
    apiUrl.searchParams.set('published', '1'); // Only published games
    apiUrl.searchParams.set('type[]', '22'); // Roulette games only

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': import.meta.env.ORIGIN_DOMAIN || 'https://zingy-sfogliatella-7901c5.netlify.app'
      }
    });

    if (!response.ok) {
      throw new Error(`SlotsLaunch API responded with ${response.status}`);
    }

    const allGames = await response.json();
    
    // All games returned are already roulette games (filtered by type[]=22)
    const rouletteGames = allGames.data || [];

    const processedGames: RouletteGame[] = rouletteGames.map((game: any) => ({
      id: game.id.toString(),
      name: game.name,
      provider: game.provider,
      variant: detectRouletteVariant(game),
      thumbnail: game.thumb, // API uses 'thumb' not 'thumbnail'
      iframeUrl: game.url, // API already provides the full iframe URL
      isAvailable: game.published === 1,
      metadata: {
        minBet: parseFloat(game.min_bet) || 1,
        maxBet: parseFloat(game.max_bet) || 1000,
        features: [
          ...(game.megaways ? ['megaways'] : []),
          ...(game.bonus_buy ? ['bonus_buy'] : []),
          ...(game.progressive ? ['progressive'] : []),
          ...(game.autoplay ? ['autoplay'] : [])
        ],
        popularity: game.featured ? 80 : 50,
        rtp: game.rtp,
        volatility: game.volatility,
        reels: game.reels,
        paylines: game.payline
      },
      cacheTimestamp: Date.now()
    }));

    // Apply client-side filtering if specified
    let filteredGames = processedGames;
    if (variant) {
      filteredGames = filteredGames.filter(game => game.variant === variant);
    }
    if (provider) {
      filteredGames = filteredGames.filter(game => 
        game.provider.toLowerCase().includes(provider.toLowerCase())
      );
    }

    // Update cache
    cache[cacheKey] = {
      data: filteredGames,
      timestamp: Date.now()
    };

    return new Response(JSON.stringify({ games: filteredGames }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('SlotsLaunch API error:', error);
    
    // Return cached data if available
    const anyCachedData = Object.values(cache)[0];
    if (anyCachedData) {
      return new Response(JSON.stringify({ 
        games: anyCachedData.data,
        notice: "API unavailable, using cached data"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback to empty games list with error
    return new Response(JSON.stringify({ 
      games: [],
      error: "Games temporarily unavailable" 
    }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function detectRouletteVariant(game: any): string {
  const searchableText = [
    game.name,
    game.description,
    game.type,
    game.theme,
    game.tags?.join(' '),
    game.subcategory
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Dynamic variant detection - discover variants from API data
  if (searchableText.includes('european')) return 'european';
  if (searchableText.includes('american')) return 'american'; 
  if (searchableText.includes('french')) return 'french';
  
  // Additional potential variants to discover
  if (searchableText.includes('mini')) return 'mini';
  if (searchableText.includes('speed')) return 'speed';
  if (searchableText.includes('lightning')) return 'lightning';
  if (searchableText.includes('live')) return 'live';
  if (searchableText.includes('multi')) return 'multi';
  if (searchableText.includes('auto')) return 'auto';
  if (searchableText.includes('immersive')) return 'immersive';
  
  // Default fallback - prefer European for best odds
  return 'european';
}