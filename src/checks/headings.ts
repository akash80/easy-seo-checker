import type { SeoAnalysisResult } from "../types";
import { isInsideSeoIgnore } from "../utils";
import { DEFAULT_IGNORE_SELECTOR } from "../constants";

export function analyzeHeadings(
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): SeoAnalysisResult["headings"] {
  const headings = {
    h1: { count: 0, content: [] as string[] },
    h2: { count: 0, content: [] as string[] },
    h3: { count: 0, content: [] as string[] },
    h4: { count: 0, content: [] as string[] },
    h5: { count: 0, content: [] as string[] },
    h6: { count: 0, content: [] as string[] },
  };

  (["h1", "h2", "h3", "h4", "h5", "h6"] as const).forEach((tag) => {
    const filtered = Array.from(document.querySelectorAll(tag)).filter(
      (el) => !isInsideSeoIgnore(el, ignoreSelector)
    );
    headings[tag].count = filtered.length;
    headings[tag].content = filtered.map((el) => el.textContent || "");
  });

  return headings;
}
