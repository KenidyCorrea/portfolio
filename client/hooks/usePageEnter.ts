import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { MAIN_CONTENT_ID } from "@/components/layout/SiteLayout";
import { ScrollTrigger } from "@/lib/gsap";
import { recallScroll } from "@/lib/scroll-memory";
import { usePageTransition } from "@/providers/PageTransitionProvider";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

let isFirstPage = true;

/** A malformed hash (e.g. "#%E0%A4%A") must not crash the page. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Runs once per navigation: sets the document title, restores the scroll
 * position (saved position on back/forward, #hash, or top) after ScrollTriggers
 * exist, uncovers the page and moves focus to the new content.
 */
export function usePageEnter(title: string): void {
  const { revealPage } = usePageTransition();
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const id = safeDecode(location.hash.slice(1));
    const saved = navigationType === "POP" ? recallScroll(location.key) : undefined;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = id ? document.getElementById(id) : null;
      scrollTo(saved ?? target ?? 0, { immediate: true });
      revealPage();
      if (!isFirstPage && !target) {
        // Focus the new page so screen readers announce it and Tab starts from the top.
        document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
      }
      isFirstPage = false;
    });
    return () => cancelAnimationFrame(frame);
    // Only on navigation; scrollTo/revealPage identities may change with Lenis lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
}
