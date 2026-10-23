# Checklists (Preflight desk)

A small shelf of three fixed checklists (content creation, project launch, job interview) written as MDX files in
`content/checklists/`. Open one, tick its checks phase by phase and watch the progress meter; progress is saved per
checklist in this browser's `localStorage`. The route book index searches titles, categories and single checks.

Live: https://checklists.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does

- `/` lists the procedures by priority; `/checklists` searches them; `/checklists/<slug>` runs one.
- The runner restores saved ticks only if they still fit the checklist's phases, never shows 100% with open checks,
  and has a reset.
- `/api/mcp` JSON-RPC tools read the same MDX: `list_checklists`, `get_checklist`, `search_checklists`.

## What it does not do

- No creating, editing, duplicating, reordering or sharing checklists; no subtasks, account or sync.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: MDX parsing and progress rules, MCP handler + route, pages, robots/sitemap, Sentry
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin. Defaults to `https://checklists.bookchaowalit.com`.
- `NEXT_PUBLIC_SENTRY_DSN` (optional): turns on error reporting; unset means Sentry is off.

## Code map

- `content/checklists/*.mdx`: the three checklists (front matter + phases).
- `lib/checklist.ts`: parsing, priority sort, search, progress restore and labels; `lib/mdx.ts` reads the files.
- `components/checklist-ui.tsx`: cards, the searchable index and the tick runner (`localStorage`).
- `lib/mcp.ts` + `app/api/mcp/route.ts`: JSON-RPC endpoint over the same MDX.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped.
- `app/more-projects/page.tsx`: portfolio link page (copied per repository, not a package).
