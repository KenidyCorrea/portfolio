import { lazy } from "react";

/** Case study route is code-split; links call preloadCaseStudy() on hover/focus. */
export const loadCaseStudy = () => import("@/pages/CaseStudy");
export const CaseStudyPage = lazy(loadCaseStudy);

let preloadPromise: Promise<unknown> | null = null;

export function preloadCaseStudy(): void {
  // A failed preload is not an error: the lazy route retries and reports through Suspense.
  preloadPromise ??= loadCaseStudy().catch(() => {
    preloadPromise = null;
  });
}

export const projectPath = (slug: string) => `/projects/${slug}`;
