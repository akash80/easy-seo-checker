import type {
  SeoPageContentStructureResult,
  SeoPageKeywordsResult,
  SeoPageKeywordDensityResult,
} from "../types";
import { isInsideSeoIgnore } from "../utils";
import { DEFAULT_IGNORE_SELECTOR } from "../constants";

export function analyzeContentStructure(
  mainRoot: Element | null,
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): SeoPageContentStructureResult {
  const root = mainRoot || document.body;
  const paragraphs = Array.from(root.querySelectorAll("p")).filter(
    (p) => !isInsideSeoIgnore(p, ignoreSelector)
  );

  let totalWords = 0;
  const wordCounts: number[] = [];
  paragraphs.forEach((p) => {
    const words = (p.textContent || "").split(/\s+/).filter(Boolean).length;
    totalWords += words;
    if (words > 0) wordCounts.push(words);
  });

  const avgParagraphWords = wordCounts.length > 0 ? totalWords / wordCounts.length : 0;

  let lists = Array.from(root.querySelectorAll("ul, ol")).filter(
    (el) => !isInsideSeoIgnore(el, ignoreSelector)
  );
  if (lists.length === 0) {
    lists = Array.from(document.body.querySelectorAll("ul, ol")).filter(
      (el) => !isInsideSeoIgnore(el, ignoreSelector)
    );
  }

  return {
    avgParagraphWords: Math.round(avgParagraphWords),
    hasShortParagraphs: avgParagraphWords <= 75 && avgParagraphWords > 0,
    listCount: lists.length,
  };
}

export function analyzeKeywordDensity(
  keywords: SeoPageKeywordsResult,
  bodyText: string
): SeoPageKeywordDensityResult {
  const totalWords = bodyText.split(/\s+/).filter(Boolean).length;
  const focusKeywords =
    keywords.fromMeta.length > 0
      ? keywords.fromMeta.slice(0, 10)
      : keywords.suggested.slice(0, 10);

  if (totalWords === 0 || focusKeywords.length === 0) {
    return { density: 0, status: "low", keywordsUsedForDensity: focusKeywords };
  }

  const bodyLower = bodyText.toLowerCase();
  let mentions = 0;
  focusKeywords.forEach((kw) => {
    const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = bodyLower.match(regex);
    if (matches) mentions += matches.length;
  });

  const density = (mentions / totalWords) * 100;
  let status: "low" | "ok" | "high" = "ok";
  if (density > 3) status = "high";
  else if (density < 0.5) status = "low";

  return {
    density: Math.round(density * 100) / 100,
    status,
    keywordsUsedForDensity: focusKeywords,
  };
}
