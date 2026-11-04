import { SiteLayout } from "@/components/layout/SiteLayout";
import { buttonClasses } from "@/components/ui/button-styles";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { usePageEnter } from "@/hooks/usePageEnter";
import { useLocale } from "@/providers/LocaleProvider";

export default function NotFound() {
  const { content } = useLocale();
  usePageEnter(`404 — ${content.notFound.title}`);

  return (
    <SiteLayout>
      <section aria-labelledby="not-found-title" className="frame flex min-h-[80svh] flex-col justify-center pt-28">
        <p aria-hidden="true" className="font-display text-step-5 font-extrabold text-signal-ink type-condensed">
          404
        </p>
        <h1 id="not-found-title" className="mt-6 text-step-3 font-bold type-condensed">
          {content.notFound.title}
        </h1>
        <p className="mt-4 max-w-measure text-step-1 text-fog">{content.notFound.body}</p>
        <TransitionLink to="/" className={buttonClasses("primary", "mt-10 self-start")}>
          {content.notFound.cta}
        </TransitionLink>
      </section>
    </SiteLayout>
  );
}
