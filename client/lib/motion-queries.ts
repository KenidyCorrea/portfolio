/**
 * Media queries shared by every gsap.matchMedia() call.
 * Kept free of GSAP imports so it can be unit-tested against tailwind.config.ts.
 */
export const MOTION_QUERIES = {
  /** Large screens with motion allowed: pinning, horizontal scroll. Mirrors the Tailwind "pin:" screen. */
  desktop: "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
  /** Small or short screens with motion allowed: lighter, unpinned versions */
  mobile:
    "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px), (prefers-reduced-motion: no-preference) and (max-height: 639.98px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;
