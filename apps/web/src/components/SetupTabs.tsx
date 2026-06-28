import { cn } from "@/lib/utils";

export type SetupTabItem<T extends string> = {
  id: T;
  label: string;
};

type SetupTabsProps<T extends string> = {
  tabs: readonly SetupTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
};

export default function SetupTabs<T extends string>({
  tabs,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SetupTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full max-w-full flex-wrap gap-1 rounded-xl bg-muted/50 p-1 ring-1 ring-border/60",
        className,
      )}
    >
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
            value === item.id
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}