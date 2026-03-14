'use client';
/**
 * ContactPanel.tsx — Contact form / info.
 */

import about from '@/data/about';

export default function ContactPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', padding: 8 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Get In Touch</h3>
      <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 320, lineHeight: 1.6 }}>
        I&apos;m always open to interesting opportunities, collaborations, and conversations about AI, computer vision, and creative tech.
      </p>

      <a
        href={`mailto:${about.email}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 24px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(130, 140, 248, 0.2), rgba(34, 211, 238, 0.2))',
          border: '1px solid rgba(130, 140, 248, 0.3)',
          color: '#e2e8f0',
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
      >
        ✉️ {about.email}
      </a>

      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
        <span>Or type <code style={{ color: '#818cf8' }}>contact</code> in the terminal</span>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%', paddingTop: 12, marginTop: 4 }}>
        <p style={{ fontSize: 11, color: '#475569' }}>
          Pro tip: Try typing <code style={{ color: '#818cf8' }}>sudo hire me</code> in the terminal 😉
        </p>
      </div>
    </div>
  );
}
