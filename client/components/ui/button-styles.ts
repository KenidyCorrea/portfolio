import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-step-0 font-medium transition-[background-color,border-color,color,box-shadow] duration-200 ease-out-expo";

const VARIANTS: Readonly<Record<ButtonVariant, string>> = {
  primary: "bg-signal text-on-signal hover:shadow-[0_0_0_6px_rgb(var(--signal)/0.22)]",
  outline: "border border-fg/35 text-fg hover:border-fg hover:bg-fg/5",
  ghost: "text-fog hover:text-fg",
};

export function buttonClasses(variant: ButtonVariant, className?: string): string {
  return cn(BASE, VARIANTS[variant], className);
}
