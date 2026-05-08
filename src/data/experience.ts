/**
 * experience.ts — Unified work experience data.
 *
 * Merged from Portfolio/src/constants/index.js and Illusion_V2/src/data/experience.ts
 * All 7 unique roles retained; Illusion V2's richer format used throughout.
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
  iconBg?: string;
  logoUrl?: string; // path relative to /public/
}

const experience: Experience[] = [
  {
    id: "godrej-ai",
    role: "AI Engineer Intern",
    company: "Godrej Enterprises",
    location: "Mumbai, India",
    period: "Jan 2026 – Jun 2026",
    description:
      "Engineered production-grade AI agents and connectors for Godrej's Amethyst AI platform, focusing on autonomous execution and industrial analysis.",
    highlights: [
      "Built an intelligent Email Agent with human-in-the-loop and context-aware replies using a knowledge base.",
      "Developed an Engineering Specsheet Analyzer for aerospace, achieving 98% accuracy in BOM generation.",
      "Designed a SharePoint & OneDrive Connector supporting safe read/write with multi-layered guardrails.",
      "Automated address generation workflows with the Multi-Address Generation Agent, saving 2 man-days of work.",
      "Developed a 2D/3D Drawing Analyzer for STP-format engineering drawings to identify design patterns.",
      "Implemented Computer Vision for warehousing safety monitoring and rack space occupancy detection.",
      "Core contributor to the official launch of Amethyst, Godrej's internal AI platform.",
    ],
    techStack: [
      "Python",
      "LangChain",
      "OpenCV",
      "Azure",
      "GCP",
      "MSAL",
      "STP Parsing",
    ],
    iconBg: "#383E56",
    logoUrl: "/images/company/Godrej_Enterprises_Group.svg.png",
  },
  {
    id: "godrej-data-science",
    role: "Data Science Intern",
    company: "Godrej Enterprises",
    period: "Jun 2025 – Jul 2025",
    description:
      "Designed a full LLM security guardrails framework from scratch to block sophisticated jailbreak attempts.",
    highlights: [
      "Implemented Regex-based pattern matching, Semantic Filtering, and LLM-as-a-critic as a multi-layered defense.",
      "Built a comprehensive analytics and reporting dashboard to monitor guardrail performance in real-time.",
      "Benchmarked system against industry LLM safety standards and collaborated for cross-functional compliance.",
    ],
    techStack: ["Python", "LangChain", "LLM Security", "Data Visualization"],
    iconBg: "#383E56",
    logoUrl: "/images/company/Godrej_Enterprises_Group.svg.png",
  },
  {
    id: "deepcytes",
    role: "Project Leader",
    company: "DeepCytes Cyber Labs",
    location: "Remote",
    period: "Mar 2025 – May 2025",
    description:
      "Engineered a real-time global cyber threat visualization system processing 10,000+ data points per second.",
    highlights: [
      "Designed scalable backend pipelines to continuously ingest and process thousands of threat data entries per minute.",
      "Applied clustering techniques to intelligently group and stream data to the frontend.",
      "Built a responsive, information-dense frontend rendering live cyberattack origins, targets, and types.",
    ],
    techStack: [
      "Python",
      "Streaming Pipelines",
      "Clustering",
      "Data Visualization",
    ],
    iconBg: "#E6DEDD",
    logoUrl: "/images/company/deepcytes.jpeg",
  },
  {
    id: "expert-scm",
    role: "Project Leader",
    company: "Expert SCM",
    period: "Oct 2024 – Dec 2024",
    description:
      "Built a dynamic supply chain management simulation game using real-world logistics logic.",
    highlights: [
      "Developed interactive decision-making and animations to help students learn complex SCM concepts.",
      "Bridged the gap between technical implementation and supply chain theory for non-technical learners.",
    ],
    techStack: ["React.js", "Animations", "Simulation Logic"],
    iconBg: "#E6DEDD",
  },
  {
    id: "coding-judge",
    role: "Frontend Developer Intern",
    company: "Coding Judge",
    period: "Jul 2024 – Aug 2024",
    description:
      "Optimized frontend performance and delivered critical features under tight deadlines.",
    highlights: [
      "Implemented lazy-loading, debouncing, and memoization to significantly improve performance and reduce latency.",
      "Mentored by Microsoft SDEs and IIT-B engineers in a high-pressure development environment.",
    ],
    techStack: ["React.js", "Frontend Optimization", "Performance"],
    iconBg: "#383E56",
    logoUrl: "/images/company/codingjudge.png",
  },
  {
    id: "pro-compiler",
    role: "Project Lead — ProCompiler",
    company: "K.J. Somaiya School of Engineering",
    period: "Dec 2023 – Aug 2024",
    description:
      "Designed and built a secure multi-language online compiler used for tamper-proof examinations.",
    highlights: [
      "Supported Python, C/C++, and Java for 5,000+ students with optimized execution and sandboxing.",
      "Led a small dev team managing sprint planning, code reviews, and deployment cycles.",
      "Rewrote architecture twice to significantly improve usability, reliability, and language support.",
    ],
    techStack: ["Node.js", "Docker", "Sandboxing", "Full Stack"],
    iconBg: "#E6DEDD",
    logoUrl: "/images/company/svu.png",
  },
  {
    id: "proct-connect",
    role: "Frontend Developer — ProctConnect",
    company: "K.J. Somaiya School of Engineering",
    period: "Jul 2023 – Jul 2024",
    description:
      "Developed a centralized academic portal for 5,000+ users for communication and academic tracking.",
    highlights: [
      "Scaled backend infrastructure to support live academic monitoring sessions during high-concurrency usage.",
      "Enabled seamless communication between proctors, students, and faculty for monitoring and grievances.",
    ],
    techStack: ["React.js", "Backend Scaling", "Communication Systems"],
    iconBg: "#383E56",
    logoUrl: "/images/company/svu.png",
  },
];

export default experience;
