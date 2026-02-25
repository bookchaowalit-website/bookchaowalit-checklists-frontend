import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  items: string[][];
  slug: string;
  created_at: string;
}

export async function getAllChecklists() {
  const contentDir = path.join(process.cwd(), 'content', 'checklists');
  const files = await fs.readdir(contentDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const checklists = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        ...data,
        id: file.replace('.mdx', ''),
        items: parseItems(fileContent),
        slug: file.replace('.mdx', ''),
        created_at: new Date().toISOString()
      } as ChecklistItem;
    })
  );

  return checklists.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export async function getChecklistBySlug(slug: string) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'checklists');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      ...data,
      id: slug,
      items: parseItems(fileContent),
      slug,
      created_at: new Date().toISOString(),
      content
    } as ChecklistItem;
  } catch (error) {
    return null;
  }
}

export async function searchChecklists(query: string) {
  const checklists = await getAllChecklists();
  const lowercaseQuery = query.toLowerCase();

  return checklists.filter(checklist =>
    checklist.title.toLowerCase().includes(lowercaseQuery) ||
    checklist.category.toLowerCase().includes(lowercaseQuery) ||
    checklist.description.toLowerCase().includes(lowercaseQuery) ||
    checklist.items.some(section =>
      section.some(item => item.toLowerCase().includes(lowercaseQuery))
    )
  );
}

function parseItems(content: string): string[][] {
  const itemsMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  if (!itemsMatch) return [];

  const itemsSection = itemsMatch[1];
  const sectionMatches = itemsSection.match(/^### ([^\n]+)/gm);

  if (!sectionMatches) {
    const singleMatch = itemsSection.match(/^[\s]*- (.+)$/gm);
    return singleMatch ? [['', ...singleMatch.map(item => item.replace(/^[\s]*- /, ''))]] : [];
  }

  const result: string[][] = [];
  sections:
  for (const section of sectionMatches) {
    const sectionName = section.replace(/^### /, '');
    result.push([sectionName]);

    const sectionContent = itemsSection.substring(itemsSection.indexOf(section) + section.length);
    const nextSectionMatch = sectionMatches.slice(sectionMatches.indexOf(section) + 1).find(s => s.startsWith('### '));
    const sectionEnd = nextSectionMatch ? itemsSection.indexOf(nextSectionMatch) : itemsSection.length;
    const sectionText = sectionContent.substring(0, sectionEnd - itemsSection.indexOf(section)).trim();

    const itemMatches = sectionText.match(/^[\s]*- (.+)$/gm);
    if (itemMatches) {
      result[result.length - 1].push(...itemMatches.map(item => item.replace(/^[\s]*- /, '')));
    }
  }

  return result;
}