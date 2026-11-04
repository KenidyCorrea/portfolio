/**
 * Single GSAP entry point: every plugin is registered once, here.
 * Import gsap and plugins from this module, never from "gsap" directly.
 */
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, Flip);
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export const EASE = {
  out: "expo.out",
  inOut: "power4.inOut",
} as const;

/** Refresh order for pinned sections (higher refreshes first, matches page order). */
export const REFRESH_PRIORITY = {
  integration: 2,
  projects: 1,
} as const;

export { MOTION_QUERIES } from "./motion-queries";
export { DrawSVGPlugin, Flip, gsap, ScrollTrigger, SplitText, useGSAP };
