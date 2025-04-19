/**
 * Security configuration for The Spirit Nerds app
 * Implements various security measures to protect against common web vulnerabilities
 */

// Content Security Policy (CSP) Settings
export const setupCSP = () => {
  // Create CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  
  // Define CSP directives
  const cspContent = [
    // Only allow scripts from our origin and trusted CDNs
    "script-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com 'unsafe-inline'",
    // Only allow CSS from our origin
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
    // Only allow images from our origin and trusted CDNs
    "img-src 'self' data: https: blob:",
    // Only allow fonts from our origin and Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Only allow connections to these origins
    "connect-src 'self' https://www.google-analytics.com",
    // Fall back to default-src for other resource types
    "default-src 'self'",
    // Frame ancestors restriction (clickjacking protection)
    "frame-ancestors 'none'",
    // Block mixed content
    "block-all-mixed-content",
    // Upgrade insecure requests
    "upgrade-insecure-requests"
  ].join('; ');
  
  cspMeta.content = cspContent;
  document.head.appendChild(cspMeta);
};

// Security Headers
export const setupSecurityHeaders = () => {
  // These headers would normally be set on the server
  // For client-side only apps, we can suggest them in documentation
  const recommendedHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS protection in older browsers
    'X-XSS-Protection': '1; mode=block',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // HSTS - Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // Referrer Policy
    'Referrer-Policy': 'no-referrer-when-downgrade',
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
  
  console.info('Recommended security headers for server configuration:', recommendedHeaders);
};

// Rate limiting for client-side API calls
export class RateLimiter {
  constructor(maxRequests = 30, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requestTimes = [];
  }
  
  // Check if the request should be allowed
  canMakeRequest() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requestTimes = this.requestTimes.filter(time => now - time < this.timeWindow);
    
    // Check if we're under the limit
    if (this.requestTimes.length < this.maxRequests) {
      this.requestTimes.push(now);
      return true;
    }
    
    return false;
  }
}

// Initialize all security measures
export const initSecurity = () => {
  // Set up Content Security Policy
  setupCSP();
  
  // Log recommended headers for server implementation
  setupSecurityHeaders();
  
  // Add event listener for visibility changes to detect clickjacking attempts
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Check if iframe embedding might be occurring (potential clickjacking)
      if (window.self !== window.top) {
        console.warn('Potential clickjacking attempt detected');
      }
    }
  });
  
  // Sanitize localStorage on load to prevent XSS via stored data
  try {
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key);
      // Simple sanitization - remove script tags and suspicious content
      if (value && typeof value === 'string' && (
        value.includes('<script') || 
        // eslint-disable-next-line no-script-url
        value.includes('javascript:') || 
        value.includes('onerror=') ||
        value.includes('onload=')
      )) {
        console.warn('Suspicious content found in localStorage, removing:', key);
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Error sanitizing localStorage:', e);
  }
  
  console.info('Security measures initialized');
};

// Export a default API rate limiter instance
export const apiRateLimiter = new RateLimiter();

// Create a security object to export as default
const securityConfig = {
  initSecurity,
  RateLimiter,
  apiRateLimiter
};

export default securityConfig; 