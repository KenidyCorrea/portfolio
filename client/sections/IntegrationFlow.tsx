import { useRef } from "react";
import { ArchitectureDiagram } from "@/components/diagram/ArchitectureDiagram";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { LayoutOptions } from "@/lib/architecture-layout";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";

const STEP_LABEL = /^step-(\d+)$/;
/** Wide screens have room for full-size nodes beside the step list. */
const WIDE_LAYOUT: Partial<LayoutOptions> = { nodeWidth: 156, rowGap: 14 };

/**
 * Scrubbed timeline: each tier of the diagram is one step. Edges leading into
 * the tier are drawn first (DrawSVG), then its nodes and labels appear.
 */
function buildFlowTimeline(root: HTMLElement, stepCount: number, vars: gsap.TimelineVars): gsap.core.Timeline {
  const tiers = [...root.querySelectorAll<SVGGElement>("[data-node]")].map((node) => Number(node.dataset.tier));
  const tierCount = Math.max(...tiers) + 1;
  const timeline = gsap.timeline({ ...vars, defaults: { ease: "none" } });

  for (let tier = 0; tier < tierCount; tier += 1) {
    timeline.addLabel(`step-${Math.min(tier, stepCount - 1)}`);
    const incoming = root.querySelectorAll(`[data-edge][data-to-tier="${tier}"]`);
    if (incoming.length > 0) timeline.from(incoming, { drawSVG: 0, duration: 1, stagger: 0.15 });
    timeline.from(
      root.querySelectorAll(`[data-node][data-tier="${tier}"]`),
      { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.12, ease: "power2.out" },
      incoming.length > 0 ? "-=0.25" : undefined,
    );
  }
  return timeline;
}

/** Marks every step up to `lastReached` as reached, so the list fills as the diagram draws. */
function setReachedSteps(root: HTMLElement, lastReached: number | "all") {
  root.querySelectorAll<HTMLElement>("[data-step]").forEach((step, index) => {
    step.toggleAttribute("data-active", lastReached === "all" || index <= lastReached);
  });
}

function activeStepAt(timeline: gsap.core.Timeline): number {
  const time = timeline.time();
  return Object.entries(timeline.labels).reduce((active, [name, at]) => {
    const match = STEP_LABEL.exec(name);
    return match && time >= at ? Math.max(active, Number(match[1])) : active;
  }, 0);
}

export function IntegrationFlow() {
  const { content, locale } = useLocale();
  const { integration } = content;
  const scope = useRef<HTMLElement>(null);
  const isWide = useMediaQuery("(min-width: 1024px)");

  useGSAP(
    () => {
      const root = scope.current;
      const diagram = root?.querySelector<HTMLElement>("[data-diagram]");
      if (!root || !diagram) return undefined;
      const stepCount = integration.steps.length;
      const mm = gsap.matchMedia();

      // Desktop: the diagram draws while it crosses the viewport and the steps beside it fill in.
      mm.add(MOTION_QUERIES.desktop, () => {
        const timeline = buildFlowTimeline(root, stepCount, {
          scrollTrigger: { trigger: diagram, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
        });
        timeline.eventCallback("onUpdate", () => setReachedSteps(root, activeStepAt(timeline)));
        setReachedSteps(root, 0);
      });

      // Small screens: the steps sit above the diagram, so they stay fully visible.
      mm.add(MOTION_QUERIES.mobile, () => {
        buildFlowTimeline(root, stepCount, {
          scrollTrigger: { trigger: diagram, start: "top 85%", end: "bottom 60%", scrub: 0.6 },
        });
        setReachedSteps(root, "all");
      });

      mm.add(MOTION_QUERIES.reduced, () => setReachedSteps(root, "all"));

      return () => mm.revert();
    },
    { scope, dependencies: [isWide, locale], revertOnUpdate: true },
  );

  return (
    <section ref={scope} id="integrations" aria-labelledby="integration-title" className="border-t border-line/60 py-section">
      <div className="frame grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <h2 id="integration-title" className="text-step-4 font-bold type-condensed">
            {integration.heading}
          </h2>
          <p className="mt-5 max-w-measure text-step-0 text-fog">{integration.intro}</p>

          <ol className="mt-8 border-l border-line">
            {integration.steps.map((step, index) => (
              <li
                key={step.title}
                data-step=""
                className="group -ml-px border-l-2 border-transparent py-3 pl-5 transition-colors duration-300 data-[active]:border-signal"
              >
                <h3 className="flex items-baseline gap-3 text-step-1 font-semibold text-fog transition-colors duration-300 group-data-[active]:text-fg">
                  <span className="font-display font-bold tabular-nums text-signal-ink type-condensed">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-1 max-w-[52ch] text-step--1 text-fog">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div data-diagram="" className="mx-auto w-full max-w-sm lg:col-span-5 lg:col-start-8 lg:max-w-[32rem]">
          <ArchitectureDiagram
            architecture={integration.architecture}
            title={integration.diagramTitle}
            orientation="vertical"
            layoutOptions={isWide ? WIDE_LAYOUT : undefined}
          />
        </div>
      </div>
    </section>
  );
}
