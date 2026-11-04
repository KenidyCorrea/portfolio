import type { ReactNode } from "react";
import { useLocale } from "@/providers/LocaleProvider";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export const MAIN_CONTENT_ID = "main-content";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { content } = useLocale();
  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-md bg-signal px-4 py-2 font-medium text-on-signal"
      >
        {content.controls.skipToContent}
      </a>
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
