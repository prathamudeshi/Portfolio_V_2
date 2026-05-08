'use client';
/**
 * TechSection.tsx — Material 3 skills grid.
 * Skill items: m3-chip (assist style) with tonal filled variant.
 * Group headers: M3 label typography + primary dot indicator.
 */

import { motion } from 'framer-motion';
import { skillNodes, groupColors, groupLabels } from '@/data/skills';

const textVariant = () => ({
  hidden: { y: -40, opacity: 0 },
  show:   { y: 0,   opacity: 1, transition: { type: 'spring' as const, duration: 1.2 } },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { delay, duration: 0.3, ease: [0.2, 0, 0, 1] as const } },
});

const grouped = Object.entries(
  skillNodes.reduce<Record<string, typeof skillNodes>>((acc, node) => {
    if (!acc[node.group]) acc[node.group] = [];
    acc[node.group].push(node);
    return acc;
  }, {})
);

function SkillChip({ node, index }: { node: typeof skillNodes[0]; index: number }) {
  const color = groupColors[node.group];
  const bars  = Array.from({ length: 5 }, (_, i) => i < node.proficiency);

  return (
    <motion.div
      variants={fadeIn(index * 0.035)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      title={node.description}
      className="m3-card-elevated"
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--md-shape-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: 'default',
      }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: 'var(--md-font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--md-on-surface)',
          letterSpacing: '0.1px',
          marginBottom: 8,
        }}>
          {node.label}
        </p>
        {/* Proficiency dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {bars.map((filled, i) => (
            <div key={i} style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: filled ? color : 'var(--md-outline-variant)',
              boxShadow: filled ? `0 0 6px ${color}80` : 'none',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TechSection() {
  return (
    <section id="skills" className="portfolio-section" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="m3-label-sm">Technologies &amp; Tools</p>
          <h2 className="m3-title-lg" style={{ marginTop: 8 }}>Skills.</h2>
        </motion.div>

        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 48 }}>
          {grouped.map(([group, nodes]) => (
            <div key={group}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: groupColors[group as keyof typeof groupColors],
                  boxShadow: `0 0 8px ${groupColors[group as keyof typeof groupColors]}`,
                }} />
                <span className="m3-label-sm" style={{
                  color: groupColors[group as keyof typeof groupColors],
                  letterSpacing: '1.2px',
                }}>
                  {groupLabels[group as keyof typeof groupLabels]}
                </span>
              </div>

              {/* Skill grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))',
                gap: 10,
              }}>
                {nodes.map((node, i) => (
                  <SkillChip key={node.id} node={node} index={i} />
                ))}
              </div>

              {/* Section divider */}
              <hr className="m3-divider" style={{ marginTop: 32 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
