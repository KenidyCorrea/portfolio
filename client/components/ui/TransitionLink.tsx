import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useTransitionNavigate } from "@/providers/PageTransitionProvider";

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  children: ReactNode;
  /** Called on hover/focus, e.g. to preload the next route's chunk */
  onIntent?: () => void;
}

/** Internal link that plays the page transition before navigating. */
export function TransitionLink({ to, children, onIntent, onClick, ...rest }: TransitionLinkProps) {
  const transitionNavigate = useTransitionNavigate();
  return (
    <a
      {...rest}
      href={to}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) transitionNavigate(event, to);
      }}
    >
      {children}
    </a>
  );
}
