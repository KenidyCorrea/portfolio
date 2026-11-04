import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const DEFAULT_LAG_THRESHOLD = 500;
const DEFAULT_LAG_ADJUSTED = 33;

/**
 * Smooth scrolling driven by GSAP's ticker, so Lenis and ScrollTrigger
 * read the same frame. Disabled (returns null) when `enabled` is false,
 * e.g. for prefers-reduced-motion; native scrolling is used instead.
 */
export function useLenis(enabled: boolean): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const instance = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: true });
    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(DEFAULT_LAG_THRESHOLD, DEFAULT_LAG_ADJUSTED);
      instance.off("scroll", onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return lenis;
}
