import { useState } from "react";

const INSTALL_CMD =
  "npx skills add woven-video/woven-sfx --skill woven-sfx -g -y";
const PULL_CMD =
  "cd your-project && bash ~/.agents/skills/woven-sfx/scripts/pull-library.sh";
const CURL_INSTALL_CMD =
  "curl -fsSL https://sfx.woven.video/install.sh | bash";
const MCP_CONFIG = `{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}`;

const SUMMARY = [
  "35 CC0 sounds for video edits — whooshes, pops, glitches, UI ticks",
  "MCP tools to search, resolve transition pairings, and pull .wav files locally",
  "Workflow hooks for /edit-plan (SFX placement) and /assemble (cache verify)",
];

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-600 hover:bg-stone-800 hover:text-stone-200"
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function InstallPanel() {
  const [expanded, setExpanded] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 sm:p-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">
        Install
      </p>

      <div className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
        <code className="min-w-0 flex-1 break-all font-mono text-sm text-stone-200">
          {INSTALL_CMD}
        </code>
        <CopyButton text={INSTALL_CMD} label="install command" />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">
          Summary
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-stone-400">
          {SUMMARY.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-stone-600" aria-hidden="true">
                ·
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 space-y-2 text-sm text-stone-400">
        <p>
          <span className="text-stone-500">Skill</span>{" "}
          <code className="font-mono text-stone-300">
            ~/.agents/skills/woven-sfx/
          </code>
        </p>
        <p>
          <span className="text-stone-500">Sounds</span>{" "}
          <code className="font-mono text-stone-300">
            ./sounds/sfx/
          </code>
          <span className="text-stone-500"> or </span>
          <code className="font-mono text-stone-300">
            project.md sfx-library
          </code>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-stone-800 px-3 py-2 text-left text-sm text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-300"
        aria-expanded={expanded}
      >
        <span>Also setup MCP &amp; sounds</span>
        <span className="text-stone-500" aria-hidden="true">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded ? (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
              MCP config
            </p>
            <div className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
              <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-stone-300">
                {MCP_CONFIG}
              </pre>
              <CopyButton text={MCP_CONFIG} label="MCP config" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
              Pull sound library
            </p>
            <div className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-stone-300">
                {PULL_CMD}
              </code>
              <CopyButton text={PULL_CMD} label="pull library command" />
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Or let MCP pull on demand via{" "}
              <code className="font-mono text-stone-400">sfx_pull</code> /{" "}
              <code className="font-mono text-stone-400">sfx_resolve</code>.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAdvanced((value) => !value)}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg border border-stone-800/60 px-3 py-2 text-left text-sm text-stone-500 transition-colors hover:border-stone-800 hover:text-stone-400"
        aria-expanded={advanced}
      >
        <span>Advanced: curl install</span>
        <span aria-hidden="true">{advanced ? "−" : "+"}</span>
      </button>

      {advanced ? (
        <div className="mt-3 flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
          <code className="min-w-0 flex-1 break-all font-mono text-xs text-stone-400">
            {CURL_INSTALL_CMD}
          </code>
          <CopyButton text={CURL_INSTALL_CMD} label="curl install command" />
        </div>
      ) : null}
    </div>
  );
}