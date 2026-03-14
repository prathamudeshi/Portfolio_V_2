'use client';
/**
 * AboutPanel.tsx — Holographic ID card.
 */

import about from '@/data/about';

export default function AboutPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', padding: '8px 4px' }}>
      {/* Avatar placeholder */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          border: '3px solid rgba(130, 140, 248, 0.3)',
          boxShadow: '0 0 30px rgba(130, 140, 248, 0.2)',
        }}
      >
        👤
      </div>

      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>{about.fullName}</h2>
        <p style={{ fontSize: 14, color: '#818cf8', margin: '4px 0', fontWeight: 500 }}>{about.title}</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{about.subtitle}</p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, maxWidth: 340 }}>
        {about.bio}
      </p>

      <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
        <span style={{ color: '#64748b' }}>📍 {about.location}</span>
        <span style={{ color: '#64748b' }}>✉️ {about.email}</span>
      </div>

      <a
        href={about.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '8px 20px',
          borderRadius: 8,
          background: 'rgba(130, 140, 248, 0.15)',
          border: '1px solid rgba(130, 140, 248, 0.3)',
          color: '#818cf8',
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'background 0.2s',
          cursor: 'pointer',
        }}
      >
        📄 Download Resume
      </a>
    </div>
  );
}
