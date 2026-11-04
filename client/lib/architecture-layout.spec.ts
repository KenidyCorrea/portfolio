import { describe, expect, it } from "vitest";
import type { Architecture } from "@/content/types";
import { layoutArchitecture, wrapLabel } from "./architecture-layout";

const ARCH: Architecture = {
  nodes: [
    { id: "a", tier: 0, kind: "source", label: "Source A" },
    { id: "b", tier: 0, kind: "source", label: "Source B" },
    { id: "api", tier: 1, kind: "service", label: "API" },
    { id: "out", tier: 2, kind: "channel", label: "Output" },
  ],
  edges: [
    { from: "a", to: "api" },
    { from: "b", to: "api" },
    { from: "api", to: "out" },
  ],
};

describe("layoutArchitecture (horizontal)", () => {
  const layout = layoutArchitecture(ARCH, { orientation: "horizontal", nodeWidth: 100, nodeHeight: 40, tierGap: 50, rowGap: 20, padding: 10 });
  const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));

  it("places tiers in columns from left to right", () => {
    expect(byId.a.x).toBe(10);
    expect(byId.api.x).toBe(10 + 100 + 50);
    expect(byId.out.x).toBe(10 + 2 * (100 + 50));
  });

  it("centers smaller tiers vertically against the tallest one", () => {
    expect(byId.a.y).toBe(10);
    expect(byId.b.y).toBe(10 + 40 + 20);
    // tallest column = 2 * 40 + 20 = 100; single node centered => (100 - 40) / 2
    expect(byId.api.y).toBe(10 + 30);
  });

  it("computes the canvas size including padding", () => {
    expect(layout.width).toBe(10 * 2 + 3 * 100 + 2 * 50);
    expect(layout.height).toBe(10 * 2 + 100);
  });

  it("routes edges from the right side of the source to the left side of the target", () => {
    const edge = layout.edges.find((e) => e.from === "api" && e.to === "out");
    expect(edge?.d.startsWith(`M${byId.api.x + 100} ${byId.api.y + 20}`)).toBe(true);
    expect(edge?.d.endsWith(`${byId.out.x} ${byId.out.y + 20}`)).toBe(true);
    expect(layout.edges.map((e) => e.id)).toEqual(["a->api", "b->api", "api->out"]);
  });
});

describe("layoutArchitecture (vertical)", () => {
  const layout = layoutArchitecture(ARCH, { orientation: "vertical", nodeWidth: 100, nodeHeight: 40, tierGap: 30, rowGap: 10, padding: 0, maxPerRow: 2 });
  const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));

  it("stacks tiers top to bottom", () => {
    expect(byId.a.y).toBe(0);
    expect(byId.api.y).toBe(40 + 30);
    expect(byId.out.y).toBe(2 * (40 + 30));
  });

  it("routes edges from bottom to top", () => {
    const edge = layout.edges.find((e) => e.from === "a");
    expect(edge?.d.startsWith(`M${byId.a.x + 50} ${byId.a.y + 40}`)).toBe(true);
  });

  it("wraps wide tiers into extra rows", () => {
    const wide: Architecture = {
      nodes: [0, 1, 2].map((i) => ({ id: `n${i}`, tier: 0, kind: "channel" as const, label: `N${i}` })),
      edges: [],
    };
    const wrapped = layoutArchitecture(wide, { orientation: "vertical", nodeWidth: 100, nodeHeight: 40, rowGap: 10, padding: 0, maxPerRow: 2 });
    expect(wrapped.width).toBe(2 * 100 + 10);
    expect(wrapped.height).toBe(2 * 40 + 10);
  });
});

describe("layoutArchitecture validation", () => {
  it("throws on edges that reference unknown nodes", () => {
    const broken: Architecture = { nodes: ARCH.nodes, edges: [{ from: "a", to: "missing" }] };
    expect(() => layoutArchitecture(broken)).toThrow(/missing/);
  });
});

describe("wrapLabel", () => {
  it("keeps short labels on one line", () => {
    expect(wrapLabel("API", 12)).toEqual(["API"]);
  });

  it("splits long labels at the space closest to the middle", () => {
    expect(wrapLabel("Ticket printer queue", 12)).toEqual(["Ticket", "printer queue"]);
  });

  it("never returns more than two lines", () => {
    expect(wrapLabel("one two three four five six", 6).length).toBeLessThanOrEqual(2);
  });
});
