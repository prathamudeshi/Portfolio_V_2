'use client';
/**
 * ProfilesPanel.tsx — Platform profile badges + resume download.
 */

import { motion } from 'framer-motion';
import profiles from '@/data/profiles';
import about from '@/data/about';

export default function ProfilesPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', margin: 0 }}>🔗 Online Profiles</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 10,
        }}
      >
        {profiles.map((p) => (
          <motion.a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '16px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 12,
              textDecoration: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 32 }}>{p.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{p.platform}</span>
            <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>@{p.username}</span>
            {p.stat && (
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${p.color}18`,
                  color: p.color,
                  fontWeight: 500,
                }}
              >
                {p.stat}
              </span>
            )}
          </motion.a>
        ))}
      </div>

      {/* ── Resume Download ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ fontSize: 11, color: '#475569', fontFamily: '"JetBrains Mono", monospace', letterSpacing: 1 }}>
          RESUME
        </div>

        <motion.a
          href={about.resumeUrl}
          download
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(130,140,248,0.1) 0%, rgba(34,211,238,0.06) 100%)',
            border: '1px solid rgba(130,140,248,0.2)',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            boxShadow: '0 2px 12px rgba(130,140,248,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* PDF icon */}
            <div style={{
              width: 36, height: 36,
              borderRadius: 8,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}>
              📄
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                Pratham_Udeshi_Resume.pdf
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                B.Tech Computer Engineering · AI & Full-Stack
              </div>
            </div>
          </div>

          {/* Download arrow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
            background: 'rgba(130,140,248,0.12)',
            border: '1px solid rgba(130,140,248,0.2)',
            color: '#a5b4fc',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            <span>↓</span>
            <span>Download</span>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
