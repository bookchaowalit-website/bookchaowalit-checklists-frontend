import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/site";

describe("robots and sitemap", () => {
  it("default to the live custom domain", () => {
    expect(SITE_URL).toBe("https://checklists.bookchaowalit.com");
  });

  it("robots.txt points at the sitemap on the same origin", () => {
    expect(robots()).toMatchObject({ sitemap: `${SITE_URL}/sitemap.xml` });
  });

  it("sitemap.xml lists the home page and every checklist page", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain(SITE_URL);
    for (const slug of ["content-creation", "job-interview", "project-launch"]) expect(urls).toContain(`${SITE_URL}/checklists/${slug}`);
  });
});
