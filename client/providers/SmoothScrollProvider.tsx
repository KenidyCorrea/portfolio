import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Distance kept between the fixed header and a scroll target */
export const SCROLL_OFFSET = 0;

interface ScrollToOptions {
  immediate?: boolean;
}

interface SmoothScrollContextValue {
  scrollTo: (target: Element | number, options?: ScrollToOptions) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const isReduced = usePrefersReducedMotion();
  const lenis = useLenis(!isReduced);

  const scrollTo = useCallback(
    (target: Element | number, { immediate = false }: ScrollToOptions = {}) => {
      if (lenis) {
        lenis.scrollTo(target as HTMLElement | number, { offset: SCROLL_OFFSET, immediate, force: true });
        return;
      }
      const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
      window.scrollTo({ top, behavior: immediate || isReduced ? "auto" : "smooth" });
    },
    [lenis, isReduced],
  );

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  if (!context) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return context;
}
