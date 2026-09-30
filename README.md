# Preflight — checklist route book

Personal checklists for launches, interviews, and content work. Each
checklist is an MDX file in `content/checklists/`; runs are tracked with
checkboxes and progress is saved in this browser only (`localStorage`).

## Features
- Route book with search across titles, categories, and individual checks.
- Checklist runner with progress bar, reset, and saved progress that is
  discarded automatically when the checklist's shape changes.
- Per-checklist title/description/canonical metadata; sitemap lists every
  checklist (`NEXT_PUBLIC_SITE_URL` overrides the origin).
- `/api/mcp` JSON-RPC tools: `list_checklists`, `get_checklist`,
  `search_checklists` (read-only, same content as the site).

## Adding a checklist
Create `content/checklists/<kebab-case-slug>.mdx`:

```yaml
---
title: "Release day"
category: "launch"
description: "What to check before shipping"
priority: "high"   # low | medium | high (defaults to medium)
items:
  - Before deploy
    - Changelog written
    - Backups verified
---
```

Sections can also be written in the body as `### Section` followed by `- item`.

## Run
```bash
npm ci
npm run dev
```

## Checks (same as CI)
```bash
npm run lint
npm run typecheck
npm test
npm run build
```
