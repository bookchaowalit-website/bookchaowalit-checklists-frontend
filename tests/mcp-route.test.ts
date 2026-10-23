import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

const post = (body: unknown) =>
  POST(new Request("https://example.test/api/mcp", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));
const call = async (id: number, name: string, args: Record<string, unknown> = {}) =>
  (await post({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } })).json();
const textOf = (json: { result: { content: { text: string }[] } }) => JSON.parse(json.result.content[0].text);

describe("POST /api/mcp over the real MDX checklists", () => {
  it("lists the three tools and echoes the id", async () => {
    const json = await (await post({ jsonrpc: "2.0", id: "t", method: "tools/list" })).json();
    expect(json.id).toBe("t");
    expect(json.result.tools.map((tool: { name: string }) => tool.name)).toEqual(["list_checklists", "get_checklist", "search_checklists"]);
  });

  it("list_checklists returns every MDX file, high priority first", async () => {
    const list = textOf(await call(1, "list_checklists"));
    expect(list.map((item: { slug: string }) => item.slug).sort()).toEqual(["content-creation", "job-interview", "project-launch"]);
    expect(list.at(-1)).toMatchObject({ slug: "job-interview", priority: "medium" });
  });

  it("get_checklist returns phases with their checks; an unknown slug is an error", async () => {
    const checklist = textOf(await call(2, "get_checklist", { slug: "job-interview" }));
    expect(checklist.phases[0]).toMatchObject({ name: "Pre-Interview Research" });
    expect(checklist.phases[0].checks).toContain("Research the company and role");
    const missing = await call(3, "get_checklist", { slug: "../etc/passwd" });
    expect(missing.error ?? missing.result?.isError).toBeTruthy();
  });

  it("search_checklists matches individual checks", async () => {
    const hits = textOf(await call(4, "search_checklists", { query: "company values" }));
    expect(hits.map((item: { slug: string }) => item.slug)).toEqual(["job-interview"]);
  });

  it("rejects an unknown tool, bad JSON (400) and answers notifications with 202", async () => {
    expect((await call(5, "delete_all")).error).toBeDefined();
    const bad = await post("{");
    expect(bad.status).toBe(400);
    expect((await post({ jsonrpc: "2.0", method: "notifications/initialized" })).status).toBe(202);
  });
});
