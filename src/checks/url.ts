import type { SeoPageUrlSlugResult } from "../types";

export function analyzeUrlSlug(pathname: string): SeoPageUrlSlugResult {
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] || "";
  const hasSpecialChars = /[^a-z0-9-]/i.test(slug);

  return {
    segmentCount: segments.length,
    hasSpecialChars,
    isReadable: segments.length >= 1 && segments.length <= 5 && !hasSpecialChars,
  };
}

export function checkHttps(): boolean {
  if (typeof window === "undefined") return false;
  return location.protocol === "https:";
}
