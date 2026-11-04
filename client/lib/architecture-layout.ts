import type { Architecture, ArchitectureEdge, ArchitectureNode } from "@/content/types";

export type Orientation = "horizontal" | "vertical";

export interface LayoutOptions {
  orientation: Orientation;
  nodeWidth: number;
  nodeHeight: number;
  /** Distance between tiers (columns when horizontal, rows when vertical) */
  tierGap: number;
  /** Distance between nodes inside the same tier */
  rowGap: number;
  padding: number;
  /** Vertical layout only: nodes per row before a tier wraps */
  maxPerRow: number;
}

export interface PositionedNode extends ArchitectureNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoutedEdge extends ArchitectureEdge {
  id: string;
  d: string;
}

export interface DiagramLayout {
  width: number;
  height: number;
  nodes: readonly PositionedNode[];
  edges: readonly RoutedEdge[];
}

const DEFAULTS: LayoutOptions = {
  orientation: "horizontal",
  nodeWidth: 176,
  nodeHeight: 56,
  tierGap: 72,
  rowGap: 20,
  padding: 8,
  maxPerRow: 2,
};

function groupByTier(nodes: readonly ArchitectureNode[]): ArchitectureNode[][] {
  const maxTier = nodes.reduce((max, node) => Math.max(max, node.tier), 0);
  return Array.from({ length: maxTier + 1 }, (_, tier) => nodes.filter((node) => node.tier === tier));
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function layoutHorizontal(tiers: ArchitectureNode[][], o: LayoutOptions): Omit<DiagramLayout, "edges"> {
  const columnHeight = (count: number) => count * o.nodeHeight + Math.max(0, count - 1) * o.rowGap;
  const tallest = Math.max(...tiers.map((tier) => columnHeight(tier.length)));

  const nodes = tiers.flatMap((tier, tierIndex) => {
    const offset = (tallest - columnHeight(tier.length)) / 2;
    return tier.map((node, row) => ({
      ...node,
      x: o.padding + tierIndex * (o.nodeWidth + o.tierGap),
      y: o.padding + offset + row * (o.nodeHeight + o.rowGap),
      width: o.nodeWidth,
      height: o.nodeHeight,
    }));
  });

  return {
    width: o.padding * 2 + tiers.length * o.nodeWidth + (tiers.length - 1) * o.tierGap,
    height: o.padding * 2 + tallest,
    nodes,
  };
}

function layoutVertical(tiers: ArchitectureNode[][], o: LayoutOptions): Omit<DiagramLayout, "edges"> {
  const perRow = Math.max(1, o.maxPerRow);
  const widest = Math.min(perRow, Math.max(...tiers.map((tier) => tier.length)));
  const contentWidth = widest * o.nodeWidth + (widest - 1) * o.rowGap;

  let cursorY = o.padding;
  const nodes: PositionedNode[] = [];
  tiers.forEach((tier, tierIndex) => {
    const rows = chunk(tier, perRow);
    rows.forEach((row, rowIndex) => {
      const rowWidth = row.length * o.nodeWidth + (row.length - 1) * o.rowGap;
      const offset = (contentWidth - rowWidth) / 2;
      row.forEach((node, col) => {
        nodes.push({
          ...node,
          x: o.padding + offset + col * (o.nodeWidth + o.rowGap),
          y: cursorY,
          width: o.nodeWidth,
          height: o.nodeHeight,
        });
      });
      cursorY += o.nodeHeight + (rowIndex < rows.length - 1 ? o.rowGap : 0);
    });
    if (tierIndex < tiers.length - 1) cursorY += o.tierGap;
  });

  return { width: o.padding * 2 + contentWidth, height: cursorY + o.padding, nodes };
}

const round = (value: number) => Math.round(value * 100) / 100;

function routeEdge(from: PositionedNode, to: PositionedNode, orientation: Orientation): string {
  if (orientation === "horizontal") {
    const x1 = from.x + from.width;
    const y1 = from.y + from.height / 2;
    const x2 = to.x;
    const y2 = to.y + to.height / 2;
    const dx = round((x2 - x1) / 2);
    return `M${round(x1)} ${round(y1)} C${round(x1 + dx)} ${round(y1)} ${round(x2 - dx)} ${round(y2)} ${round(x2)} ${round(y2)}`;
  }
  const x1 = from.x + from.width / 2;
  const y1 = from.y + from.height;
  const x2 = to.x + to.width / 2;
  const y2 = to.y;
  const dy = round((y2 - y1) / 2);
  return `M${round(x1)} ${round(y1)} C${round(x1)} ${round(y1 + dy)} ${round(x2)} ${round(y2 - dy)} ${round(x2)} ${round(y2)}`;
}

/** More nodes than this per row makes labels unreadable on a phone. */
const MAX_FIT_PER_ROW = 4;

/**
 * Vertical options that keep each tier on one row (up to MAX_FIT_PER_ROW nodes)
 * inside `targetWidth`. Wrapped tiers would route edges behind other nodes.
 */
export function fitVerticalOptions(
  architecture: Architecture,
  targetWidth: number,
  base: Partial<LayoutOptions> = {},
): Partial<LayoutOptions> {
  const o: LayoutOptions = { ...DEFAULTS, ...base, orientation: "vertical" };
  const widest = Math.max(1, ...groupByTier(architecture.nodes).map((tier) => tier.length));
  const perRow = Math.min(widest, MAX_FIT_PER_ROW);
  const available = targetWidth - o.padding * 2 - (perRow - 1) * o.rowGap;
  return { ...base, orientation: "vertical", maxPerRow: perRow, nodeWidth: Math.min(o.nodeWidth, Math.floor(available / perRow)) };
}

/** Pure layout: positions nodes by tier and routes edges as cubic curves. */
export function layoutArchitecture(architecture: Architecture, options: Partial<LayoutOptions> = {}): DiagramLayout {
  const o: LayoutOptions = { ...DEFAULTS, ...options };
  const tiers = groupByTier(architecture.nodes);
  const base = o.orientation === "horizontal" ? layoutHorizontal(tiers, o) : layoutVertical(tiers, o);
  const byId = new Map(base.nodes.map((node) => [node.id, node]));

  const edges = architecture.edges.map((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) throw new Error(`Edge ${edge.from} -> ${edge.to} references a missing node`);
    return { ...edge, id: `${edge.from}->${edge.to}`, d: routeEdge(from, to, o.orientation) };
  });

  return { ...base, edges };
}

/** Splits a label into at most two lines, breaking at the space closest to the middle. */
export function wrapLabel(label: string, maxChars: number): string[] {
  if (label.length <= maxChars || !label.includes(" ")) return [label];
  const middle = label.length / 2;
  let best = -1;
  for (let i = 0; i < label.length; i += 1) {
    if (label[i] === " " && (best === -1 || Math.abs(i - middle) < Math.abs(best - middle))) best = i;
  }
  return [label.slice(0, best), label.slice(best + 1)];
}
