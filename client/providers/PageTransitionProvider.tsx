import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EASE, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { rememberScroll } from "@/lib/scroll-memory";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface PageTransitionContextValue {
  /** Covers the screen, then navigates. Falls back to plain navigation for reduced motion. */
  navigateTo: (to: string) => void;
  /** Called by each page (and the error fallback) once mounted: uncovers the screen. */
  revealPage: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const COVER_DURATION = 0.55;
const REVEAL_DURATION = 0.65;

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isCoveredRef = useRef(false);
  const coverRef = useRef<{ timeline: gsap.core.Timeline; hasNavigated: boolean } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const locationKeyRef = useRef(location.key);
  const isReduced = usePrefersReducedMotion();
  const { contextSafe } = useGSAP({ scope: overlayRef });

  // Save the scroll position of the entry being left (back/forward restores it).
  useEffect(() => {
    const onPopState = () => rememberScroll(locationKeyRef.current);
    window.addEventListener("popstate", onPopState, { capture: true });
    return () => window.removeEventListener("popstate", onPopState, { capture: true });
  }, []);

  // A Back/Forward during the cover cancels the pending navigation.
  useEffect(() => {
    locationKeyRef.current = location.key;
    const cover = coverRef.current;
    if (cover && !cover.hasNavigated) {
      cover.timeline.kill();
      coverRef.current = null;
      isCoveredRef.current = false;
      if (overlayRef.current) gsap.set(overlayRef.current, { autoAlpha: 0 });
    }
  }, [location.key]);

  const navigateTo = useMemo(
    () =>
      contextSafe((to: string) => {
        rememberScroll(locationKeyRef.current);
        const overlay = overlayRef.current;
        if (isReduced || !overlay) {
          navigate(to);
          return;
        }
        if (isCoveredRef.current) return;
        isCoveredRef.current = true;
        const cover = { timeline: gsap.timeline(), hasNavigated: false };
        coverRef.current = cover;
        cover.timeline
          .set(overlay, { autoAlpha: 1, yPercent: 100 })
          .to(overlay, { yPercent: 0, duration: COVER_DURATION, ease: EASE.inOut })
          .add(() => {
            cover.hasNavigated = true;
            navigate(to);
          });
      }),
    [contextSafe, isReduced, navigate],
  );

  const revealPage = useMemo(
    () =>
      contextSafe(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        coverRef.current = null;
        const overlay = overlayRef.current;
        if (!overlay || !isCoveredRef.current) return;
        gsap.to(overlay, {
          yPercent: -100,
          duration: REVEAL_DURATION,
          ease: EASE.inOut,
          delay: 0.05,
          onComplete: () => {
            isCoveredRef.current = false;
            gsap.set(overlay, { autoAlpha: 0 });
          },
        });
      }),
    [contextSafe],
  );

  const value = useMemo(() => ({ navigateTo, revealPage }), [navigateTo, revealPage]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[60] bg-signal"
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition(): PageTransitionContextValue {
  const context = useContext(PageTransitionContext);
  if (!context) throw new Error("usePageTransition must be used inside <PageTransitionProvider>");
  return context;
}

/** True when the click should be left to the browser (new tab, download, etc.) */
export function isModifiedClick(event: React.MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function useTransitionNavigate() {
  const { navigateTo } = usePageTransition();
  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, to: string) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      navigateTo(to);
    },
    [navigateTo],
  );
}
