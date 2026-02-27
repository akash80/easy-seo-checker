import type { SeoAnalysisResult, SeoPageKeywordsResult } from "../types";
import { tokenize } from "../utils";

export function extractKeywords(
  metaTags: SeoAnalysisResult["metaTags"],
  headings: SeoAnalysisResult["headings"],
  firstParagraph: HTMLParagraphElement | null
): SeoPageKeywordsResult {
  const fromMeta: string[] = [];
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    const content = metaKeywords.getAttribute("content") || "";
    fromMeta.push(...content.split(",").map((k) => k.trim()).filter(Boolean));
  }

  const extracted = new Set<string>();
  fromMeta.forEach((k) => extracted.add(k.toLowerCase()));
  tokenize(metaTags.title.content).forEach((w) => extracted.add(w));
  headings.h1.content.forEach((h) => tokenize(h).forEach((w) => extracted.add(w)));

  const introText = firstParagraph?.textContent || "";
  tokenize(introText.slice(0, 500)).forEach((w) => extracted.add(w));

  const suggested = Array.from(extracted).slice(0, 15);

  return { extracted: Array.from(extracted), fromMeta, suggested };
}
