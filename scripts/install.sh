#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="${HOME}/.claude/skills/woven-sfx"
LIB_DIR="${HOME}/.local/share/woven-sfx/library"
CDN="${SFX_CDN_BASE:-https://sfx.woven.video}"
REPO_RAW="${SFX_INSTALL_RAW:-https://sfx.woven.video}"

mkdir -p "$SKILL_DIR" "$LIB_DIR"

curl -fsSL "$REPO_RAW/skill.md" -o "$SKILL_DIR/SKILL.md"

echo "Installed skill → $SKILL_DIR"

# Download catalog and pull each sound
CATALOG=$(curl -fsSL "$CDN/catalog.json")
node -e "
const fs=require('fs');const path=require('path');const https=require('https');const http=require('http');
const catalog=JSON.parse(process.argv[1]);const lib=process.argv[2];
async function dl(url, dest) {
  if (fs.existsSync(dest)) return;
  await new Promise((res,rej)=>{(url.startsWith('https')?https:http).get(url,r=>{const d=[];r.on('data',c=>d.push(c));r.on('end',()=>{fs.writeFileSync(dest,Buffer.concat(d));res();});}).on('error',rej);});
}
(async()=>{for(const s of catalog.sounds){await dl(s.url, path.join(lib,s.file));console.log('  '+s.id);}})();
" "$CATALOG" "$LIB_DIR"

cat <<EOF

✓ Woven SFX installed

  Skill:   $SKILL_DIR
  Sounds:  $LIB_DIR

Add MCP to ~/.cursor/mcp.json (or Claude Desktop config):

{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}

Catalog: $CDN/catalog.json
EOF