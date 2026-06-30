import catalog from "../../../public/catalog.json";

export type FaqItem = {
  q: string;
  a: string;
};

const soundCount = catalog.sounds.length;
const catalogVersion = catalog.version;

export const homepageFaqs: FaqItem[] = [
  {
    q: "What is Woven SFX?",
    a: "Woven SFX is an open-source sound effects registry built for AI agents. It ships a skills.sh installable skill, stdio MCP tools, and a browsable catalog of whooshes, pops, glitches, and other .wav files for video editing workflows.",
  },
  {
    q: "How do I install Woven SFX for my AI agent?",
    a: "Run: npx skills add woven-video/skills --skill add-sfx and choose your agent, or use --agent codex -y, --agent claude-code -y, or --agent cursor -y for a non-interactive install. Then add the woven-sfx-mcp server to your MCP config and pull sounds with scripts/pull-library.sh or on-demand via sfx_search and sfx_pull.",
  },
  {
    q: "What MCP tools does woven-sfx provide?",
    a: "Three tools: sfx_search (find sounds by normal words, id, or tag), sfx_pull (download a selected sound by id), and sfx_list_installed (list cached .wav files in your project library).",
  },
  {
    q: "Where are sound files stored locally?",
    a: "By default in ./sounds/sfx/ under your project root. Override with WOVEN_SFX_LIBRARY or an sfx-library path in .claude/project.md. The MCP server and pull script use the same resolution order.",
  },
  {
    q: "How many sounds are in the Woven SFX catalog?",
    a: `The catalog at https://www.woven.video/sfx/catalog.json currently lists ${soundCount} sounds (catalog v${catalogVersion}), including whooshes, camera shutters, glitches, dings, and impacts. New sounds are added to the open registry over time.`,
  },
  {
    q: "Is Woven SFX free?",
    a: "Yes. The skill, MCP server, and catalog are open source (MIT). Sound files are CC0. Install with npx skills add — no account required.",
  },
  {
    q: "What video editing workflows use woven-sfx?",
    a: "Agents search the catalog with normal words, choose a sound id, then pull the .wav into the project library. Before assembly or render, they verify cached files with sfx_list_installed and pull any missing ids.",
  },
];
