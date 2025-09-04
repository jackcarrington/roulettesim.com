// GDPR compliance utilities for user consent and privacy

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: Date;
}

const CONSENT_STORAGE_KEY = 'user_consent_preferences';
const CONSENT_VERSION = 'v1.0';

export function hasValidConsent(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;
    
    const consent = JSON.parse(stored);
    return consent.version === CONSENT_VERSION && consent.timestamp;
  } catch {
    return false;
  }
}

export function getConsentPreferences(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    
    const consent = JSON.parse(stored);
    if (consent.version !== CONSENT_VERSION) return null;
    
    return {
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      functional: consent.functional || true, // Always true for site functionality
      timestamp: new Date(consent.timestamp),
    };
  } catch {
    return null;
  }
}

export function setConsentPreferences(preferences: Omit<ConsentPreferences, 'timestamp'>): void {
  const consentData = {
    ...preferences,
    timestamp: new Date(),
    version: CONSENT_VERSION,
  };
  
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
}

export function clearConsent(): void {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}

export function isConsentRequired(): boolean {
  // Basic geo-detection for GDPR requirements
  // This is a simplified check - production would use proper geo-location
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const euTimezones = [
    'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome',
    'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna',
    'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Dublin',
  ];
  
  return euTimezones.includes(userTimezone);
}

export function getMinimalSessionId(): string {
  // Generate privacy-compliant session ID that doesn't contain PII
  return crypto.randomUUID();
}

// Data anonymization helpers
export function anonymizeIpAddress(ip: string): string {
  // Remove last octet for IPv4, last 4 groups for IPv6
  const ipv4Pattern = /^(\d+\.\d+\.\d+)\.\d+$/;
  const ipv4Match = ip.match(ipv4Pattern);
  if (ipv4Match) {
    return ipv4Match[1] + '.0';
  }
  
  // Basic IPv6 anonymization (remove last 64 bits)
  const ipv6Pattern = /^([a-f0-9:]+):[a-f0-9:]*$/i;
  const ipv6Match = ip.match(ipv6Pattern);
  if (ipv6Match) {
    return ipv6Match[1] + '::';
  }
  
  return 'anonymous';
}

export function shouldCollectAnalytics(): boolean {
  if (!hasValidConsent()) return false;
  
  const preferences = getConsentPreferences();
  return preferences?.analytics === true;
}