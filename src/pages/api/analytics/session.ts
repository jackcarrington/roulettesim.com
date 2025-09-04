import type { APIRoute } from 'astro';
import type { SessionEvent } from '../../../types/analytics.ts';

export const POST: APIRoute = async ({ request }) => {
  try {
    const event: SessionEvent = await request.json();
    
    // Basic validation
    if (!event.sessionId || !event.type || !event.timestamp) {
      return new Response(JSON.stringify({ error: 'Invalid event data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log analytics event (in production, this would go to analytics service)
    console.log('Analytics event:', {
      sessionId: event.sessionId,
      type: event.type,
      timestamp: event.timestamp,
      data: event.data,
    });

    // In production, implement:
    // - Send to analytics platform (Google Analytics 4, Mixpanel, etc.)
    // - Store in database for custom analytics
    // - Process for real-time recommendations

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};