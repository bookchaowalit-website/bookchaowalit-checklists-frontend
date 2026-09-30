# Upgrade plan

## Current state: 8/10 (was 5/10)

Checklist shelf, runner, and search work end-to-end with tested parsing, real
MCP tools, clean type/lint, and CI; build no longer hides type errors.

## Backlog

### P0
- (none open)

### P1
- Confirm canonical domain; set `NEXT_PUBLIC_SITE_URL`.
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

## Done in this pass (pass 2)
- `PRODUCT.md`: dropped the broken create-next-app "Source README excerpt" (its open code fence swallowed the rest of the brief); points to README/CI checks instead.

## Done in this pass (pass 3)
- Edge-case pass on `lib/checklist.ts` (regression tests in `tests/checklist.test.ts`):
  - The run readout used `Math.round`, so 199 of 200 checks showed **100%**
    while one check was still open (and 1 of 300 showed 0%). New
    `progressPercent` only reads 100% when every check is clear.
  - Markdown bodies saved with lone CR or U+2028/U+2029 line endings parsed
    as one line with zero items.
  - "1 of 1 checks clear" -> "1 of 1 check clear" (`checksLabel`).
- Backlog (P2): saved progress is restored when only the section sizes match;
  editing an item's text keeps its old tick. Key progress by item text/hash.
