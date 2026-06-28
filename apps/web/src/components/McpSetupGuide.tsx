import { useState } from "react";

import { mcpAgents, type AgentId } from "@/lib/mcp-agents";
import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";
import SetupTabs from "./SetupTabs";

function CommandStrip({
  text,
  copyLabel,
}: {
  text: string;
  copyLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 ring-1 ring-border/60">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed break-words text-foreground">
        <span className="select-none text-muted-foreground">$ </span>
        {text}
      </code>
      <CopyButton
        text={text}
        label={copyLabel}
        variant="icon"
        className="shrink-0 text-muted-foreground"
      />
    </div>
  );
}

export default function McpSetupGuide({ compact = false }: { compact?: boolean }) {
  const [agent, setAgent] = useState<AgentId>("claude-code");
  const active = mcpAgents.find((item) => item.id === agent) ?? mcpAgents[0];

  return (
    <div className={cn("flex flex-col", compact ? "gap-4" : "gap-5")}>
      <SetupTabs
        tabs={mcpAgents.map((item) => ({ id: item.id, label: item.label }))}
        value={agent}
        onChange={setAgent}
        aria-label="MCP agent setup"
      />

      <div role="tabpanel" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {!compact ? (
            <p className="text-sm text-muted-foreground">
              Restart {active.label} after setup. Confirm{" "}
              <code className="font-mono">sfx_*</code> tools appear.
            </p>
          ) : null}
          <code className="font-mono text-xs text-muted-foreground">
            {active.configPath}
          </code>
        </div>

        {active.installCmd ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              One-click install
            </p>
            <CommandStrip
              text={active.installCmd}
              copyLabel={`${active.label} install command`}
            />
            {active.installNote ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {active.installNote}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-medium text-muted-foreground">
            {active.pasteLabel}
          </p>
          <div className="flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 ring-1 ring-border/60">
            <pre className="min-w-0 flex-1 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-foreground">
              {active.pasteText}
            </pre>
            <CopyButton
              text={active.pasteText}
              label={active.pasteCopyLabel}
              variant="icon"
              className="shrink-0 text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}