'use client';
/**
 * ProjectsPanel.tsx — Masonry grid of project cards.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projects from '@/data/projects';

export default function ProjectsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const proj = selected ? projects.find((p) => p.id === selected) : null;

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
        }}
      >
        {projects.map((p) => (
          <motion.div
            key={p.id}
            layout
            onClick={() => setSelected(p.id)}
            whileHover={{ scale: 1.02, y: -2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: p.featured
                ? '1px solid rgba(130, 140, 248, 0.25)'
                : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 10,
              padding: 12,
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            {p.featured && (
              <span style={{ fontSize: 10, color: '#818cf8', fontWeight: 600 }}>★ FEATURED</span>
            )}
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: '4px 0', color: '#e2e8f0' }}>{p.title}</h4>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{p.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 8 }}>
              {p.techStack.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 3,
                    background: 'rgba(34, 211, 238, 0.1)',
                    color: '#22d3ee',
                    fontFamily: 'monospace',
                  }}
                >
                  {t}
                </span>
              ))}
              {p.techStack.length > 3 && (
                <span style={{ fontSize: 9, color: '#64748b', alignSelf: 'center' }}>
                  +{p.techStack.length - 3}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {proj && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(15, 15, 40, 0.95)',
                border: '1px solid rgba(130, 140, 248, 0.2)',
                borderRadius: 12,
                padding: 20,
                maxWidth: 420,
                width: '100%',
                cursor: 'default',
              }}
            >
              {proj.featured && (
                <span style={{ fontSize: 10, color: '#818cf8', fontWeight: 600 }}>★ FEATURED</span>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '4px 0 8px' }}>
                {proj.title}
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                {proj.longDescription || proj.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                {proj.techStack.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(130, 140, 248, 0.12)',
                      color: '#818cf8',
                      fontFamily: 'monospace',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: '#22d3ee',
                      textDecoration: 'none',
                      padding: '4px 12px',
                      borderRadius: 6,
                      background: 'rgba(34, 211, 238, 0.1)',
                      border: '1px solid rgba(34, 211, 238, 0.2)',
                    }}
                  >
                    🐙 GitHub
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: '#22c55e',
                      textDecoration: 'none',
                      padding: '4px 12px',
                      borderRadius: 6,
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    🌐 Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  marginTop: 14,
                  fontSize: 11,
                  color: '#64748b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                ← Back to grid
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
