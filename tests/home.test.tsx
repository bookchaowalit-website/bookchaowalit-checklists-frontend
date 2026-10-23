import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import ChecklistsPage from "@/app/checklists/page";
import ChecklistPage, { generateStaticParams } from "@/app/checklists/[slug]/page";
import { getAllChecklists } from "@/lib/mdx";

describe("pages render the real MDX shelf", () => {
  it("home lists every procedure from content/checklists and the local-progress notice", async () => {
    const checklists = await getAllChecklists();
    const html = renderToString(await Home());
    expect(html).toContain("Know the next move.");
    for (const checklist of checklists) expect(html).toContain(checklist.title);
    expect(html).toContain(`Open ${checklists[0].title}`);
    expect(html).toContain("progress stays in this browser");
  });

  it("the route book index renders and every slug has a static page", async () => {
    const html = renderToString(await ChecklistsPage());
    expect(html).toContain("The route book.");
    const params = await generateStaticParams();
    expect(params.map((param) => param.slug).sort()).toEqual(["content-creation", "job-interview", "project-launch"]);
  });

  it("a checklist page shows its phases and the not-a-certification notice", async () => {
    const html = renderToString(await ChecklistPage({ params: Promise.resolve({ slug: "job-interview" }) }));
    expect(html).toContain("Job Interview Preparation");
    expect(html).toContain("Pre-Interview Research");
    expect(html).toContain("Research the company and role");
    expect(html).toContain("It does not certify safety, readiness, or completion outside this browser.");
  });
});
