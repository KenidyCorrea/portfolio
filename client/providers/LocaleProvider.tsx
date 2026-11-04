import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildContent } from "@/content";
import { LOCALES, type Locale, type SiteContent } from "@/content/types";
import { readPreference, STORAGE_KEYS, writePreference } from "@/lib/storage";

interface LocaleContextValue {
  locale: Locale;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitialLocale(): Locale {
  const stored = readPreference(STORAGE_KEYS.locale, LOCALES);
  if (stored) return stored;
  const language = typeof navigator === "undefined" ? "en" : navigator.language.toLowerCase();
  return language.startsWith("pt") ? "pt" : "en";
}

function setMetaContent(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);
  const content = useMemo(() => buildContent(locale, { includeDrafts: import.meta.env.DEV }), [locale]);

  useEffect(() => {
    document.documentElement.lang = content.htmlLang;
    setMetaContent('meta[name="description"]', content.meta.description);
    setMetaContent('meta[property="og:description"]', content.meta.description);
    setMetaContent('meta[property="og:locale"]', locale === "pt" ? "pt_BR" : "en_US");
  }, [content, locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writePreference(STORAGE_KEYS.locale, next);
  }, []);

  const value = useMemo(() => ({ locale, content, setLocale }), [locale, content, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside <LocaleProvider>");
  return context;
}
