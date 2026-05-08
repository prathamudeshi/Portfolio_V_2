'use client';
/**
 * ProjectsPanel.tsx — Horizontally sliding project explorer.
 * Grid → click project → full panel slides to detail view (no overlay/scroll bug).
 * Supports screenshot images per project.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projects from '@/data/projects';
import type { Project } from '@/data/projects';

/* ─── Category colours ─── */
const STACK_COLORS: Record<string, string> = {
  'React.js': '#22d3ee', 'Next.js': '#e2e8f0', 'Python': 'var(--accent)',
  'LangChain': '#a78bfa', 'OpenCV': '#34d399', 'YOLO': '#34d399',
  'Azure': '#38bdf8', 'GCP': '#f59e0b', 'Docker': '#38bdf8',
  'Three.js': '#f472b6', 'TailwindCSS': '#22d3ee', 'Node.js': '#86efac',
  'default': '#94a3b8',
};

function tagColor(tech: string) {
  return STACK_COLORS[tech] ?? STACK_COLORS.default;
}

/* ─── Small project card ─── */
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={{
        background: hovered
          ? 'rgba(130, 140, 248, 0.08)'
          : 'rgba(255, 255, 255, 0.025)',
        border: project.featured
          ? '1px solid rgba(130, 140, 248, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: '14px 14px 12px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(130,140,248,0.1)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hover glow streak */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {project.featured && (
        <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700, letterSpacing: 1, marginBottom: 5 }}>
          ★ FEATURED
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 600, color: hovered ? '#c7d2fe' : '#e2e8f0', marginBottom: 5, lineHeight: 1.3 }}>
        {project.title}
      </div>

      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
        {project.description}
      </div>

      {/* Tech chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {project.techStack.slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: 9,
            padding: '2px 7px',
            borderRadius: 4,
            background: `${tagColor(t)}12`,
            color: tagColor(t),
            fontFamily: '"JetBrains Mono", monospace',
            border: `1px solid ${tagColor(t)}20`,
          }}>
            {t}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span style={{ fontSize: 9, color: '#475569', alignSelf: 'center' }}>
            +{project.techStack.length - 3} more
          </span>
        )}
      </div>

      {/* Arrow hint */}
      <div style={{
        position: 'absolute', bottom: 10, right: 12,
        fontSize: 12, color: hovered ? 'var(--accent)' : '#1e293b',
        transition: 'color 0.2s, transform 0.2s',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
      }}>
        →
      </div>
    </motion.div>
  );
}

/* ─── Detail view ─── */
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <motion.div
      key="detail"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        background: '#07071a',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* ── Header strip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px',
            borderRadius: 7,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
            color: '#64748b',
            fontSize: 11,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: '"JetBrains Mono", monospace',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.borderColor = 'rgba(130,140,248,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
        >
          ← Back
        </button>
        {project.featured && (
          <span style={{
            fontSize: 9, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1.2,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(130,140,248,0.1)',
            border: '1px solid rgba(130,140,248,0.2)',
          }}>
            ★ FEATURED
          </span>
        )}
        <div style={{ flex: 1 }} />
        {/* Links */}
        <div style={{ display: 'flex', gap: 8 }}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 6,
                background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                color: '#22d3ee', textDecoration: 'none', transition: 'all 0.2s',
              }}>
              🐙 GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 6,
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                color: '#22c55e', textDecoration: 'none', transition: 'all 0.2s',
              }}>
              🌐 Live
            </a>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 18px 20px' }}>
        {/* Title */}
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: '#f1f5f9',
          margin: '0 0 4px', lineHeight: 1.25,
        }}>
          {project.title}
        </h2>

        {/* Subtitle description */}
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', fontStyle: 'italic' }}>
          {project.description}
        </p>

        {/* Screenshot / banner */}
        {project.imageUrl ? (
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 18,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          /* Decorative placeholder with gradient */
          <div style={{
            width: '100%',
            height: 120,
            borderRadius: 10,
            marginBottom: 18,
            background: `linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.06) 50%, rgba(52,211,153,0.08) 100%)`,
            border: '1px solid rgba(130,140,248,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* animated shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
              }}
            />
            <span style={{ opacity: 0.4, fontSize: 40 }}>📁</span>
          </div>
        )}

        {/* Long description */}
        <div style={{
          fontSize: 13, color: '#94a3b8', lineHeight: 1.75,
          marginBottom: 20,
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(130,140,248,0.3)',
        }}>
          {project.longDescription || project.description}
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontSize: 10, color: '#475569', letterSpacing: 1.2,
            textTransform: 'uppercase', marginBottom: 10,
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            Tech Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.techStack.map(t => (
              <span key={t} style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 6,
                background: `${tagColor(t)}10`,
                color: tagColor(t),
                fontFamily: '"JetBrains Mono", monospace',
                border: `1px solid ${tagColor(t)}25`,
                transition: 'all 0.2s',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function ProjectsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const proj = selected ? projects.find(p => p.id === selected) ?? null : null;

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>

      {/* ── Project grid (always rendered behind) ── */}
      <motion.div
        animate={{ x: selected ? '-15%' : '0%', opacity: selected ? 0 : 1, scale: selected ? 0.96 : 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        style={{
          height: '100%',
          overflow: 'auto',
          paddingRight: 4,
          pointerEvents: selected ? 'none' : 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', margin: 0 }}>
            📂 Projects
            <span style={{ fontSize: 10, color: '#334155', fontWeight: 400, marginLeft: 8, fontFamily: '"JetBrains Mono", monospace' }}>
              {projects.length}
            </span>
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 10,
        }}>
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p.id)} />
          ))}
        </div>
      </motion.div>

      {/* ── Detail panel (slides in from right) ── */}
      <AnimatePresence>
        {proj && (
          <ProjectDetail
            key={proj.id}
            project={proj}
            onBack={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

