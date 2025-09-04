import type { APIRoute } from 'astro';
import { casinoService } from '../../services/casinoService.ts';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { sessionId, userLocation } = await request.json();
    
    // In a real implementation, you'd fetch session data from database
    // For now, we'll use client-side session data passed in the request
    const session = null; // Would fetch session by sessionId
    
    const recommendations = await casinoService.getRecommendations(session, userLocation);
    
    // Generate recommendation rationales
    const rationales: Record<string, string[]> = {};
    for (const casino of recommendations) {
      rationales[casino.casinoId] = casinoService.getRecommendationRationale(casino, session);
    }

    return new Response(JSON.stringify({ 
      recommendations,
      rationales,
      metadata: {
        totalAvailable: recommendations.length,
        userLocation: userLocation || 'unknown',
        generatedAt: new Date(),
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Casino recommendations API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate recommendations',
      recommendations: [],
      rationales: {}
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};