export const MCP_SERVER = `{
  "command": "npx",
  "args": ["-y", "woven-sfx-mcp"]
}`;

export const MCP_CONFIG = `{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}`;

export const CODEX_TOML = `[mcp_servers.woven-sfx]
command = "npx"
args = ["-y", "woven-sfx-mcp"]`;

export type AgentId = "cursor" | "claude-code" | "codex" | "claude-desktop";

export type McpAgent = {
  id: AgentId;
  label: string;
  configPath: string;
  installCmd?: string;
  installNote?: string;
  pasteLabel: string;
  pasteText: string;
  pasteCopyLabel: string;
};

export const mcpAgents: readonly McpAgent[] = [
  {
    id: "cursor",
    label: "Cursor",
    configPath: "~/.cursor/mcp.json",
    pasteLabel: "Paste into mcp.json",
    pasteText: MCP_CONFIG,
    pasteCopyLabel: "MCP config",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    configPath: "~/.claude.json or .mcp.json",
    installCmd:
      "claude mcp add --transport stdio woven-sfx -- npx -y woven-sfx-mcp",
    installNote:
      "Add --scope project before woven-sfx to write .mcp.json for your team.",
    pasteLabel: "Or paste into .mcp.json",
    pasteText: MCP_CONFIG,
    pasteCopyLabel: "MCP config",
  },
  {
    id: "codex",
    label: "Codex",
    configPath: "~/.codex/config.toml",
    installCmd: "codex mcp add woven-sfx -- npx -y woven-sfx-mcp",
    pasteLabel: "Or add to config.toml",
    pasteText: CODEX_TOML,
    pasteCopyLabel: "Codex MCP config",
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    configPath: "Settings → Developer → MCP",
    pasteLabel: "Paste server block in MCP settings",
    pasteText: MCP_SERVER,
    pasteCopyLabel: "MCP server block",
  },
] as const;