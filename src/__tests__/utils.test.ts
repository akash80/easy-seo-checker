import { describe, it, expect } from "vitest";
import { tokenize, normalizeMetaText, isDescriptiveFilename } from "../utils";

describe("tokenize", () => {
  it("returns empty array for empty input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize(null as unknown as string)).toEqual([]);
    expect(tokenize(undefined as unknown as string)).toEqual([]);
  });

  it("lowercases and splits text", () => {
    const result = tokenize("Hello World Testing");
    expect(result).toContain("hello");
    expect(result).toContain("world");
    expect(result).toContain("testing");
  });

  it("filters out stopwords", () => {
    const result = tokenize("the quick brown fox and the lazy dog");
    expect(result).not.toContain("the");
    expect(result).not.toContain("and");
    expect(result).toContain("quick");
    expect(result).toContain("brown");
    expect(result).toContain("fox");
    expect(result).toContain("lazy");
    expect(result).toContain("dog");
  });

  it("filters out words shorter than 3 chars", () => {
    const result = tokenize("go to my big house");
    expect(result).not.toContain("go");
    expect(result).not.toContain("my");
    expect(result).toContain("big");
    expect(result).toContain("house");
  });

  it("supports custom stopwords", () => {
    const customStopwords = new Set(["custom", "stop"]);
    const result = tokenize("custom word stop here", customStopwords);
    expect(result).not.toContain("custom");
    expect(result).not.toContain("stop");
    expect(result).toContain("word");
    expect(result).toContain("here");
  });

  it("strips punctuation", () => {
    const result = tokenize("hello, world! testing...");
    expect(result).toContain("hello");
    expect(result).toContain("world");
    expect(result).toContain("testing");
  });
});

describe("normalizeMetaText", () => {
  it("returns empty string for falsy input", () => {
    expect(normalizeMetaText("")).toBe("");
    expect(normalizeMetaText(null as unknown as string)).toBe("");
  });

  it("trims whitespace", () => {
    expect(normalizeMetaText("  hello  ")).toBe("hello");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeMetaText("hello   world")).toBe("hello world");
  });

  it("removes zero-width characters", () => {
    expect(normalizeMetaText("hello\u200Bworld")).toBe("helloworld");
    expect(normalizeMetaText("test\uFEFFvalue")).toBe("testvalue");
  });
});

describe("isDescriptiveFilename", () => {
  it("returns true for descriptive filenames", () => {
    expect(isDescriptiveFilename("https://example.com/images/hero-banner.jpg")).toBe(true);
    expect(isDescriptiveFilename("https://example.com/product-photo.png")).toBe(true);
  });

  it("returns false for generic filenames", () => {
    expect(isDescriptiveFilename("https://example.com/IMG_001.jpg")).toBe(false);
    expect(isDescriptiveFilename("https://example.com/image.jpg")).toBe(false);
    expect(isDescriptiveFilename("https://example.com/123.jpg")).toBe(false);
    expect(isDescriptiveFilename("https://example.com/pic.jpg")).toBe(false);
  });

  it("returns false for very short filenames", () => {
    expect(isDescriptiveFilename("https://example.com/ab.jpg")).toBe(false);
  });

  it("handles empty src gracefully", () => {
    expect(isDescriptiveFilename("")).toBe(false);
  });
});
