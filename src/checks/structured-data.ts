import type { SeoAnalysisResult } from "../types";

export function analyzeStructuredData(): SeoAnalysisResult["structuredData"] {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const types: string[] = [];
  const faqItems: { question: string; answer: string }[] = [];
  let valid = true;

  scripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || "{}");
      const addType = (t: string) => {
        if (t) types.push(t);
      };

      if (data["@type"]) {
        if (Array.isArray(data["@type"])) {
          data["@type"].forEach(addType);
        } else {
          addType(data["@type"]);
        }
      }

      if (data["@graph"]) {
        data["@graph"].forEach((item: { "@type"?: string }) => {
          if (item["@type"]) addType(item["@type"]);
        });
      }

      if (data["@type"] === "FAQPage" && Array.isArray(data.mainEntity)) {
        data.mainEntity.forEach(
          (entry: { name?: string; acceptedAnswer?: { text?: string } }) => {
            const q = entry?.name?.trim();
            const a = entry?.acceptedAnswer?.text?.trim();
            if (q) faqItems.push({ question: q, answer: a || "" });
          }
        );
      }
    } catch {
      valid = false;
    }
  });

  return {
    present: scripts.length > 0,
    types,
    valid,
    faqItems: faqItems.length > 0 ? faqItems : undefined,
  };
}
