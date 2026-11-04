import { Moon, Sun } from "lucide-react";
import { LOCALES } from "@/content/types";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import { useTheme } from "@/providers/ThemeProvider";

const LOCALE_LANG = { pt: "pt-BR", en: "en" } as const;

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, content } = useLocale();
  return (
    <div role="group" aria-label={content.controls.languageLabel} className={cn("flex items-center rounded-full border border-line p-0.5", className)}>
      {LOCALES.map((option) => {
        const isActive = option === locale;
        return (
          <button
            key={option}
            type="button"
            lang={LOCALE_LANG[option]}
            aria-pressed={isActive}
            onClick={() => setLocale(option)}
            className={cn(
              "min-h-9 min-w-10 rounded-full px-2.5 text-step--1 font-medium uppercase transition-colors duration-200",
              isActive ? "bg-fg text-bg" : "text-fog hover:text-fg",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { content } = useLocale();
  const label = theme === "dark" ? content.controls.themeToLight : content.controls.themeToDark;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-line text-fog transition-colors duration-200 hover:border-fg hover:text-fg",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
