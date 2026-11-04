export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DOMAIN_IDS = ["healthcare", "finance", "payments", "data", "automation"] as const;
export type DomainId = (typeof DOMAIN_IDS)[number];

export const PROJECT_SLUGS = [
  "santabot",
  "santaacesso",
  "santapag",
  "scf-auth",
  "balanca-smart",
  "santaanalise",
  "etl-platform",
  "santa-ia",
  "santa-sign",
  "santalabs-landing",
  "finance-project",
] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const METRIC_IDS = ["yearsExperience", "productsInProduction", "integrations", "monthlyVolume"] as const;
export type MetricId = (typeof METRIC_IDS)[number];

export const SKILL_GROUP_IDS = ["backend", "data", "infra", "integrations", "frontend"] as const;
export type SkillGroupId = (typeof SKILL_GROUP_IDS)[number];

export interface Domain {
  id: DomainId;
  /** Short label used by the project filter */
  label: string;
  /** Longer label used in the hero domain line */
  longLabel: string;
}

export interface Metric {
  id: MetricId;
  /** null = not filled yet (hidden in production builds) */
  value: number | null;
  suffix: string;
  label: string;
}

export interface SkillGroup {
  id: SkillGroupId;
  title: string;
  items: readonly string[];
}

export type ExperienceKind = "work" | "education" | "certification";

export interface Experience {
  id: string;
  kind: ExperienceKind;
  organization: string;
  role: string;
  period: string;
  summary: string;
  highlights: readonly string[];
}

/* ---------- Architecture diagrams ---------- */

export type ArchitectureNodeKind = "source" | "service" | "queue" | "store" | "channel" | "device" | "external";

export interface ArchitectureNodeSpec {
  id: string;
  /** Column (horizontal layout) or row (vertical layout), starting at 0 */
  tier: number;
  kind: ArchitectureNodeKind;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
}

export interface ArchitectureSpec {
  nodes: readonly ArchitectureNodeSpec[];
  edges: readonly ArchitectureEdge[];
}

export interface ArchitectureNode extends ArchitectureNodeSpec {
  label: string;
}

export interface Architecture {
  nodes: readonly ArchitectureNode[];
  edges: readonly ArchitectureEdge[];
}

/** Localized node labels keyed by node id */
export type NodeLabels = Readonly<Record<string, string>>;

/* ---------- Projects ---------- */

export interface ProjectImage {
  /** Base file name inside /public/images, e.g. "santabot" -> santabot-800.webp / santabot-1600.webp */
  base: string;
  /** Intrinsic size of the 1600w variant, used to reserve space (no layout shift) */
  width: number;
  height: number;
}

export type ProjectLinkKind = "live" | "post" | "repo";

export interface ProjectLink {
  kind: ProjectLinkKind;
  href: string;
}

/** Language-neutral project data (shared.ts) */
export interface ProjectMeta {
  slug: ProjectSlug;
  domains: readonly DomainId[];
  stack: readonly string[];
  image: ProjectImage | null;
  links: readonly ProjectLink[];
  /** Drafts render only in development builds */
  isDraft: boolean;
  architecture: ArchitectureSpec;
}

/** Localized project text (pt.ts / en.ts) */
export interface ProjectCopy {
  title: string;
  tagline: string;
  problem: string;
  solution: readonly string[];
  /** Empty array = impact not measured yet; the UI shows a neutral note */
  impact: readonly string[];
  nodes: NodeLabels;
}

export interface Project extends Omit<ProjectMeta, "architecture">, Omit<ProjectCopy, "nodes"> {
  architecture: Architecture;
}

/* ---------- Site copy ---------- */

export interface IntegrationStep {
  title: string;
  body: string;
}

export interface LocaleCopy {
  locale: Locale;
  htmlLang: string;
  meta: { title: string; description: string };
  controls: {
    skipToContent: string;
    languageLabel: string;
    switchLanguage: string;
    themeToLight: string;
    themeToDark: string;
    openMenu: string;
    closeMenu: string;
    primaryNav: string;
  };
  nav: { about: string; work: string; stack: string; experience: string; contact: string };
  hero: {
    roles: readonly string[];
    rolesSummary: string;
    tagline: string;
    domainsLabel: string;
    ctaProjects: string;
    ctaContact: string;
    ctaCv: string;
    cvLanguageLabel: string;
  };
  about: {
    heading: string;
    paragraphs: readonly string[];
    location: string;
    availability: string;
    portraitAlt: string;
    metricsHeading: string;
  };
  metrics: readonly Metric[];
  marquee: { label: string };
  integration: {
    heading: string;
    intro: string;
    steps: readonly IntegrationStep[];
    diagramTitle: string;
    nodes: NodeLabels;
  };
  domains: readonly Domain[];
  projects: {
    heading: string;
    intro: string;
    filterLabel: string;
    filterAll: string;
    openCaseStudy: string;
    resultsAnnouncement: string;
    draftBadge: string;
  };
  projectCopy: Readonly<Record<ProjectSlug, ProjectCopy>>;
  stack: { heading: string; intro: string; groups: readonly SkillGroup[] };
  experience: { heading: string; kinds: Readonly<Record<ExperienceKind, string>>; items: readonly Experience[] };
  contact: {
    heading: string;
    body: string;
    emailLabel: string;
    socialLabel: string;
    locationLabel: string;
  };
  caseStudy: {
    back: string;
    problem: string;
    solution: string;
    architecture: string;
    architectureHint: string;
    stack: string;
    impact: string;
    impactPending: string;
    links: string;
    linkLabels: Readonly<Record<ProjectLinkKind, string>>;
    next: string;
    domains: string;
    imageAlt: string;
  };
  footer: { builtWith: string };
  notFound: { title: string; body: string; cta: string };
}

export interface SiteContent extends Omit<LocaleCopy, "projectCopy" | "integration"> {
  integration: Omit<LocaleCopy["integration"], "nodes"> & { architecture: Architecture };
  projects: LocaleCopy["projects"] & { items: readonly Project[] };
}
