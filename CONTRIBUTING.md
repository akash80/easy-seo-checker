# Contributing to easy-seo-checker

Thank you for your interest in contributing! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/akash80/all-social-media-api.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feat/my-feature`

## Development

```bash
npm run dev      # Watch mode (rebuild on change)
npm run build    # Production build
npm test         # Run tests
npm run lint     # Run linter
```

## Project Structure

```
src/
  constants.ts       Shared constants (stopwords, defaults)
  utils.ts           Shared utility functions
  types.ts           All TypeScript interfaces/types
  checks/            Individual analysis modules
    meta.ts          Meta tag analysis
    headings.ts      Heading structure analysis
    images.ts        Image SEO analysis
    links.ts         Link analysis
    structured-data.ts  JSON-LD / schema analysis
    keywords.ts      Keyword extraction
    content.ts       Content structure & keyword density
    url.ts           URL slug & HTTPS checks
    mobile.ts        Mobile-friendliness check
    ai-signals.ts    AI engine optimization signals
  analyzer.ts        Orchestrator — runs all checks
  scoring.ts         Score calculation & suggestions
  index.ts           Main barrel export
  react.ts           React hook
  __tests__/         Test files
```

## Guidelines

- **Browser-only**: This library runs in the browser. Do not add Node.js dependencies.
- **Zero runtime dependencies**: Keep the bundle small. Dev dependencies only.
- **Tests**: Add tests for new features. Run `npm test` before submitting.
- **Types**: Export all public types from `src/types.ts`.
- **Backwards compatibility**: Do not remove or rename existing exported fields/functions without a major version bump.

## Pull Requests

1. Keep PRs focused — one feature or fix per PR.
2. Update tests and documentation if applicable.
3. Run `npm run lint && npm test && npm run build` before submitting.
4. Write a clear PR description explaining *what* and *why*.

## Reporting Issues

- Use GitHub Issues.
- Include browser, framework, and library version.
- Provide a minimal reproduction if possible.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
