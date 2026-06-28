#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {
  searchCatalog,
  resolveForTransition,
  pullSound,
  findSoundById,
  listInstalled,
} from "@woven-sfx/core";
import { loadCatalog } from "./catalog-loader.js";

const server = new McpServer({ name: "woven-sfx", version: "0.1.0" });

function textResult(obj: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }] };
}

server.registerTool(
  "sfx_search",
  {
    title: "Search SFX catalog",
    description: "Search Woven SFX by tag, transition pairing, or query string",
    inputSchema: z.object({
      tag: z.string().optional(),
      transition: z.string().optional(),
      query: z.string().optional(),
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
    description: "Download a sound by id to ~/.local/share/woven-sfx/library/",
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
  "sfx_resolve",
  {
    title: "Resolve SFX for transition",
    description: "Resolve and download the best SFX for a video transition type",
    inputSchema: z.object({
      transition: z.string(),
      moment: z.string().optional(),
    }),
  },
  async ({ transition }) => {
    const catalog = await loadCatalog();
    const resolved = resolveForTransition(catalog, transition);
    if (!resolved) {
      return textResult({
        error: `No default SFX for transition: ${transition}`,
        suggestions: searchCatalog(catalog, { transition }),
      });
    }
    const sound = findSoundById(catalog, resolved.id)!;
    const localPath = await pullSound(sound);
    return textResult({ ...resolved, localPath });
  },
);

server.registerTool(
  "sfx_list_installed",
  {
    title: "List installed SFX",
    description: "List .wav files in the local Woven SFX library",
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