import { describe, it, expect } from "vitest";
import { getSfxHome, getSfxLibrary } from "./paths.js";

describe("paths", () => {
  it("returns woven-sfx under XDG data home", () => {
    expect(getSfxHome()).toMatch(/woven-sfx$/);
    expect(getSfxLibrary()).toMatch(/library$/);
  });
});