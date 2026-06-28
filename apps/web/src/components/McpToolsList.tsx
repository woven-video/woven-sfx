import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const tools = [
  {
    name: "sfx_search",
    input: "{ tag?, transition?, query? }",
    description: "Search the catalog by tag, transition pairing, or query string.",
  },
  {
    name: "sfx_pull",
    input: "{ id }",
    description: "Download a sound by id to ./sounds/sfx/ in your project.",
  },
  {
    name: "sfx_resolve",
    input: "{ transition, moment? }",
    description: "Resolve and pull the best sound for a video transition type.",
  },
  {
    name: "sfx_list_installed",
    input: "—",
    description: "List .wav files already cached in the local SFX library.",
  },
] as const;

export default function McpToolsList({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col border-t border-border/60 pt-5",
        compact ? "gap-3" : "gap-4",
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">Tools</p>
      <div className={cn("flex flex-col", compact ? "gap-3.5" : "gap-4")}>
        {tools.map((tool, index) => (
          <div key={tool.name}>
            {index > 0 ? (
              <Separator className={compact ? "mb-3.5" : "mb-4"} />
            ) : null}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-mono text-sm font-medium text-foreground">
                {tool.name}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {tool.input}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}