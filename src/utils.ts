import { STOPWORDS, DEFAULT_IGNORE_SELECTOR } from "./constants";

export function isInsideSeoIgnore(
  el: Element | null,
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): boolean {
  return el?.closest(ignoreSelector) != null;
}

export function getMainContentRoot(ignoreSelector = DEFAULT_IGNORE_SELECTOR): Element | null {
  const candidates = document.querySelectorAll("main, article, .content");
  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i]!;
    if (!isInsideSeoIgnore(el, ignoreSelector)) return el;
  }
  return null;
}

export function getPageParagraphs(
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): HTMLParagraphElement[] {
  const all = document.querySelectorAll("main p, article p, .content p, p");
  return Array.from(all).filter(
    (p) => !isInsideSeoIgnore(p, ignoreSelector)
  ) as HTMLParagraphElement[];
}

export function getFirstPageParagraph(
  ignoreSelector = DEFAULT_IGNORE_SELECTOR
): HTMLParagraphElement | null {
  const all = document.querySelectorAll("main p, article p, .content p, p");
  for (let i = 0; i < all.length; i++) {
    const el = all[i]!;
    if (!isInsideSeoIgnore(el, ignoreSelector)) return el as HTMLParagraphElement;
  }
  return null;
}

export function tokenize(text: string, stopwords: Set<string> = STOPWORDS): string[] {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

export function normalizeMetaText(s: string): string {
  if (!s || typeof s !== "string") return "";
  return s
    .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isDescriptiveFilename(src: string): boolean {
  try {
    const url = new URL(src, window.location.origin);
    const lastSegment = url.pathname.split("/").pop() || "";
    const nameWithoutExt = lastSegment.replace(/\.[^.]+$/, "");
    if (!nameWithoutExt || nameWithoutExt.length < 3) return false;
    return !/^(img|image|photo|pic|untitled|dsc|img_\d+|\d+)$/i.test(nameWithoutExt);
  } catch {
    return false;
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
