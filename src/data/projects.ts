/**
 * projects.ts — Your project portfolio data.
 *
 * ✏️  EDIT THIS FILE to add/remove/update your projects.
 *     Each project will appear as a card in the Projects panel.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;        // path relative to /public/images/
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'nexus-portfolio',
    title: 'The Nexus Portfolio',
    description: 'This portfolio itself — a spatial computing interface with webcam head tracking.',
    longDescription:
      'A head-coupled perspective 3D portfolio built with Next.js, React Three Fiber, and MediaPipe Face Mesh. The parallax illusion makes the browser feel like a window into a holographic workspace.',
    techStack: ['Next.js', 'Three.js', 'React Three Fiber', 'MediaPipe', 'Framer Motion', 'TailwindCSS'],
    githubUrl: 'https://github.com/yourusername/nexus',
    featured: true,
  },
  {
    id: 'amethyst-platform',
    title: 'Amethyst AI Agent Platform',
    description: 'Enterprise multi-agent platform powering autonomous AI workflows at Godrej.',
    longDescription:
      'Led the frontend architecture migration to React.js, reducing agent integration code from ~1000 lines to ~40 lines. Built and integrated multiple specialized AI agents including email automation, engineering drawing interpretation, and document processing.',
    techStack: ['React.js', 'Python', 'LangChain', 'Azure', 'GCP', 'OAuth 2.0'],
    featured: true,
  },
  {
    id: 'cv-safety',
    title: 'Industrial CV Safety System',
    description: 'Real-time computer vision system for worker safety near robotic welding arms.',
    longDescription:
      'Developed a CV-based solution to monitor "no-go" zones around high-pressure/high-temperature robotic welding arms. The system detects human presence in dangerous areas and triggers alerts or emergency shutdowns to ensure worker safety.',
    techStack: ['Python', 'OpenCV', 'YOLO', 'Computer Vision', 'Real-time Processing'],
    featured: true,
  },
  {
    id: 'drawing-agent',
    title: 'Engineering Drawing Agent',
    description: 'AI agent that understands and answers questions about complex engineering drawings.',
    longDescription:
      'Built from scratch using advanced LLM vision capabilities. The agent interprets architectural and mechanical diagrams, extracting technical information and answering domain-specific queries about the drawings.',
    techStack: ['Python', 'GPT-4 Vision', 'LangChain', 'RAG'],
    featured: false,
  },
  {
    id: 'email-agent',
    title: 'Automated Email Agent',
    description: 'Fully autonomous cross-platform email system with intent extraction and auto-reply.',
    longDescription:
      'End-to-end autonomous email pipeline: listens for incoming emails (Gmail/Outlook), extracts intent using LLMs, drafts context-aware replies, and sends them automatically. Integrated with both GCP and Azure for cross-platform support.',
    techStack: ['Python', 'Gmail API', 'Outlook API', 'Azure', 'GCP', 'LangChain'],
    featured: false,
  },
  {
    id: 'sharepoint-connector',
    title: 'SharePoint & OneDrive Connector',
    description: 'Enterprise data connector using Microsoft MSAL and OAuth 2.0 for document access.',
    longDescription:
      'Implemented a robust data connector for the Amethyst platform enabling AI agents to securely access and process internal enterprise documentation from SharePoint and OneDrive.',
    techStack: ['Python', 'Microsoft MSAL', 'OAuth 2.0', 'SharePoint API', 'OneDrive API'],
    featured: false,
  },
];

export default projects;
