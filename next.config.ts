import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MCP route reads checklist MDX at request time; ship the files with it.
  outputFileTracingIncludes: {
    "/api/mcp": ["./content/checklists/**/*"],
  },
};

export default nextConfig;
