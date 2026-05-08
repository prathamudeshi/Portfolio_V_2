/**
 * skills.ts — Your skills data for the constellation graph.
 *
 * ✏️  EDIT THIS FILE to add/remove skills and their connections.
 *     Nodes are skills, links connect related skills.
 *     The `group` field determines the cluster color.
 */

export interface SkillNode {
  id: string;
  label: string;
  group: 'ai' | 'frontend' | 'backend' | 'devops' | 'tools';
  proficiency: number;  // 1–5
  description: string;
}

export interface SkillLink {
  source: string;
  target: string;
}

export const groupLabels: Record<SkillNode['group'], string> = {
  ai: 'AI / ML',
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps / Cloud',
  tools: 'Tools',
};

export const skillNodes: SkillNode[] = [
  // AI / ML
  { id: 'python',       label: 'Python',          group: 'ai',       proficiency: 5, description: 'Primary language for AI/ML development and automation.' },
  { id: 'langchain',    label: 'LangChain',       group: 'ai',       proficiency: 5, description: 'Building LLM-powered applications and autonomous agents.' },
  { id: 'agentic-ai',   label: 'Agentic AI',      group: 'ai',       proficiency: 5, description: 'Designing autonomous agents with human-in-the-loop and tool-use.' },
  { id: 'prompt-eng',   label: 'Prompt Eng.',     group: 'ai',       proficiency: 5, description: 'Advanced prompt engineering, structured output, and chain-of-thought.' },
  { id: 'rag',          label: 'RAG',              group: 'ai',       proficiency: 5, description: 'Retrieval-Augmented Generation for grounding LLMs in real-world data.' },
  { id: 'guardrails',   label: 'LLM Guardrails',  group: 'ai',       proficiency: 5, description: 'Implementing security, semantic filtering, and LLM-as-a-critic.' },
  { id: 'cv',           label: 'Computer Vision',  group: 'ai',      proficiency: 4, description: 'End-to-end vision systems and STP-format drawing analysis.' },
  { id: 'llm',          label: 'LLMs',             group: 'ai',       proficiency: 5, description: 'Working with GPT-4, Claude, and open-source models.' },

  // Frontend
  { id: 'react',        label: 'React.js',        group: 'frontend',  proficiency: 5, description: 'Building modern, high-performance web applications.' },
  { id: 'nextjs',       label: 'Next.js',         group: 'frontend',  proficiency: 5, description: 'Full-stack React framework for production-grade apps.' },
  { id: 'typescript',   label: 'TypeScript',      group: 'frontend',  proficiency: 5, description: 'Type-safe development for scalable codebases.' },
  { id: 'threejs',      label: 'Three.js',        group: 'frontend',  proficiency: 4, description: '3D rendering and spatial computing interfaces.' },
  { id: 'tailwind',     label: 'TailwindCSS',     group: 'frontend',  proficiency: 5, description: 'Rapid UI development with utility-first styling.' },

  // Backend
  { id: 'nodejs',       label: 'Node.js',         group: 'backend',   proficiency: 5, description: 'Scalable server-side development with Express.' },
  { id: 'django',       label: 'Django',          group: 'backend',   proficiency: 4, description: 'Robust Python web framework with full battery-included features.' },
  { id: 'sql',          label: 'SQL / DB',         group: 'backend',   proficiency: 4, description: 'Relational database design and query optimization.' },
  { id: 'rest-api',     label: 'REST APIs',       group: 'backend',   proficiency: 5, description: 'Designing secure and efficient API architectures.' },
  { id: 'cpp',          label: 'C/C++',            group: 'backend',   proficiency: 4, description: 'High-performance systems programming.' },

  // DevOps / Cloud
  { id: 'azure-gcp',    label: 'Azure / GCP',      group: 'devops',    proficiency: 4, description: 'Cloud infrastructure, MSAL, and AI service integration.' },
  { id: 'cicd',         label: 'CI/CD',            group: 'devops',    proficiency: 4, description: 'Automated build, test, and deployment pipelines.' },
  { id: 'streaming',    label: 'Streaming',        group: 'devops',    proficiency: 4, description: 'Real-time data streaming and processing pipelines.' },
  { id: 'git',          label: 'Git',              group: 'devops',    proficiency: 5, description: 'Version control and collaborative workflow management.' },

  // Tools
  { id: 'figma',        label: 'Figma',            group: 'tools',     proficiency: 5, description: 'UI/UX design and prototyping for digital products.' },
  { id: 'cybersecurity', label: 'Cybersecurity',   group: 'tools',     proficiency: 4, description: 'Security audits, threat visualization, and safe-coding.' },
];

export const skillLinks: SkillLink[] = [
  // AI cluster
  { source: 'python', target: 'langchain' },
  { source: 'langchain', target: 'agentic-ai' },
  { source: 'agentic-ai', target: 'prompt-eng' },
  { source: 'langchain', target: 'rag' },
  { source: 'agentic-ai', target: 'guardrails' },
  { source: 'python', target: 'cv' },
  { source: 'python', target: 'llm' },

  // Frontend cluster
  { source: 'react', target: 'nextjs' },
  { source: 'nextjs', target: 'typescript' },
  { source: 'react', target: 'threejs' },
  { source: 'react', target: 'tailwind' },

  // Backend cluster
  { source: 'nodejs', target: 'rest-api' },
  { source: 'django', target: 'python' },
  { source: 'sql', target: 'rest-api' },

  // DevOps cluster
  { source: 'azure-gcp', target: 'cicd' },
  { source: 'cicd', target: 'streaming' },
  { source: 'git', target: 'cicd' },

  // Bridges
  { source: 'python', target: 'django' },
  { source: 'typescript', target: 'nodejs' },
  { source: 'threejs', target: 'react' },
  { source: 'figma', target: 'react' },
  { source: 'cybersecurity', target: 'guardrails' },
];


export const groupColors: Record<SkillNode['group'], string> = {
  ai: '#818cf8',        // indigo
  frontend: '#22d3ee',  // cyan
  backend: '#34d399',   // emerald
  devops: '#f59e0b',    // amber
  tools: '#a78bfa',     // violet
};
