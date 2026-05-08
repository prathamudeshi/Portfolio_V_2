/**
 * projects.ts — Unified project portfolio data.
 *
 * Merged from Portfolio/src/constants/index.js and Illusion_V2/src/data/projects.ts
 * Deduplication: HostKar, IgniteWeb, StockIt, Portfolio/Nexus → kept once with best data.
 * Portfolio-only additions: InsightMeet, Emandi, FlightBook, WellTrack, OnlineCompiler, FrontendProject.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string; // path relative to /public/images/projects/
  featured?: boolean;
}

const projects: Project[] = [
  // ── Featured / Professional ──────────────────────────────────────
  {
    id: "ignite-web",
    title: "IGNITE-WEB",
    description:
      "AI-powered platform converting natural language prompts into production-ready, editable websites.",
    longDescription:
      "Built a platform that converts natural language prompts into production-ready, editable websites using structured prompt-to-code generation pipelines. Includes live runtime editing support where users can modify layout, text, and styling in-browser without touching code.",
    techStack: [
      "MERN",
      "Anthropic API",
      "AI Prompt-to-Code",
      "Runtime Editing",
    ],
    githubUrl: "https://github.com/prathamudeshi/IGNITE-WEB",
    imageUrl: "/images/projects/igniteweb.png",
    featured: true,
  },
  {
    id: "hostkar",
    title: "HOSTKAR",
    description:
      "CI/CD web deployment platform enabling instant deployments from GitHub repositories.",
    longDescription:
      "Developed a CI/CD web deployment platform where users can deploy static and dynamic sites by simply pasting a GitHub repository link. Handles automatic build triggering, artifact hosting, and route management using Node.js and Express.",
    techStack: ["Node.js", "Express", "CI/CD", "Vercel-Clone", "DevOps"],
    githubUrl: "https://github.com/prathamudeshi/HOSTKAR",
    imageUrl: "/images/projects/hostkar.png",
    featured: true,
  },
  {
    id: "prompt-search",
    title: "PROMPT-SEARCH",
    description:
      "Solving LLM hallucinations with auto-enhanced query generation and Google CSE integration.",
    longDescription:
      "Addresses the LLM hallucination problem for search-based queries using auto-enhanced query generation that rewrites user prompts for improved retrieval precision. Integrated Google Custom Search Engine (CSE) to ground responses in real, indexed sources.",
    techStack: ["Python", "LLM", "Google CSE", "Search Optimization"],
    githubUrl: "https://github.com/prathamudeshi/PROMPT-SEARCH",
    featured: true,
  },
  {
    id: "amethyst-platform",
    title: "Amethyst AI Platform",
    description:
      "Internal enterprise AI platform powering autonomous agents at Godrej.",
    longDescription:
      "Core contributor to the official launch of Godrej's internal AI platform. Built multiple production-grade agents including a human-in-the-loop Email Agent and an Engineering Specsheet Analyzer with 98% accuracy.",
    techStack: ["React.js", "Python", "LangChain", "Azure", "GCP", "MSAL"],
    featured: true,
    imageUrl: "/images/projects/portfolio.png",
  },

  // ── Professional & Freelance ─────────────────────────────────────
  {
    id: "flight-booking",
    title: "Flight Booking Frontend",
    description:
      "Freelance travel-tech project featuring search, filter, and booking flows.",
    longDescription:
      "Built a complete, responsive frontend for a client's flight booking system. Implemented complex search and filter logic along with a seamless booking flow focusing on user-friendly interface design.",
    techStack: ["Next.js", "TailwindCSS", "UI/UX", "Travel Tech"],
    featured: false,
    imageUrl: "/images/projects/flightbook.png",
  },
  {
    id: "data-extractor",
    title: "Web Data Extractor",
    description:
      "Automated extraction tool for real estate listings on 99acres.com.",
    longDescription:
      "Developed an automated data extraction tool for 99acres.com, scraping and structuring property listings into queryable formats for market analysis.",
    techStack: ["Python", "Automation", "Scraping", "Data Engineering"],
    featured: false,
  },

  // ── Other Projects ───────────────────────────────────────────────
  {
    id: "stock-scope",
    title: "STOCK-SCOPE",
    description:
      "FinTech dashboard providing live charts and portfolio insights.",
    longDescription:
      "Built a stock analytics dashboard providing detailed statistics, live charts, and portfolio insights with real-time data visualization.",
    techStack: ["React.js", "Data Visualization", "FinTech", "Highcharts"],
    githubUrl: "https://github.com/prathamudeshi/STOCK-SCOPE",
    imageUrl: "/images/projects/StockIt.png",
    featured: false,
  },
  {
    id: "emandi",
    title: "Emandi",
    description:
      "One stop solution for farmers to deliver their prodeuce direct from farm to the consumer helping them to maximize their profits",
    techStack: ["CRUD operations", "MERN", "easy-to-use"],
    imageUrl: "/images/projects/emandi.png",
    githubUrl: "https://github.com/prathamudeshi/Online_Compiler",
    featured: false,
  },
  {
    id: "welltrack",
    title: "WellTrack",
    description:
      "A frontend project shocasing eye-catching animations and transitions. Aimed at providing a platform for students to track their mental health and well-being.",
    techStack: ["animation", "gsap", "transition"],
    imageUrl: "/images/projects/welltrack.png",
    githubUrl: "https://github.com/prathamudeshi/Online_Compiler",
    featured: false,
  },
  {
    id: "frontend-project",
    title: "Frontend Project",
    description:
      "Web Applications showcasing some good animations and a clean combo of UI and UX. Also this website has user authentication functionality using php and sql.",
    techStack: ["gsap", "scroller-locomotive", "php", "sql"],
    imageUrl: "/images/projects/something.png",
    githubUrl: "https://github.com/prathamudeshi/WorkFlow",
    featured: false,
  },
  {
    id: "roomers",
    title: "ROOMERS",
    description:
      "Real-time social media chat application with AJAX-based messaging.",
    longDescription:
      "Developed a real-time chat application with AJAX-based messaging, emoji/GIF support, and a scalable message delivery architecture.",
    techStack: ["AJAX", "PHP", "SQL", "Real-time Systems"],
    githubUrl: "https://github.com/prathamudeshi/ROOMERS",
    featured: false,
  },
  {
    id: "nexus-portfolio",
    title: "The Nexus Portfolio",
    description:
      "Spatial computing interface with head tracking and 3D interactive panels.",
    longDescription:
      "A head-coupled perspective 3D portfolio built with Next.js, React Three Fiber, and MediaPipe. The parallax illusion makes the browser feel like a window into a holographic workspace.",
    techStack: ["Next.js", "Three.js", "MediaPipe", "Framer Motion"],
    githubUrl: "https://github.com/prathamudeshi/Portfolio",
    featured: false,
    imageUrl: "/images/projects/nexus.png",
  },
];

export default projects;
