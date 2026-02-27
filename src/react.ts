import { useState, useCallback, useEffect, useRef } from "react";
import { getSeoPageAnalysis } from "./analyzer";
import type { SeoPageAnalysisResult, SeoAnalyzerOptions } from "./types";

export interface UseSeoPageAnalysisOptions extends SeoAnalyzerOptions {
  /** If true, run analysis once when pathname is set. Default: false */
  runOnMount?: boolean;
}

export interface UseSeoPageAnalysisReturn {
  result: SeoPageAnalysisResult | null;
  /** Trigger analysis manually. */
  run: () => void;
  /** Clear result, error, and loading state. */
  reset: () => void;
  loading: boolean;
  error: Error | null;
}

/**
 * React hook for client-side SEO page analysis.
 *
 * Browser-only — do not call during SSR.
 *
 * @param pathname Current pathname (e.g. `window.location.pathname`).
 * @param options  Optional config: `runOnMount`, `ignoreSelector`.
 */
export function useSeoPageAnalysis(
  pathname: string | null,
  options?: UseSeoPageAnalysisOptions
): UseSeoPageAnalysisReturn {
  const [result, setResult] = useState<SeoPageAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  const run = useCallback(() => {
    if (pathname == null) {
      setResult(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    // Defer analysis so the loading state renders before DOM traversal blocks the thread.
    requestAnimationFrame(() => {
      try {
        const opts = optionsRef.current;
        const analysis = getSeoPageAnalysis(pathname, {
          ignoreSelector: opts?.ignoreSelector,
        });
        setResult(analysis);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setResult(null);
      } finally {
        setLoading(false);
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (options?.runOnMount && pathname != null) {
      run();
    }
  }, [pathname, options?.runOnMount, run]);

  return { result, run, reset, loading, error };
}
