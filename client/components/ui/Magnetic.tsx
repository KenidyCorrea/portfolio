import { useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows */
  strength?: number;
  className?: string;
}

/** Pulls its content toward the pointer (fine pointers with motion allowed only). */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.finePointer, () => {
        const element = ref.current;
        if (!element) return undefined;
        const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "power3.out" });
        let rect = element.getBoundingClientRect();

        const onEnter = () => {
          rect = element.getBoundingClientRect();
        };
        const onMove = (event: PointerEvent) => {
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);
        return () => {
          element.removeEventListener("pointerenter", onEnter);
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
}
