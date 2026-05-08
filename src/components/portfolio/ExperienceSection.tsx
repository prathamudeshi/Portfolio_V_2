'use client';
/**
 * ExperienceSection.tsx — Material 3 vertical timeline.
 * Cards: m3-card-elevated (surface-container-low + tonal elevation overlay).
 * Timeline line: primary color gradient.
 * Tech chips: m3-chip tonal variant.
 */

import { motion } from 'framer-motion';
import experience from '@/data/experience';

const textVariant = () => ({
  hidden: { y: -40, opacity: 0 },
  show:   { y: 0,   opacity: 1, transition: { type: 'spring' as const, duration: 1.2 } },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { delay, duration: 0.45, ease: [0.2, 0, 0, 1] as const } },
});

function ExperienceCard({ exp, index }: { exp: typeof experience[0]; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      marginBottom: 56,
    }}>
      {/* Date label — desktop only, opposite side */}
      <div style={{
        position: 'absolute',
        top: 28,
        [isLeft ? 'right' : 'left']: 'calc(50% + 56px)',
        width: '34%',
        textAlign: isLeft ? 'left' : 'right',
      }} className="hidden md:block">
        <span className="m3-label-md" style={{ fontSize: 11 }}>{exp.period}</span>
      </div>

      {/* Card row */}
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          justifyContent: isLeft ? 'flex-start' : 'flex-end',
          paddingLeft:  isLeft ? 0 : '50%',
          paddingRight: isLeft ? '50%' : 0,
          position: 'relative',
        }}
        className="experience-card-row px-4"
      >
        <motion.div
          variants={fadeIn(index * 0.18)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="m3-card-elevated"
          style={{ width: '100%', maxWidth: 480, padding: 24 }}
        >
          {/* M3 connector arrow */}
          <div style={{
            position: 'absolute',
            top: 28,
            [isLeft ? 'right' : 'left']: -9,
            width: 0, height: 0,
            borderTop:    '9px solid transparent',
            borderBottom: '9px solid transparent',
            [isLeft ? 'borderLeft' : 'borderRight']: '9px solid var(--md-surface-container-low)',
          }} />

          {/* Card content — above ::before overlay */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontFamily: 'var(--md-font-display)',
              fontSize: 'clamp(17px, 3.5vw, 22px)',
              fontWeight: 700,
              color: 'var(--md-on-surface)',
              letterSpacing: '-0.15px',
              marginBottom: 4,
            }}>
              {exp.role}
            </h3>

            <p style={{
              fontFamily: 'var(--md-font-body)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--md-primary)',
              letterSpacing: '0.1px',
            }}>
              {exp.company}
            </p>

            {/* Period — mobile only */}
            <p className="md:hidden m3-label-md" style={{ marginTop: 4, fontSize: 11 }}>
              {exp.period}
            </p>

            <ul style={{ marginTop: 18, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exp.highlights.map((point, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {/* M3 bullet: primary dot */}
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--md-primary)',
                    marginTop: 6, flexShrink: 0,
                  }} />
                  <span className="m3-body-md">{point}</span>
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
              {exp.techStack.map(tech => (
                <span key={tech} className="m3-chip tonal" style={{ fontSize: 11 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Central icon node */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 18,
        width: 48, height: 48,
        borderRadius: '50%',
        background: 'var(--md-surface-container-high)',
        border: '3px solid var(--md-primary)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        transform: 'translateX(-50%)',
        zIndex: 5,
        overflow: 'hidden',
        boxShadow: '0 0 0 4px var(--md-surface), 0 4px 16px rgba(0,0,0,0.4)',
      }}>
        {exp.logoUrl ? (
          <img src={exp.logoUrl} alt={exp.company} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: 20 }}>💼</span>
        )}
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="portfolio-section" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="m3-label-sm">What I have done so far</p>
          <h2 className="m3-title-lg" style={{ marginTop: 8 }}>Work Experience</h2>
        </motion.div>

        <div style={{ position: 'relative' }}>
          {/* Timeline vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 10,
            bottom: 0,
            width: 2,
            background: `linear-gradient(to bottom, var(--md-primary) 0%, var(--md-outline-variant) 100%)`,
            transform: 'translateX(-50%)',
            borderRadius: 2,
          }} className="timeline-line" />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {experience.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .experience-card-row {
            padding-left: 56px !important;
            padding-right: 16px !important;
            justify-content: flex-start !important;
          }
          :global(.timeline-line) {
            left: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
