'use client';
/**
 * AboutSection.tsx — Material 3 layout.
 * Service cards use M3 Filled Card (surface-container-highest + tonal elevation).
 */

import { motion } from 'framer-motion';
import about from '@/data/about';

const textVariant = () => ({
  hidden: { y: -40, opacity: 0 },
  show:   { y: 0,   opacity: 1, transition: { type: 'spring' as const, duration: 1.2 } },
});

const fadeUp = (delay: number) => ({
  hidden: { y: 32, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { delay, duration: 0.5, ease: [0.2, 0, 0, 1] as const } },
});

function ServiceCard({ title, icon, index }: { title: string; icon: string; index: number }) {
  return (
    <motion.div
      variants={fadeUp(0.1 + index * 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="m3-card-filled"
      style={{
        flex: '1 1 200px',
        minWidth: 180,
        maxWidth: 260,
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        cursor: 'default',
        userSelect: 'none',
        borderTop: '2px solid transparent',
        transition: 'border-color 0.3s ease',
      }}
      whileHover={{ 
        y: -8, 
        borderTopColor: 'var(--md-primary)',
        boxShadow: '0 12px 30px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.15)',
        transition: { duration: 0.2 } 
      }}
    >
      {/* M3 icon container — primary-container tint */}
      <div style={{
        width: 64, height: 64,
        borderRadius: 'var(--md-shape-lg)',
        background: 'var(--md-primary-container)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <img src={icon} alt={title} style={{ width: 36, height: 36, objectFit: 'contain' }} />
      </div>

      <h3 style={{
        fontFamily: 'var(--md-font-display)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--md-on-surface)',
        textAlign: 'center',
        letterSpacing: '-0.1px',
        lineHeight: 1.3,
        position: 'relative', zIndex: 1,
      }}>
        {title}
      </h3>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="portfolio-section"
      style={{ padding: '96px 24px' }}
    >
      <span className="hash-span" id="about-anchor" />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section overline */}
        <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="m3-label-sm" style={{ marginBottom: 8 }}>Introduction</p>
          <h2 className="m3-title-lg">Overview.</h2>
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="m3-body-lg"
          style={{ marginTop: 20, maxWidth: 820, lineHeight: 1.8 }}
        >
          {about.bio}{' '}
          I'm a quick learner and collaborate closely with clients to create efficient, scalable, and
          user-friendly solutions that solve real-world problems. Let's work together to bring your
          ideas to life!
        </motion.p>

        {/* M3 Divider */}
        <hr className="m3-divider" style={{ margin: '48px 0 40px' }} />

        {/* Service cards — horizontal scroll on mobile */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {about.services.map((service, index) => (
            <ServiceCard key={service.title} title={service.title} icon={service.icon} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
