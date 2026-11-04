import { useRef } from "react";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";

export function Experience() {
  const { content, locale } = useLocale();
  const { experience } = content;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        // Vertical line fills with the scroll.
        gsap.fromTo(
          "[data-line-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: 0.5 },
          },
        );

        // Items enter in batches as they reach the viewport.
        const items = gsap.utils.toArray<HTMLElement>("[data-timeline-item]");
        gsap.set(items, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(items, {
          start: "top 85%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }),
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section ref={scope} id="experience" aria-labelledby="experience-title" className="border-t border-line/60 py-section outline-none">
      <div className="frame grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="experience-title" className="text-step-4 font-bold type-condensed lg:sticky lg:top-28">
            {experience.heading}
          </h2>
        </div>

        <div data-timeline="" className="relative lg:col-span-8">
          <div aria-hidden="true" className="absolute bottom-0 left-[5px] top-2 w-px bg-line">
            <div data-line-fill="" className="h-full w-full origin-top bg-signal" />
          </div>
          <ol className="space-y-14">
            {experience.items.map((item) => (
              <li key={item.id} data-timeline-item="" className="relative grid gap-2 pl-10">
                <span aria-hidden="true" className="absolute left-0 top-2 h-[11px] w-[11px] rotate-45 border border-signal bg-bg" />
                <p className="text-step--1 text-fog">
                  {experience.kinds[item.kind]}
                  {item.period && (
                    <>
                      <span aria-hidden="true" className="mx-2 inline-block h-px w-4 translate-y-[-0.25em] bg-line" />
                      <span className="tabular-nums">{item.period}</span>
                    </>
                  )}
                </p>
                <h3 className="text-step-2 font-bold type-condensed">{item.role}</h3>
                <p className="text-step-0 text-signal-ink">{item.organization}</p>
                <p className="max-w-measure text-step-0 text-fog">{item.summary}</p>
                {item.highlights.length > 0 && (
                  <ul className="mt-2 grid gap-1.5 text-step--1 sm:grid-cols-2">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 bg-signal" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
