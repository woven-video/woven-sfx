import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  text: string;
  label: string;
  className?: string;
  children?: string;
  variant?: "default" | "icon";
};

export default function CopyButton({
  text,
  label,
  className,
  children = "Copy id",
  variant = "default",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        className={className}
        aria-label={`Copy ${label}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied" : children}
    </Button>
  );
}