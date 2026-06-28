import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";
import HowItWorksTimeline from "./HowItWorksTimeline";
import McpSetupGuide from "./McpSetupGuide";
import McpToolsList from "./McpToolsList";

const INSTALL_CMD =
  "npx skills add woven-video/skills --skill woven-sfx -g -y";
const PULL_CMD =
  "cd your-project && bash ~/.agents/skills/woven-sfx/scripts/pull-library.sh";
const CURL_INSTALL_CMD =
  "curl -fsSL https://sfx.woven.video/install.sh | bash";

type OpenPanel = "mcp" | "curl" | "how" | null;

const panelTitles: Record<Exclude<OpenPanel, null>, string> = {
  mcp: "MCP setup",
  curl: "Curl install",
  how: "How it works",
};

function StepBadge({ step }: { step: number }) {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-muted-foreground ring-1 ring-border"
      aria-hidden="true"
    >
      {step}
    </span>
  );
}

function CommandStrip({
  children,
  copyText,
  copyLabel,
  compact = false,
  className,
}: {
  children: ReactNode;
  copyText: string;
  copyLabel: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-muted/60 ring-1 ring-border/60",
        compact ? "px-3 py-2" : "px-4 py-3",
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

function DropdownTrigger({
  label,
  open,
  onClick,
  secondary = false,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors",
        secondary ? "text-xs" : "text-sm",
        open
          ? secondary
            ? "text-foreground"
            : "bg-muted text-foreground"
          : secondary
            ? "text-muted-foreground hover:text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {label}
      <ChevronDownIcon
        className={cn(
          "shrink-0 transition-transform",
          secondary ? "size-3" : "size-3.5",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

function InstallDropdownCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-muted/25 px-4 py-4 ring-1 ring-border/60 md:px-5">
      <p className="mb-4 text-sm font-medium text-foreground">{title}</p>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default function InstallPanel() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  function togglePanel(panel: Exclude<OpenPanel, null>) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <StepBadge step={1} />
        <CommandStrip
          copyText={INSTALL_CMD}
          copyLabel="install command"
          compact
          className="min-w-0 flex-1"
        >
          <code className="block font-mono text-[12px] leading-none whitespace-nowrap text-foreground">
            <span className="select-none text-muted-foreground">$ </span>
            {INSTALL_CMD}
          </code>
        </CommandStrip>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-2.5">
          <StepBadge step={2} />
          <DropdownTrigger
            label="MCP setup"
            open={openPanel === "mcp"}
            onClick={() => togglePanel("mcp")}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <DropdownTrigger
            label="Curl install"
            open={openPanel === "curl"}
            onClick={() => togglePanel("curl")}
            secondary
          />
          <span className="text-muted-foreground/40" aria-hidden="true">
            ·
          </span>
          <DropdownTrigger
            label="How it works"
            open={openPanel === "how"}
            onClick={() => togglePanel("how")}
            secondary
          />
        </div>
      </div>

      {openPanel ? (
        <InstallDropdownCard title={panelTitles[openPanel]}>
          {openPanel === "mcp" ? (
            <>
              <McpSetupGuide compact />

              <div className="flex flex-col gap-3 border-t border-border/60 pt-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Pull sound library (optional)
                </p>
                <CommandStrip
                  copyText={PULL_CMD}
                  copyLabel="pull library command"
                >
                  <code className="block font-mono text-xs leading-relaxed break-words text-foreground">
                    {PULL_CMD}
                  </code>
                </CommandStrip>
              </div>

              <McpToolsList compact />
            </>
          ) : null}

          {openPanel === "curl" ? (
            <div className="flex flex-col gap-3">
              <CommandStrip
                copyText={CURL_INSTALL_CMD}
                copyLabel="curl install command"
              >
                <code className="block font-mono text-xs leading-relaxed break-words text-foreground">
                  {CURL_INSTALL_CMD}
                </code>
              </CommandStrip>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Installs the skill and pulls sounds. Open MCP setup for step 2.
              </p>
            </div>
          ) : null}

          {openPanel === "how" ? <HowItWorksTimeline compact /> : null}
        </InstallDropdownCard>
      ) : null}
    </div>
  );
}