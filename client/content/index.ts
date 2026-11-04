import { en } from "./en";
import { pt } from "./pt";
import { INTEGRATION_FLOW, PROJECTS_META } from "./shared";
import type { Architecture, ArchitectureSpec, Locale, LocaleCopy, NodeLabels, Project, SiteContent } from "./types";

const COPY: Readonly<Record<Locale, LocaleCopy>> = { pt, en };

export function getLocaleCopy(locale: Locale): LocaleCopy {
  return COPY[locale];
}

function labelArchitecture(spec: ArchitectureSpec, labels: NodeLabels): Architecture {
  return {
    nodes: spec.nodes.map((node) => ({ ...node, label: labels[node.id] ?? node.id })),
    edges: spec.edges.map((edge) => ({ ...edge })),
  };
}

export interface BuildOptions {
  /** Include draft projects and unfilled metrics (development builds) */
  includeDrafts: boolean;
}

export function buildContent(locale: Locale, { includeDrafts }: BuildOptions): SiteContent {
  const copy = COPY[locale];
  const { projectCopy, integration, ...rest } = copy;

  const items: Project[] = PROJECTS_META.filter((meta) => includeDrafts || !meta.isDraft).map((meta) => {
    const { nodes, ...text } = projectCopy[meta.slug];
    return {
      ...meta,
      ...text,
      architecture: labelArchitecture(meta.architecture, nodes),
    };
  });

  const { nodes: integrationNodes, ...integrationText } = integration;

  return {
    ...rest,
    metrics: copy.metrics.filter((metric) => includeDrafts || metric.value !== null),
    integration: { ...integrationText, architecture: labelArchitecture(INTEGRATION_FLOW, integrationNodes) },
    projects: { ...copy.projects, items },
  };
}

/** Replaces {key} tokens in UI strings */
export function format(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export * from "./types";
