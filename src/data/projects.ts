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
  {
    id: 'ignite-web',
    title: 'IGNITE-WEB',
    description: 'EdTech AI platform that transforms user prompts into production-ready websites.',
    longDescription: 'Added support for runtime editing, allowing users to customize layout, text, and styling live. Focused on AI prompt structuring, mapping natural language to web layout logic.',
    techStack: ['AI Prompt-to-Code', 'Runtime Editing', 'React.js', 'No-code'],
  },
  {
    id: 'hostkar',
    title: 'HOSTKAR (Vercel Clone)',
    description: 'CI/CD web platform for deploying static and dynamic sites.',
    longDescription: 'Users can deploy sites by simply pasting a GitHub repo link. Introduced backend deployment principles using Node.js, Express, with automatic build and hosting.',
    techStack: ['Node.js', 'Express', 'CI/CD', 'Automated Deployment'],
  },
  {
    id: 'stock-scope',
    title: 'STOCK-SCOPE',
    description: 'Fintech platform providing detailed stock stats and live charts with portfolio insights.',
    techStack: ['Fintech', 'Data Visualization', 'Charts', 'Real-time Data'],
  },
  {
    id: 'roomers',
    title: 'ROOMERS',
    description: 'Social media chat app with AJAX-based real-time messaging, emoji/GIF support.',
    techStack: ['AJAX', 'Real-time Messaging', 'Chat App'],
  },
  {
    id: 'prompt-search',
    title: 'Prompt-Search',
    description: 'Solved hallucination in LLMs using auto-enhanced query generation and Google CSE.',
    techStack: ['LLM', 'Google CSE', 'RAG'],
  }
];

export default projects;
