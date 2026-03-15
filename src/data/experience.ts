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
  period: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

const experience: Experience[] = [
  {
    id: "godrej-ai",
    role: "AI Engineer Intern",
    company: "Godrej Enterprises Group",
    location: "Mumbai, India",
    period: "Jan 2026 – Mar 2026",
    description:
      "End-to-end development of autonomous AI agents, industrial computer vision solutions, and cloud-integrated infrastructure on the Amethyst platform.",
    highlights: [
      "Built 5+ specialized AI agents (email, drawing interpretation, document processing)",
      "Developed an industrial CV safety system for robotic welding environments",
      "Led React.js frontend migration — reduced integration code from ~1000 to ~40 lines",
      "Integrated SharePoint/OneDrive connectors with OAuth 2.0 / MSAL",
      "Explored agentic warehousing solutions at India's largest facility",
      "Researched drone + computer vision integration for industrial monitoring",
    ],
    techStack: [
      "Python",
      "React.js",
      "LangChain",
      "OpenCV",
      "Azure",
      "GCP",
      "OAuth 2.0",
    ],
  },
  {
    id: "godrej-guardrail",
    role: "AI Guardrail Engineer Intern",
    company: "Godrej Enterprises Group",
    period: "Jun 2025 – July 2025",
    description:
      "Designed full LLM security Guardrails from scratch capable of blocking advanced jailbreaks.",
    highlights: [
      "Utilized Regex-based pattern matching, Semantic filtering, and LLM-as-a-critic.",
      "Implemented comprehensive analytics and reporting tools to monitor system performance.",
      "Benchmarked on industry safety standards; collaborated with domain experts.",
    ],
    techStack: ["Python", "Langchain", "Guardrails", "LLM"],
  },
  {
    id: "deepcytes",
    role: "Project Leader",
    company: "DeepCytes Cyber Labs UK",
    location: "Mumbai, India",
    period: "March 2025 – May 2025",
    description:
      "Engineered a real-time cyber threat visualization system capable of processing 10,000+ data points/sec.",
    highlights: [
      "Developed a scalable backend to collect and process thousands of data entries per minute applying clustering techniques.",
      "Built a responsive frontend that visualizes global live attacks across multiple countries in real-time.",
    ],
    techStack: [
      "Python",
      "Scalable Backend",
      "Data Visualization",
      "Real-time Streaming",
    ],
  },
  {
    id: "expert-scm",
    role: "Project Leader",
    company: "Expert SCM",
    period: "Oct 2024 – Dec 2024",
    description:
      "Built a dynamic supply chain management simulation game using real-world logistics logic and animations.",
    highlights: [
      "Overcame the barrier between supply chain management process and tech, merging them to help students learn these concepts.",
    ],
    techStack: ["Game Development", "Animations", "Simulation"],
  },
  {
    id: "coding-judge",
    role: "Frontend Developer Intern",
    company: "Coding Judge",
    period: "July 2024 – Aug 2024",
    description:
      "Improved performance of the platform preventing crashes and reducing perceived latency.",
    highlights: [
      "Implemented lazy-loading, debouncing, and memoization to optimize frontend.",
      "Mentored by Microsoft SDEs and IIT-B peers.",
    ],
    techStack: ["React.js", "Frontend Optimization", "Lazy-Loading"],
  },
  {
    id: "pro-compiler",
    role: "Full Stack Developer Intern / Project Leader",
    company: "KJ Somaiya (ProCompiler)",
    period: "Dec 2023 – Aug 2024",
    description:
      "Developed and optimized a compiler used to conduct coding examinations supporting multiple languages.",
    highlights: [
      "Supported multiple languages including Python, C/C++, and Java.",
      "Rewrote architecture twice to optimize performance and improve usability.",
    ],
    techStack: ["Full Stack", "Compiler", "Python", "C/C++", "Java"],
  },
  {
    id: "proct-connect",
    role: "Frontend Developer Intern",
    company: "KJ Somaiya (ProctConnect)",
    period: "July 2023 – July 2024",
    description:
      "Created a centralized portal for communication and monitoring support for 5,000+ users.",
    highlights: [
      "Enabled communication between proctors, students, and faculty.",
      "Scaled backend infrastructure to support live academic monitoring.",
    ],
    techStack: ["React.js", "Backend Scaling", "Real-time Communication"],
  },
];

export default experience;
