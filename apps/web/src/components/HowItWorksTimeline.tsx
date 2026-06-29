import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Install skill",
    description:
      "npx skills add woven-video/skills --skill add-sfx",
    code: false,
  },
  {
    title: "Add MCP server",
    description:
      "Paste config into Cursor, Claude Code, or Claude Desktop — required for sfx_* tools",
    code: false,
  },
  {
    title: "Agent searches sounds",
    description: 'sfx_search({ query: "fast whoosh" })',
    code: true,
  },
  {
    title: "Agent pulls a .wav",
    description: 'sfx_pull({ id: "fast-whoosh" })',
    code: true,
  },
  {
    title: "File lands locally",
    description: "./sounds/sfx/ (or your sfx-library path)",
    code: true,
  },
] as const;

const paths = [
  { label: "Skill", value: "./.agents/skills/add-sfx/" },
  { label: "MCP", value: "woven-sfx-mcp" },
  { label: "Sounds", value: "./sounds/sfx/" },
] as const;

export default function HowItWorksTimeline({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-col gap-4">
        <ul className="space-y-3">
          {steps.map((step) => (
            <li key={step.title} className="min-w-0">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              {step.code ? (
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {step.description}
                </p>
              ) : (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              )}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-[3.25rem_1fr] gap-x-3 gap-y-1.5 border-t border-border/60 pt-4 text-xs">
          {paths.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="font-mono text-foreground">{item.value}</dd>
            </div>
          ))}
          <dt className="text-muted-foreground">Registry</dt>
          <dd>
            <a
              href="https://www.skills.sh/woven-video/skills/add-sfx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              skills.sh
            </a>
          </dd>
        </dl>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ol className="relative space-y-5">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4">
            {index < steps.length - 1 ? (
              <span
                className="absolute top-8 left-[11px] h-[calc(100%+0.25rem)] w-px bg-border"
                aria-hidden="true"
              />
            ) : null}

            <span
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-muted-foreground ring-1 ring-border",
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>

            <div className="min-w-0 pt-0.5 pb-0.5">
              <h3 className="text-sm font-medium text-foreground">
                {step.title}
              </h3>
              {step.code ? (
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {step.description}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-border/60 pt-4">
        <dl className="grid grid-cols-[3.25rem_1fr] gap-x-3 gap-y-2 text-sm">
          {paths.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="font-mono text-foreground">{item.value}</dd>
            </div>
          ))}
          <dt className="text-muted-foreground">Registry</dt>
          <dd>
            <a
              href="https://www.skills.sh/woven-video/skills/add-sfx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              skills.sh
            </a>
          </dd>
        </dl>
      </div>
    </div>
  );
}
