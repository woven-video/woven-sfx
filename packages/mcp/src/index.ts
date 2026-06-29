import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {
  searchCatalog,
  pullSound,
  findSoundById,
  listInstalled,
} from "@woven-sfx/core";
import { loadCatalog } from "./catalog-loader.js";

const server = new McpServer({ name: "woven-sfx", version: "0.2.1" });

function textResult(obj: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }] };
}

server.registerTool(
  "sfx_search",
  {
    title: "Search sound effects",
    description:
      "Search Woven SFX directly by normal words, sound id, or tag. Call with no arguments to list all available sound effects. Use this first to find sounds such as beep, camera shutter, glitch, pop, impact, or whoosh.",
    inputSchema: z.object({
      query: z.string().optional(),
      tag: z.string().optional(),
      limit: z.number().int().positive().max(50).optional(),
    }),
  },
  async (input) => {
    const catalog = await loadCatalog();
    return textResult(searchCatalog(catalog, input));
  },
);

server.registerTool(
  "sfx_pull",
  {
    title: "Pull SFX to local library",
    description:
      "Download a sound by id to the project library (WOVEN_SFX_LIBRARY, project.md sfx-library, or ./sounds/sfx/)",
    inputSchema: z.object({ id: z.string() }),
  },
  async ({ id }) => {
    const catalog = await loadCatalog();
    const sound = findSoundById(catalog, id);
    if (!sound) return textResult({ error: `Unknown sound: ${id}` });
    const localPath = await pullSound(sound);
    return textResult({ id, localPath, file: sound.file });
  },
);

server.registerTool(
  "sfx_list_installed",
  {
    title: "List installed SFX",
    description: "List .wav files in the project sound library",
    inputSchema: z.object({}),
  },
  async () => textResult({ files: await listInstalled() }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("woven-sfx MCP running on stdio");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
