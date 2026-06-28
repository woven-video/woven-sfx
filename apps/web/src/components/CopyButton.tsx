import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label: string;
  className?: string;
};

export default function CopyButton({
  text,
  label,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`shrink-0 rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-600 hover:bg-stone-800 hover:text-stone-200 ${className}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied" : "Copy id"}
    </button>
  );
}