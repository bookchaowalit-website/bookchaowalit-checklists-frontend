import { getAllChecklists, getChecklistBySlug, searchChecklists } from "@/lib/mdx";
import { countChecks } from "@/lib/checklist";
import type { Checklist } from "@/lib/checklist";
import { ToolInputError, requireString, respondToMcpRequest } from "@/lib/mcp";
import type { McpTool } from "@/lib/mcp";

const SERVER = { name: "bookchaowalit-checklists", version: "0.2.0" };

function summary(checklist: Checklist) {
  const { slug, title, category, description, priority } = checklist;
  return { slug, title, category, description, priority, checks: countChecks(checklist) };
}

const TOOLS: McpTool[] = [
  {
    name: "list_checklists",
    description: "List every checklist on the shelf, highest priority first.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => (await getAllChecklists()).map(summary),
  },
  {
    name: "get_checklist",
    description: "Get one checklist with its phases and checks by slug (e.g. job-interview).",
    inputSchema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] },
    handler: async (args) => {
      const checklist = await getChecklistBySlug(requireString(args, "slug"));
      if (!checklist) throw new ToolInputError("No checklist with that slug.");
      return {
        ...summary(checklist),
        phases: checklist.items.map(([name, ...checks]) => ({ name, checks })),
      };
    },
  },
  {
    name: "search_checklists",
    description: "Search checklist titles, categories, descriptions, and individual checks.",
    inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    handler: async (args) => (await searchChecklists(requireString(args, "query"))).map(summary),
  },
];

export async function POST(request: Request) {
  return respondToMcpRequest(request, SERVER, TOOLS);
}
