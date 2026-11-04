import { forwardRef, useId, useMemo } from "react";
import type { Architecture, ArchitectureNodeKind } from "@/content/types";
import { layoutArchitecture, wrapLabel, type LayoutOptions, type Orientation } from "@/lib/architecture-layout";
import { cn } from "@/lib/utils";

const LAYOUTS: Readonly<Record<Orientation, Partial<LayoutOptions>>> = {
  horizontal: { orientation: "horizontal", nodeWidth: 176, nodeHeight: 56, tierGap: 72, rowGap: 20 },
  vertical: { orientation: "vertical", nodeWidth: 156, nodeHeight: 56, tierGap: 44, rowGap: 14, maxPerRow: 2 },
};

const AVERAGE_CHAR_WIDTH = 7.4;
const LABEL_PADDING = 20;
const LINE_HEIGHT = 16;

const NODE_CLASSES: Readonly<Record<ArchitectureNodeKind, string>> = {
  source: "fill-bg stroke-line",
  service: "fill-surface stroke-signal",
  queue: "fill-bg stroke-signal [stroke-dasharray:5_4]",
  store: "fill-surface stroke-line",
  channel: "fill-bg stroke-fg/50",
  device: "fill-surface stroke-fg/50",
  external: "fill-bg stroke-line [stroke-dasharray:3_4]",
};

interface ArchitectureDiagramProps {
  architecture: Architecture;
  title: string;
  orientation: Orientation;
  className?: string;
}

/**
 * Static SVG diagram. Exposes data-edge / data-node / data-tier hooks so
 * callers can animate it (DrawSVG on edges, fades on nodes).
 */
export const ArchitectureDiagram = forwardRef<SVGSVGElement, ArchitectureDiagramProps>(function ArchitectureDiagram(
  { architecture, title, orientation, className },
  ref,
) {
  const id = useId();
  const layout = useMemo(() => layoutArchitecture(architecture, LAYOUTS[orientation]), [architecture, orientation]);
  const labelById = useMemo(() => new Map(architecture.nodes.map((node) => [node.id, node.label])), [architecture]);
  const description = layout.edges.map((edge) => `${labelById.get(edge.from)} → ${labelById.get(edge.to)}`).join("; ");

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className={cn("h-auto w-full overflow-visible font-sans", className)}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>

      <g fill="none" className="stroke-signal" strokeWidth={1.5} strokeLinecap="round">
        {layout.edges.map((edge) => {
          const toTier = architecture.nodes.find((node) => node.id === edge.to)?.tier ?? 0;
          return <path key={edge.id} d={edge.d} data-edge="" data-to-tier={toTier} />;
        })}
      </g>

      {layout.nodes.map((node) => {
        const maxChars = Math.floor((node.width - LABEL_PADDING) / AVERAGE_CHAR_WIDTH);
        const lines = wrapLabel(node.label, maxChars);
        const centerX = node.x + node.width / 2;
        const firstLineY = node.y + node.height / 2 - ((lines.length - 1) * LINE_HEIGHT) / 2;
        return (
          <g key={node.id} data-node="" data-tier={node.tier}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              rx={8}
              strokeWidth={1.25}
              className={NODE_CLASSES[node.kind]}
            />
            <text textAnchor="middle" dominantBaseline="central" className="fill-fg text-[13px] font-medium">
              {lines.map((line, index) => (
                <tspan key={line} x={centerX} y={firstLineY + index * LINE_HEIGHT}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
