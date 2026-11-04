import { useRef } from "react";
import { CV_FILES, PROFILE } from "@/content/shared";
import { LOCALES } from "@/content/types";
import { buttonClasses } from "@/components/ui/button-styles";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSectionNav } from "@/hooks/useSectionNav";
import { EASE, gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";

const ROLE_HOLD_SECONDS = 2.2;
const PARALLAX_PX = 18;
const LANGUAGE_NAMES = { pt: "Português", en: "English" } as const;

export function Hero() {
  const { content, locale } = useLocale();
  const { hero, domains } = content;
  const goToSection = useSectionNav();
  const scope = useRef<HTMLElement>(null);

  // One orchestrated load sequence + pointer parallax on the blueprint grid.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES.motion, () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-name-line]");
        const chars = lines.flatMap(
          (line) => SplitText.create(line, { type: "chars", charsClass: "split-chars", aria: "hidden" }).chars,
        );
        // Copy starts early on purpose: the tagline is the LCP element on small screens.
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .from(chars, { yPercent: 85, autoAlpha: 0, rotate: 4, duration: 1.3, stagger: 0.035 }, 0)
          .from("[data-hero-reveal]", { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.15)
          .from("[data-signal-path]", { drawSVG: 0, duration: 1.8, ease: "power2.inOut" }, 0.35);
      });

      mm.add(MOTION_QUERIES.finePointer, () => {
        const layer = scope.current?.querySelector<HTMLElement>("[data-parallax]");
        if (!layer) return undefined;
        const xTo = gsap.quickTo(layer, "x", { duration: 1.4, ease: "power3.out" });
        const yTo = gsap.quickTo(layer, "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * -PARALLAX_PX);
          yTo((event.clientY / window.innerHeight - 0.5) * -PARALLAX_PX);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope },
  );

  // Rotating role: rebuilt when the language changes. Paused while the hero is off-screen.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        const roles = gsap.utils.toArray<HTMLElement>("[data-role]");
        if (roles.length < 2) return;
        gsap.set(roles, { yPercent: 110 });
        gsap.set(roles[0], { yPercent: 0 });
        const loop = gsap.timeline({ repeat: -1, delay: 1.4 });
        roles.forEach((role, index) => {
          const next = roles[(index + 1) % roles.length];
          loop
            .to(role, { yPercent: -110, duration: 0.75, ease: "power3.inOut" }, `+=${ROLE_HOLD_SECONDS}`)
            // immediateRender: false, or the last step would hide roles[0] before the loop starts.
            .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.75, ease: "power3.inOut", immediateRender: false }, "<");
        });
        ScrollTrigger.create({
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      ref={scope}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 outline-none"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-parallax=""
          className="bg-grid absolute -inset-10 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_35%,black_20%,transparent_75%)]"
        />
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="frame">
        <h1
          id="hero-title"
          aria-label={PROFILE.name}
          className="font-display text-step-5 font-extrabold type-expanded tracking-[-0.035em]"
        >
          <span data-name-line="" className="block">
            {PROFILE.firstName}
          </span>
          <span data-name-line="" className="block pl-[11vw]">
            {PROFILE.lastName}
          </span>
        </h1>

        <div className="mt-6 pl-[11vw] sm:mt-8">
          <p className="sr-only">{hero.rolesSummary}</p>
          <div
            aria-hidden="true"
            className="relative h-[1.2em] overflow-hidden font-display text-step-3 font-semibold text-signal-ink type-condensed motion-reduce:h-auto"
          >
            {hero.roles.map((role, index) => (
              <span
                key={role}
                data-role=""
                className="absolute left-0 top-0 whitespace-nowrap motion-reduce:static motion-reduce:inline"
              >
                {role}
                {index < hero.roles.length - 1 && <span className="hidden text-fog motion-reduce:inline"> / </span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="mt-10 h-16 w-full sm:h-24"
      >
        <path
          data-signal-path=""
          d="M0 92 H690 L722 26 L758 112 L790 58 H1440"
          fill="none"
          strokeWidth={2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-signal"
        />
      </svg>

      <div className="frame mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-hero-reveal="" className="max-w-measure text-step-1 text-fg sm:text-step-2">
            {hero.tagline}
          </p>
          <div data-hero-reveal="" className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="/#work" onClick={(event) => goToSection(event, "work")} className={buttonClasses("primary")}>
                {hero.ctaProjects}
              </a>
            </Magnetic>
            <Magnetic>
              <a href="/#contact" onClick={(event) => goToSection(event, "contact")} className={buttonClasses("outline")}>
                {hero.ctaContact}
              </a>
            </Magnetic>
            <div role="group" aria-labelledby="cv-label" className="flex items-center gap-1 pl-2">
              <span id="cv-label" className="pr-1 text-fog">
                {hero.ctaCv}
              </span>
              {LOCALES.map((option) => (
                <a
                  key={option}
                  href={CV_FILES[option]}
                  download
                  hrefLang={option === "pt" ? "pt-BR" : "en"}
                  className={buttonClasses(option === locale ? "outline" : "ghost", "min-h-11 px-3 text-step--1")}
                >
                  <span className="sr-only">{hero.ctaCv} </span>
                  <abbr title={LANGUAGE_NAMES[option]} className="uppercase no-underline">
                    {option}
                  </abbr>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div data-hero-reveal="" className="lg:col-span-4 lg:col-start-9">
          <p id="domains-label" className="text-step--1 text-fog">
            {hero.domainsLabel}
          </p>
          <ul aria-labelledby="domains-label" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col">
            {domains.map((domain) => (
              <li key={domain.id} className="flex items-center gap-3 text-step-0">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
                {domain.longLabel}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
