import { describe, it, expect, beforeEach } from "vitest";
import { getSeoPageAnalysis } from "../analyzer";

function setDocument(html: string) {
  document.documentElement.innerHTML = html;
}

beforeEach(() => {
  setDocument("<head></head><body></body>");
});

describe("getSeoPageAnalysis", () => {
  it("returns a result with expected shape", () => {
    setDocument(`
      <head>
        <title>Test Page Title That Is Good</title>
        <meta name="description" content="A solid meta description that is long enough to score points and help with SEO rankings significantly.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <main>
          <h1>Main Heading</h1>
          <h2>Sub Heading</h2>
          <p>This is the first paragraph with some real content for analysis.</p>
        </main>
      </body>
    `);
    const result = getSeoPageAnalysis("/test-page");

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("page", "/test-page");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("metaTags");
    expect(result).toHaveProperty("headings");
    expect(result).toHaveProperty("images");
    expect(result).toHaveProperty("links");
    expect(result).toHaveProperty("structuredData");
    expect(result).toHaveProperty("mobileFriendly");
    expect(result).toHaveProperty("keywords");
    expect(result).toHaveProperty("aiSignals");
    expect(result).toHaveProperty("contentStructure");
    expect(result).toHaveProperty("keywordDensity");
    expect(result).toHaveProperty("urlSlug");
    expect(result).toHaveProperty("isHttps");
    expect(result).toHaveProperty("firstParagraphText");
    expect(result).toHaveProperty("recommendations");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("detects title and description", () => {
    setDocument(`
      <head>
        <title>My SEO Page</title>
        <meta name="description" content="A great page for SEO analysis testing.">
      </head>
      <body><p>Content</p></body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.metaTags.title.present).toBe(true);
    expect(result.metaTags.title.content).toBe("My SEO Page");
    expect(result.metaTags.description.present).toBe(true);
  });

  it("reports missing title and description", () => {
    setDocument("<head></head><body><p>Hello</p></body>");
    const result = getSeoPageAnalysis("/");
    expect(result.metaTags.title.present).toBe(false);
    expect(result.metaTags.description.present).toBe(false);
  });

  it("counts headings correctly", () => {
    setDocument(`
      <head><title>Test</title></head>
      <body>
        <h1>Main</h1>
        <h2>Sub 1</h2>
        <h2>Sub 2</h2>
        <h3>Detail</h3>
      </body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.headings.h1.count).toBe(1);
    expect(result.headings.h2.count).toBe(2);
    expect(result.headings.h3.count).toBe(1);
  });

  it("excludes elements with data-seo-ignore", () => {
    setDocument(`
      <head><title>Test</title></head>
      <body>
        <h1>Visible Heading</h1>
        <div data-seo-ignore>
          <h1>Admin Heading</h1>
          <h2>Admin Sub</h2>
        </div>
        <h2>Visible Sub</h2>
      </body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.headings.h1.count).toBe(1);
    expect(result.headings.h1.content).toEqual(["Visible Heading"]);
    expect(result.headings.h2.count).toBe(1);
    expect(result.headings.h2.content).toEqual(["Visible Sub"]);
  });

  it("accepts custom ignoreSelector via options", () => {
    setDocument(`
      <head><title>Test</title></head>
      <body>
        <h1>Visible</h1>
        <div class="admin-only">
          <h1>Hidden</h1>
        </div>
      </body>
    `);
    const result = getSeoPageAnalysis("/", { ignoreSelector: ".admin-only" });
    expect(result.headings.h1.count).toBe(1);
    expect(result.headings.h1.content).toEqual(["Visible"]);
  });

  it("analyzes images for alt text", () => {
    setDocument(`
      <head><title>Test</title></head>
      <body>
        <img src="good.jpg" alt="A good image">
        <img src="bad.jpg">
        <img src="also-bad.jpg" alt="">
      </body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.images.total).toBe(3);
    expect(result.images.withAlt).toBe(1);
    expect(result.images.withoutAlt).toBe(2);
  });

  it("detects structured data", () => {
    setDocument(`
      <head>
        <title>Test</title>
        <script type="application/ld+json">{"@type": "WebPage", "name": "Test"}</script>
      </head>
      <body><p>Content</p></body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.structuredData.present).toBe(true);
    expect(result.structuredData.types).toContain("WebPage");
    expect(result.structuredData.valid).toBe(true);
  });

  it("handles invalid JSON-LD gracefully", () => {
    setDocument(`
      <head>
        <title>Test</title>
        <script type="application/ld+json">NOT VALID JSON</script>
      </head>
      <body><p>Content</p></body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.structuredData.present).toBe(true);
    expect(result.structuredData.valid).toBe(false);
  });

  it("detects mobile-friendly viewport", () => {
    setDocument(`
      <head>
        <title>Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body><p>Content</p></body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.mobileFriendly).toBe(true);
  });

  it("reports not mobile-friendly without viewport", () => {
    setDocument("<head><title>Test</title></head><body><p>Content</p></body>");
    const result = getSeoPageAnalysis("/");
    expect(result.mobileFriendly).toBe(false);
  });

  it("analyzes URL slug", () => {
    const result = getSeoPageAnalysis("/blog/my-great-post");
    expect(result.urlSlug.segmentCount).toBe(2);
    expect(result.urlSlug.hasSpecialChars).toBe(false);
    expect(result.urlSlug.isReadable).toBe(true);
  });

  it("detects special chars in URL slug", () => {
    const result = getSeoPageAnalysis("/blog/my_post@here");
    expect(result.urlSlug.hasSpecialChars).toBe(true);
    expect(result.urlSlug.isReadable).toBe(false);
  });

  it("extracts keywords from meta and headings", () => {
    setDocument(`
      <head>
        <title>TypeScript SEO Library</title>
        <meta name="keywords" content="seo, typescript, browser">
      </head>
      <body>
        <h1>Client SEO Analyzer</h1>
        <p>Analyze your pages for search engine optimization.</p>
      </body>
    `);
    const result = getSeoPageAnalysis("/");
    expect(result.keywords.fromMeta).toEqual(["seo", "typescript", "browser"]);
    expect(result.keywords.extracted.length).toBeGreaterThan(0);
  });

  it("generates recommendations for incomplete pages", () => {
    setDocument("<head></head><body></body>");
    const result = getSeoPageAnalysis("/");
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations).toContain("Add a title tag to improve SEO");
  });
});
