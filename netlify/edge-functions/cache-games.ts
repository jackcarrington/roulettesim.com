import type { Context } from "@netlify/edge-functions";
import type { RouletteGame } from "../../src/types/game.ts";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_WINDOW = 1000; // 1 second
let lastApiCall = 0;

export default async function cacheGames(request: Request, context: Context) {
  const url = new URL(request.url);
  const cacheKey = `games-${url.searchParams.toString()}`;
  
  // Check edge cache first
  const cached = await context.storage.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return Response.json(cached.data);
  }
  
  // Rate limiting check
  const now = Date.now();
  if (now - lastApiCall < RATE_LIMIT_WINDOW) {
    // Return stale cache if available
    if (cached) {
      return Response.json({
        ...cached.data,
        notice: "Using cached data due to rate limits"
      });
    }
    return Response.json({ error: "Rate limit exceeded, no cache available" }, { status: 429 });
  }
  
  try {
    lastApiCall = now;
    
    // Build API URL with token parameter as documented
    const apiUrl = new URL('https://slotslaunch.com/api/games');
    const token = Deno.env.get('SLOTSLAUNCH_API_TOKEN');
    
    if (!token) {
      throw new Error('SLOTSLAUNCH_API_TOKEN not configured');
    }
    
    apiUrl.searchParams.set('token', token);
    apiUrl.searchParams.set('per_page', '150'); // Max allowed
    apiUrl.searchParams.set('published', 'true'); // Only published games
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'localhost:4321'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const allGames = await response.json();
    
    // Enhanced roulette game identification using documented API structure  
    const rouletteGames = allGames.data?.filter((game: any) => {
      // Search across all available game metadata fields from documented API response
      const searchableText = [
        game.name,
        game.type,
        game.type_slug,
        game.description,
        ...(game.themes?.map((theme: any) => theme.name) || []),
        ...(game.themes?.map((theme: any) => theme.slug) || [])
      ].filter(Boolean).join(' ').toLowerCase();
      
      // Comprehensive roulette detection patterns based on actual API structure
      return (
        searchableText.includes('roulette') ||
        searchableText.includes('wheel') ||
        // Look for table game types that might include roulette
        (game.type_slug?.includes('table') && searchableText.includes('roulette')) ||
        // European/American/French table games are likely roulette
        (searchableText.includes('european') && (searchableText.includes('table') || searchableText.includes('casino'))) ||
        (searchableText.includes('american') && (searchableText.includes('table') || searchableText.includes('casino'))) ||
        (searchableText.includes('french') && (searchableText.includes('table') || searchableText.includes('casino')))
      );
    }) || [];
    
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
      cacheTimestamp: now
    }));
    
    // Cache the processed results
    await context.storage.set(cacheKey, {
      data: { games: processedGames },
      timestamp: now
    });
    
    return Response.json({ games: processedGames });
    
  } catch (error) {
    console.error('SlotsLaunch API error:', error);
    
    // Fallback to stale cache
    if (cached) {
      return Response.json({
        ...cached.data,
        notice: "API unavailable, using cached data"
      });
    }
    
    return Response.json({ error: "Games temporarily unavailable" }, { status: 503 });
  }
}

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