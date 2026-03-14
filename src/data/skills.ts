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
}

export interface SkillLink {
  source: string;
  target: string;
}

export const skillNodes: SkillNode[] = [
  // AI / ML
  { id: 'python',       label: 'Python',        group: 'ai',       proficiency: 5 },
  { id: 'langchain',    label: 'LangChain',     group: 'ai',       proficiency: 5 },
  { id: 'opencv',       label: 'OpenCV',        group: 'ai',       proficiency: 4 },
  { id: 'tensorflow',   label: 'TensorFlow',    group: 'ai',       proficiency: 4 },
  { id: 'pytorch',      label: 'PyTorch',       group: 'ai',       proficiency: 3 },
  { id: 'llm',          label: 'LLM/GPT',       group: 'ai',       proficiency: 5 },
  { id: 'rag',          label: 'RAG',            group: 'ai',       proficiency: 5 },
  { id: 'cv',           label: 'Computer Vision', group: 'ai',     proficiency: 4 },
  { id: 'mediapipe',    label: 'MediaPipe',     group: 'ai',       proficiency: 3 },

  // Frontend
  { id: 'react',        label: 'React.js',      group: 'frontend',  proficiency: 5 },
  { id: 'nextjs',       label: 'Next.js',       group: 'frontend',  proficiency: 4 },
  { id: 'typescript',   label: 'TypeScript',    group: 'frontend',  proficiency: 4 },
  { id: 'javascript',   label: 'JavaScript',    group: 'frontend',  proficiency: 5 },
  { id: 'threejs',      label: 'Three.js',      group: 'frontend',  proficiency: 3 },
  { id: 'tailwind',     label: 'TailwindCSS',   group: 'frontend',  proficiency: 4 },
  { id: 'html-css',     label: 'HTML/CSS',      group: 'frontend',  proficiency: 5 },

  // Backend
  { id: 'nodejs',       label: 'Node.js',       group: 'backend',   proficiency: 4 },
  { id: 'fastapi',      label: 'FastAPI',       group: 'backend',   proficiency: 4 },
  { id: 'rest-api',     label: 'REST APIs',     group: 'backend',   proficiency: 5 },
  { id: 'sql',          label: 'SQL',            group: 'backend',   proficiency: 4 },

  // DevOps / Cloud
  { id: 'azure',        label: 'Azure',          group: 'devops',    proficiency: 4 },
  { id: 'gcp',          label: 'GCP',            group: 'devops',    proficiency: 3 },
  { id: 'docker',       label: 'Docker',         group: 'devops',    proficiency: 3 },
  { id: 'git',          label: 'Git',            group: 'devops',    proficiency: 5 },

  // Tools
  { id: 'vscode',       label: 'VS Code',       group: 'tools',     proficiency: 5 },
  { id: 'linux',        label: 'Linux',          group: 'tools',     proficiency: 4 },

  // ✏️  Add more skills here
];

export const skillLinks: SkillLink[] = [
  // AI cluster
  { source: 'python', target: 'langchain' },
  { source: 'python', target: 'opencv' },
  { source: 'python', target: 'tensorflow' },
  { source: 'python', target: 'pytorch' },
  { source: 'python', target: 'fastapi' },
  { source: 'langchain', target: 'llm' },
  { source: 'langchain', target: 'rag' },
  { source: 'opencv', target: 'cv' },
  { source: 'cv', target: 'mediapipe' },
  { source: 'tensorflow', target: 'cv' },

  // Frontend cluster
  { source: 'react', target: 'nextjs' },
  { source: 'react', target: 'typescript' },
  { source: 'react', target: 'javascript' },
  { source: 'javascript', target: 'threejs' },
  { source: 'react', target: 'tailwind' },
  { source: 'html-css', target: 'tailwind' },
  { source: 'html-css', target: 'javascript' },

  // Backend cluster
  { source: 'nodejs', target: 'javascript' },
  { source: 'nodejs', target: 'rest-api' },
  { source: 'fastapi', target: 'rest-api' },
  { source: 'sql', target: 'rest-api' },

  // Cloud cluster
  { source: 'azure', target: 'gcp' },
  { source: 'docker', target: 'azure' },
  { source: 'docker', target: 'gcp' },
  { source: 'git', target: 'docker' },

  // Cross-cluster bridges
  { source: 'typescript', target: 'nodejs' },
  { source: 'mediapipe', target: 'threejs' },
  { source: 'llm', target: 'azure' },

  // ✏️  Add more links here
];

export const groupColors: Record<SkillNode['group'], string> = {
  ai: '#818cf8',        // indigo
  frontend: '#22d3ee',  // cyan
  backend: '#34d399',   // emerald
  devops: '#f59e0b',    // amber
  tools: '#a78bfa',     // violet
};
