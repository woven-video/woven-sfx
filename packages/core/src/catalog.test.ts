import { describe, it, expect } from "vitest";
import { searchCatalog } from "./catalog.js";
import type { Catalog } from "./types.js";

const catalog: Catalog = {
  version: "1.0.0",
  sounds: [
    { id: "fast-whoosh", file: "fast-whoosh.wav", tags: ["whoosh"], duration_ms: 420, default_volume: 0.45, url: "" },
    { id: "glitch-logo", file: "glitch-logo.wav", tags: ["glitch"], duration_ms: 320, default_volume: 0.4, url: "" },
  ],
};

describe("searchCatalog", () => {
  it("filters by tag", () => {
    expect(searchCatalog(catalog, { tag: "glitch" }).map((s) => s.id)).toEqual(["glitch-logo"]);
  });
  it("filters by query", () => {
    expect(searchCatalog(catalog, { query: "whoosh" }).map((s) => s.id)).toEqual(["fast-whoosh"]);
  });
});