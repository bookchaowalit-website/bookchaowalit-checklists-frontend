import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { buildChecklist, isValidSlug, searchChecklists as searchIn, sortByPriority } from "./checklist";
import type { Checklist } from "./checklist";

export type { Checklist, Checklist as ChecklistItem } from "./checklist";

const CONTENT_DIR = path.join(process.cwd(), "content", "checklists");

async function readChecklist(slug: string): Promise<Checklist> {
  const source = await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(source);
  return buildChecklist(slug, data, content);
}

export async function getAllChecklists(): Promise<Checklist[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const slugs = files.filter((file) => file.endsWith(".mdx")).map((file) => file.slice(0, -4)).filter(isValidSlug);
  return sortByPriority(await Promise.all(slugs.map(readChecklist)));
}

export async function getChecklistBySlug(slug: string): Promise<Checklist | null> {
  if (!isValidSlug(slug)) return null;
  try {
    return await readChecklist(slug);
  } catch {
    return null;
  }
}

export async function searchChecklists(query: string): Promise<Checklist[]> {
  return searchIn(await getAllChecklists(), query);
}
