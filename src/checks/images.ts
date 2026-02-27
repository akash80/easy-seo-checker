import type { SeoPageImagesResult } from "../types";
import { isInsideSeoIgnore, isDescriptiveFilename } from "../utils";
import { DEFAULT_IGNORE_SELECTOR } from "../constants";

export function analyzeImages(ignoreSelector = DEFAULT_IGNORE_SELECTOR): SeoPageImagesResult {
  const allImages = Array.from(document.querySelectorAll("img")).filter(
    (img) => !isInsideSeoIgnore(img, ignoreSelector)
  );
  const total = allImages.length;
  let withAlt = 0;
  const missingAlt: string[] = [];
  const missingAltSrcs: string[] = [];
  let withSrcset = 0;
  let withLazyLoad = 0;
  let filenameQuality = 0;
  let withTitle = 0;
  const missingTitleSrcs: string[] = [];

  allImages.forEach((img, index) => {
    const alt = img.getAttribute("alt");
    const src = img.getAttribute("src") || img.src || "";

    if (alt && alt.trim() !== "") {
      withAlt++;
    } else {
      missingAlt.push(`Image ${index + 1} (src: ${src})`);
      missingAltSrcs.push(src);
    }

    const title = img.getAttribute("title");
    if (title && title.trim() !== "") {
      withTitle++;
    } else {
      missingTitleSrcs.push(src);
    }

    const hasImgSrcset = img.hasAttribute("srcset") && img.getAttribute("srcset")?.trim();
    const picture = img.closest("picture");
    const hasPictureSrcset = Array.from(picture?.querySelectorAll("source") ?? []).some(
      (s) => (s.getAttribute("srcset") ?? "").trim().length > 0
    );
    if (hasImgSrcset || hasPictureSrcset) withSrcset++;
    if (img.getAttribute("loading") === "lazy") withLazyLoad++;
    if (isDescriptiveFilename(src)) filenameQuality++;
  });

  return {
    total,
    withAlt,
    withoutAlt: total - withAlt,
    missingAlt,
    missingAltSrcs,
    withSrcset,
    withLazyLoad,
    filenameQuality,
    withTitle,
    withoutTitle: total - withTitle,
    missingTitleSrcs,
  };
}
