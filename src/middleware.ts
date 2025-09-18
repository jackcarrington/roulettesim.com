import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Enhanced CSP directives to complement Netlify CSP Nonce plugin
  const additionalCSPDirectives = "; object-src 'none'; base-uri 'self'";

  // Enhance CSP header with missing directives - only for HTML responses
  if (response.headers.get('content-type')?.includes('text/html')) {
    const existingCSP = response.headers.get('content-security-policy');

    if (existingCSP) {
      // If Netlify CSP plugin has set a CSP, enhance it with missing directives
      const enhancedCSP = existingCSP + additionalCSPDirectives;
      response.headers.set('content-security-policy', enhancedCSP);
    } else {
      // Fallback: create comprehensive CSP if none exists
      const nonce = response.headers.get('x-netlify-csp-nonce') ||
                   response.headers.get('x-debug-csp-nonce');
      const nonceDirective = nonce ? `'nonce-${nonce}'` : "'unsafe-inline'";

      const fullCSP = [
        "default-src 'self'",
        `script-src 'self' ${nonceDirective} https://www.googletagmanager.com https://www.google-analytics.com`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https:",
        "frame-src https://slotslaunch.com https://*.slotslaunch.com",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "form-action 'self'"
      ].join('; ');

      response.headers.set('content-security-policy', fullCSP);
    }
  }

  return response;
});