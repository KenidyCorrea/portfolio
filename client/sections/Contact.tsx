import { Github, Linkedin } from "lucide-react";
import { PROFILE } from "@/content/shared";
import { useLocale } from "@/providers/LocaleProvider";

const SOCIAL = [
  { ...PROFILE.linkedin, Icon: Linkedin },
  { ...PROFILE.github, Icon: Github },
] as const;

export function Contact() {
  const { content } = useLocale();
  const { contact, about } = content;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line/60 py-section outline-none">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
      <div className="frame">
        <h2 id="contact-title" className="text-step-5 font-extrabold type-expanded tracking-[-0.03em]">
          {contact.heading}
        </h2>
        <p className="mt-8 max-w-measure text-step-1 text-fog">{contact.body}</p>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-step--1 text-fog">{contact.emailLabel}</p>
            <a
              href={`mailto:${PROFILE.email}`}
              className="link-underline mt-2 inline-block break-all font-display text-step-3 font-bold text-signal-ink type-condensed"
            >
              {PROFILE.email}
            </a>
          </div>

          <div className="lg:col-span-3">
            <p className="text-step--1 text-fog">{contact.socialLabel}</p>
            <ul className="mt-3 space-y-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 text-step-1 transition-colors hover:text-signal-ink"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-step--1 text-fog">{contact.locationLabel}</p>
            <p className="mt-3 text-step-0">{about.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
