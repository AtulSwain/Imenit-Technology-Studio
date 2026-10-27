// All editable site copy lives here. Items marked "placeholder" should be replaced with real data.

export const NAV = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "blog", label: "Insights" },
  { id: "contact", label: "Contact" },
] as const;

export const CONTACT_EMAIL = "hello@imenit.com"; // placeholder
export const CONTACT_PHONE = "+91 00000 00000"; // placeholder
export const CONTACT_LOCATION = "India · Working worldwide"; // placeholder
export const STUDIO_CITY = "India"; // shown next to the live clock — placeholder
export const TIMEZONE = "Asia/Kolkata"; // IANA time zone for the live clock
export const AVAILABILITY = "Booking new projects"; // small status line in the hero

/**
 * Optional form endpoint (e.g. Formspree "https://formspree.io/f/xxxx").
 * When empty, the contact form opens the visitor's email app with the message pre-filled.
 */
export const CONTACT_FORM_ENDPOINT = "";

export const HERO_WORDS = ["Tomorrow", "Future", "Business", "World"];

export const TECH = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Flutter", "Swift", "Kotlin", "AWS", "Google Cloud", "PostgreSQL", "OpenAI", "Anthropic", "Figma", "Three.js", "Docker"];

export type ServiceIcon = "code" | "mobile" | "ai" | "design";
export const SERVICES: { title: string; text: string; tags: string[]; icon: ServiceIcon; points: string[] }[] = [
  {
    title: "Web Development", icon: "code",
    text: "Modern, fast and scalable web applications built with the latest technologies.",
    tags: ["React", "Next.js", "Node"],
    points: ["Web apps & SaaS platforms", "Marketing sites & e-commerce", "APIs, dashboards & integrations"],
  },
  {
    title: "Mobile App Development", icon: "mobile",
    text: "High-performance mobile apps for iOS and Android, designed for great user experiences.",
    tags: ["iOS", "Android", "Flutter"],
    points: ["Native & cross-platform apps", "Offline-first & real-time sync", "App Store launch & growth"],
  },
  {
    title: "AI & Automation", icon: "ai",
    text: "Intelligent solutions that automate workflows and unlock new possibilities with AI.",
    tags: ["LLMs", "Agents", "Data"],
    points: ["AI assistants & copilots", "Workflow & document automation", "Data pipelines & analytics"],
  },
  {
    title: "UI/UX & Product Design", icon: "design",
    text: "Research-driven interfaces and design systems that make complex products feel effortless.",
    tags: ["Figma", "Systems", "Motion"],
    points: ["Product strategy & UX research", "Interface & motion design", "Design systems that scale"],
  },
];

// Statement text: segments with em=true render in the italic serif accent.
export const ABOUT_STATEMENT: { t: string; em?: boolean }[] = [
  { t: "We started IMENIT because too much software ships late, looks like everything else and quietly breaks. So we keep teams small, show you real progress every week, and" },
  { t: "sweat the details", em: true },
  { t: "most people skip." },
];

// A short personal note in the About section — edit the name and words to make it yours.
export const FOUNDER_NOTE = {
  text: "Every project gets the same promise: honest timelines, clean code you own, and a team that picks up the phone after launch.",
  name: "Atul Swain", // placeholder — your name
  role: "Founder, IMENIT",
};

export const STATS = [ // placeholder numbers
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 12, suffix: "+", label: "Industries served" },
  { value: 24, suffix: "/7", label: "Support & monitoring" },
];

export const PRINCIPLES: { title: string; text: string }[] = [
  { title: "Small teams, senior people", text: "The people you meet on the first call are the people who build your product. No hand-offs to a team you never see." },
  { title: "Progress you can click", text: "A working build every week, not a status report. You always know where things stand." },
  { title: "Honest about trade-offs", text: "If something isn't worth building yet, we'll tell you — and suggest the simpler thing that is." },
  { title: "Built to be handed over", text: "Clean code, real documentation and no lock-in. It's your product, and it should stay that way." },
];

export type ArtKind = "rings" | "grid" | "bars" | "orb";
export type Project = {
  title: string; category: string; art: ArtKind; year: string;
  /** Optional screenshot: put the file in src/projects/ and write its file name here, e.g. "nova.jpg". */
  image?: string;
  /** Optional live link shown in the case study. */
  link?: string;
  summary: string; challenge: string; solution: string;
  services: string[]; stack: string[]; results: { value: string; label: string }[];
};
/*
 * ADDING A PROJECT
 * Copy one block below, paste it at the end of the list and change the text.
 * For a real screenshot, drop the image in src/projects/ and set image: "file-name.jpg"
 * (without an image, a monochrome visual is used: art "rings" | "grid" | "bars" | "orb").
 * The Work section lays out any number of projects automatically.
 */
export const PROJECTS: Project[] = [ // placeholder case studies
  {
    title: "Nova Ledger", category: "Fintech · Web App", art: "rings", year: "2026",
    summary: "A real-time finance workspace that gives growing companies one clear view of cash, spend and forecasts.",
    challenge: "Finance teams were reconciling data from six tools in spreadsheets, closing the books took two weeks.",
    solution: "We designed a focused dashboard and built live bank integrations, automated categorisation and role-based approvals.",
    services: ["Product design", "Web development", "Integrations"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    results: [{ value: "4×", label: "faster month-end close" }, { value: "60%", label: "less manual entry" }, { value: "99.9%", label: "uptime" }],
  },
  {
    title: "Pulse Care", category: "Health · Mobile", art: "grid", year: "2026",
    summary: "A patient companion app for appointments, reminders and secure messaging with care teams.",
    challenge: "Clinics lost hours every day to phone calls, and patients missed follow-ups.",
    solution: "A calm, accessible mobile experience with smart reminders, video visits and encrypted chat.",
    services: ["UX research", "Mobile development", "Backend"],
    stack: ["Flutter", "Node.js", "Firebase", "Google Cloud"],
    results: [{ value: "-35%", label: "missed appointments" }, { value: "4.8★", label: "app store rating" }, { value: "3 mo", label: "idea to launch" }],
  },
  {
    title: "Cortex Flow", category: "AI · Automation", art: "bars", year: "2025",
    summary: "An AI operations assistant that reads documents, drafts replies and routes work automatically.",
    challenge: "An operations team processed thousands of emails and PDFs by hand each week.",
    solution: "LLM-powered extraction and drafting with human review, connected to their existing CRM.",
    services: ["AI engineering", "Automation", "Dashboard"],
    stack: ["Python", "LLMs", "React", "PostgreSQL"],
    results: [{ value: "70%", label: "tasks automated" }, { value: "12h", label: "saved per person weekly" }, { value: "<2 min", label: "average turnaround" }],
  },
  {
    title: "Monolith Store", category: "Commerce · Platform", art: "orb", year: "2025",
    summary: "A headless commerce platform with an editorial storefront and lightning-fast checkout.",
    challenge: "A slow legacy store was losing mobile shoppers at checkout.",
    solution: "A headless rebuild with a design-led storefront, one-page checkout and edge caching.",
    services: ["Brand & UI", "E-commerce", "Performance"],
    stack: ["Next.js", "Shopify", "Vercel", "Three.js"],
    results: [{ value: "+42%", label: "mobile conversion" }, { value: "0.9s", label: "page load" }, { value: "2×", label: "average order value" }],
  },
];

export const STEPS = [
  { title: "Discover", text: "We dig into your goals, users and market to define what success looks like." },
  { title: "Design", text: "Flows, prototypes and visual systems — tested early, refined often." },
  { title: "Develop", text: "Clean, scalable engineering with weekly releases you can see and touch." },
  { title: "Deliver & Grow", text: "Launch, measure and iterate. We stay on as your long-term technology partner." },
];

export type Post = { date: string; title: string; category: string; art: ArtKind; read: string; body: string[] };
export const POSTS: Post[] = [ // placeholder articles
  {
    date: "Oct 2026", title: "Designing AI products people actually trust", category: "AI", art: "rings", read: "5 min",
    body: [
      "Trust is the real interface of every AI product. People forgive a slow answer; they rarely forgive a confident wrong one.",
      "We design AI features around three habits: show where an answer came from, make it easy to correct, and keep a human in the loop for anything that matters.",
      "Small details do the heavy lifting — clear loading states, visible sources, and an undo button on every automated action. The result is software people are comfortable handing real work to.",
    ],
  },
  {
    date: "Sep 2026", title: "Scaling a web platform from 0 to 1M users", category: "Engineering", art: "grid", read: "7 min",
    body: [
      "Most products do not fail because they could not scale — they fail because they scaled the wrong things too early.",
      "We start simple: one well-structured codebase, a managed database and good observability. Then we measure, and only optimise what the numbers point to.",
      "Caching at the edge, background jobs for slow work and careful database indexing usually carry a product much further than a complex architecture ever will.",
    ],
  },
  {
    date: "Aug 2026", title: "Native vs cross-platform: choosing in 2026", category: "Mobile", art: "bars", read: "6 min",
    body: [
      "Cross-platform frameworks have closed most of the gap. For the majority of business apps, one shared codebase is faster to build and easier to maintain.",
      "Native still wins when you live close to the hardware — advanced camera work, heavy graphics or deep platform integrations.",
      "Our rule of thumb: start cross-platform, keep a clean boundary for native modules, and decide feature by feature.",
    ],
  },
  {
    date: "Jul 2026", title: "Motion as a language in modern interfaces", category: "Design", art: "orb", read: "4 min",
    body: [
      "Motion is not decoration. Done well, it explains where things came from, what changed, and what to do next.",
      "We use a small vocabulary — one easing curve, three durations — so every transition feels like part of the same product.",
      "And we always respect reduced-motion settings. Great motion is felt, not noticed.",
    ],
  },
];

export const SOCIAL = [ // placeholder links — replace with your real profiles
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X / Twitter", href: "https://x.com/" },
  { label: "Dribbble", href: "https://dribbble.com/" },
];

export const PROJECT_TYPES = ["Web app", "Mobile app", "AI & automation", "UI/UX design", "Something else"];
export const BUDGETS = ["< $5k", "$5k – 15k", "$15k – 50k", "$50k +"];

// Where the 3D ribbon sits while each section is in view (world units).
export type ScenePose = { x: number; y: number; s: number; rx: number; dim: number };
export const SCENE_POSES: Record<string, ScenePose> = {
  top: { x: 2.45, y: 0.1, s: 1, rx: 0, dim: 1 },
  services: { x: -2.6, y: -0.4, s: 0.8, rx: 0.6, dim: 0.75 },
  about: { x: 2.4, y: 0.6, s: 0.62, rx: -0.5, dim: 0.6 },
  approach: { x: -2.8, y: 0.8, s: 0.5, rx: 0.9, dim: 0.45 },
  work: { x: 0, y: 0, s: 0.42, rx: 1.2, dim: 0.45 },
  process: { x: -2.3, y: 0.2, s: 0.7, rx: -0.2, dim: 0.55 },
  blog: { x: 2.6, y: -0.5, s: 0.55, rx: 0.4, dim: 0.5 },
  cta: { x: 0, y: 0.1, s: 1.15, rx: 0, dim: 1 },
  contact: { x: 2.8, y: -0.2, s: 0.75, rx: 0.5, dim: 0.55 },
};
