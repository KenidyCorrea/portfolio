import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { isModifiedClick, usePageTransition } from "@/providers/PageTransitionProvider";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

export type SectionId = "top" | "about" | "work" | "stack" | "experience" | "contact";

/** Smooth-scrolls to a home section, or transitions to the home page first when elsewhere. */
export function useSectionNav() {
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const { navigateTo } = usePageTransition();

  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      if (pathname !== "/") {
        navigateTo(`/#${id}`);
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      scrollTo(target);
      // Move focus for keyboard and screen reader users without jumping the page.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [pathname, scrollTo, navigateTo],
  );
}
