import { useRef, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { format } from "@/content";
import type { Project, SiteContent } from "@/content/types";
import { ArchitectureDiagram } from "@/components/diagram/ArchitectureDiagram";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { projectImageSrc } from "@/components/projects/ProjectCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePageEnter } from "@/hooks/usePageEnter";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { PROFILE } from "@/content/shared";
import { useLocale } from "@/providers/LocaleProvider";
import { projectPath } from "@/routes";
import NotFound from "./NotFound";

/** React 18 only forwards the lowercase attribute; React 19 accepts fetchPriority. */
const HIGH_PRIORITY = { fetchpriority: "high" } as Record<string, string>;

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-line pt-8 lg:grid-cols-12 lg:gap-8">
      <h2 id={id} className="text-step-2 font-bold type-condensed lg:col-span-3">
        {title}
      </h2>
      <div className="lg:col-span-8 lg:col-start-5">{children}</div>
    </section>
  );
}

function CaseStudyView({ project, next, content }: { project: Project; next: Project; content: SiteContent }) {
  const { caseStudy, domains } = content;
  const scope = useRef<HTMLElement>(null);
  const isWide = useMediaQuery("(min-width: 768px)");
  usePageEnter(`${project.title} — ${PROFILE.name}`);

  // Intro plays once per project (the view is keyed by slug).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        gsap.from("[data-intro]", { y: 36, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.45 });
      });
      return () => mm.revert();
    },
    { scope },
  );

  // The diagram re-renders when its orientation changes, so DrawSVG must be rebuilt with it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-diagram]", start: "top 75%", once: true } })
          .from("[data-diagram] [data-node]", { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08 })
          .from("[data-diagram] [data-edge]", { drawSVG: 0, duration: 0.9, stagger: 0.12, ease: "power2.inOut" }, "-=0.3");
      });
      return () => mm.revert();
    },
    { scope, dependencies: [isWide], revertOnUpdate: true },
  );

  const domainLabels = project.domains.map((id) => domains.find((domain) => domain.id === id)?.label ?? id);

  return (
    <article ref={scope} aria-labelledby="case-title">
      <header className="frame pt-28 sm:pt-32">
        <TransitionLink to="/#work" className="inline-flex min-h-11 items-center gap-2 text-fog transition-colors hover:text-fg">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {caseStudy.back}
        </TransitionLink>

        <p data-intro="" className="mt-10 text-step--1 text-fog">
          <span className="sr-only">{caseStudy.domains}: </span>
          {domainLabels.join(" / ")}
        </p>
        <h1
          id="case-title"
          data-intro=""
          className="mt-4 max-w-[16ch] text-[clamp(3rem,1.2rem+7vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.02em] type-condensed"
        >
          {project.title}
        </h1>
        <p data-intro="" className="mt-8 max-w-[44ch] text-step-2 text-fog">
          {project.tagline}
        </p>
      </header>

      {project.image && (
        <figure className="frame mt-12">
          <img
            src={projectImageSrc(project.image.base, 1600)}
            srcSet={`${projectImageSrc(project.image.base, 800)} 800w, ${projectImageSrc(project.image.base, 1600)} 1600w`}
            sizes="(min-width: 1536px) 1440px, 94vw"
            width={project.image.width}
            height={project.image.height}
            {...HIGH_PRIORITY}
            decoding="async"
            alt={format(caseStudy.imageAlt, { title: project.title })}
            className="h-auto w-full border border-line bg-surface"
          />
        </figure>
      )}

      <div className="frame mt-section space-y-12 pb-section">
        <Block id="case-problem" title={caseStudy.problem}>
          <p className="max-w-measure text-step-2">{project.problem}</p>
        </Block>

        <Block id="case-solution" title={caseStudy.solution}>
          <ul className="max-w-measure space-y-4 text-step-1 text-fog">
            {project.solution.map((point) => (
              <li key={point} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-signal" />
                <span className="text-fg">{point}</span>
              </li>
            ))}
          </ul>
        </Block>

        <section aria-labelledby="case-architecture" className="border-t border-line pt-8">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
            <h2 id="case-architecture" className="text-step-2 font-bold type-condensed lg:col-span-3">
              {caseStudy.architecture}
            </h2>
            <p className="text-step-0 text-fog lg:col-span-8 lg:col-start-5">{caseStudy.architectureHint}</p>
          </div>
          <div data-diagram="" className="mx-auto mt-10 max-w-sm md:max-w-5xl">
            <ArchitectureDiagram
              architecture={project.architecture}
              title={`${caseStudy.architecture}: ${project.title}`}
              orientation={isWide ? "horizontal" : "vertical"}
            />
          </div>
        </section>

        <Block id="case-stack" title={caseStudy.stack}>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full border border-line px-4 py-2 text-step-0">
                {tech}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="case-impact" title={caseStudy.impact}>
          {project.impact.length > 0 ? (
            <ul className="max-w-measure space-y-3 text-step-1">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-step-0 text-fog">{caseStudy.impactPending}</p>
          )}
        </Block>

        {project.links.length > 0 && (
          <Block id="case-links" title={caseStudy.links}>
            <ul className="space-y-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-step-1 text-signal-ink"
                  >
                    <span className="link-underline">{caseStudy.linkLabels[link.kind]}</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>

      <nav aria-label={caseStudy.next} className="border-t border-line">
        <TransitionLink to={projectPath(next.slug)} className="group frame flex items-end justify-between gap-6 py-section">
          <span>
            <span className="block text-step--1 text-fog">{caseStudy.next}</span>
            <span className="mt-3 block text-step-5 font-extrabold leading-[0.9] type-condensed transition-colors duration-300 group-hover:text-signal-ink">
              {next.title}
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-12 w-12 shrink-0 text-fog transition-transform duration-300 ease-out-expo group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-signal-ink"
          />
        </TransitionLink>
      </nav>
    </article>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const { content } = useLocale();
  const items = content.projects.items;
  const index = items.findIndex((project) => project.slug === slug);

  if (index === -1) return <NotFound />;

  return (
    <SiteLayout>
      <CaseStudyView key={items[index].slug} project={items[index]} next={items[(index + 1) % items.length]} content={content} />
    </SiteLayout>
  );
}
