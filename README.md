# easy-seo-checker

[![CI](https://github.com/akash80/easy-seo-checker/actions/workflows/ci.yml/badge.svg)](https://github.com/akash80/easy-seo-checker/actions)
[![npm version](https://img.shields.io/npm/v/easy-seo-checker)](https://www.npmjs.com/package/easy-seo-checker)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/easy-seo-checker)](https://bundlephobia.com/package/easy-seo-checker)

Lightweight **client-side SEO analyzer for web pages**.  
Analyzes the rendered DOM, calculates an SEO score (0–100) with clear labels, and generates actionable suggestions — all directly in the browser with **zero runtime dependencies**.

## Features

- 📊 **SEO scoring (0–100)** with clear labels
- 🔍 **DOM analysis** for titles, meta tags, headings, images, links, and more
- 🧠 **Actionable SEO recommendations** you can surface in UIs
- ⚡ **Zero runtime dependencies**
- 🌐 **Browser-only** (runs after page render)
- ⚛️ Optional **React hook** (`easy-seo-checker/react`)
- 🎯 Ignore elements with `[data-seo-ignore]`
- 📦 Small bundle size

## Installation

```bash
npm install easy-seo-checker
```

That's it — the core library has **zero runtime dependencies** and works with any browser framework.

## Framework Compatibility

The core entry (`easy-seo-checker`) is **framework-agnostic**. It works anywhere the browser DOM is available:

| Framework | Supported | Entry point |
|-----------|-----------|-------------|
| Vanilla JS | Yes | `easy-seo-checker` |
| React | Yes | `easy-seo-checker` + optional `easy-seo-checker/react` hook |
| Angular | Yes | `easy-seo-checker` |
| Vue | Yes | `easy-seo-checker` |
| Svelte | Yes | `easy-seo-checker` |
| Next.js / Nuxt / Angular Universal | Client-side only | Call after mount, not during SSR |
| Node.js / Deno / Bun (server) | No | Requires browser DOM |

The optional **`easy-seo-checker/react`** sub-path provides a `useSeoPageAnalysis` hook for React projects. React is listed as an **optional** peer dependency — non-React projects won't install or download it.

## Quick Start

### Vanilla / any framework

Run the analyzer after the page has rendered:

```ts
import { getSeoPageAnalysis, getScoreLabel } from "easy-seo-checker";

const result = getSeoPageAnalysis(window.location.pathname);

console.log("Score:", result.score);
console.log("Label:", getScoreLabel(result.score));
console.log("Suggestions:", result.recommendations);
```

### With options

```ts
import { getSeoPageAnalysis } from "easy-seo-checker";

const result = getSeoPageAnalysis(window.location.pathname, {
  ignoreSelector: ".admin-panel, [data-seo-ignore]",
});
```

### Angular

```ts
import { Component, AfterViewInit } from "@angular/core";
import { getSeoPageAnalysis, getScoreLabel } from "easy-seo-checker";

@Component({ selector: "app-seo", template: `<p>Score: {{ result?.score }}</p>` })
export class SeoComponent implements AfterViewInit {
  result: ReturnType<typeof getSeoPageAnalysis> | null = null;

  ngAfterViewInit() {
    this.result = getSeoPageAnalysis(window.location.pathname);
  }
}
```

### Vue

```vue
<script setup>
import { ref, onMounted } from "vue";
import { getSeoPageAnalysis, getScoreLabel } from "easy-seo-checker";

const result = ref(null);
onMounted(() => {
  result.value = getSeoPageAnalysis(window.location.pathname);
});
</script>
<template>
  <p v-if="result">Score: {{ result.score }} – {{ getScoreLabel(result.score) }}</p>
</template>
```

### Svelte

```svelte
<script>
  import { onMount } from "svelte";
  import { getSeoPageAnalysis, getScoreLabel } from "easy-seo-checker";

  let result = null;
  onMount(() => {
    result = getSeoPageAnalysis(window.location.pathname);
  });
</script>

{#if result}
  <p>Score: {result.score} – {getScoreLabel(result.score)}</p>
{/if}
```

### React (optional hook)

```tsx
import { useEffect } from "react";
import { getScoreLabel } from "easy-seo-checker";
import { useSeoPageAnalysis } from "easy-seo-checker/react";

function SeoReviewPanel() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : null;
  const { result, run, reset, loading, error } = useSeoPageAnalysis(pathname, {
    runOnMount: false,
  });

  useEffect(() => {
    if (!pathname) return;
    run();
  }, [pathname, run]);

  if (loading) return <p>Analyzing…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!result) return <button onClick={run}>Run SEO analysis</button>;

  return (
    <div>
      <p>
        Score: {result.score} – {getScoreLabel(result.score)}
      </p>
      <ul>
        {result.recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <button onClick={reset}>Clear</button>
    </div>
  );
}
```

## Example Output

```js
{
  score: 82,
  label: "Good",
  recommendations: [
    "Meta description is missing",
    "Add alt text to 3 images",
    "Consider adding structured data (JSON-LD)"
  ]
}
```

## Browser Only

This package runs **only in the browser** because it relies on:

- `document`
- `window`
- `location`

Do **not run during SSR** (Next.js, Nuxt, etc.).  
Instead, run it **after the page mounts** (e.g. in `useEffect`, `onMounted`, `ngAfterViewInit`, `onMount`, etc.).

## Ignore Selector

Elements with the attribute `[data-seo-ignore]` are excluded from analysis by default. Add this attribute to admin UI, modals, or chatbots you want excluded:

```html
<div data-seo-ignore>
  <!-- This block is ignored by the analyzer -->
</div>
```

You can customize this via the `ignoreSelector` option or pass your own `ignoreSelector` when calling `getSeoPageAnalysis`.

## API

### Main entry (`easy-seo-checker`)

| Export | Description |
|--------|-------------|
| `getSeoPageAnalysis(pathname, options?)` | Full DOM analysis; returns `SeoPageAnalysisResult` |
| `getMainContentRoot(ignoreSelector?)` | First `main`, `article`, or `.content` outside ignored containers |
| `getPageParagraphs(ignoreSelector?)` | All `<p>` elements outside ignored containers |
| `calculateSeoScore(result)` | Score 0–100 from a `SeoAnalysisResult` |
| `generateSeoSuggestions(result)` | Suggestion strings from a `SeoAnalysisResult` |
| `getScoreColor(score)` | Hex color string (e.g. `"#16a34a"` for green) |
| `getScoreLabel(score)` | Label: `"Excellent"`, `"Good"`, `"Needs Improvement"`, or `"Poor"` |

#### Options

```ts
interface SeoAnalyzerOptions {
  /** CSS selector for elements to exclude. Default: "[data-seo-ignore]" */
  ignoreSelector?: string;
}
```

### React entry (`easy-seo-checker/react`)

| Export | Description |
|--------|-------------|
| `useSeoPageAnalysis(pathname, options?)` | Returns `{ result, run, reset, loading, error }` |

#### Hook Options

```ts
interface UseSeoPageAnalysisOptions extends SeoAnalyzerOptions {
  /** Run analysis once when pathname is set. Default: false */
  runOnMount?: boolean;
}
```

### Types

All types are exported from the main entry:

- `SeoAnalyzerOptions`
- `SeoAnalysisResult`
- `SeoPageAnalysisResult`
- `SeoPageImagesResult`
- `SeoPageKeywordsResult`
- `SeoPageAiSignalsResult`
- `SeoPageContentStructureResult`
- `SeoPageKeywordDensityResult`
- `SeoPageUrlSlugResult`

## Score Breakdown (100 points)

| Category | Points | Criteria |
|----------|--------|----------|
| Meta tags | 30 | Title present (10), title length 30–60 (5), description present (10), description length 120–160 (5) |
| Open Graph | 20 | `og:title` (5), `og:description` (5), `og:image` (5), `twitter:card` (5) |
| Headings | 20 | Single H1 (15) or multiple H1s (5), H2 present (5) |
| Images | 15 | Scaled by alt-text coverage; full marks if no images |
| Links | 10 | Internal links (5), external links (5) |
| Structured data | 5 | Valid JSON-LD present |

## Use Cases

- SEO audit tools
- CMS SEO panels
- Browser extensions
- Admin dashboards
- Static site SEO validation
- Content publishing workflows

## Performance

The analyzer scans the rendered DOM once and is designed to be lightweight.

Typical runtime: **<10 ms for most pages** (depends on page size and device).

## Browser Support

- Chrome
- Edge
- Firefox
- Safari

Requires modern DOM APIs.

## Demo

![SEO review panel demo](https://firebasestorage.googleapis.com/v0/b/rfid-softwares.firebasestorage.app/o/assets%2Fother%2Fseo_review.png?alt=media)

Example of how you might present the results in a panel:

```text
SEO Score: 82 (Good)

✔ Title tag present
✔ H1 found
⚠ Missing meta description
⚠ 3 images missing alt text
```

You can build your own UI on top of `SeoPageAnalysisResult` to match your product.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Watch mode
npm run build      # Production build
npm test           # Run tests
npm run lint       # Run linter
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

[MIT](./LICENSE) — Akash Arora
