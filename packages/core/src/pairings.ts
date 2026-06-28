/** Primary sound ID per transition (from edit-plan skill). */
export const TRANSITION_PRIMARY: Record<string, string> = {
  "pull-in": "swish-whoosh-large",
  "pull-out": "fast-whoosh",
  flash: "camera-flash",
  glitch: "glitch-logo",
  "tv-glitch": "glitch-logo",
  whoosh: "fast-whoosh",
};

/** fade → no SFX by default */
export const TRANSITION_NONE = new Set(["fade", "none"]);