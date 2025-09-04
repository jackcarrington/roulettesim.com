import type { APIRoute } from 'astro';

interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  eventType: string;
  eventData?: any;
  timestamp: Date;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const event: ExperimentEvent = await request.json();
    
    // Basic validation
    if (!event.experimentId || !event.variantId || !event.eventType) {
      return new Response(JSON.stringify({ error: 'Invalid experiment event data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log experiment event (in production, this would go to analytics platform)
    console.log('A/B Test event:', {
      experimentId: event.experimentId,
      variantId: event.variantId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      eventData: event.eventData,
    });

    // In production, implement:
    // - Send to A/B testing platform (Optimizely, LaunchDarkly, etc.)
    // - Store experiment results for statistical analysis
    // - Real-time experiment performance monitoring

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Experiment API error:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};