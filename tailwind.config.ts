import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}", "./index.html"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Pinned / horizontal-scroll layouts. Keep in sync with MOTION_QUERIES.desktop (client/lib/gsap.ts).
      pin: { raw: "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)" },
    },
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        line: token("line"),
        fg: token("fg"),
        fog: token("fog"),
        signal: token("signal"),
        "signal-ink": token("signal-ink"),
        "on-signal": token("on-signal"),
      },
      fontFamily: {
        display: ['"Archivo Variable"', "Arial Black", "sans-serif"],
        sans: ['"IBM Plex Sans Variable"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // Modular scale (1.25) anchored at 1rem; display sizes are fluid.
        "step--1": ["0.875rem", { lineHeight: "1.5" }],
        "step-0": ["1rem", { lineHeight: "1.6" }],
        "step-1": ["1.25rem", { lineHeight: "1.5" }],
        "step-2": ["1.5625rem", { lineHeight: "1.3" }],
        "step-3": ["clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)", { lineHeight: "1.1" }],
        "step-4": ["clamp(2.25rem, 1.6rem + 3vw, 4.5rem)", { lineHeight: "1" }],
        "step-5": ["clamp(3.25rem, 1rem + 11vw, 13rem)", { lineHeight: "0.86" }],
      },
      spacing: {
        section: "clamp(4rem, 3rem + 3vw, 7rem)",
        gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)",
      },
      maxWidth: {
        measure: "62ch",
        frame: "96rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
