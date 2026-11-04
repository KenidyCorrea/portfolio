import { useRef } from "react";
import { ArchitectureDiagram } from "@/components/diagram/ArchitectureDiagram";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, MOTION_QUERIES, REFRESH_PRIORITY, useGSAP } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";

const PIN_DISTANCE = "+=260%";
const STEP_LABEL = /^step-(\d+)$/;

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

function setActiveStep(root: HTMLElement, activeIndex: number | "all") {
  root.querySelectorAll<HTMLElement>("[data-step]").forEach((step, index) => {
    step.toggleAttribute("data-active", activeIndex === "all" || index === activeIndex);
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
      if (!root) return undefined;
      const stepCount = integration.steps.length;
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scrub the drawing with the scroll.
      mm.add(MOTION_QUERIES.desktop, () => {
        const timeline = buildFlowTimeline(root, stepCount, {
          scrollTrigger: {
            trigger: root,
            pin: root.querySelector<HTMLElement>("[data-pin]"),
            start: "top top",
            end: PIN_DISTANCE,
            scrub: 0.8,
            refreshPriority: REFRESH_PRIORITY.integration,
          },
        });
        timeline.eventCallback("onUpdate", () => setActiveStep(root, activeStepAt(timeline)));
        setActiveStep(root, 0);
      });

      // Small screens: no pin; the diagram draws while it crosses the viewport.
      mm.add(MOTION_QUERIES.mobile, () => {
        buildFlowTimeline(root, stepCount, {
          scrollTrigger: { trigger: root.querySelector("svg"), start: "top 85%", end: "bottom 60%", scrub: 0.8 },
        });
        setActiveStep(root, "all");
      });

      mm.add(MOTION_QUERIES.reduced, () => setActiveStep(root, "all"));

      return () => mm.revert();
    },
    { scope, dependencies: [isWide, locale], revertOnUpdate: true },
  );

  return (
    <section ref={scope} id="integrations" aria-labelledby="integration-title" className="relative border-t border-line/60">
      <div data-pin="" className="flex flex-col justify-center py-section pin:h-[100svh] pin:py-0 pin:pt-16">
        <div className="frame">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="integration-title" className="text-step-4 font-bold type-condensed lg:col-span-6">
              {integration.heading}
            </h2>
            <p className="max-w-measure text-step-0 text-fog lg:col-span-5 lg:col-start-8">{integration.intro}</p>
          </div>

          {/* Desktop: diagram on top, one step per diagram column below it. */}
          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:max-w-[64rem] lg:gap-8">
            <ol className="grid gap-6 sm:grid-cols-2 lg:order-2 lg:grid-cols-4 lg:gap-8">
              {integration.steps.map((step, index) => (
                <li
                  key={step.title}
                  data-step=""
                  className="border-t-2 border-line pt-4 opacity-50 transition-[opacity,border-color] duration-300 data-[active]:border-signal data-[active]:opacity-100"
                >
                  <h3 className="flex items-baseline gap-3 text-step-1 font-semibold">
                    <span className="font-display font-bold tabular-nums text-signal-ink type-condensed">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-step--1 text-fog">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mx-auto w-full max-w-sm lg:order-1 lg:max-w-none">
              <ArchitectureDiagram
                architecture={integration.architecture}
                title={integration.diagramTitle}
                orientation={isWide ? "horizontal" : "vertical"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
