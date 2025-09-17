export default async function handler(request: Request, context: any) {
  const response = await context.next();
  // Clone response so we can edit headers
  const headers = new Headers(response.headers);
  // Remove any existing CSP header set by older Netlify config/UI/post-processing
  headers.delete('content-security-policy');
  headers.delete('Content-Security-Policy');

  // Set our strict CSP for all pages/assets
  // Note: Keep in sync with your desired policy
  const csp = [
    "default-src 'self'",
    // Allow GTM/GA script sources if used
    "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    // Allow analytics beacons if used
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    "frame-src https://slotslaunch.com https://*.slotslaunch.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  headers.set('Content-Security-Policy', csp);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = {
  path: '/*',
};
