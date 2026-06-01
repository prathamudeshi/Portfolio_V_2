'use client';
/**
 * WorksSection.tsx — Material 3 project card grid.
 * Cards: m3-card-elevated with state layer ripple on hover.
 * Featured indicator: primary-container tonal badge.
 * Tech tags: m3-chip tonal variant.
 */

import { motion } from 'framer-motion';
import projects from '@/data/projects';

const textVariant = () => ({
  hidden: { y: -40, opacity: 0 },
  show:   { y: 0,   opacity: 1, transition: { type: 'spring' as const, duration: 1.2 } },
});

const fadeUp = (delay: number) => ({
  hidden: { y: 40, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { delay, duration: 0.45, ease: [0.2, 0, 0, 1] as const } },
});

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      variants={fadeUp(index * 0.12)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="m3-card-elevated"
      style={{
        width: '100%',
        maxWidth: 340,
        flex: '0 1 340px',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        borderTop: '2px solid transparent',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
      }}
      whileHover={{ 
        y: -10, 
        borderTopColor: 'var(--md-primary)',
        transition: { duration: 0.2 } 
      }}
    >
      {/* Project image */}
      <div style={{
        width: '100%',
        height: 192,
        background: 'var(--md-surface-container-high)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--md-primary-container) 0%, var(--md-surface-container-highest) 100%)',
            fontSize: 48,
          }}>
            📁
          </div>
        )}

        {/* Featured badge — M3 primary-container tonal badge */}
        {project.featured && (
          <div style={{
            position: 'absolute',
            top: 12, left: 12,
            background: 'var(--md-primary-container)',
            color: 'var(--md-on-primary-container)',
            borderRadius: 'var(--md-shape-sm)',
            padding: '4px 10px',
            fontFamily: 'var(--md-font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            Featured
          </div>
        )}

        {/* GitHub icon button overlay */}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            style={{
              position: 'absolute',
              top: 10, right: 10,
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--md-outline-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(176,184,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.65)')}
          >
            🐙
          </a>
        )}
      </div>

      {/* Card body — above state layer */}
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--md-font-display)',
          fontSize: 19,
          fontWeight: 700,
          color: 'var(--md-on-surface)',
          letterSpacing: '-0.2px',
          marginBottom: 8,
        }}>
          {project.title}
        </h3>

        <p className="m3-body-md" style={{ flex: 1, marginBottom: 16 }}>
          {project.description}
        </p>

        {/* Tech chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.techStack.slice(0, 4).map(tech => (
            <span key={tech} className="m3-chip tonal" style={{ fontSize: 11 }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function WorksSection() {
  return (
    <section id="projects" className="portfolio-section" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="m3-label-sm">My work</p>
          <h2 className="m3-title-lg" style={{ marginTop: 8 }}>Projects.</h2>
        </motion.div>

        <motion.p
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="m3-body-lg"
          style={{ marginTop: 16, maxWidth: 820 }}
        >
          The following projects showcase my skills and experience through real-world examples.
          Each project is described with links to code repositories where available. They reflect
          my ability to solve complex problems, work with different technologies, and manage
          projects effectively.
        </motion.p>

        <div style={{
          marginTop: 56,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 24,
        }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
