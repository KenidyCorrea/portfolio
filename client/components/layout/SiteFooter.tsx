import { PROFILE } from "@/content/shared";
import { useLocale } from "@/providers/LocaleProvider";

export function SiteFooter() {
  const { content } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60">
      <div className="frame flex flex-col gap-2 py-10 text-step--1 text-fog sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {PROFILE.name}
        </p>
        <p>{content.footer.builtWith}</p>
      </div>
    </footer>
  );
}
