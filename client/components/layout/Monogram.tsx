import { cn } from "@/lib/utils";

/** Brand mark: K with a terminal prompt underneath. Decorative; pair with visible text. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={cn("h-8 w-8", className)}>
      <rect width="64" height="64" rx="12" className="fill-fg" />
      <path d="M16 12h9v16l13-16h11L35 29l15 21H39L29 35l-4 5v10h-9z" className="fill-signal" />
      <rect x="16" y="54" width="14" height="3" rx="1.5" className="fill-bg" />
      <circle cx="37" cy="55.5" r="1.8" className="fill-bg" />
      <circle cx="43" cy="55.5" r="1.8" className="fill-bg" />
      <circle cx="49" cy="55.5" r="1.8" className="fill-bg" />
    </svg>
  );
}
