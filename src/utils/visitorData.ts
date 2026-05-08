import Cookies from 'js-cookie';

const VISITOR_COOKIE_KEY = 'v_id';

export interface VisitorMetadata {
  visitorId: string;
  userAgent: string;
  language: string;
  screenResolution: string;
  referrer: string;
  timestamp: string;
  path: string;
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getVisitorId(): string {
  let id = Cookies.get(VISITOR_COOKIE_KEY);
  if (!id) {
    id = generateId();
    Cookies.set(VISITOR_COOKIE_KEY, id, { expires: 365 });
  }
  return id;
}

export function collectVisitorMetadata(): VisitorMetadata {
  return {
    visitorId: getVisitorId(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
    screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
    referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
  };
}

export function isLocalEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export async function sendAnalytics(data: any) {
  try {
    if (isLocalEnvironment()) {
      console.log('[Analytics] Telemetry disabled in local environment');
      return;
    }

    const consent = Cookies.get('ux_consent') === 'true';
    if (!consent) return;

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('[Analytics] Failed to send data:', err);
  }
}
