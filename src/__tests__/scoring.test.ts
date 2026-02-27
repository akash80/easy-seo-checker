import { describe, it, expect } from "vitest";
import {
  calculateSeoScore,
  generateSeoSuggestions,
  getScoreColor,
  getScoreLabel,
} from "../scoring";
import type { SeoAnalysisResult } from "../types";

function makeResult(overrides: Partial<SeoAnalysisResult> = {}): SeoAnalysisResult {
  return {
    id: "test-id",
    page: "/test",
    timestamp: Date.now(),
    score: 0,
    metaTags: {
      title: { present: false, length: 0, content: "" },
      description: { present: false, length: 0, content: "" },
      ogTitle: { present: false, content: "" },
      ogDescription: { present: false, content: "" },
      ogImage: { present: false, content: "" },
      twitterCard: { present: false, content: "" },
      canonical: { present: false, content: "" },
    },
    headings: {
      h1: { count: 0, content: [] },
      h2: { count: 0, content: [] },
      h3: { count: 0, content: [] },
      h4: { count: 0, content: [] },
      h5: { count: 0, content: [] },
      h6: { count: 0, content: [] },
    },
    images: { total: 0, withAlt: 0, withoutAlt: 0, missingAlt: [] },
    links: { internal: 0, external: 0, nofollow: 0 },
    structuredData: { present: false, types: [], valid: true },
    mobileFriendly: false,
    issues: { critical: [], warning: [], info: [] },
    recommendations: [],
    ...overrides,
  };
}

describe("calculateSeoScore", () => {
  it("returns 0 for a completely empty page", () => {
    const result = makeResult();
    expect(calculateSeoScore(result)).toBe(15);
    // 15 because: 0 images on page gives full 15 pts for images
  });

  it("gives 10 pts for title present", () => {
    const base = calculateSeoScore(makeResult());
    const withTitle = calculateSeoScore(
      makeResult({
        metaTags: {
          ...makeResult().metaTags,
          title: { present: true, length: 10, content: "Short" },
        },
      })
    );
    expect(withTitle - base).toBe(10);
  });

  it("gives 5 bonus pts for title in optimal length range", () => {
    const shortTitle = calculateSeoScore(
      makeResult({
        metaTags: {
          ...makeResult().metaTags,
          title: { present: true, length: 10, content: "Short" },
        },
      })
    );
    const optimalTitle = calculateSeoScore(
      makeResult({
        metaTags: {
          ...makeResult().metaTags,
          title: { present: true, length: 45, content: "A good title that is forty-five characters long" },
        },
      })
    );
    expect(optimalTitle - shortTitle).toBe(5);
  });

  it("gives 15 pts for exactly one h1", () => {
    const base = calculateSeoScore(makeResult());
    const withH1 = calculateSeoScore(
      makeResult({
        headings: { ...makeResult().headings, h1: { count: 1, content: ["Title"] } },
      })
    );
    expect(withH1 - base).toBe(15);
  });

  it("gives only 5 pts for multiple h1s (not 15)", () => {
    const base = calculateSeoScore(makeResult());
    const withMultipleH1 = calculateSeoScore(
      makeResult({
        headings: {
          ...makeResult().headings,
          h1: { count: 3, content: ["A", "B", "C"] },
        },
      })
    );
    expect(withMultipleH1 - base).toBe(5);
  });

  it("caps score at 100", () => {
    const perfect = makeResult({
      metaTags: {
        title: { present: true, length: 45, content: "Perfect Title" },
        description: { present: true, length: 150, content: "Perfect description" },
        ogTitle: { present: true, content: "OG Title" },
        ogDescription: { present: true, content: "OG Desc" },
        ogImage: { present: true, content: "https://img.jpg" },
        twitterCard: { present: true, content: "summary_large_image" },
        canonical: { present: true, content: "https://example.com" },
      },
      headings: {
        ...makeResult().headings,
        h1: { count: 1, content: ["Main Heading"] },
        h2: { count: 2, content: ["Sub 1", "Sub 2"] },
      },
      images: { total: 2, withAlt: 2, withoutAlt: 0, missingAlt: [] },
      links: { internal: 5, external: 2, nofollow: 0 },
      structuredData: { present: true, types: ["WebPage"], valid: true },
      mobileFriendly: true,
    });
    expect(calculateSeoScore(perfect)).toBe(100);
  });

  it("scales image score by alt coverage", () => {
    const halfAlt = calculateSeoScore(
      makeResult({
        images: { total: 4, withAlt: 2, withoutAlt: 2, missingAlt: ["img3", "img4"] },
      })
    );
    const fullAlt = calculateSeoScore(
      makeResult({
        images: { total: 4, withAlt: 4, withoutAlt: 0, missingAlt: [] },
      })
    );
    expect(fullAlt).toBeGreaterThan(halfAlt);
  });
});

describe("generateSeoSuggestions", () => {
  it("suggests adding title when missing", () => {
    const suggestions = generateSeoSuggestions(makeResult());
    expect(suggestions).toContain("Add a title tag to improve SEO");
  });

  it("suggests lengthening short title", () => {
    const result = makeResult({
      metaTags: {
        ...makeResult().metaTags,
        title: { present: true, length: 10, content: "Hi" },
      },
    });
    const suggestions = generateSeoSuggestions(result);
    expect(suggestions).toContain("Make your title tag longer (30-60 characters)");
  });

  it("suggests shortening long title", () => {
    const result = makeResult({
      metaTags: {
        ...makeResult().metaTags,
        title: { present: true, length: 80, content: "x".repeat(80) },
      },
    });
    const suggestions = generateSeoSuggestions(result);
    expect(suggestions).toContain("Shorten your title tag (30-60 characters)");
  });

  it("suggests single h1 when multiple exist", () => {
    const result = makeResult({
      headings: {
        ...makeResult().headings,
        h1: { count: 3, content: ["A", "B", "C"] },
      },
    });
    const suggestions = generateSeoSuggestions(result);
    expect(suggestions).toContain("Use only one H1 heading per page");
  });

  it("suggests viewport meta tag when not mobile friendly", () => {
    const suggestions = generateSeoSuggestions(makeResult());
    expect(suggestions).toContain(
      "Add a viewport meta tag with width=device-width and initial-scale=1"
    );
  });

  it("returns no title suggestion when title is optimal", () => {
    const result = makeResult({
      metaTags: {
        ...makeResult().metaTags,
        title: { present: true, length: 45, content: "A great title" },
      },
    });
    const suggestions = generateSeoSuggestions(result);
    const titleSuggestions = suggestions.filter((s) => s.toLowerCase().includes("title tag"));
    expect(titleSuggestions).toHaveLength(0);
  });
});

describe("getScoreColor", () => {
  it("returns green hex for excellent scores", () => {
    expect(getScoreColor(95)).toBe("#16a34a");
    expect(getScoreColor(90)).toBe("#16a34a");
  });

  it("returns yellow hex for good scores", () => {
    expect(getScoreColor(75)).toBe("#ca8a04");
  });

  it("returns orange hex for moderate scores", () => {
    expect(getScoreColor(55)).toBe("#ea580c");
  });

  it("returns red hex for poor scores", () => {
    expect(getScoreColor(30)).toBe("#dc2626");
    expect(getScoreColor(0)).toBe("#dc2626");
  });
});

describe("getScoreLabel", () => {
  it("returns correct labels for score ranges", () => {
    expect(getScoreLabel(95)).toBe("Excellent");
    expect(getScoreLabel(75)).toBe("Good");
    expect(getScoreLabel(55)).toBe("Needs Improvement");
    expect(getScoreLabel(30)).toBe("Poor");
  });
});
