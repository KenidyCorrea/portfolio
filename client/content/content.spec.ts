import { describe, expect, it } from "vitest";
import { buildContent, getLocaleCopy } from "./index";
import { INTEGRATION_FLOW, METRIC_VALUES, PROJECTS_META } from "./shared";
import { DOMAIN_IDS, LOCALES, METRIC_IDS, PROJECT_SLUGS, SKILL_GROUP_IDS } from "./types";

const MAX_NODE_LABEL = 24;

describe("project metadata", () => {
  it("defines every slug exactly once", () => {
    const slugs = PROJECTS_META.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect([...slugs].sort()).toEqual([...PROJECT_SLUGS].sort());
  });

  it.each(PROJECTS_META.map((meta) => [meta.slug, meta] as const))("%s has a consistent architecture", (_slug, meta) => {
    const ids = meta.architecture.nodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const edge of meta.architecture.edges) {
      expect(ids).toContain(edge.from);
      expect(ids).toContain(edge.to);
    }
  });

  it("only uses known domains and https links", () => {
    for (const meta of PROJECTS_META) {
      expect(meta.domains.length).toBeGreaterThan(0);
      meta.domains.forEach((domain) => expect(DOMAIN_IDS).toContain(domain));
      meta.links.forEach((link) => expect(link.href.startsWith("https://")).toBe(true));
    }
  });
});

describe.each(LOCALES)("locale %s", (locale) => {
  const copy = getLocaleCopy(locale);

  it("has copy and diagram labels for every project", () => {
    for (const meta of PROJECTS_META) {
      const projectCopy = copy.projectCopy[meta.slug];
      expect(projectCopy, meta.slug).toBeDefined();
      expect(projectCopy.title.trim()).not.toBe("");
      expect(projectCopy.solution.length).toBeGreaterThan(0);
      for (const node of meta.architecture.nodes) {
        const label = projectCopy.nodes[node.id];
        expect(label, `${meta.slug}.${node.id}`).toBeTruthy();
        expect(label.length, `${meta.slug}.${node.id}`).toBeLessThanOrEqual(MAX_NODE_LABEL);
      }
    }
  });

  it("labels every node of the integration flow", () => {
    for (const node of INTEGRATION_FLOW.nodes) {
      expect(copy.integration.nodes[node.id], node.id).toBeTruthy();
    }
  });

  it("covers every domain, metric and skill group", () => {
    expect(copy.domains.map((d) => d.id)).toEqual([...DOMAIN_IDS]);
    expect(copy.metrics.map((m) => m.id)).toEqual([...METRIC_IDS]);
    expect(copy.stack.groups.map((g) => g.id)).toEqual([...SKILL_GROUP_IDS]);
    copy.metrics.forEach((metric) => expect(metric.value).toBe(METRIC_VALUES[metric.id]));
  });

  it("keeps placeholders in UI strings resolvable", () => {
    expect(copy.projects.resultsAnnouncement).toContain("{count}");
    expect(copy.caseStudy.imageAlt).toContain("{title}");
  });
});

describe("locale parity", () => {
  const [pt, en] = LOCALES.map(getLocaleCopy);

  it("keeps the same structure in pt and en", () => {
    expect(pt.integration.steps.length).toBe(en.integration.steps.length);
    expect(pt.hero.roles.length).toBe(en.hero.roles.length);
    expect(pt.experience.items.map((i) => i.id)).toEqual(en.experience.items.map((i) => i.id));
    expect(pt.about.paragraphs.length).toBe(en.about.paragraphs.length);
  });
});

describe("buildContent", () => {
  it("merges metadata and copy into projects", () => {
    const content = buildContent("en", { includeDrafts: true });
    const santabot = content.projects.items.find((p) => p.slug === "santabot");
    expect(santabot?.title).toBe("SantaBot");
    expect(santabot?.architecture.nodes.every((n) => n.label.length > 0)).toBe(true);
  });

  it("hides drafts unless asked to include them", () => {
    const published = buildContent("pt", { includeDrafts: false }).projects.items;
    const all = buildContent("pt", { includeDrafts: true }).projects.items;
    expect(published.some((p) => p.isDraft)).toBe(false);
    expect(all.length).toBe(PROJECTS_META.length);
  });

  it("hides empty metrics unless drafts are included", () => {
    const content = buildContent("en", { includeDrafts: false });
    expect(content.metrics.every((m) => m.value !== null)).toBe(true);
  });

  it("returns new arrays so callers cannot mutate shared data", () => {
    const a = buildContent("en", { includeDrafts: true });
    const b = buildContent("en", { includeDrafts: true });
    expect(a.projects.items).not.toBe(b.projects.items);
  });
});
