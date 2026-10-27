/*
 * ============================================================
 *  IMENIT Technologies — all site content lives in this file.
 * ============================================================
 *  Rules for editing:
 *  - Only publish facts you can stand behind. No invented clients,
 *    numbers, testimonials or awards.
 *  - Project facts below come from the project repositories and
 *    Atul Swain's portfolio (github.com/AtulSwain).
 */

import lgCover from "../projects/langgraph-cover.webp";
import lgStudy from "../projects/langgraph-study-guide.webp";
import lgLesson from "../projects/langgraph-lesson-3d.webp";
import lgPatterns from "../projects/langgraph-patterns.webp";
import lgArch from "../projects/langgraph-architecture.webp";
import webspaceCover from "../projects/webspace.webp";

export const SITE = {
  name: "IMENIT Technologies",
  url: "https://atulswain.github.io/Imenit-Technology-Studio/",
  descriptor: "Independent Technology Studio",
  oneLiner: "An independent studio building digital products, intelligent software and the technology behind them.",
  location: "Mumbai, India",
  email: "swainatul785@gmail.com",
  founder: "Atul Swain",
};

/**
 * Contact form endpoint. Paste a Formspree form URL here (https://formspree.io → New form)
 * to receive enquiries directly. Leave it empty and the form opens the visitor's email app
 * with their message filled in instead — it never pretends a message was sent.
 */
export const FORM_ENDPOINT = "";

export const SOCIAL = [
  { label: "GitHub", href: "https://github.com/AtulSwain" },
];

export const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
] as const;

/* ---------------------------------------------------------------- Projects */

export type Shot = { src: string; alt: string; caption?: string };
export type Status = "Live" | "In use" | "Open source" | "In development";

export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  status: Status;
  /** One specific sentence. */
  summary: string;
  /** Short line used on the cover / card. */
  tagline: string;
  role: string;
  cover?: Shot;
  /** "screenshot" shows a framed product image; "mark" shows a brand mark on a quiet surface. */
  coverStyle: "screenshot" | "mark" | "type";
  stack: string[];
  links: { live?: string; code?: string };
  /** Facts about the product (features), not outcomes. */
  facts?: { value: string; label: string }[];
  problem: string;
  objective: string;
  approach: string;
  features: string[];
  tradeoffs: string;
  next?: string;
  gallery?: Shot[];
  note?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "langgraph-universe",
    name: "LangGraph Universe",
    category: "Interactive learning platform",
    year: "2026",
    status: "Live",
    tagline: "Learning agents by watching them think.",
    summary:
      "An interactive, 3D study guide to LangGraph and the LangChain ecosystem — 47 lessons in 9 modules, with animated diagrams of 12 agent architectures and code in Python and TypeScript.",
    role: "Author, design and engineering",
    cover: { src: lgCover, alt: "LangGraph Universe home page: “Build agents that think in graphs” beside a 3D graph" },
    coverStyle: "screenshot",
    stack: ["React", "TypeScript", "three.js", "React Three Fiber", "Framer Motion", "Vite"],
    links: { live: "https://atulswain.github.io/LangGraph/", code: "https://github.com/AtulSwain/LangGraph" },
    facts: [
      { value: "47", label: "Lessons" },
      { value: "9", label: "Modules" },
      { value: "12", label: "Agent patterns" },
    ],
    problem:
      "Agent frameworks are easiest to understand when you can see state flow between nodes, but most documentation shows static boxes and arrows.",
    objective: "A guide where the graph actually runs in front of you, step by step, next to the code that produces it.",
    approach:
      "Each lesson pairs a live three.js scene with the matching Python and TypeScript code. Patterns such as supervisor, map-reduce and human-in-the-loop are animated one step at a time, so you can follow exactly what each node receives and returns.",
    features: [
      "47 lessons across 9 modules with progress tracking",
      "12 agent patterns animated step by step in 3D",
      "Every lesson pairs a diagram with Python and TypeScript code",
      "A playground, guided project walkthroughs, a quiz and a glossary",
    ],
    tradeoffs:
      "Teaching a topic exposes every gap in your own understanding — writing 47 lessons meant learning LangGraph properly, and keeping a large React codebase organised as the content grew.",
    gallery: [
      { src: lgStudy, alt: "Study guide lesson page", caption: "47 lessons in 9 modules, with progress tracking" },
      { src: lgLesson, alt: "Animated 3D map-reduce graph above code", caption: "3D diagrams beside Python and TypeScript code" },
      { src: lgPatterns, alt: "Supervisor multi-agent pattern in 3D", caption: "12 agent architectures, animated step by step" },
      { src: lgArch, alt: "3D stack of the LangChain ecosystem", caption: "The LangChain ecosystem as a 3D stack" },
    ],
  },
  {
    slug: "green",
    name: "Green",
    category: "AI personal assistant",
    year: "2026",
    status: "In development",
    tagline: "A local-first AI assistant for Windows.",
    summary:
      "A native desktop assistant that talks to a language model running on your own computer through Ollama, keeps conversations and memories locally, and acts only through tools you enable and approve.",
    role: "Design and engineering",
    coverStyle: "type",
    stack: ["Python", "PySide6", "Ollama", "SQLite", "pydantic"],
    links: { code: "https://github.com/AtulSwain/Green" },
    problem:
      "Most AI assistants send everything to the cloud and give the model broad access to your machine. Many people want help on their computer without giving up privacy or control.",
    objective:
      "A personal assistant where, by default, nothing leaves your computer — no cloud AI, analytics or telemetry — and every action the model takes is visible and approved.",
    approach:
      "A PySide6 desktop app talking to a local model through Ollama. Tools sit in a deny-by-default registry with strict argument schemas and read / controlled / restricted permissions. Controlled actions need approval on every call, and file edits are shown as a diff with a backup before anything changes.",
    features: [
      "Conversations, memory, reminders, workspace, tool activity, voice, settings and diagnostics screens",
      "Native tool calling with per-call approval and a live step display",
      "Developer assistance: browse a project, ask about a file, review proposed edits as a diff",
      "Optional OpenAI-compatible online models, with one-time consent and keys stored in Windows Credential Manager",
    ],
    tradeoffs:
      "The current release is covered by automated tests using a fake model server, but has not yet been run on Windows against a real model, microphone or voice. Wake-word listening, an installer and an encrypted database are planned, not built.",
    next: "Testing on real Windows hardware, then a packaged installer.",
  },
  {
    slug: "webspace",
    name: "WebSpace",
    category: "Real-time communication",
    year: "2026",
    status: "Open source",
    tagline: "Private video calls, peer to peer.",
    summary:
      "Room-based video and voice calls with chat, typing indicators and screen sharing. The server only does signalling — audio and video flow directly between browsers over WebRTC.",
    role: "Full-stack development",
    cover: { src: webspaceCover, alt: "WebSpace “Private Video Call” screen with name and room ID fields" },
    coverStyle: "screenshot",
    stack: ["Node.js", "Express", "Socket.IO", "WebRTC", "JavaScript"],
    links: { code: "https://github.com/AtulSwain/WebSpace" },
    problem:
      "A video call between two people shouldn't need an account, a database or a company sitting in the middle of the conversation.",
    objective: "A small app where you pick a name and a room ID, share it with a friend, and talk — with nothing stored on a server.",
    approach:
      "Socket.IO joins people to a room and relays the WebRTC handshake: one browser sends an SDP offer, the other answers, and ICE candidates are exchanged until a direct path is found. After that, audio and video never touch the server.",
    features: [
      "Real-time video, voice and chat in private rooms",
      "Screen sharing, mute and camera toggles",
      "Typing indicators and connection status for both sides",
      "No database and no accounts — privacy by design",
    ],
    tradeoffs:
      "Networking is full of edge cases — permissions, NAT traversal, one side joining before the other. Keeping the server to signalling only keeps calls private, but means there is no recording or call history by design.",
  },
  {
    slug: "invoicing",
    name: "Vinayak Creation Invoicing",
    category: "Business software",
    year: "2026",
    status: "In use",
    tagline: "Software built around how a real shop works.",
    summary:
      "A web app for making GST tax invoices laid out exactly like the shop's paper pad, plus a one-click monthly report for the accountant. Works on a phone or a laptop.",
    role: "Sole developer",
    coverStyle: "type",
    stack: ["Python", "Flask", "SQLite", "ReportLab", "openpyxl", "Waitress"],
    links: { code: "https://github.com/AtulSwain/Invoice-system" },
    problem:
      "A small business wanted to stop writing GST invoices by hand — without changing how their invoices looked — and wanted the monthly numbers ready for their accountant.",
    objective: "Invoices that print exactly like the paper pad they already used, with the least possible software to install, run or pay for.",
    approach:
      "Flask and SQLite, chosen deliberately: no database server to install or pay for, and backups are a file copy. PDFs are generated in pure Python, so it runs on Windows, Mac, Linux or a cheap host.",
    features: [
      "Invoices laid out exactly like the existing paper pad",
      "Owner and worker roles with different permissions",
      "Monthly Excel report for the accountant and PDF export for every invoice",
      "Import of past ledger bills from a spreadsheet, and daily automatic backups",
    ],
    tradeoffs:
      "Only five dependencies and one SQLite file keep it simple to run and back up, at the cost of features a larger system would have. The best software for a small business is often the simplest one that fits how it already works.",
  },
];

/** Smaller pieces of real work, shown as a compact list. */
export const MORE_WORK = [
  { name: "FlowDesk", detail: "Team workspace with manager and employee views", stack: "Express · Socket.IO · MySQL", href: "https://github.com/AtulSwain/Flow" },
  { name: "Berserk Archive", detail: "Fan encyclopedia with a modular full-stack foundation", stack: "React · FastAPI · PostgreSQL", href: "https://github.com/AtulSwain/BerserkFanMadeClub" },
];

/* ---------------------------------------------------------------- Services */

export type ServiceIconName = "layers" | "monitor" | "sparkles" | "server";

export const SERVICES: {
  icon: ServiceIconName;
  title: string;
  build: string;
  solves: string;
  when: string;
  items: string[];
  note?: string;
}[] = [
  {
    icon: "layers",
    title: "Digital product development",
    build: "Web applications taken from an idea to a working, maintained product.",
    solves: "Turns a validated idea into software people can actually use, without a large team.",
    when: "You have a product in mind and need planning, architecture and engineering in one place.",
    items: ["Product planning and technical architecture", "Frontend engineering", "Backend and API development", "Responsive web applications", "Iteration and maintenance"],
  },
  {
    icon: "monitor",
    title: "Web design and development",
    build: "Websites and interactive experiences that are fast, accessible and easy to maintain.",
    solves: "Replaces slow, generic or hard-to-edit sites with something that represents you properly.",
    when: "You need a business site, portfolio, landing page or a performance and accessibility upgrade.",
    items: ["Business and portfolio websites", "Landing pages", "Interactive digital experiences", "Performance and accessibility improvements"],
  },
  {
    icon: "sparkles",
    title: "AI and intelligent systems",
    build: "Practical AI features with guardrails — tested prompts, cited sources, agents built as graphs you can reason about.",
    solves: "Removes repetitive work and makes information easier to find and trust.",
    when: "You have a workflow, document set or data source where AI could save real time.",
    items: ["AI-powered applications", "LLM integrations", "Workflow automation", "Agent-based systems where appropriate", "Retrieval and analysis over your data"],
  },
  {
    icon: "server",
    title: "Software and platform engineering",
    build: "Internal tools, dashboards and data-driven applications built around how your team works.",
    solves: "Replaces spreadsheets and manual steps with reliable, purpose-built software.",
    when: "Your team is outgrowing spreadsheets or stitching tools together by hand.",
    items: ["Internal tools and dashboards", "Data-driven applications", "API integrations", "Scalable application architecture", "Technical prototyping"],
  },
];

/* ---------------------------------------------------------------- About */

export const ABOUT = {
  statement:
    "We believe technology should do more than look impressive. It should solve meaningful problems, create useful experiences, and make complex ideas work in the real world.",
  body: [
    "IMENIT Technologies is an independent technology studio founded by Atul Swain in Mumbai. We design and build digital products, intelligent software and the engineering behind them — from a focused business tool to a full platform.",
    "We are deliberately small. That means the person you talk to is the person building your product, and every decision is made with the long term in mind.",
  ],
  values: [
    { title: "Thoughtful problem-solving", text: "Understand the decision someone needs to make before writing code." },
    { title: "Strong engineering fundamentals", text: "Clear architecture, tested code and software someone else can pick up." },
    { title: "Product-oriented thinking", text: "Build what helps people, then improve it with what we learn." },
    { title: "Attention to detail", text: "Honest numbers, clear interfaces and careful typography." },
    { title: "Continuous experimentation", text: "New tools are tried in our own products before they reach yours." },
    { title: "Long-term commitment", text: "Software that keeps working, documented and handed over properly." },
  ],
};

/* ---------------------------------------------------------------- Process */

export const PROCESS = [
  { title: "Discover", text: "Understand the business problem, audience, objectives and constraints." },
  { title: "Define", text: "Clarify requirements, scope, technical approach and priorities." },
  { title: "Build", text: "Design, implement, test and refine the solution." },
  { title: "Deliver", text: "Launch, document and support the product according to the agreed scope." },
];

/* ---------------------------------------------------------------- Contact */

export const PROJECT_TYPES = [
  "Digital product",
  "Website",
  "AI / intelligent system",
  "Internal tool or platform",
  "Something else",
];
export const BUDGETS = ["Not sure yet", "Under INR 1 lakh", "INR 1–5 lakh", "INR 5 lakh +"];
