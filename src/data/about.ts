/**
 * about.ts — Personal info for About panel and About section.
 *
 * Merged from Portfolio constants and Illusion V2 about.ts.
 * Uses Illusion V2's richer bio; adds service roles from Portfolio.
 */

export interface Education {
  school: string;
  degree: string;
  period: string;
  cgpa: string;
}

export interface Award {
  title: string;
  description: string;
}

const about = {
  fullName: 'Pratham Udeshi',
  title: 'AI Engineer · Full Stack Developer · GenAI & Agentic Systems',
  subtitle: 'GenAI & Agentic Systems · Full Stack · Computer Vision',
  location: 'Mumbai, India',
  email: 'udeshipratham@gmail.com',
  bio: 'Final-year B.Tech Computer Engineering student at K.J. Somaiya (CGPA 8.9) with 6+ internships spanning Agentic AI, LLM systems, full-stack development, and cybersecurity. Designed and shipped production-grade AI agents at Godrej Enterprises, including an Email Agent with human-in-the-loop and an Engineering Specsheet Analyzer achieving 98% accuracy.',
  resumeUrl: '/Pratham_Udeshi_CV.pdf',
  avatarUrl: '/images/avatar.png',
  /** Roles shown as cards in the About section (from Portfolio's services array) */
  services: [
    { title: 'AI & GenAI', icon: '/images/tech/backend.png' },
    { title: 'Web Developer', icon: '/images/tech/web.png' },
    { title: 'App Developer', icon: '/images/tech/mobile.png' },
    { title: 'Cybersecurity', icon: '/images/tech/creator.png' },
  ],
  education: [
    {
      school: 'K.J. Somaiya School of Engineering',
      degree: 'B.Tech Computer Engineering with Honours in Cyber Security',
      period: '2022 – Jun 2026',
      cgpa: '8.9',
    },
  ],
  awards: [
    { title: 'Top 10', description: 'LLM Hackathon at IIT-Bombay (National-level AI competition)' },
    { title: 'Finalist', description: 'Crackathon (National-level coding competition)' },
    { title: '1st Place', description: 'Tech Competition organized by ISTE, KJSCE' },
    { title: '1st Place', description: 'Figma Design Competition by Friends of Figma (FOF) Mumbai' },
    { title: '2nd Place', description: 'State-level Mathematics Competition' },
    { title: 'Featured', description: 'Official Godrej LinkedIn media posts for Amethyst AI Platform launch' },
  ],
};

export default about;

