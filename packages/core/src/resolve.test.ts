import { describe, it, expect } from "vitest";
import { resolveForTransition } from "./resolve.js";
import type { Catalog } from "./types.js";

const catalog: Catalog = {
  version: "1.0.0",
  sounds: [
    {
      id: "swish-whoosh-large",
      file: "swish-whoosh-large.wav",
      tags: ["whoosh"],
      duration_ms: 680,
      default_volume: 0.45,
      url: "https://sfx.woven.video/sfx/swish-whoosh-large.wav",
      pairings: { transition: ["pull-in"] },
    },
    {
      id: "fast-whoosh",
      file: "fast-whoosh.wav",
      tags: ["whoosh"],
      duration_ms: 420,
      default_volume: 0.45,
      url: "https://sfx.woven.video/sfx/fast-whoosh.wav",
      pairings: { transition: ["pull-out", "whoosh"] },
    },
  ],
};

describe("resolveForTransition", () => {
  it("returns swish-whoosh-large for pull-in", () => {
    const r = resolveForTransition(catalog, "pull-in");
    expect(r?.id).toBe("swish-whoosh-large");
    expect(r?.suggested_volume).toBe(0.45);
  });

  it("returns fast-whoosh for pull-out", () => {
    const r = resolveForTransition(catalog, "pull-out");
    expect(r?.id).toBe("fast-whoosh");
  });

  it("returns null for fade", () => {
    expect(resolveForTransition(catalog, "fade")).toBeNull();
  });
});