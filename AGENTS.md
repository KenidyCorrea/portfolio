# Kenidy Corrêa — Portfolio

Static SPA portfolio (Tech Lead / Backend Engineer). React 18 + React Router 7 (library mode) + TypeScript (strict) + Vite + Tailwind 3, animated with GSAP 3 (@gsap/react) and Lenis. No backend: deployed as static files on Netlify.

## Commands

```bash
npm run dev        # Vite dev server on :8080
npm run build      # Production build -> dist/spa
npm run preview    # Serve the production build
npm run typecheck  # tsc (strict)
npm test           # Vitest (content integrity, layout, storage)
npm run images     # Re-generate WebP images, favicons and OG card (sharp)
```

## Structure

```
client/
  main.tsx                 # Entry: CSS, GSAP registration, createRoot
  App.tsx                  # Providers + routes (/, /projects/:slug lazy, 404)
  routes.ts                # Lazy case study + preload helper
  content/                 # ALL visible text lives here
    types.ts               # Content types (Project, Experience, Metric, SkillGroup, Domain...)
    shared.ts              # Language-neutral data: links, stack, images, diagram topology, METRIC_VALUES
    pt.ts / en.ts          # Localized copy (same LocaleCopy shape)
    index.ts               # buildContent(locale) merges shared + copy; drafts hidden in production
  lib/
    gsap.ts                # Single plugin registration + MOTION_QUERIES (import GSAP only from here)
    architecture-layout.ts # Pure SVG diagram layout (tested)
    storage.ts             # Guarded localStorage with allow-lists (tested)
  hooks/                   # useLenis (GSAP ticker), useMediaQuery, usePageEnter, useSectionNav
  providers/               # Locale, Theme, SmoothScroll (Lenis), PageTransition
  components/              # layout/, diagram/, projects/, ui/
  sections/                # Home sections: Hero, TechMarquee, About, IntegrationFlow, Projects, Stack, Experience, Contact
  pages/                   # Index (home), CaseStudy, NotFound
public/                    # Served as-is: boot.js (theme/lang before paint), images/*.webp, CVs, icons
assets/source-images/      # Original images (input of npm run images, not deployed)
```

## Rules for changes

- **Text**: never hardcode visible strings in components. Add them to `LocaleCopy` in `content/types.ts`, then to both `pt.ts` and `en.ts`. `content.spec.ts` fails if the locales drift.
- **Projects**: add metadata to `PROJECTS_META` (shared.ts) and copy to `projectCopy` in both locales. Every diagram node needs a label (max 24 chars). `isDraft: true` hides a project in production.
- **Metrics**: fill `METRIC_VALUES` in shared.ts; `null` values are hidden in production.
- **Animation**: use `useGSAP` with a `scope`, wrap setup in `gsap.matchMedia()` with `MOTION_QUERIES`, and keep a no-motion fallback (`prefers-reduced-motion`). Pinned layouts use the Tailwind `pin:` screen, which must mirror `MOTION_QUERIES.desktop`.
- **Images**: add the original to `assets/source-images`, register it in `scripts/optimize-images.mjs`, run `npm run images`, and always set `width`/`height`.
- **Security**: headers and CSP live in `netlify.toml` (`script-src 'self'`: no inline scripts, no third-party origins). No secrets in the repo; `.env*` is git-ignored.
