import type { SeoAnalysisResult } from "./types";

/**
 * Calculate SEO score (0–100) from analysis results.
 *
 * Point breakdown:
 *  - Meta tags: 30 pts (title present 10, title length 5, description present 10, description length 5)
 *  - Open Graph: 20 pts (og:title 5, og:description 5, og:image 5, twitter:card 5)
 *  - Headings: 20 pts (single h1 15 OR multiple h1s 5, h2 present 5)
 *  - Images: 15 pts (scaled by alt-text coverage)
 *  - Links: 10 pts (internal 5, external 5)
 *  - Structured data: 5 pts
 */
export function calculateSeoScore(result: SeoAnalysisResult): number {
  let score = 0;

  // Meta tags (30 pts)
  if (result.metaTags.title.present) score += 10;
  if (result.metaTags.title.length >= 30 && result.metaTags.title.length <= 60) score += 5;
  if (result.metaTags.description.present) score += 10;
  if (result.metaTags.description.length >= 120 && result.metaTags.description.length <= 160)
    score += 5;

  // Open Graph (20 pts)
  if (result.metaTags.ogTitle.present) score += 5;
  if (result.metaTags.ogDescription.present) score += 5;
  if (result.metaTags.ogImage.present) score += 5;
  if (result.metaTags.twitterCard.present) score += 5;

  // Headings (20 pts)
  if (result.headings.h1.count === 1) {
    score += 15;
  } else if (result.headings.h1.count > 1) {
    score += 5;
  }
  if (result.headings.h2.count > 0) score += 5;

  // Images (15 pts) — full marks if no images on page
  const imageScore =
    result.images.total > 0 ? (result.images.withAlt / result.images.total) * 15 : 15;
  score += imageScore;

  // Links (10 pts)
  if (result.links.internal > 0) score += 5;
  if (result.links.external > 0) score += 5;

  // Structured data (5 pts)
  if (result.structuredData.present && result.structuredData.valid) score += 5;

  return Math.min(Math.round(score), 100);
}

/** Generate actionable SEO suggestions from analysis results. */
export function generateSeoSuggestions(result: SeoAnalysisResult): string[] {
  const suggestions: string[] = [];

  if (!result.metaTags.title.present) {
    suggestions.push("Add a title tag to improve SEO");
  } else if (result.metaTags.title.length < 30) {
    suggestions.push("Make your title tag longer (30-60 characters)");
  } else if (result.metaTags.title.length > 60) {
    suggestions.push("Shorten your title tag (30-60 characters)");
  }

  if (!result.metaTags.description.present) {
    suggestions.push("Add a meta description tag");
  } else if (result.metaTags.description.length < 120) {
    suggestions.push("Make your meta description longer (120-160 characters)");
  } else if (result.metaTags.description.length > 160) {
    suggestions.push("Shorten your meta description (120-160 characters)");
  }

  if (result.headings.h1.count === 0) {
    suggestions.push("Add an H1 heading to your page");
  } else if (result.headings.h1.count > 1) {
    suggestions.push("Use only one H1 heading per page");
  }

  if (result.images.withoutAlt > 0) {
    suggestions.push(`Add alt text to ${result.images.withoutAlt} image(s)`);
  }

  if (!result.metaTags.ogTitle.present) {
    suggestions.push("Add Open Graph title for social media sharing");
  }
  if (!result.metaTags.ogDescription.present) {
    suggestions.push("Add Open Graph description for social media sharing");
  }
  if (!result.metaTags.ogImage.present) {
    suggestions.push("Add Open Graph image for social media sharing");
  }

  if (!result.structuredData.present) {
    suggestions.push(
      "Add structured data (JSON-LD) to help search engines understand your content"
    );
  }

  if (!result.mobileFriendly) {
    suggestions.push("Add a viewport meta tag with width=device-width and initial-scale=1");
  }

  return suggestions;
}

/**
 * Get a hex color representing the score severity.
 *  - >= 90: green (#16a34a)
 *  - >= 70: yellow (#ca8a04)
 *  - >= 50: orange (#ea580c)
 *  - < 50:  red (#dc2626)
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "#16a34a";
  if (score >= 70) return "#ca8a04";
  if (score >= 50) return "#ea580c";
  return "#dc2626";
}

/** Human-readable label for a score. */
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
}
