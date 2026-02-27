import type { SeoAnalysisResult, SeoPageAnalysisResult, SeoAnalyzerOptions } from "./types";
import { DEFAULT_IGNORE_SELECTOR } from "./constants";
import { getMainContentRoot, getFirstPageParagraph, getPageParagraphs, generateId } from "./utils";
import { calculateSeoScore, generateSeoSuggestions } from "./scoring";
import { analyzeMetaTags } from "./checks/meta";
import { analyzeHeadings } from "./checks/headings";
import { analyzeImages } from "./checks/images";
import { analyzeLinks } from "./checks/links";
import { analyzeStructuredData } from "./checks/structured-data";
import { extractKeywords } from "./checks/keywords";
import { analyzeContentStructure, analyzeKeywordDensity } from "./checks/content";
import { analyzeUrlSlug, checkHttps } from "./checks/url";
import { checkMobileFriendly } from "./checks/mobile";
import { checkAiEngineSignals } from "./checks/ai-signals";

export { getMainContentRoot, getPageParagraphs };

/**
 * Run full client-side SEO page analysis.
 * Call from the browser after the page has rendered.
 */
export function getSeoPageAnalysis(
  pathname: string,
  options?: SeoAnalyzerOptions
): SeoPageAnalysisResult {
  const ignoreSelector = options?.ignoreSelector ?? DEFAULT_IGNORE_SELECTOR;

  const metaTags = analyzeMetaTags();
  const headings = analyzeHeadings(ignoreSelector);
  const images = analyzeImages(ignoreSelector);
  const links = analyzeLinks(ignoreSelector);
  const structuredData = analyzeStructuredData();
  const mobileFriendly = checkMobileFriendly();

  const mainRoot = getMainContentRoot(ignoreSelector);
  const firstParagraph = getFirstPageParagraph(ignoreSelector);

  const keywords = extractKeywords(metaTags, headings, firstParagraph);
  const aiSignals = checkAiEngineSignals(structuredData, headings, firstParagraph);
  const contentStructure = analyzeContentStructure(mainRoot, ignoreSelector);

  const bodyText = (mainRoot?.textContent || document.body.textContent || "").slice(0, 10_000);
  const keywordDensity = analyzeKeywordDensity(keywords, bodyText);
  const urlSlug = analyzeUrlSlug(pathname);
  const isHttps = checkHttps();

  const baseResult: SeoAnalysisResult = {
    id: generateId(),
    page: pathname,
    timestamp: Date.now(),
    score: 0,
    metaTags,
    headings,
    images: {
      total: images.total,
      withAlt: images.withAlt,
      withoutAlt: images.withoutAlt,
      missingAlt: images.missingAlt,
    },
    links,
    structuredData,
    mobileFriendly,
    issues: { critical: [], warning: [], info: [] },
    recommendations: [],
  };

  baseResult.score = calculateSeoScore(baseResult);
  baseResult.recommendations = generateSeoSuggestions(baseResult);

  const firstParagraphText = (firstParagraph?.textContent || "").trim();

  return {
    ...baseResult,
    images,
    keywords,
    aiSignals,
    contentStructure,
    keywordDensity,
    urlSlug,
    isHttps,
    firstParagraphText,
  };
}
