import { describe, it, expect } from "vitest";
import { searchCatalog } from "./catalog.js";
import type { Catalog } from "./types.js";

const catalog: Catalog = {
  version: "1.0.0",
  sounds: [
    {
      id: "fast-whoosh",
      file: "fast-whoosh.wav",
      tags: ["whoosh", "movement"],
      duration_ms: 420,
      default_volume: 0.45,
      url: "",
    },
    {
      id: "camera-shutter-release",
      file: "camera-shutter-release.wav",
      tags: ["camera", "shutter", "ui"],
      duration_ms: 650,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "camera-analog",
      file: "camera-analog.wav",
      tags: ["camera", "film"],
      duration_ms: 859,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "beep-short",
      file: "beep-short.wav",
      tags: ["ui", "beep"],
      duration_ms: 697,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "glitch-logo",
      file: "glitch-logo.wav",
      tags: ["glitch", "digital"],
      duration_ms: 320,
      default_volume: 0.4,
      url: "",
    },
  ],
};

describe("searchCatalog", () => {
  it("returns all sounds when no filters are provided", () => {
    expect(searchCatalog(catalog, {}).map((s) => s.id)).toEqual([
      "fast-whoosh",
      "camera-shutter-release",
      "camera-analog",
      "beep-short",
      "glitch-logo",
    ]);
  });

  it("filters by tag", () => {
    expect(searchCatalog(catalog, { tag: "glitch" }).map((s) => s.id)).toEqual([
      "glitch-logo",
    ]);
  });

  it("finds sounds by id, tag, and file text from one query field", () => {
    expect(searchCatalog(catalog, { query: "beep" }).map((s) => s.id)).toEqual([
      "beep-short",
    ]);
  });

  it("ranks multi-word matches above partial matches", () => {
    expect(searchCatalog(catalog, { query: "camera shutter" }).map((s) => s.id)).toEqual([
      "camera-shutter-release",
      "camera-analog",
    ]);
  });

  it("normalizes punctuation, hyphens, and case", () => {
    expect(searchCatalog(catalog, { query: "FAST whoosh!" }).map((s) => s.id)).toEqual([
      "fast-whoosh",
    ]);
  });

  it("limits results when requested", () => {
    expect(searchCatalog(catalog, { query: "camera", limit: 1 }).map((s) => s.id)).toEqual([
      "camera-shutter-release",
    ]);
  });
});
