import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "@/content";
import type { DomainId } from "@/content/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Flip, gsap, MOTION_QUERIES, REFRESH_PRIORITY, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

type Filter = DomainId | "all";

const HORIZONTAL_ID = "projects-horizontal";
const CARD_SELECTOR = "[data-project-card]";

function prefersMotion(): boolean {
  return window.matchMedia(MOTION_QUERIES.motion).matches;
}

export function Projects() {
  const { content } = useLocale();
  const { projects, domains, caseStudy } = content;
  const { scrollTo } = useSmoothScroll();
  const scope = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const scrollToRef = useRef(scrollTo);

  useEffect(() => {
    scrollToRef.current = scrollTo;
  }, [scrollTo]);

  const counts = useMemo(() => {
    const byDomain = new Map<DomainId, number>();
    projects.items.forEach((project) => project.domains.forEach((id) => byDomain.set(id, (byDomain.get(id) ?? 0) + 1)));
    return byDomain;
  }, [projects.items]);

  const isVisible = (domains: readonly DomainId[]) => filter === "all" || domains.includes(filter);
  const visibleCount = projects.items.filter((project) => isVisible(project.domains)).length;

  // Horizontal scroll (desktop) + cursor-following image preview (fine pointers).
  const { contextSafe } = useGSAP(
    () => {
      const root = scope.current;
      if (!root) return undefined;
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES.desktop, () => {
        const track = root.querySelector<HTMLElement>("[data-track]");
        const viewport = root.querySelector<HTMLElement>("[data-viewport]");
        if (!track || !viewport) return;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: HORIZONTAL_ID,
            trigger: root,
            pin: root.querySelector<HTMLElement>("[data-pin]"),
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            refreshPriority: REFRESH_PRIORITY.projects,
          },
        });

        // Keyboard: Tab to an off-screen card scrolls the page to the matching
        // point of the horizontal track instead of letting the browser scroll the clipped viewport.
        const onFocusIn = (event: FocusEvent) => {
          const card = (event.target as Element).closest<HTMLElement>(CARD_SELECTOR);
          const trigger = tween.scrollTrigger;
          const max = distance();
          viewport.scrollLeft = 0;
          requestAnimationFrame(() => {
            viewport.scrollLeft = 0;
          });
          if (!card || !trigger || max <= 0) return;
          const gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
          const progress = gsap.utils.clamp(0, 1, (card.offsetLeft - gutter) / max);
          scrollToRef.current(trigger.start + progress * (trigger.end - trigger.start), { immediate: true });
        };
        viewport.addEventListener("focusin", onFocusIn);
        return () => viewport.removeEventListener("focusin", onFocusIn);
      });

      mm.add(`${MOTION_QUERIES.desktop} and ${MOTION_QUERIES.finePointer}`, () => {
        const preview = previewRef.current;
        const image = preview?.querySelector("img");
        const track = root.querySelector<HTMLElement>("[data-track]");
        if (!preview || !image || !track) return undefined;
        const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3.out" });
        let current: string | null = null;

        const onMove = (event: PointerEvent) => {
          xTo(event.clientX + 24);
          yTo(event.clientY - preview.offsetHeight / 2);
          const card = (event.target as Element).closest<HTMLElement>(CARD_SELECTOR);
          const src = card?.dataset.preview ?? null;
          if (src === current) return;
          current = src;
          if (src) {
            image.src = src;
            gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.35, overwrite: "auto" });
          } else {
            gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.25, overwrite: "auto" });
          }
        };
        const onLeave = () => {
          current = null;
          gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.25, overwrite: "auto" });
        };
        gsap.set(preview, { autoAlpha: 0, scale: 0.92 });
        track.addEventListener("pointermove", onMove);
        track.addEventListener("pointerleave", onLeave);
        return () => {
          track.removeEventListener("pointermove", onMove);
          track.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope },
  );

  // Flip: animate cards from their previous layout after the filter changes.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
        onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45 }),
        onLeave: (elements) => gsap.to(elements, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope, dependencies: [filter] },
  );

  const handleFilter = contextSafe((next: Filter) => {
    if (next === filter) return;
    // Mid-track: jump back to the start first so Flip measures cards at their resting position.
    const horizontal = ScrollTrigger.getById(HORIZONTAL_ID);
    if (horizontal && horizontal.progress > 0) {
      scrollTo(horizontal.start, { immediate: true });
      ScrollTrigger.update();
      horizontal.getTween()?.progress(1);
      horizontal.animation?.progress(0);
    }
    if (prefersMotion()) flipState.current = Flip.getState(scope.current?.querySelectorAll(CARD_SELECTOR) ?? []);
    setFilter(next);
  });

  const filters: readonly { id: Filter; label: string; count: number }[] = [
    { id: "all", label: projects.filterAll, count: projects.items.length },
    ...domains
      .map((domain) => ({ id: domain.id as Filter, label: domain.label, count: counts.get(domain.id) ?? 0 }))
      .filter((item) => item.count > 0),
  ];

  return (
    <section ref={scope} id="work" aria-labelledby="work-title" className="relative border-t border-line/60 outline-none">
      <div data-pin="" className="py-section pin:flex pin:h-[100svh] pin:flex-col pin:py-0 pin:pt-24">
        <div className="frame flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="work-title" className="text-step-4 font-bold type-condensed">
              {projects.heading}
            </h2>
            <p className="mt-4 max-w-measure text-step-0 text-fog">{projects.intro}</p>
          </div>
          <div role="group" aria-label={projects.filterLabel} className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const isActive = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilter(item.id)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-step--1 transition-colors duration-200",
                    isActive ? "border-fg bg-fg text-bg" : "border-line text-fog hover:border-fg hover:text-fg",
                  )}
                >
                  {item.label}
                  <span className={cn("ml-2 tabular-nums", isActive ? "text-bg/70" : "text-fog/80")}>{item.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {format(projects.resultsAnnouncement, { count: visibleCount })}
        </p>

        <div data-viewport="" className="mt-12 pin:flex pin:flex-1 pin:items-center pin:overflow-hidden">
          <ul
            data-track=""
            className="frame relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pin:flex pin:w-max pin:max-w-none pin:items-start pin:gap-8 pin:pr-[12vw]"
          >
            {projects.items.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                domains={domains}
                isVisible={isVisible(project.domains)}
                ctaLabel={projects.openCaseStudy}
                draftLabel={projects.draftBadge}
                imageAlt={caseStudy.imageAlt}
              />
            ))}
          </ul>
        </div>
      </div>

      {createPortal(
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden w-[22rem] overflow-hidden border border-line bg-surface shadow-2xl lg:block"
        >
          <img alt="" width={800} height={450} className="aspect-video w-full object-cover object-top" />
        </div>,
        document.body,
      )}
    </section>
  );
}
