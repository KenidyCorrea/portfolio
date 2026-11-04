import { useRef } from "react";
import { MARQUEE_TECH } from "@/content/shared";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";

const BASE_SPEED = 60; // px per second
const MAX_BOOST = 14; // multiplier cap driven by scroll velocity
const VELOCITY_DIVISOR = 220;

/** Infinite tech band. Speed and direction follow the page scroll. */
export function TechMarquee() {
  const { content } = useLocale();
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        const track = scope.current?.querySelector<HTMLElement>("[data-track]");
        if (!track) return undefined;

        const setX = gsap.quickSetter(track, "x", "px");
        const state = { x: 0, direction: 1, boost: 1 };
        // One loop period = distance between the first item and its duplicate.
        const measurePeriod = () => {
          const first = track.children[0] as HTMLElement | undefined;
          const duplicate = track.children[MARQUEE_TECH.length] as HTMLElement | undefined;
          return first && duplicate ? duplicate.offsetLeft - first.offsetLeft : track.scrollWidth / 2;
        };
        let wrapX = gsap.utils.wrap(-measurePeriod(), 0);

        const onResize = () => {
          wrapX = gsap.utils.wrap(-measurePeriod(), 0);
        };
        const tick = (_time: number, deltaMs: number) => {
          state.x = wrapX(state.x - (BASE_SPEED * state.boost * state.direction * deltaMs) / 1000);
          setX(state.x);
        };

        const trigger = ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
          onUpdate: (self) => {
            state.direction = self.direction;
            const boost = 1 + Math.min(MAX_BOOST, Math.abs(self.getVelocity()) / VELOCITY_DIVISOR);
            gsap.killTweensOf(state, "boost");
            gsap.set(state, { boost });
            gsap.to(state, { boost: 1, duration: 1.2, ease: "power2.out", delay: 0.1 });
          },
        });
        if (trigger.isActive) gsap.ticker.add(tick);

        // Refresh fires on resize and after web fonts load (main.tsx), when widths change.
        ScrollTrigger.addEventListener("refresh", onResize);
        return () => {
          ScrollTrigger.removeEventListener("refresh", onResize);
          gsap.ticker.remove(tick);
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  const items = [...MARQUEE_TECH, ...MARQUEE_TECH];

  return (
    <section ref={scope} aria-label={content.marquee.label} className="overflow-hidden border-y border-line/60 py-6">
      <ul className="sr-only">
        {MARQUEE_TECH.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <div
        data-track=""
        aria-hidden="true"
        className="flex w-max items-center gap-10 whitespace-nowrap font-display text-step-3 font-bold type-condensed motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-2 motion-reduce:px-gutter motion-reduce:text-step-2"
      >
        {items.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className={cn("flex items-center gap-10", index >= MARQUEE_TECH.length && "motion-reduce:hidden")}
          >
            {tech}
            <span className="h-2 w-2 rotate-45 bg-signal" />
          </span>
        ))}
      </div>
    </section>
  );
}
