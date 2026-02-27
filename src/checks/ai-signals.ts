import type { SeoAnalysisResult, SeoPageAiSignalsResult } from "../types";

export function checkAiEngineSignals(
  structuredData: SeoAnalysisResult["structuredData"],
  headings: SeoAnalysisResult["headings"],
  firstParagraph: HTMLParagraphElement | null
): SeoPageAiSignalsResult {
  const types = structuredData.types.map((t) => t.toLowerCase());

  const hasFaqSchema = types.some((t) => t.includes("faq") || t.includes("question"));
  const hasEntitySchema = types.some(
    (t) => t.includes("organization") || t.includes("webpage") || t.includes("article")
  );
  const hasClearHeadings = headings.h2.count > 0 && headings.h3.count > 0;

  const introText = (firstParagraph?.textContent || "").trim();
  const introWordCount = introText.split(/\s+/).filter(Boolean).length;
  const hasConciseIntro = introWordCount >= 30 && introWordCount <= 150;

  return { hasFaqSchema, hasClearHeadings, hasConciseIntro, hasEntitySchema };
}
