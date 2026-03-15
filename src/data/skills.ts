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
  { id: 'python',       label: 'Python',          group: 'ai',       proficiency: 5, description: 'Primary language for AI/ML development, data processing, and automation scripts.' },
  { id: 'langchain',    label: 'LangChain',       group: 'ai',       proficiency: 5, description: 'Building LLM-powered applications with chains, agents, and retrieval-augmented generation.' },
  { id: 'opencv',       label: 'OpenCV',          group: 'ai',       proficiency: 4, description: 'Computer vision library for image processing, object detection, and video analysis.' },
  { id: 'tensorflow',   label: 'TensorFlow',      group: 'ai',       proficiency: 4, description: 'Deep learning framework for training and deploying neural networks at scale.' },
  { id: 'pytorch',      label: 'PyTorch',         group: 'ai',       proficiency: 3, description: 'Dynamic deep learning framework for research prototyping and model experimentation.' },
  { id: 'llm',          label: 'LLM/GPT',         group: 'ai',       proficiency: 5, description: 'Working with large language models — prompt engineering, fine-tuning, and API integration.' },
  { id: 'rag',          label: 'RAG',              group: 'ai',       proficiency: 5, description: 'Retrieval-Augmented Generation pipelines for knowledge-grounded AI applications.' },
  { id: 'cv',           label: 'Computer Vision',  group: 'ai',      proficiency: 4, description: 'End-to-end vision systems including detection, segmentation, and tracking.' },
  { id: 'mediapipe',    label: 'MediaPipe',        group: 'ai',      proficiency: 3, description: 'Real-time perception pipelines for face mesh, hand tracking, and pose estimation.' },

  // Frontend
  { id: 'react',        label: 'React.js',        group: 'frontend',  proficiency: 5, description: 'Component-based UI library for building interactive single-page applications.' },
  { id: 'nextjs',       label: 'Next.js',         group: 'frontend',  proficiency: 4, description: 'Full-stack React framework with SSR, API routes, and optimized performance.' },
  { id: 'typescript',   label: 'TypeScript',      group: 'frontend',  proficiency: 4, description: 'Type-safe JavaScript superset for robust, maintainable codebases.' },
  { id: 'javascript',   label: 'JavaScript',      group: 'frontend',  proficiency: 5, description: 'Core web language for client-side logic, DOM manipulation, and async programming.' },
  { id: 'threejs',      label: 'Three.js',        group: 'frontend',  proficiency: 3, description: '3D rendering library for immersive web experiences and WebGL visualization.' },
  { id: 'tailwind',     label: 'TailwindCSS',     group: 'frontend',  proficiency: 4, description: 'Utility-first CSS framework for rapid, consistent UI development.' },
  { id: 'html-css',     label: 'HTML/CSS',        group: 'frontend',  proficiency: 5, description: 'Semantic markup and modern CSS including Grid, Flexbox, and animations.' },
  { id: 'flutter',      label: 'Flutter',         group: 'frontend',  proficiency: 3, description: 'Cross-platform mobile framework for building natively compiled apps.' },

  // Backend
  { id: 'nodejs',       label: 'Node.js',         group: 'backend',   proficiency: 4, description: 'Server-side JavaScript runtime for scalable backend services.' },
  { id: 'fastapi',      label: 'FastAPI',         group: 'backend',   proficiency: 4, description: 'High-performance Python API framework with automatic docs and type validation.' },
  { id: 'django',       label: 'Django',          group: 'backend',   proficiency: 4, description: 'Full-featured Python web framework with ORM, auth, and admin interface.' },
  { id: 'rest-api',     label: 'REST APIs',       group: 'backend',   proficiency: 5, description: 'Designing and building RESTful endpoints with proper patterns and documentation.' },
  { id: 'sql',          label: 'SQL',              group: 'backend',   proficiency: 4, description: 'Relational database queries, schema design, and performance optimization.' },
  { id: 'cpp',          label: 'C/C++',            group: 'backend',   proficiency: 4, description: 'Systems programming for performance-critical applications and algorithms.' },

  // DevOps / Cloud
  { id: 'azure',        label: 'Azure',            group: 'devops',    proficiency: 4, description: 'Microsoft cloud platform — Cognitive Services, App Services, and DevOps pipelines.' },
  { id: 'gcp',          label: 'GCP',              group: 'devops',    proficiency: 3, description: 'Google Cloud services including Vertex AI, Cloud Run, and BigQuery.' },
  { id: 'docker',       label: 'Docker',           group: 'devops',    proficiency: 3, description: 'Containerization for consistent development, testing, and deployment environments.' },
  { id: 'git',          label: 'Git',              group: 'devops',    proficiency: 5, description: 'Version control with branching strategies, rebasing, and collaborative workflows.' },

  // Tools
  { id: 'vscode',       label: 'VS Code',         group: 'tools',     proficiency: 5, description: 'Primary IDE with custom extensions, debugging, and integrated terminal workflow.' },
  { id: 'linux',        label: 'Linux',            group: 'tools',     proficiency: 4, description: 'Linux administration, shell scripting, and server management.' },
  { id: 'figma',        label: 'Figma',            group: 'tools',     proficiency: 4, description: 'UI/UX design tool for wireframing, prototyping, and design systems.' },
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
  { source: 'django', target: 'python' },
  { source: 'cpp', target: 'python' },
  { source: 'flutter', target: 'react' },
  { source: 'figma', target: 'react' },
];

export const groupColors: Record<SkillNode['group'], string> = {
  ai: '#818cf8',        // indigo
  frontend: '#22d3ee',  // cyan
  backend: '#34d399',   // emerald
  devops: '#f59e0b',    // amber
  tools: '#a78bfa',     // violet
};
