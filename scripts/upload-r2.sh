#!/usr/bin/env bash
# Upload sounds + peaks to Cloudflare R2. Requires: wrangler login, bucket woven-sfx.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUCKET="${WOVEN_SFX_R2_BUCKET:-woven-sfx}"

if ! command -v wrangler >/dev/null 2>&1; then
  WRANGLER="pnpm --dir $ROOT/apps/web exec wrangler"
else
  WRANGLER="wrangler"
fi

echo "Uploading to R2 bucket: $BUCKET"

for wav in "$ROOT"/sounds/*.wav; do
  name="$(basename "$wav")"
  echo "  sfx/$name"
  $WRANGLER r2 object put "$BUCKET/sfx/$name" --file="$wav" --remote
done

for peak in "$ROOT"/apps/web/public/peaks/*.json; do
  name="$(basename "$peak")"
  echo "  peaks/$name"
  $WRANGLER r2 object put "$BUCKET/peaks/$name" --file="$peak" --remote
done

echo "  catalog.json"
$WRANGLER r2 object put "$BUCKET/catalog.json" \
  --file="$ROOT/apps/web/public/catalog.json" --remote

echo ""
echo "✓ Upload complete. Ensure public access + custom domain sfx.woven.video on this bucket."