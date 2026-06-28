import catalog from "../../../public/catalog.json";

export const SITE_URL = "https://sfx.woven.video";
export const SITE_NAME = "Woven SFX";
export const PARENT_ORG_URL = "https://www.woven.video";
export const PARENT_ORG_NAME = "Woven";
export const PARENT_LEGAL_NAME = "Woven Labs";

export const SITE_TAGLINE = "Sound Effects Library for AI Agents";

export const SITE_TITLE = `${SITE_TAGLINE} — ${SITE_NAME}`;

export const SITE_DESCRIPTION = `Open-source sound effects for AI agents. ${catalog.sounds.length} whooshes, pops, and glitches with MCP tools and a one-command skill install for video edits.`;

export const ANSWER_FIRST =
  "Woven SFX is an open source library of whooshes, pops, and glitches built for agent video edits. Install the skill and MCP server once. Your agent resolves and pulls the right .wav for every transition.";

/** Bump when landing copy, catalog, or install flow changes materially. */
export const SITE_CONTENT_UPDATED = "2026-06-28";

export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;