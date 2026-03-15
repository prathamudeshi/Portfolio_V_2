'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('ux_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (agreed: boolean) => {
    Cookies.set('ux_consent', String(agreed), { expires: 365 });
    setShow(false);
    if (agreed) {
      window.location.reload(); // Refresh to start tracking
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '90%',
            maxWidth: 500,
            background: 'rgba(15, 15, 25, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              🍪
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0 }}>Experience Enhancement</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
                We use cookies and telemetry to improve your experience and conduct UX research.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              onClick={() => handleConsent(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-mid))',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Accept & Continue
            </button>
            <button
              onClick={() => handleConsent(false)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Decline
            </button>
          </div>
          
          <p style={{ fontSize: 10, color: '#475569', textAlign: 'center', margin: 0 }}>
            By continuing, you agree to our research and analytics practices.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
