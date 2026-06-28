import * as esbuild from "esbuild";
import { chmodSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = join(root, "dist/bundle.js");

await esbuild.build({
  entryPoints: [join(root, "src/index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile,
  external: ["@modelcontextprotocol/server", "zod"],
  banner: { js: "#!/usr/bin/env node" },
});

chmodSync(outfile, 0o755);
copyFileSync(join(root, "catalog.json"), join(root, "dist/catalog.json"));
console.error(`Bundled → ${outfile}`);