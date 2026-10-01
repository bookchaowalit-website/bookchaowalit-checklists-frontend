/**
 * Pure checklist model: frontmatter normalisation, search, and ordering.
 * Kept free of fs/Next imports so it can be unit-tested and reused by the
 * MCP route.
 */

export type Priority = "low" | "medium" | "high";

export interface Checklist {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  priority: Priority;
  /** Each section is [sectionTitle, ...items]. */
  items: string[][];
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

function asText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizePriority(value: unknown): Priority {
  return value === "low" || value === "medium" || value === "high" ? value : "medium";
}

/**
 * Frontmatter `items` is written as an indented list, which YAML folds into
 * "Section - item - item" strings. Split those back into sections; fall back to
 * `### Section` + `- item` markdown in the body.
 */
export function normalizeItems(value: unknown, body: string): string[][] {
  if (Array.isArray(value)) {
    const sections = value
      .map((section) => {
        if (Array.isArray(section)) return section.map(String).map((item) => item.trim()).filter(Boolean);
        if (typeof section === "string") return section.split(/\s+-\s+/).map((item) => item.trim()).filter(Boolean);
        return [];
      })
      .filter((section) => section.length > 0);
    if (sections.length > 0) return sections;
  }
  return parseMarkdownItems(body);
}

export function parseMarkdownItems(body: string): string[][] {
  const result: string[][] = [];
  let current: string[] | null = null;
  for (const line of body.split(/\r\n|\r|\n|\u2028|\u2029/)) {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      current = [heading[1]];
      result.push(current);
      continue;
    }
    const item = line.match(/^\s*[-*]\s+(.+?)\s*$/);
    if (item) {
      if (!current) {
        current = [""];
        result.push(current);
      }
      current.push(item[1]);
    }
  }
  return result.filter((section) => section.length > 1);
}

export function buildChecklist(slug: string, data: Record<string, unknown>, body: string): Checklist {
  return {
    id: slug,
    slug,
    title: asText(data.title, slug),
    category: asText(data.category, "general"),
    description: asText(data.description, ""),
    priority: normalizePriority(data.priority),
    items: normalizeItems(data.items, body),
  };
}

export function countChecks(checklist: Pick<Checklist, "items">): number {
  return checklist.items.reduce((total, section) => total + Math.max(section.length - 1, 0), 0);
}

export function sortByPriority(checklists: readonly Checklist[]): Checklist[] {
  return [...checklists].sort(
    (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority] || a.title.localeCompare(b.title),
  );
}

export function searchChecklists(checklists: readonly Checklist[], query: string): Checklist[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...checklists];
  return checklists.filter(
    (checklist) =>
      checklist.title.toLowerCase().includes(needle) ||
      checklist.category.toLowerCase().includes(needle) ||
      checklist.description.toLowerCase().includes(needle) ||
      checklist.items.some((section) => section.some((item) => item.toLowerCase().includes(needle))),
  );
}

/** Restore saved progress only when its shape matches the current checklist. */
export function restoreProgress(saved: unknown, sectionSizes: readonly number[]): boolean[][] | null {
  if (!Array.isArray(saved) || saved.length !== sectionSizes.length) return null;
  const valid = saved.every(
    (row, index) =>
      Array.isArray(row) && row.length === sectionSizes[index] && row.every((value) => typeof value === "boolean"),
  );
  return valid ? (saved as boolean[][]) : null;
}

/**
 * Whole-number completion percentage that never overstates or understates the
 * run: 199 of 200 shows 99% (not a rounded-up 100% while one check is still
 * open) and 1 of 300 shows 1% (not 0% after work has started).
 */
export function progressPercent(complete: number, total: number): number {
  if (!Number.isFinite(complete) || !Number.isFinite(total) || total <= 0 || complete <= 0) return 0;
  if (complete >= total) return 100;
  return Math.min(99, Math.max(1, Math.floor((complete / total) * 100)));
}

/** "1 of 1 check clear" / "3 of 5 checks clear". */
export function checksLabel(complete: number, total: number): string {
  return `${complete} of ${total} ${total === 1 ? "check" : "checks"} clear`;
}
