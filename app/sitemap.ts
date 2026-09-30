import type { MetadataRoute } from "next";
import { getAllChecklists } from "@/lib/mdx";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const checklists = await getAllChecklists();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/checklists`, changeFrequency: "weekly", priority: 0.8 },
    ...checklists.map((checklist) => ({ url: `${SITE_URL}/checklists/${checklist.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/more-projects`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
