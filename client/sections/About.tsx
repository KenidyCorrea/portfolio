import { useRef } from "react";
import { Languages, MapPin, Plane } from "lucide-react";
import { PORTRAIT } from "@/content/shared";
import type { Metric } from "@/content/types";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { useLocale } from "@/providers/LocaleProvider";

const COUNTER_DURATION = 1.8;

function MetricValue({ metric, formatter }: { metric: Metric; formatter: Intl.NumberFormat }) {
  if (metric.value === null) {
    // Development only: production builds filter out unfilled metrics.
    return <span title="TODO: fill METRIC_VALUES in client/content/shared.ts">—</span>;
  }
  const formatted = formatter.format(metric.value);
  return (
    <>
      <span className="sr-only">{`${formatted}${metric.suffix}`}</span>
      <span aria-hidden="true">
        <span data-counter="" data-value={metric.value}>
          {formatted}
        </span>
        <span className="text-signal-ink">{metric.suffix}</span>
      </span>
    </>
  );
}

export function About() {
  const { content, locale } = useLocale();
  const { about, metrics } = content;
  const scope = useRef<HTMLElement>(null);
  const formatter = new Intl.NumberFormat(content.htmlLang, { maximumFractionDigits: 0 });

  // Counters animate the React-owned text node in place, so React and GSAP never disagree.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motion, () => {
        const restore: (() => void)[] = [];
        gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((element) => {
          const textNode = element.firstChild;
          const target = Number(element.dataset.value);
          if (!(textNode instanceof Text) || !Number.isFinite(target)) return;
          restore.push(() => {
            textNode.nodeValue = formatter.format(target);
          });
          const proxy = { value: 0 };
          textNode.nodeValue = formatter.format(0);
          gsap.to(proxy, {
            value: target,
            duration: COUNTER_DURATION,
            ease: "power2.out",
            snap: { value: 1 },
            onUpdate: () => {
              textNode.nodeValue = formatter.format(proxy.value);
            },
            onComplete: () => {
              textNode.nodeValue = formatter.format(target);
            },
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });
        // If motion gets disabled mid-count, leave the final value on screen.
        return () => restore.forEach((fn) => fn());
      });
      return () => mm.revert();
    },
    { scope, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section ref={scope} id="about" aria-labelledby="about-title" className="py-section outline-none">
      <div className="frame grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="about-title" className="max-w-[18ch] text-step-4 font-bold type-condensed">
            {about.heading}
          </h2>
          <div className="mt-8 max-w-measure space-y-5 text-step-1 text-fog">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-10 space-y-3 text-step-0">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-signal-ink" aria-hidden="true" />
              {about.location}
            </li>
            <li className="flex items-start gap-3">
              <Plane className="mt-1 h-4 w-4 shrink-0 text-signal-ink" aria-hidden="true" />
              {about.availability}
            </li>
            <li className="flex items-start gap-3">
              <Languages className="mt-1 h-4 w-4 shrink-0 text-signal-ink" aria-hidden="true" />
              {about.languages}
            </li>
          </ul>
        </div>

        <figure className="lg:col-span-4 lg:col-start-9 lg:mt-24">
          <div className="relative">
            <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full border border-signal" />
            <img
              src={`/images/${PORTRAIT.base}-480.webp`}
              srcSet={`/images/${PORTRAIT.base}-480.webp 480w, /images/${PORTRAIT.base}-960.webp 960w`}
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 90vw"
              width={PORTRAIT.width}
              height={PORTRAIT.height}
              loading="lazy"
              decoding="async"
              alt={about.portraitAlt}
              className="relative h-auto w-full max-w-sm bg-surface object-cover grayscale-[35%] lg:max-w-none"
            />
          </div>
        </figure>
      </div>

      {metrics.length > 0 && (
        <div className="frame mt-section">
          <h3 className="sr-only">{about.metricsHeading}</h3>
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex flex-col-reverse gap-2 border-b border-line py-8 pr-6 lg:border-b-0">
                <dt className="text-step--1 text-fog">{metric.label}</dt>
                <dd className="font-display text-step-4 font-bold tabular-nums type-condensed">
                  <MetricValue metric={metric} formatter={formatter} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
