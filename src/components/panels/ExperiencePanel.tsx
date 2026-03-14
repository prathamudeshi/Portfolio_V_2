'use client';
/**
 * ExperiencePanel.tsx — Interactive timeline of work experience.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import experience from '@/data/experience';

export default function ExperiencePanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#818cf8', margin: 0 }}>📋 Experience Timeline</h3>

      {experience.map((exp) => (
        <motion.div
          key={exp.id}
          layout
          onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          style={{
            background: expandedId === exp.id ? 'rgba(130, 140, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 10,
            padding: '12px 14px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          whileHover={{ background: 'rgba(130, 140, 248, 0.06)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{exp.role}</div>
              <div style={{ fontSize: 13, color: '#818cf8' }}>{exp.company}</div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', flexShrink: 0, fontFamily: 'monospace' }}>{exp.period}</div>
          </div>

          <AnimatePresence>
            {expandedId === exp.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: '8px 0' }}>{exp.description}</p>

                <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'none' }}>
                  {exp.highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.7, position: 'relative', paddingLeft: 8 }}>
                      <span style={{ position: 'absolute', left: -8, color: '#818cf8' }}>▸</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(130, 140, 248, 0.12)',
                        color: '#818cf8',
                        fontFamily: 'monospace',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
