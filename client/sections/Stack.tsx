import { useLocale } from "@/providers/LocaleProvider";

export function Stack() {
  const { content } = useLocale();
  const { stack } = content;

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-t border-line/60 py-section outline-none">
      <div className="frame grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="stack-title" className="text-step-4 font-bold type-condensed">
            {stack.heading}
          </h2>
          <p className="mt-4 max-w-[34ch] text-step-0 text-fog">{stack.intro}</p>
        </div>

        <dl className="lg:col-span-8">
          {stack.groups.map((group) => (
            <div
              key={group.id}
              className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <dt className="font-display text-step-2 font-bold type-condensed">{group.title}</dt>
              <dd>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-step-1 text-fog">
                  {group.items.map((item) => (
                    <li key={item} className="text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
