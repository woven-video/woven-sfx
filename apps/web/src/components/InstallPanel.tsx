import { useState } from "react";

const INSTALL_CMD = "curl -fsSL https://sfx.woven.video/install.sh | bash";
const SKILL_CMD =
  "curl -fsSL https://sfx.woven.video/skill.md -o ~/.claude/skills/woven-sfx/SKILL.md";
const MCP_CONFIG = `{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}`;

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

      <div className="mt-4 space-y-2 text-sm text-stone-400">
        <p>
          <span className="text-stone-500">Skill</span>{" "}
          <code className="font-mono text-stone-300">
            ~/.claude/skills/woven-sfx/SKILL.md
          </code>
        </p>
        <p>
          <span className="text-stone-500">Library</span>{" "}
          <code className="font-mono text-stone-300">
            ~/.local/share/woven-sfx/library/
          </code>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-stone-800 px-3 py-2 text-left text-sm text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-300"
        aria-expanded={expanded}
      >
        <span>Manual MCP &amp; skill setup</span>
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
              Skill only
            </p>
            <div className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
              <code className="min-w-0 flex-1 break-all font-mono text-xs text-stone-300">
                {SKILL_CMD}
              </code>
              <CopyButton text={SKILL_CMD} label="skill command" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}