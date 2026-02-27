/** Options for configuring the SEO analyzer. */
export interface SeoAnalyzerOptions {
  /** CSS selector for elements to exclude from analysis. Default: `"[data-seo-ignore]"` */
  ignoreSelector?: string;
}

/** Base SEO analysis result shape (used by scoring). */
export interface SeoAnalysisResult {
  id: string;
  page: string;
  timestamp: number;
  score: number;
  metaTags: {
    title: { present: boolean; length: number; content: string };
    description: { present: boolean; length: number; content: string };
    ogTitle: { present: boolean; content: string };
    ogDescription: { present: boolean; content: string };
    ogImage: { present: boolean; content: string };
    twitterCard: { present: boolean; content: string };
    canonical: { present: boolean; content: string };
  };
  headings: {
    h1: { count: number; content: string[] };
    h2: { count: number; content: string[] };
    h3: { count: number; content: string[] };
    h4: { count: number; content: string[] };
    h5: { count: number; content: string[] };
    h6: { count: number; content: string[] };
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    missingAlt: string[];
  };
  links: {
    internal: number;
    external: number;
    nofollow: number;
  };
  structuredData: {
    present: boolean;
    types: string[];
    valid: boolean;
    faqItems?: { question: string; answer: string }[];
  };
  mobileFriendly: boolean;
  issues: {
    critical: string[];
    warning: string[];
    info: string[];
  };
  recommendations: string[];
}

/** Extended images analysis for Image SEO. */
export type SeoPageImagesResult = SeoAnalysisResult["images"] & {
  withSrcset: number;
  withLazyLoad: number;
  filenameQuality: number;
  missingAltSrcs: string[];
  withTitle: number;
  withoutTitle: number;
  missingTitleSrcs: string[];
};

/** Keyword extraction result. */
export interface SeoPageKeywordsResult {
  extracted: string[];
  fromMeta: string[];
  suggested: string[];
}

/** AI engine (GEO) signals. */
export interface SeoPageAiSignalsResult {
  hasFaqSchema: boolean;
  hasClearHeadings: boolean;
  hasConciseIntro: boolean;
  hasEntitySchema: boolean;
}

/** Content structure for readability. */
export interface SeoPageContentStructureResult {
  avgParagraphWords: number;
  hasShortParagraphs: boolean;
  listCount: number;
}

/** Keyword density (percent). */
export interface SeoPageKeywordDensityResult {
  density: number;
  status: "low" | "ok" | "high";
  keywordsUsedForDensity: string[];
}

/** URL slug quality. */
export interface SeoPageUrlSlugResult {
  segmentCount: number;
  hasSpecialChars: boolean;
  isReadable: boolean;
}

/** Extended SEO analysis result with all check data. */
export type SeoPageAnalysisResult = Omit<SeoAnalysisResult, "images"> & {
  images: SeoPageImagesResult;
  keywords: SeoPageKeywordsResult;
  aiSignals: SeoPageAiSignalsResult;
  contentStructure: SeoPageContentStructureResult;
  keywordDensity: SeoPageKeywordDensityResult;
  urlSlug: SeoPageUrlSlugResult;
  isHttps: boolean;
  firstParagraphText: string;
};
