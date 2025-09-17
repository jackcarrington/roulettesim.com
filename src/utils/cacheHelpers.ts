/**
 * Cache helpers for improving TTFB and page performance
 */

export function setStaticCacheHeaders(response: Response, maxAge = 3600) {
  response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  response.headers.set('CDN-Cache-Control', `public, max-age=${maxAge}`);
  response.headers.set('Netlify-CDN-Cache-Control', `public, max-age=${maxAge}, immutable`);
}

export function setDynamicCacheHeaders(response: Response, maxAge = 300) {
  response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge * 2}`);
  response.headers.set('CDN-Cache-Control', `public, max-age=${maxAge * 2}`);
  response.headers.set('Netlify-CDN-Cache-Control', `public, max-age=${maxAge * 2}`);
}

export function setNoCache(response: Response) {
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

export function optimizeForFirstVisit(response: Response) {
  // Optimize for first-time visitors and search engines
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
  response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}