'use client';

import { useState, useEffect } from 'react';

/**
 * SystemBar.tsx — Top-right system status indicators (Clock, WiFi, Battery).
 * Purely visual to complete the iOS/macOS aesthetic.
 */

export default function SystemBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="system-bar"
      style={{
        position: 'absolute',
        top: 12,
        right: 18,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        color: '#fff',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {/* WiFi Icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        {/* Battery Icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" />
        </svg>
      </div>
      
      <div style={{ letterSpacing: '0.5px' }}>
        {time}
      </div>
    </div>
  );
}
