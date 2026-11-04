import { ArrowUpRight } from "lucide-react";
import type { Domain, Project } from "@/content/types";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { preloadCaseStudy, projectPath } from "@/routes";
import { cn } from "@/lib/utils";

const STACK_PREVIEW = 4;

interface ProjectCardProps {
  project: Project;
  domains: readonly Domain[];
  isVisible: boolean;
  ctaLabel: string;
  draftLabel: string;
  imageAlt: string;
}

export function projectImageSrc(base: string, width: 800 | 1600): string {
  return `/images/${base}-${width}.webp`;
}

export function ProjectCard({ project, domains, isVisible, ctaLabel, draftLabel, imageAlt }: ProjectCardProps) {
  const domainLabels = project.domains.map((id) => domains.find((domain) => domain.id === id)?.label ?? id);
  const titleId = `project-${project.slug}-title`;

  return (
    <li
      data-project-card=""
      data-preview={project.image ? projectImageSrc(project.image.base, 800) : undefined}
      hidden={!isVisible}
      className="shrink-0 pin:w-[clamp(20rem,30vw,28rem)] pin:even:mt-[6vh]"
    >
      <article
        aria-labelledby={titleId}
        className="group relative flex h-full flex-col border border-line bg-bg p-6 transition-colors duration-300 hover:border-signal focus-within:border-signal sm:p-8 pin:min-h-[min(50vh,28rem)]"
      >
        {project.image && (
          <img
            src={projectImageSrc(project.image.base, 800)}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            decoding="async"
            alt={imageAlt.replace("{title}", project.title)}
            className="mb-6 aspect-video w-full border border-line/60 bg-surface object-cover object-top pin:hidden"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-step--1 text-fog">
            {domainLabels.map((label) => (
              <li key={label} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 bg-signal" />
                {label}
              </li>
            ))}
            {project.isDraft && <li className="text-signal-ink">{draftLabel}</li>}
          </ul>
          <ArrowUpRight
            aria-hidden="true"
            className="h-6 w-6 shrink-0 text-fog transition-transform duration-300 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal-ink"
          />
        </div>

        <h3 id={titleId} className="mt-8 text-step-3 font-bold type-condensed pin:mt-auto">
          {project.title}
        </h3>
        <p className="mt-4 text-step-0 text-fog">{project.tagline}</p>

        <ul className="mt-6 flex flex-wrap gap-2 text-step--1">
          {project.stack.slice(0, STACK_PREVIEW).map((tech) => (
            <li key={tech} className="rounded-full border border-line px-3 py-1">
              {tech}
            </li>
          ))}
        </ul>

        <TransitionLink
          to={projectPath(project.slug)}
          onIntent={preloadCaseStudy}
          className={cn(
            "mt-8 inline-flex items-center gap-2 self-start font-medium text-signal-ink",
            "after:absolute after:inset-0 after:content-['']",
          )}
        >
          {ctaLabel}
          <span className="sr-only">: {project.title}</span>
        </TransitionLink>
      </article>
    </li>
  );
}
