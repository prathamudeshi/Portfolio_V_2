'use client';

import dynamic from 'next/dynamic';
import PortfolioNav from '@/components/portfolio/PortfolioNav';

// Hero — always needs to load immediately
const Workspace = dynamic(() => import('@/components/Workspace'), {
  ssr: false,
});

// Portfolio sections — lazy-loaded only when the module is needed.
// Next.js will code-split each into its own chunk so they don't block
// the initial JS parse of the hero section.
const AboutSection      = dynamic(() => import('@/components/portfolio/AboutSection'));
const ExperienceSection = dynamic(() => import('@/components/portfolio/ExperienceSection'));
const TechSection       = dynamic(() => import('@/components/portfolio/TechSection'));
const WorksSection      = dynamic(() => import('@/components/portfolio/WorksSection'));
const ContactSection    = dynamic(() => import('@/components/portfolio/ContactSection'));

export default function Home() {
  return (
    <>
      {/* ── Hero: Illusion V2 spatial workspace (100vh) ── */}
      <Workspace />

      {/* ── Fixed navbar (appears after scrolling past hero) ── */}
      <PortfolioNav />

      {/* ── Portfolio sections below the fold ── */}
      <main style={{ background: 'var(--md-surface)', position: 'relative', zIndex: 1 }}>
        <AboutSection />
        <ExperienceSection />
        <TechSection />
        <WorksSection />
        <ContactSection />

        {/* M3 Footer */}
        <footer style={{
          background: 'var(--md-surface-container)',
          borderTop: '1px solid var(--md-outline-variant)',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span style={{
            fontFamily: 'var(--md-font-body)',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.8px',
            color: 'var(--md-on-surface-variant)',
          }}>
            NEXUS — Pratham Udeshi © {new Date().getFullYear()}
          </span>
        </footer>
      </main>
    </>
  );
}
