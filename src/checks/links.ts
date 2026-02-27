import type { SeoAnalysisResult } from "../types";
import { isInsideSeoIgnore } from "../utils";
import { DEFAULT_IGNORE_SELECTOR } from "../constants";

export function analyzeLinks(
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): SeoAnalysisResult["links"] {
  const allLinks = Array.from(document.querySelectorAll("a[href]")).filter(
    (link) => !isInsideSeoIgnore(link, ignoreSelector)
  );

  let internal = 0;
  let external = 0;
  let nofollow = 0;

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const rel = link.getAttribute("rel");

    if (rel && rel.includes("nofollow")) nofollow++;

    if (href) {
      if (href.startsWith("http") && !href.includes(window.location.hostname)) {
        external++;
      } else {
        internal++;
      }
    }
  });

  return { internal, external, nofollow };
}
