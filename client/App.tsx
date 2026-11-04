import { Component, Suspense, useEffect, type ErrorInfo, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LocaleProvider } from "./providers/LocaleProvider";
import { PageTransitionProvider, usePageTransition } from "./providers/PageTransitionProvider";
import { SmoothScrollProvider } from "./providers/SmoothScrollProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CaseStudyPage } from "./routes";

interface BoundaryState {
  hasError: boolean;
}

/** Catches failed lazy chunks (e.g. after a deploy) and offers a reload. */
class RouteErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("Route failed to render", error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <RouteErrorFallback /> : this.props.children;
  }
}

function RouteErrorFallback() {
  const { revealPage } = usePageTransition();
  // The transition overlay may still cover the screen if the failed route never mounted.
  useEffect(() => revealPage(), [revealPage]);
  return (
    <div role="alert" className="frame flex min-h-[100svh] flex-col justify-center gap-6">
      <p className="text-step-2 font-bold">This page failed to load. / Esta página não carregou.</p>
      <a href={window.location.pathname} className="self-start text-signal-ink underline">
        Reload / Recarregar
      </a>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <SmoothScrollProvider>
            <PageTransitionProvider>
              <RouteErrorBoundary>
                <Suspense fallback={<div className="min-h-[100svh] bg-bg" />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/projects/:slug" element={<CaseStudyPage />} />
                    <Route path="/about" element={<Navigate to="/#about" replace />} />
                    <Route path="/projects" element={<Navigate to="/#work" replace />} />
                    <Route path="/contact" element={<Navigate to="/#contact" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </RouteErrorBoundary>
            </PageTransitionProvider>
          </SmoothScrollProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
