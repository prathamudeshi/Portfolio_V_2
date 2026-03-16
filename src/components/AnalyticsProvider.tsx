'use client';

import { useEffect } from 'react';
import { collectVisitorMetadata, sendAnalytics, isLocalEnvironment } from '@/utils/visitorData';
import Cookies from 'js-cookie';

export default function AnalyticsProvider() {
  useEffect(() => {
    if (isLocalEnvironment()) {
      return;
    }

    const consent = Cookies.get('ux_consent') === 'true';
    if (!consent) return;

    // Initial session start
    const metadata = collectVisitorMetadata();
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'session_start',
        metadata,
      }),
    }).catch(() => {});
  }, []);

  return null;
}
