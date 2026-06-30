#!/usr/bin/env bash
set -euo pipefail

SKILL_SOURCE="woven-video/skills"
SKILL_NAME="add-sfx"
AGENT="${WOVEN_SFX_AGENT:-}"

if [[ -z "$AGENT" ]]; then
  if [[ -r /dev/tty && -w /dev/tty ]]; then
    cat >/dev/tty <<'EOF'
Install add-sfx for:
  1) Codex
  2) Claude Code
  3) Cursor
EOF
    printf "Select agent [1]: " >/dev/tty
    read -r CHOICE </dev/tty || CHOICE=""
    case "$CHOICE" in
      2) AGENT="claude-code" ;;
      3) AGENT="cursor" ;;
      *) AGENT="codex" ;;
    esac
  else
    AGENT="codex"
    echo "No TTY detected; defaulting to Codex. Set WOVEN_SFX_AGENT=claude-code or cursor to override."
  fi
fi

echo "Installing add-sfx skill for ${AGENT} via skills CLI..."
npx skills add "$SKILL_SOURCE" --skill "$SKILL_NAME" --agent "$AGENT" -y < /dev/null

SKILL_DIR="${PWD}/.agents/skills/add-sfx"
PULL_SCRIPT="${SKILL_DIR}/scripts/pull-library.sh"

echo ""
echo "Pulling sounds into project library (run from your project root)..."
if [[ -x "$PULL_SCRIPT" ]]; then
  bash "$PULL_SCRIPT"
else
  echo "Pull script not found at $PULL_SCRIPT — run it manually after cd'ing to your project."
fi

cat <<'EOF'

✓ add-sfx skill installed (Woven SFX)

Installed to ./.agents/skills/add-sfx. For another agent, run one of:

  Codex:       npx skills add woven-video/skills --skill add-sfx --agent codex -y
  Claude Code: npx skills add woven-video/skills --skill add-sfx --agent claude-code -y
  Cursor:      npx skills add woven-video/skills --skill add-sfx --agent cursor -y

Next: add the MCP server (required for sfx_* tools)

  Cursor:         ~/.cursor/mcp.json
  Claude Code:    .mcp.json in your project
  Claude Desktop: Settings → Developer → MCP

{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}

Merge into existing mcpServers if needed. Restart your agent.

Full paths: ./.agents/skills/add-sfx/references/mcp-setup.md
Catalog:    https://www.woven.video/sfx/catalog.json
EOF
