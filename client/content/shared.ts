/**
 * Language-neutral content: names, URLs, stack names, image metadata,
 * diagram topology and metric values. Text shown to visitors lives in pt.ts / en.ts.
 */
import type { ArchitectureSpec, Locale, MetricId, ProjectMeta, ProjectSlug, SkillGroupId } from "./types";

export const PROFILE = {
  name: "Kenidy Corrêa",
  firstName: "Kenidy",
  lastName: "Corrêa",
  email: "kenidycorrea37@gmail.com",
  github: { label: "GitHub", handle: "@KenidyCorrea", href: "https://github.com/KenidyCorrea" },
  linkedin: { label: "LinkedIn", handle: "Kenidy Corrêa", href: "https://www.linkedin.com/in/kenidy-correa-3a7a14259/" },
} as const;

/** CVs are offered in more languages than the site itself (Spanish for Spain-based roles). */
export const CV_LANGUAGES = ["pt", "en", "es"] as const;
export type CvLanguage = (typeof CV_LANGUAGES)[number];

export interface CvFile {
  href: string;
  /** Name the browser saves the file as */
  filename: string;
  language: string;
  lang: string;
}

export const CV_FILES: Readonly<Record<CvLanguage, CvFile>> = {
  pt: { href: "/cv_kenidy_pt.pdf", filename: "Kenidy-Correa-CV-PT.pdf", language: "Português", lang: "pt-BR" },
  en: { href: "/cv_kenidy_eng.pdf", filename: "Kenidy-Correa-CV-EN.pdf", language: "English", lang: "en" },
  es: { href: "/cv_kenidy_es.pdf", filename: "Kenidy-Correa-CV-ES.pdf", language: "Español", lang: "es" },
};

/** CV highlighted by default for each site language */
export const DEFAULT_CV: Readonly<Record<Locale, CvLanguage>> = { pt: "pt", en: "en" };

export const PORTRAIT = { base: "portrait", width: 960, height: 1125 } as const;

/** TODO(kenidy): fill in real numbers. null values are hidden in production builds. */
export const METRIC_VALUES: Readonly<Record<MetricId, number | null>> = {
  yearsExperience: 3, // since Jan 2023 (CV)
  productsInProduction: 9, // 9 of 13 healthcare products (CV)
  integrations: null, // TODO: number of system integrations delivered
  monthlyVolume: null, // TODO: users or messages per month
};

export const MARQUEE_TECH: readonly string[] = [
  "Node.js",
  "TypeScript",
  "NestJS",
  "Python",
  "PostgreSQL",
  "OracleDB",
  "BullMQ",
  "RabbitMQ",
  "Docker",
  "Nginx",
  "Cloudflare",
  "AWS",
  "WhatsApp Business API",
  "Twilio",
  "Getnet",
  "Tasy EMR",
  "React",
  "Next.js",
  "Electron",
  "LangGraph",
];

export const SKILL_ITEMS: Readonly<Record<SkillGroupId, readonly string[]>> = {
  backend: ["Node.js", "TypeScript", "NestJS", "Express", "Python"],
  data: ["PostgreSQL", "OracleDB", "BullMQ", "RabbitMQ", "ETL / Web scraping"],
  infra: ["Docker", "Nginx", "Certbot / SSL", "Cloudflare", "AWS"],
  integrations: ["WhatsApp Business API", "Twilio", "Getnet", "Tasy (EMR)", "REST / Webhooks"],
  frontend: ["React", "Next.js", "Electron", "React Native"],
};

/** Generic flow used by the "How I integrate systems" section */
export const INTEGRATION_FLOW: ArchitectureSpec = {
  nodes: [
    { id: "legacy", tier: 0, kind: "source" },
    { id: "erp", tier: 0, kind: "source" },
    { id: "emr", tier: 0, kind: "source" },
    { id: "api", tier: 1, kind: "service" },
    { id: "queue", tier: 2, kind: "queue" },
    { id: "channels", tier: 3, kind: "channel" },
    { id: "payments", tier: 3, kind: "external" },
    { id: "data", tier: 3, kind: "store" },
  ],
  edges: [
    { from: "legacy", to: "api" },
    { from: "erp", to: "api" },
    { from: "emr", to: "api" },
    { from: "api", to: "queue" },
    { from: "queue", to: "channels" },
    { from: "queue", to: "payments" },
    { from: "queue", to: "data" },
  ],
};

const SANTALABS = "https://santalabs.com.br";

export const PROJECTS_META: readonly ProjectMeta[] = [
  {
    slug: "santabot",
    domains: ["healthcare", "automation"],
    stack: ["Node.js", "TypeScript", "Next.js", "PostgreSQL", "BullMQ", "Meta WhatsApp API"],
    image: { base: "santabot", width: 1600, height: 763 },
    links: [{ kind: "live", href: `${SANTALABS}/products/santabot/` }],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "siresp", tier: 0, kind: "external" },
        { id: "tasy", tier: 0, kind: "source" },
        { id: "panel", tier: 0, kind: "service" },
        { id: "api", tier: 1, kind: "service" },
        { id: "queue", tier: 2, kind: "queue" },
        { id: "db", tier: 2, kind: "store" },
        { id: "whatsapp", tier: 3, kind: "channel" },
        { id: "email", tier: 3, kind: "channel" },
        { id: "telegram", tier: 3, kind: "channel" },
        { id: "voice", tier: 3, kind: "channel" },
      ],
      edges: [
        { from: "siresp", to: "api" },
        { from: "tasy", to: "api" },
        { from: "panel", to: "api" },
        { from: "api", to: "queue" },
        { from: "api", to: "db" },
        { from: "queue", to: "whatsapp" },
        { from: "queue", to: "email" },
        { from: "queue", to: "telegram" },
        { from: "queue", to: "voice" },
      ],
    },
  },
  {
    slug: "santaacesso",
    domains: ["healthcare", "automation"],
    stack: ["Electron", "React", "React Native / Expo", "NestJS", "OracleDB", "GitHub Actions"],
    image: { base: "santaacesso", width: 1600, height: 1000 },
    links: [{ kind: "live", href: `${SANTALABS}/products/totem/` }],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "patient", tier: 0, kind: "source" },
        { id: "kiosk", tier: 1, kind: "device" },
        { id: "tablet", tier: 1, kind: "device" },
        { id: "bridge", tier: 2, kind: "service" },
        { id: "queueApi", tier: 2, kind: "service" },
        { id: "printer", tier: 2, kind: "device" },
        { id: "tasy", tier: 3, kind: "store" },
        { id: "panel", tier: 3, kind: "channel" },
      ],
      edges: [
        { from: "patient", to: "kiosk" },
        { from: "kiosk", to: "bridge" },
        { from: "kiosk", to: "queueApi" },
        { from: "kiosk", to: "printer" },
        { from: "tablet", to: "queueApi" },
        { from: "bridge", to: "tasy" },
        { from: "queueApi", to: "panel" },
      ],
    },
  },
  {
    slug: "santapag",
    domains: ["payments", "finance", "healthcare"],
    stack: ["React", "Vite", "Node.js", "Express", "Getnet API", "Pix"],
    image: { base: "santapag", width: 1600, height: 757 },
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "tasy", tier: 0, kind: "source" },
        { id: "sync", tier: 1, kind: "service" },
        { id: "admin", tier: 1, kind: "service" },
        { id: "api", tier: 2, kind: "service" },
        { id: "getnet", tier: 3, kind: "external" },
        { id: "links", tier: 3, kind: "channel" },
        { id: "recon", tier: 4, kind: "store" },
      ],
      edges: [
        { from: "tasy", to: "sync" },
        { from: "sync", to: "api" },
        { from: "admin", to: "api" },
        { from: "api", to: "getnet" },
        { from: "api", to: "links" },
        { from: "getnet", to: "recon" },
      ],
    },
  },
  {
    slug: "scf-auth",
    domains: ["healthcare"],
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Oracle", "Tasy EHR", "Vault"],
    image: { base: "scf-auth", width: 1600, height: 758 },
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "apps", tier: 0, kind: "source" },
        { id: "console", tier: 0, kind: "service" },
        { id: "auth", tier: 1, kind: "service" },
        { id: "tasy", tier: 2, kind: "external" },
        { id: "db", tier: 2, kind: "store" },
        { id: "vault", tier: 2, kind: "store" },
      ],
      edges: [
        { from: "apps", to: "auth" },
        { from: "console", to: "auth" },
        { from: "auth", to: "tasy" },
        { from: "auth", to: "db" },
        { from: "auth", to: "vault" },
      ],
    },
  },
  {
    slug: "balanca-smart",
    domains: ["healthcare", "automation"],
    stack: ["Electron", "JavaScript", "serialport", "Tasy integration"],
    image: { base: "balanca-smart", width: 1600, height: 900 },
    links: [{ kind: "post", href: "https://www.linkedin.com/feed/update/urn:li:activity:7348101545009283072/" }],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "scale", tier: 0, kind: "device" },
        { id: "serial", tier: 1, kind: "service" },
        { id: "app", tier: 2, kind: "device" },
        { id: "tasy", tier: 3, kind: "store" },
      ],
      edges: [
        { from: "scale", to: "serial" },
        { from: "serial", to: "app" },
        { from: "app", to: "tasy" },
      ],
    },
  },
  {
    slug: "santaanalise",
    domains: ["healthcare", "data"],
    stack: ["Next.js", "Material UI", "ECharts", "Socket.IO", "Node.js"],
    image: { base: "santaanalise", width: 1600, height: 758 },
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "tasy", tier: 0, kind: "source" },
        { id: "queries", tier: 1, kind: "service" },
        { id: "realtime", tier: 2, kind: "service" },
        { id: "dashboards", tier: 3, kind: "channel" },
        { id: "reports", tier: 3, kind: "store" },
      ],
      edges: [
        { from: "tasy", to: "queries" },
        { from: "queries", to: "realtime" },
        { from: "realtime", to: "dashboards" },
        { from: "queries", to: "reports" },
      ],
    },
  },
  {
    slug: "etl-platform",
    domains: ["data", "automation", "finance"],
    stack: ["Python", "TypeScript", "Selenium", "Puppeteer", "Playwright", "RabbitMQ", "Docker"],
    image: null,
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "sources", tier: 0, kind: "external" },
        { id: "scrapers", tier: 1, kind: "service" },
        { id: "queue", tier: 2, kind: "queue" },
        { id: "etl", tier: 3, kind: "service" },
        { id: "erp", tier: 4, kind: "store" },
        { id: "bi", tier: 4, kind: "channel" },
      ],
      edges: [
        { from: "sources", to: "scrapers" },
        { from: "scrapers", to: "queue" },
        { from: "queue", to: "etl" },
        { from: "etl", to: "erp" },
        { from: "etl", to: "bi" },
      ],
    },
  },
  {
    slug: "santa-ia",
    domains: ["healthcare", "automation"],
    stack: ["Python", "LangGraph", "FastAPI", "Ollama (Qwen3)", "PostgreSQL + pgvector"],
    image: null,
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "user", tier: 0, kind: "source" },
        { id: "api", tier: 1, kind: "service" },
        { id: "graph", tier: 2, kind: "service" },
        { id: "llm", tier: 3, kind: "service" },
        { id: "rag", tier: 3, kind: "store" },
        { id: "tools", tier: 3, kind: "service" },
        { id: "systems", tier: 4, kind: "store" },
      ],
      edges: [
        { from: "user", to: "api" },
        { from: "api", to: "graph" },
        { from: "graph", to: "llm" },
        { from: "graph", to: "rag" },
        { from: "graph", to: "tools" },
        { from: "tools", to: "systems" },
      ],
    },
  },
  {
    slug: "santa-sign",
    domains: ["healthcare"],
    // TODO(kenidy): confirm stack list
    stack: ["Node.js", "TypeScript", "PDF signing", "ICP-Brasil"],
    image: null,
    links: [],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "documents", tier: 0, kind: "source" },
        { id: "signer", tier: 1, kind: "service" },
        { id: "certificate", tier: 2, kind: "external" },
        { id: "audit", tier: 2, kind: "store" },
        { id: "signed", tier: 3, kind: "channel" },
      ],
      edges: [
        { from: "documents", to: "signer" },
        { from: "signer", to: "certificate" },
        { from: "signer", to: "audit" },
        { from: "signer", to: "signed" },
      ],
    },
  },
  {
    slug: "santalabs-landing",
    domains: ["healthcare"],
    stack: ["Next.js", "TypeScript", "GSAP", "Lenis"],
    image: { base: "santalabs", width: 1600, height: 758 },
    links: [{ kind: "live", href: `${SANTALABS}/` }],
    isDraft: false,
    architecture: {
      nodes: [
        { id: "content", tier: 0, kind: "source" },
        { id: "build", tier: 1, kind: "service" },
        { id: "hosting", tier: 2, kind: "store" },
        { id: "visitors", tier: 3, kind: "channel" },
      ],
      edges: [
        { from: "content", to: "build" },
        { from: "build", to: "hosting" },
        { from: "hosting", to: "visitors" },
      ],
    },
  },
  {
    // TODO(kenidy): financial-market project. Fill copy in pt.ts/en.ts and set isDraft: false.
    slug: "finance-project",
    domains: ["finance"],
    stack: ["TypeScript", "Python"],
    image: null,
    links: [],
    isDraft: true,
    architecture: {
      nodes: [
        { id: "market", tier: 0, kind: "external" },
        { id: "service", tier: 1, kind: "service" },
        { id: "output", tier: 2, kind: "store" },
      ],
      edges: [
        { from: "market", to: "service" },
        { from: "service", to: "output" },
      ],
    },
  },
];

export function getProjectMeta(slug: ProjectSlug): ProjectMeta {
  const meta = PROJECTS_META.find((project) => project.slug === slug);
  if (!meta) throw new Error(`Unknown project slug: ${slug}`);
  return meta;
}
