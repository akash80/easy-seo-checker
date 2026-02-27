# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-27

### Added
- Core client-side SEO analysis: meta tags, headings, images, links, structured data, mobile viewport
- Extended analysis: keyword extraction, keyword density, content structure, URL slug quality, AI/GEO signals
- Scoring engine with configurable thresholds (0–100 score)
- React hook (`useSeoPageAnalysis`) with `runOnMount`, `loading`, `error`, and `reset()`
- `[data-seo-ignore]` attribute support to exclude elements from analysis (customizable via `ignoreSelector` option)
- Dual CJS/ESM build with full TypeScript declarations
- Comprehensive test suite (Vitest + happy-dom)
