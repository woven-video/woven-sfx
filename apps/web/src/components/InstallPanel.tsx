import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";
import HowItWorksTimeline from "./HowItWorksTimeline";
import McpToolsList from "./McpToolsList";

const INSTALL_CMD =
  "npx skills add woven-video/skills --skill woven-sfx -g -y";
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

function CommandStrip({
  children,
  copyText,
  copyLabel,
  className,
}: {
  children: ReactNode;
  copyText: string;
  copyLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 ring-1 ring-border/60",
        className,
      )}
    >
      <div className="min-w-0 flex-1 overflow-x-auto">{children}</div>
      <CopyButton
        text={copyText}
        label={copyLabel}
        variant="icon"
        className="shrink-0 text-muted-foreground"
      />
    </div>
  );
}

function SectionTrigger({
  label,
  open,
  muted = false,
  onClick,
}: {
  label: string;
  open: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 text-sm transition-colors",
        muted
          ? "text-muted-foreground/80 hover:text-muted-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <ChevronDownIcon
        className={cn(
          "size-4 shrink-0 transition-transform",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

export default function InstallPanel() {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [mcpOpen, setMcpOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <CommandStrip copyText={INSTALL_CMD} copyLabel="install command">
        <code className="block font-mono text-[13px] leading-none whitespace-nowrap text-foreground">
          <span className="select-none text-muted-foreground">$ </span>
          {INSTALL_CMD}
        </code>
      </CommandStrip>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <SectionTrigger
          label="How it works"
          open={howItWorksOpen}
          onClick={() => setHowItWorksOpen((open) => !open)}
        />
        <SectionTrigger
          label="MCP & sound library"
          open={mcpOpen}
          onClick={() => setMcpOpen((open) => !open)}
        />
        <SectionTrigger
          label="Advanced: curl install"
          open={advancedOpen}
          muted
          onClick={() => setAdvancedOpen((open) => !open)}
        />
      </div>

      {howItWorksOpen || mcpOpen || advancedOpen ? (
        <div className="flex flex-col gap-4">
          {howItWorksOpen ? (
            <Collapsible open onOpenChange={setHowItWorksOpen}>
              <CollapsibleContent>
                <HowItWorksTimeline />
              </CollapsibleContent>
            </Collapsible>
          ) : null}

          {mcpOpen ? (
            <Collapsible open onOpenChange={setMcpOpen}>
              <CollapsibleContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    MCP config
                  </p>
                  <CommandStrip copyText={MCP_CONFIG} copyLabel="MCP config">
                    <pre className="font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-foreground">
                      {MCP_CONFIG}
                    </pre>
                  </CommandStrip>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Pull sound library
                  </p>
                  <CommandStrip
                    copyText={PULL_CMD}
                    copyLabel="pull library command"
                  >
                    <code className="block font-mono text-xs leading-relaxed break-words text-foreground">
                      {PULL_CMD}
                    </code>
                  </CommandStrip>
                  <p className="text-xs text-muted-foreground">
                    Or let MCP pull on demand via{" "}
                    <code className="font-mono">sfx_pull</code> /{" "}
                    <code className="font-mono">sfx_resolve</code>. Override
                    the folder with{" "}
                    <code className="font-mono">WOVEN_SFX_LIBRARY</code>.
                  </p>
                </div>

                <McpToolsList />
              </CollapsibleContent>
            </Collapsible>
          ) : null}

          {advancedOpen ? (
            <Collapsible open onOpenChange={setAdvancedOpen}>
              <CollapsibleContent>
                <CommandStrip
                  copyText={CURL_INSTALL_CMD}
                  copyLabel="curl install command"
                >
                  <code className="block font-mono text-xs leading-relaxed break-words text-muted-foreground">
                    {CURL_INSTALL_CMD}
                  </code>
                </CommandStrip>
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}