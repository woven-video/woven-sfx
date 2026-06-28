const steps = [
  {
    title: "Install skill",
    description:
      "npx skills add woven-video/skills --skill woven-sfx — agent gets woven-sfx workflow",
  },
  {
    title: "Agent resolves a sound",
    description: 'sfx_resolve({ transition: "pull-in" })',
    code: true,
  },
  {
    title: "File lands locally",
    description: "Sound file cached in ./sounds/sfx/",
    code: true,
  },
] as const;

export default function HowItWorksTimeline() {
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
              className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-muted-foreground ring-1 ring-border"
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
          <dt className="text-muted-foreground">Skill</dt>
          <dd className="font-mono text-foreground">
            ~/.agents/skills/woven-sfx/
          </dd>
          <dt className="text-muted-foreground">Sounds</dt>
          <dd className="font-mono text-foreground">./sounds/sfx/</dd>
        </dl>
      </div>
    </div>
  );
}