// All editable site copy lives here. Items marked "placeholder" should be replaced with real data.

export const NAV = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;

export const CONTACT_EMAIL = "hello@imenit.com"; // placeholder

export const HERO_WORDS = ["Tomorrow", "Future", "Business", "World"];

export type ServiceIcon = "code" | "mobile" | "ai" | "design";
export const SERVICES: { title: string; text: string; tags: string[]; icon: ServiceIcon }[] = [
  { title: "Web Development", text: "Modern, fast and scalable web applications built with the latest technologies.", tags: ["React", "Next.js", "Node"], icon: "code" },
  { title: "Mobile App Development", text: "High-performance mobile apps for iOS and Android, designed for great user experiences.", tags: ["iOS", "Android", "Flutter"], icon: "mobile" },
  { title: "AI & Automation", text: "Intelligent solutions that automate workflows and unlock new possibilities with AI.", tags: ["LLMs", "Agents", "Data"], icon: "ai" },
  { title: "UI/UX & Product Design", text: "Research-driven interfaces and design systems that make complex products feel effortless.", tags: ["Figma", "Systems", "Motion"], icon: "design" },
];

// Statement text: segments with em=true render in the italic serif accent.
export const ABOUT_STATEMENT: { t: string; em?: boolean }[] = [
  { t: "We are a studio of engineers, designers and thinkers. We turn bold ideas into" },
  { t: "precise", em: true },
  { t: "digital products — engineered for scale, designed for people and built to make a" },
  { t: "lasting impact", em: true },
  { t: "on the businesses we partner with." },
];

export const STATS = [ // placeholder numbers
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 12, suffix: "+", label: "Industries served" },
  { value: 24, suffix: "/7", label: "Support & monitoring" },
];

export type ArtKind = "rings" | "grid" | "bars" | "orb";
export const PROJECTS: { title: string; category: string; art: ArtKind }[] = [ // placeholder projects
  { title: "Nova Ledger", category: "Fintech · Web App", art: "rings" },
  { title: "Pulse Care", category: "Health · Mobile", art: "grid" },
  { title: "Cortex Flow", category: "AI · Automation", art: "bars" },
  { title: "Monolith Store", category: "Commerce · Platform", art: "orb" },
];

export const STEPS = [
  { title: "Discover", text: "We dig into your goals, users and market to define what success looks like." },
  { title: "Design", text: "Flows, prototypes and visual systems — tested early, refined often." },
  { title: "Develop", text: "Clean, scalable engineering with weekly releases you can see and touch." },
  { title: "Deliver & Grow", text: "Launch, measure and iterate. We stay on as your long-term technology partner." },
];

export const POSTS: { date: string; title: string; category: string; art: ArtKind }[] = [ // placeholder posts
  { date: "Oct 2026", title: "Designing AI products people actually trust", category: "AI", art: "rings" },
  { date: "Sep 2026", title: "Scaling a web platform from 0 to 1M users", category: "Engineering", art: "grid" },
  { date: "Aug 2026", title: "Native vs cross-platform: choosing in 2026", category: "Mobile", art: "bars" },
  { date: "Jul 2026", title: "Motion as a language in modern interfaces", category: "Design", art: "orb" },
];

export const SOCIAL = [ // placeholder links
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
];

// Where the 3D ribbon sits while each section is in view (world units).
export type ScenePose = { x: number; y: number; s: number; rx: number; dim: number };
export const SCENE_POSES: Record<string, ScenePose> = {
  top: { x: 2.45, y: 0.1, s: 1, rx: 0, dim: 1 },
  services: { x: -2.6, y: -0.4, s: 0.8, rx: 0.6, dim: 0.75 },
  about: { x: 2.4, y: 0.6, s: 0.62, rx: -0.5, dim: 0.6 },
  work: { x: 0, y: 0, s: 0.42, rx: 1.2, dim: 0.45 },
  process: { x: -2.3, y: 0.2, s: 0.7, rx: -0.2, dim: 0.55 },
  blog: { x: 2.6, y: -0.5, s: 0.55, rx: 0.4, dim: 0.5 },
  contact: { x: 0, y: 0.1, s: 1.15, rx: 0, dim: 1 },
};
