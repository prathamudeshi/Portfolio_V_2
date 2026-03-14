/**
 * experience.ts — Your work experience data.
 *
 * ✏️  EDIT THIS FILE to add/remove/update your roles.
 *     Each entry will appear as a card on the Experience timeline.
 */

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;           // e.g. "Jan 2026 – Mar 2026"
  description: string;
  highlights: string[];
  techStack: string[];
}

const experience: Experience[] = [
  {
    id: 'godrej-ai',
    role: 'AI Engineer Intern',
    company: 'Godrej Enterprises Group',
    location: 'Mumbai, India',
    period: 'Jan 2026 – Mar 2026',
    description:
      'End-to-end development of autonomous AI agents, industrial computer vision solutions, and cloud-integrated infrastructure on the Amethyst platform.',
    highlights: [
      'Built 5+ specialized AI agents (email, drawing interpretation, document processing)',
      'Developed an industrial CV safety system for robotic welding environments',
      'Led React.js frontend migration — reduced integration code from ~1000 to ~40 lines',
      'Integrated SharePoint/OneDrive connectors with OAuth 2.0 / MSAL',
      'Explored agentic warehousing solutions at India\'s largest facility',
      'Researched drone + computer vision integration for industrial monitoring',
    ],
    techStack: ['Python', 'React.js', 'LangChain', 'OpenCV', 'Azure', 'GCP', 'OAuth 2.0'],
  },
  {
    id: 'freelance',
    role: 'Freelance AI/ML Developer',
    company: 'Self-employed',
    period: '2025 – Present',
    description: 'Custom AI/ML solutions and consulting for various clients.',
    highlights: [
      'Placeholder — add your freelance highlights here',
    ],
    techStack: ['Python', 'TensorFlow', 'LangChain'],
  },
  // ✏️  Add more roles here:
  // {
  //   id: 'another-role',
  //   role: 'Software Engineer',
  //   company: 'Company Name',
  //   period: 'Jun 2024 – Dec 2024',
  //   description: '...',
  //   highlights: ['...'],
  //   techStack: ['...'],
  // },
];

export default experience;
