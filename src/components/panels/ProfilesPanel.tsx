'use client';
/**
 * ProfilesPanel.tsx — Platform profile badges.
 */

import { motion } from 'framer-motion';
import profiles from '@/data/profiles';

export default function ProfilesPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#818cf8', margin: 0 }}>🔗 Online Profiles</h3>

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
    </div>
  );
}
