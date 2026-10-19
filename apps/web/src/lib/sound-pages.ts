import catalog from "../../public/catalog.json";
import { SITE_URL } from "./seo/constants";
import type { FaqItem } from "./seo/faqs";

export type CatalogSound = {
  id: string;
  file: string;
  tags: string[];
  duration_ms: number;
  default_volume: number;
  url: string;
  peaks_url?: string;
};

type SoundPageDefinition = {
  slug: string;
  /** Sound type name as people search it, e.g. "ding". */
  name: string;
  soundIds: string[];
  title: string;
  description: string;
  h1: string;
  /** Answer-first paragraph. `{count}` is replaced with the number of sounds. */
  answer: string;
  whenToUse: string[];
  /** Extra answers for the type-specific FAQ slot (the other three are shared). */
  related: string[];
};

export type SoundPage = Omit<SoundPageDefinition, "answer"> & {
  url: string;
  answer: string;
  sounds: CatalogSound[];
  faqs: FaqItem[];
  glance: string;
  startingVolume: { id: string; volume: number };
  relatedPages: { slug: string; name: string; h1: string }[];
};

export const AUDIO_LICENSE_URL =
  "https://creativecommons.org/publicdomain/zero/1.0/";
export const GUIDE_URL =
  "https://www.woven.video/guides/add-sound-effects-to-video";
export const SOUND_FORMAT_LABEL = "44.1 kHz, 16-bit stereo WAV";

export const INSTALL_SKILL_CMD =
  "npx skills add woven-video/skills --skill add-sfx";

const definitions: SoundPageDefinition[] = [
  {
    slug: "ding-sound-effect",
    name: "ding",
    soundIds: ["airplane-ding", "elevator-ding", "notification-ding"],
    title: "Free Ding Sound Effect Downloads (CC0) — Woven SFX",
    description:
      "Free ding sound effect downloads: an airplane ding, an elevator ding and a notification ding. CC0 WAV files you can preview and use in any video.",
    h1: "Ding sound effect",
    answer:
      "Woven SFX has {count} free ding sound effects: an airplane ding, an elevator ding and a notification ding. Each one is a CC0 WAV file, so you can download it and use it in any video, commercial or not, without asking permission. Press play on a card to preview the sound in your browser first.",
    whenToUse: [
      "Put a ding on a reveal, the frame where a price, a score or a title lands on screen. Start the WAV on that frame so the sound and the picture arrive together.",
      "Use notification-ding when a message, badge or alert appears in a screen recording, so the sound comes from something the viewer can see.",
      "Mark a correct answer or a finished step in a quiz or tutorial. One ding per result is enough, because a ding every second turns into noise.",
      "Use airplane-ding or elevator-ding when the shot shows a plane cabin or a lift, so the sound belongs to the scene.",
    ],
    related: ["pop-sound-effect", "click-sound-effect", "applause-sound-effect"],
  },
  {
    slug: "boom-sound-effect",
    name: "boom",
    soundIds: ["explosion", "bass-impact", "base-drop", "dull-thud"],
    title: "Free Boom, Impact and Hit Sound Effects (CC0) — Woven SFX",
    description:
      "Free boom sound effect downloads, also covering impact, hit and bass drop sounds: explosion, bass impact, bass drop and dull thud in CC0 WAV.",
    h1: "Boom sound effect",
    answer:
      "Woven SFX has {count} free boom sound effects, which also work as impact, hit and bass drop sounds: an explosion, a bass impact, a bass drop (the file id is base-drop) and a dull thud. All are CC0 WAV files you can download and use in any video. Press play on a card to preview them in your browser.",
    whenToUse: [
      "Put explosion on the frame of a visible blast or on a hard cut to a big shot. It runs about 3.2 seconds, so leave room after that frame.",
      "Use bass-impact or base-drop on a title slam or on the first beat of a new section. Use one per section rather than one per cut.",
      "Use dull-thud for small physical hits, such as an object landing on a table or a text card dropping into place.",
      "Keep booms rare. If every cut has one, none of them lands, so save them for the one moment where the video turns.",
    ],
    related: [
      "whoosh-sound-effect",
      "record-scratch-sound-effect",
      "camera-shutter-sound-effect",
    ],
  },
  {
    slug: "record-scratch-sound-effect",
    name: "record scratch",
    soundIds: [
      "record-scratch",
      "record-needle-scratch",
      "sideways-record-needle",
      "dj-scratch",
    ],
    title: "Free Record Scratch Sound Effect (CC0 WAV) — Woven SFX",
    description:
      "Free record scratch sound effect downloads: record scratch, needle scratch, sideways needle and DJ scratch. CC0 WAV files to preview and use anywhere.",
    h1: "Record scratch sound effect",
    answer:
      "Woven SFX has {count} free record scratch sound effects: a record scratch, a needle scratch, a sideways needle and a DJ scratch. Each one is a CC0 WAV file, so you can download it and use it in any video without asking permission. Press play on a card to hear it in your browser before you download.",
    whenToUse: [
      "Use record-scratch for the stop-the-music beat: a freeze frame or a hard cut right before a \"wait, what\" line. Cut or duck the music on the same frame.",
      "Use sideways-record-needle for a quick interruption, such as a text card that contradicts the line before it. At about 0.6 seconds it is the shortest of the four.",
      "Use dj-scratch when the shot is about music, a turntable or a DJ, so the sound matches what is on screen.",
      "Pair the scratch with a moment of silence. The effect depends on the background music stopping, so a scratch over a running track reads as a mistake.",
    ],
    related: ["boom-sound-effect", "gasp-sound-effect", "pop-sound-effect"],
  },
  {
    slug: "click-sound-effect",
    name: "click",
    soundIds: ["mouse-click-1", "mouse-click-2", "tick-sound", "beep-short"],
    title: "Free Click Sound Effect Downloads (CC0 WAV) — Woven SFX",
    description:
      "Free click sound effect downloads: two mouse clicks, a tick and a short beep. CC0 WAV files you can preview in the browser and use in any video.",
    h1: "Click sound effect",
    answer:
      "Woven SFX has {count} free click sound effects: two mouse clicks, a tick and a short beep. All are CC0 WAV files, so you can download them and use them in any video, commercial or not, with no permission needed. Press play on a card to preview each one in your browser before you download.",
    whenToUse: [
      "Add a click in a screen recording on the exact frame the cursor presses. mouse-click-2 is only about 0.2 seconds long, so it suits fast clicks.",
      "Match one click to each visible click. If the cursor only moves across the screen, leave that part silent.",
      "Use tick-sound for a counter, a timer or a list that steps forward, and keep the ticks few so they stay noticeable.",
      "Use beep-short to confirm an action or flag an error in an app demo, on the frame the message appears.",
    ],
    related: [
      "keyboard-typing-sound-effect",
      "pop-sound-effect",
      "ding-sound-effect",
    ],
  },
  {
    slug: "whoosh-sound-effect",
    name: "whoosh",
    soundIds: ["deep-whoosh", "fast-whoosh", "swish-whoosh-large"],
    title: "Free Whoosh, Swoosh and Transition Sound Effects — Woven SFX",
    description:
      "Free whoosh sound effect downloads, also used as swoosh and transition sounds: deep, fast and large swish whooshes in CC0 WAV for any video.",
    h1: "Whoosh sound effect",
    answer:
      "Woven SFX has {count} free whoosh sound effects, also known as swoosh or transition sounds: a deep whoosh, a fast whoosh and a large swish whoosh. Each is a CC0 WAV file you can download and use in any video without asking permission. Press play on a card to preview it in your browser.",
    whenToUse: [
      "Put fast-whoosh under a slide-in or a quick swipe. At about 0.4 seconds it fits a move that finishes in a few frames.",
      "Use swish-whoosh-large for a large element crossing the screen, such as a full-width panel or a big title.",
      "Use deep-whoosh under a longer move or a scene change. It runs about 3.2 seconds, so trim it if the move is shorter.",
      "Line the start of the WAV up with the first frame of movement, and skip the whoosh on plain cuts that have no motion on screen.",
    ],
    related: [
      "boom-sound-effect",
      "pop-sound-effect",
      "camera-shutter-sound-effect",
    ],
  },
  {
    slug: "camera-shutter-sound-effect",
    name: "camera shutter",
    soundIds: [
      "camera-analog",
      "camera-flash",
      "camera-shutter-1-shot",
      "camera-shutter-8-shots",
      "camera-shutter-release",
    ],
    title: "Free Camera Shutter Sound Effects (CC0 WAV) — Woven SFX",
    description:
      "Free camera shutter sound effect downloads: analog camera, flash, single shot, eight-shot burst and shutter release. CC0 WAV files for any video.",
    h1: "Camera shutter sound effect",
    answer:
      "Woven SFX has {count} free camera shutter sound effects: an analog camera, a camera flash, a single shot, an eight-shot burst and a shutter release. All are CC0 WAV files, so you can download them and use them in any video. Press play on a card to preview each one in your browser first.",
    whenToUse: [
      "Use camera-shutter-1-shot on the frame a photo is taken or an image freezes, so the click lands on the freeze.",
      "Use camera-shutter-8-shots when photos flip past in a burst, and keep the image changes in step with the clicks.",
      "Use camera-analog when the picture shows a film camera or a print, so the sound matches the object.",
      "camera-flash runs about 6.5 seconds, so trim it in your editor if you only need the moment of the flash.",
    ],
    related: ["click-sound-effect", "whoosh-sound-effect", "gasp-sound-effect"],
  },
  {
    slug: "applause-sound-effect",
    name: "applause",
    soundIds: ["applause", "cheers-and-applause"],
    title: "Free Applause Sound Effect Downloads (CC0) — Woven SFX",
    description:
      "Free applause sound effect downloads: a long applause track and a shorter cheers and applause clip. CC0 WAV files you can preview and use anywhere.",
    h1: "Applause sound effect",
    answer:
      "Woven SFX has {count} free applause sound effects: a long applause track and a shorter clip of cheers and applause. Both are CC0 WAV files, so you can download them and use them in any video, commercial or not, without asking permission. Press play on a card to preview them in your browser.",
    whenToUse: [
      "Start applause as the result appears on screen, such as a winner, a finished demo or an announcement, not before it.",
      "Use cheers-and-applause (about 4 seconds) for a short celebration, like a milestone number hitting the screen.",
      "Use applause (about 13 seconds) under a longer moment and fade it out in your editor before the next scene.",
      "Keep crowd sounds under a voiceover. The catalog default volume for both is 0.45, which is a starting point, not a final level.",
    ],
    related: ["ding-sound-effect", "gasp-sound-effect", "boom-sound-effect"],
  },
  {
    slug: "pop-sound-effect",
    name: "pop",
    soundIds: ["pop-hand", "message-pop-reply"],
    title: "Free Pop Sound Effect Downloads (CC0 WAV) — Woven SFX",
    description:
      "Free pop sound effect downloads: a hand pop and a message pop reply. CC0 WAV files you can preview in the browser and use in any video.",
    h1: "Pop sound effect",
    answer:
      "Woven SFX has {count} free pop sound effects: a hand pop and a message pop reply. Both are CC0 WAV files, so you can download them and use them in any video, commercial or not, without asking permission. Press play on a card to preview each one in your browser before you download.",
    whenToUse: [
      "Put a pop on each text, sticker or icon as it appears, on the first frame it is visible.",
      "Use message-pop-reply when a chat bubble or reply shows up in a messaging mockup or screen recording.",
      "pop-hand is about 0.35 seconds long, short enough to repeat when several items appear one after another.",
      "When many items appear in a row, pop on every second or third one. A pop on every item gets tiring fast.",
    ],
    related: ["ding-sound-effect", "click-sound-effect", "whoosh-sound-effect"],
  },
  {
    slug: "gasp-sound-effect",
    name: "gasp",
    soundIds: ["female-gasp", "male-gasp"],
    title: "Free Gasp Sound Effect Downloads (CC0 WAV) — Woven SFX",
    description:
      "Free gasp sound effect downloads: a female gasp and a male gasp. CC0 WAV files you can preview in the browser and use in any video for free.",
    h1: "Gasp sound effect",
    answer:
      "Woven SFX has {count} free gasp sound effects: a female gasp and a male gasp. Both are CC0 WAV files, so you can download them and use them in any video, commercial or not, without asking permission. Press play on a card to preview each one in your browser before you download.",
    whenToUse: [
      "Use a gasp as the reaction to a reveal, such as a price, a score or a plot twist. Place it a few frames after the trigger appears, since a gasp is a reaction.",
      "Pick the voice that fits who is on screen: female-gasp or male-gasp. Both are tagged as voice sounds.",
      "Both gasps are under half a second, so they fit a quick cut to a reaction shot.",
      "Leave a beat of quiet before the gasp so it stands out, and use it once per reveal.",
    ],
    related: [
      "record-scratch-sound-effect",
      "applause-sound-effect",
      "boom-sound-effect",
    ],
  },
  {
    slug: "keyboard-typing-sound-effect",
    name: "keyboard typing",
    soundIds: ["keyboard-typing", "keyboard-typing-realistic"],
    title: "Free Keyboard Typing Sound Effect (CC0 WAV) — Woven SFX",
    description:
      "Free keyboard typing sound effect downloads: a 10-second typing clip and a realistic typing clip. CC0 WAV files to preview and use in any video.",
    h1: "Keyboard typing sound effect",
    answer:
      "Woven SFX has {count} free keyboard typing sound effects: a 10-second typing clip and a shorter realistic typing clip. Both are CC0 WAV files, so you can download them and use them in any video, commercial or not, without asking permission. Press play on a card to preview them in your browser.",
    whenToUse: [
      "Put typing under a screen recording of someone writing in a document, a code editor or a search bar. Start the WAV when the first character appears.",
      "Use keyboard-typing-realistic (about 3.4 seconds) for a short line, such as a search query or one message.",
      "Use keyboard-typing (about 10 seconds) for a longer stretch of typing, and trim it to the length of the typing on screen.",
      "Stop the sound on the frame the typing stops. The catalog default volume is 0.35, which keeps it under a voiceover.",
    ],
    related: ["click-sound-effect", "ding-sound-effect", "pop-sound-effect"],
  },
];

const allSounds = catalog.sounds as CatalogSound[];
const soundsById = new Map(allSounds.map((sound) => [sound.id, sound]));
const definitionsBySlug = new Map(definitions.map((page) => [page.slug, page]));

function formatSeconds(ms: number): string {
  const seconds = ms / 1000;
  return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`;
}

function buildFaqs(definition: SoundPageDefinition): FaqItem[] {
  const { name, soundIds } = definition;
  const first = soundIds[0];
  return [
    {
      q: `Is the ${name} sound effect free?`,
      a: `Yes. Every ${name} sound on this page is released under CC0 1.0, which puts it in the public domain. You can use it for any purpose, commercial or not, without asking permission or paying.`,
    },
    {
      q: `Can I use these ${name} sounds on YouTube, TikTok or in ads?`,
      a: `Yes. CC0 allows any use, including monetized YouTube videos, TikTok and Instagram posts, and paid ads. You do not need to credit Woven SFX or keep a license file with the video.`,
    },
    {
      q: `What format are the ${name} sound effects?`,
      a: `They are WAV files. Each ${name} file on this page is a ${SOUND_FORMAT_LABEL}. Use the download button on a card to save the file, then drop it on an audio track in your editor.`,
    },
    {
      q: `How do I use ${name} sounds with an AI agent?`,
      a: `Install the skill with ${INSTALL_SKILL_CMD}, then add the woven-sfx-mcp server to your agent's MCP config and restart the agent. Your agent can then call sfx_search with a query such as "${name}" and sfx_pull with an id such as "${first}" to save the WAV in ./sounds/sfx/ in your project.`,
    },
  ];
}

function resolve(definition: SoundPageDefinition): SoundPage {
  const sounds = definition.soundIds.map((id) => {
    const sound = soundsById.get(id);
    if (!sound) {
      throw new Error(
        `sound-pages: "${id}" (page ${definition.slug}) is not in catalog.json`,
      );
    }
    return sound;
  });

  const durations = sounds.map((sound) => sound.duration_ms);
  const shortest = Math.min(...durations);
  const longest = Math.max(...durations);
  const range =
    shortest === longest
      ? formatSeconds(shortest)
      : `${formatSeconds(shortest)} to ${formatSeconds(longest)}`;

  const relatedPages = definition.related.map((slug) => {
    const related = definitionsBySlug.get(slug);
    if (!related) {
      throw new Error(
        `sound-pages: related page "${slug}" (page ${definition.slug}) does not exist`,
      );
    }
    return { slug: related.slug, name: related.name, h1: related.h1 };
  });

  return {
    ...definition,
    answer: definition.answer.replace("{count}", String(sounds.length)),
    url: `${SITE_URL}/${definition.slug}`,
    sounds,
    faqs: buildFaqs(definition),
    glance: `${sounds.length} sounds · ${range} · ${SOUND_FORMAT_LABEL} · CC0`,
    startingVolume: {
      id: sounds[0].id,
      volume: sounds[0].default_volume,
    },
    relatedPages,
  };
}

export const soundPages: SoundPage[] = definitions.map(resolve);

export function getSoundPage(slug: string): SoundPage | undefined {
  return soundPages.find((page) => page.slug === slug);
}

/** ISO 8601 duration, e.g. 1184 ms -> "PT1.184S". */
export function isoDuration(ms: number): string {
  return `PT${ms / 1000}S`;
}

/** "notification-ding" -> "Notification ding". */
export function soundDisplayName(id: string): string {
  const spaced = id.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
