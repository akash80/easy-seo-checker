export const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare",
  "ought", "used", "not", "no", "nor", "so", "if", "than", "that", "this", "these", "those",
  "it", "its", "from", "into", "about", "between", "through", "during", "before", "after",
  "above", "below", "up", "down", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each", "every", "both",
  "few", "more", "most", "other", "some", "such", "only", "own", "same", "also", "just", "very",
]);

export const DEFAULT_IGNORE_SELECTOR = "[data-seo-ignore]";

export const DEFAULT_TITLE_LENGTH = { min: 30, max: 60 };
export const DEFAULT_DESCRIPTION_LENGTH = { min: 120, max: 160 };
