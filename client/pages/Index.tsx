import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { usePageEnter } from "@/hooks/usePageEnter";
import { ScrollTrigger } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { IntegrationFlow } from "@/sections/IntegrationFlow";
import { Projects } from "@/sections/Projects";
import { Stack } from "@/sections/Stack";
import { TechMarquee } from "@/sections/TechMarquee";

export default function Index() {
  const { content, locale } = useLocale();
  usePageEnter(content.meta.title);

  // Text length changes with the language, so pinned distances must be recomputed.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  return (
    <SiteLayout>
      <Hero />
      <TechMarquee />
      <About />
      <IntegrationFlow />
      <Projects />
      <Stack />
      <Experience />
      <Contact />
    </SiteLayout>
  );
}
