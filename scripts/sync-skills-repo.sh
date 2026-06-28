#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_REPO="${WOVEN_SKILLS_REPO:-$ROOT/../woven-video-skills}"
SRC="$ROOT/skills/woven-sfx"
DEST="$SKILLS_REPO/skills/woven-sfx"

if [[ ! -d "$SKILLS_REPO/.git" ]]; then
  echo "Skills repo not found at $SKILLS_REPO"
  echo "Clone it: git clone https://github.com/woven-video/skills.git $SKILLS_REPO"
  exit 1
fi

mkdir -p "$DEST/scripts" "$DEST/references"
cp "$SRC/SKILL.md" "$DEST/SKILL.md"
cp "$SRC/scripts/pull-library.sh" "$DEST/scripts/pull-library.sh"
cp "$SRC/references/mcp-setup.md" "$DEST/references/mcp-setup.md"
cp "$SRC/references/pairings.md" "$DEST/references/pairings.md"
chmod +x "$DEST/scripts/pull-library.sh"

echo "Synced skill → $DEST"
echo "Next: cd $SKILLS_REPO && git add skills/woven-sfx README.md && git commit && git push"