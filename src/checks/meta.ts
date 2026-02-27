import type { SeoAnalysisResult } from "../types";
import { normalizeMetaText } from "../utils";

export function analyzeMetaTags(): SeoAnalysisResult["metaTags"] {
  const title = document.querySelector("title");
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  const canonical = document.querySelector('link[rel="canonical"]');

  const titleContent = normalizeMetaText(title?.textContent || "");
  const descriptionContent = normalizeMetaText(description?.getAttribute("content") || "");

  return {
    title: { present: !!title, length: titleContent.length, content: titleContent },
    description: {
      present: !!description,
      length: descriptionContent.length,
      content: descriptionContent,
    },
    ogTitle: {
      present: !!ogTitle,
      content: normalizeMetaText(ogTitle?.getAttribute("content") || ""),
    },
    ogDescription: {
      present: !!ogDescription,
      content: normalizeMetaText(ogDescription?.getAttribute("content") || ""),
    },
    ogImage: { present: !!ogImage, content: ogImage?.getAttribute("content") || "" },
    twitterCard: { present: !!twitterCard, content: twitterCard?.getAttribute("content") || "" },
    canonical: { present: !!canonical, content: canonical?.getAttribute("href") || "" },
  };
}
