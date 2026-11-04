import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { PROFILE } from "@/content/shared";
import { useSectionNav, type SectionId } from "@/hooks/useSectionNav";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import { Monogram } from "./Monogram";
import { LocaleToggle, ThemeToggle } from "./PreferenceControls";

const NAV_SECTIONS: readonly Exclude<SectionId, "top">[] = ["about", "work", "stack", "experience", "contact"];
const NAV_KEYS = { about: "about", work: "work", stack: "stack", experience: "experience", contact: "contact" } as const;
const REVEAL_THRESHOLD = 80;

export function SiteHeader() {
  const { content } = useLocale();
  const goToSection = useSectionNav();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMenuOpenRef = useRef(isMenuOpen);
  const menuId = useId();

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  // Hide on scroll down, show on scroll up (and whenever the header holds focus).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        const header = headerRef.current;
        if (!header) return undefined;
        const showAnim = gsap.from(header, { yPercent: -100, paused: true, duration: 0.35, ease: "power2.out" }).progress(1);
        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const hasKeyboardFocus = header.querySelector(":focus-visible") !== null;
            const keepVisible =
              self.direction === -1 || self.scroll() < REVEAL_THRESHOLD || hasKeyboardFocus || isMenuOpenRef.current;
            if (keepVisible) showAnim.play();
            else showAnim.reverse();
          },
        });
        const onFocusIn = (event: FocusEvent) => {
          if (event.target instanceof Element && event.target.matches(":focus-visible")) showAnim.play();
        };
        header.addEventListener("focusin", onFocusIn);
        return () => {
          header.removeEventListener("focusin", onFocusIn);
          trigger.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: headerRef },
  );

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    setIsMenuOpen(false);
    goToSection(event, id);
  };

  const navLinks = (variant: "desktop" | "mobile") =>
    NAV_SECTIONS.map((id) => (
      <li key={id}>
        <a
          href={`/#${id}`}
          onClick={(event) => handleNav(event, id)}
          className={cn(
            "transition-colors duration-200 hover:text-fg",
            variant === "desktop"
              ? "link-underline py-2 text-step--1 text-fog"
              : "block py-3 font-display text-step-3 font-bold type-condensed text-fg",
          )}
        >
          {content.nav[NAV_KEYS[id]]}
        </a>
      </li>
    ));

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="frame flex h-16 items-center justify-between gap-6">
        <a href="/#top" onClick={(event) => handleNav(event, "top")} className="flex items-center gap-3 rounded-md">
          <Monogram />
          <span className="font-display text-step-0 font-bold type-expanded">{PROFILE.name}</span>
        </a>

        <nav aria-label={content.controls.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-7">{navLinks("desktop")}</ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? content.controls.closeMenu : content.controls.openMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label={content.controls.primaryNav}
        hidden={!isMenuOpen}
        className="border-t border-line/60 bg-bg lg:hidden"
      >
        <ul className="frame py-6">{navLinks("mobile")}</ul>
      </nav>
    </header>
  );
}
