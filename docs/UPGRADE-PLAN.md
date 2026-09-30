# Upgrade plan

## Current state: 8/10 (was 5/10)

Checklist shelf, runner, and search work end-to-end with tested parsing, real
MCP tools, clean type/lint, and CI; build no longer hides type errors.

## Backlog

### P0
- (none open)

### P1
- Confirm canonical domain; set `NEXT_PUBLIC_SITE_URL`.
- Refresh `PRODUCT.md` (its "Source README excerpt" still quotes
  create-next-app) with the real capabilities listed in README.
- Render the MDX body text (currently only frontmatter/items are shown);
  `next-mdx-remote` is installed but unused — use it or drop it.

### P2
- Export/print a completed run; share a run via URL hash.
- Remove unused deps (`lucide-react`, `@types/mdx`) after confirming.

## Done in this pass
- Pure, unit-tested checklist model (`lib/checklist.ts`): item parsing,
  priority defaults, search, ordering, slug validation, progress restore.
- Loader rejects non-kebab slugs (path traversal guard); `dynamicParams=false`.
- `next.config.ts`: removed `ignoreBuildErrors`, the unsupported `eslint`
  key, and the dev-only polling hack; fixed the type errors they hid
  (including an import of an uninstalled `@anthropic-ai/sdk`).
- Replaced sample-data `/api/mcp` with real checklist tools.
- Search on the route book; per-checklist metadata; sitemap with all
  checklists; storage failures no longer throw; stable list keys.
- CI (lint, typecheck, test, build); README rewritten.
