import catalog from "../../../public/catalog.json";
import {
  OG_IMAGE_URL,
  PARENT_LEGAL_NAME,
  PARENT_ORG_NAME,
  PARENT_ORG_URL,
  SITE_CONTENT_UPDATED,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE,
  SITE_URL,
} from "./constants";
import type { FaqItem } from "./faqs";
import {
  AUDIO_LICENSE_URL,
  isoDuration,
  soundDisplayName,
} from "../sound-pages";

type JsonLd = Record<string, unknown>;

const soundCount = catalog.sounds.length;

export function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: PARENT_ORG_NAME,
    legalName: PARENT_LEGAL_NAME,
    url: PARENT_ORG_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
      width: 1024,
      height: 1024,
    },
    sameAs: [
      PARENT_ORG_URL,
      "https://github.com/woven-video/woven-sfx",
      "https://github.com/woven-video/skills",
    ],
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function softwareApplicationSchema(): JsonLd {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: "Open source — MIT code, CC0 sounds",
    },
    featureList: [
      "MCP tools: sfx_search, sfx_pull, sfx_list_installed",
      "skills.sh installable agent skill",
      "Machine-readable catalog.json",
    ],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function datasetSchema(): JsonLd {
  return {
    "@type": "Dataset",
    "@id": `${SITE_URL}/#catalog`,
    name: "Woven SFX sound catalog",
    description: `Open sound effects catalog with ${soundCount} WAV files for AI video editing agents.`,
    url: `${SITE_URL}/catalog.json`,
    version: catalog.version,
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    isAccessibleForFree: true,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `${SITE_URL}/catalog.json`,
    },
    // Google's Dataset rich result requires a creator; Search Console flagged it as missing.
    // Typed and named inline so it validates on its own, and the @id merges it with the
    // Organization node in the same graph.
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: PARENT_ORG_NAME,
      url: PARENT_ORG_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqPageSchema(faqs: FaqItem[]): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function webPageSchema(): JsonLd {
  return {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    dateModified: SITE_CONTENT_UPDATED,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: [{ "@id": `${SITE_URL}/#app` }, { "@id": `${SITE_URL}/#catalog` }],
    publisher: { "@id": `${SITE_URL}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#summary"],
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
  };
}

export function jsonLdGraph(...nodes: JsonLd[]): {
  "@context": string;
  "@graph": JsonLd[];
} {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function homePageGraph(faqs: FaqItem[]) {
  return jsonLdGraph(
    organizationSchema(),
    websiteSchema(),
    softwareApplicationSchema(),
    datasetSchema(),
    webPageSchema(),
    faqPageSchema(faqs),
  );
}

type SoundPageGraphInput = {
  url: string;
  title: string;
  description: string;
  name: string;
  h1: string;
  faqs: FaqItem[];
  sounds: {
    id: string;
    url: string;
    duration_ms: number;
    tags: string[];
  }[];
};

/** JSON-LD graph for a sound-type landing page (WebPage, breadcrumbs, FAQs, one AudioObject per sound). */
export function soundPageGraph(page: SoundPageGraphInput) {
  const pageId = `${page.url}#webpage`;

  return jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": pageId,
      url: page.url,
      name: page.title,
      description: page.description,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: PARENT_ORG_NAME,
        url: PARENT_ORG_URL,
      },
      breadcrumb: { "@id": `${page.url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${page.url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.h1,
          item: page.url,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${page.url}#faq`,
      mainEntity: page.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    ...page.sounds.map((sound) => ({
      "@type": "AudioObject",
      "@id": `${page.url}#${sound.id}`,
      name: `${soundDisplayName(sound.id)} sound effect`,
      contentUrl: sound.url,
      encodingFormat: "audio/wav",
      duration: isoDuration(sound.duration_ms),
      license: AUDIO_LICENSE_URL,
      isAccessibleForFree: true,
      keywords: sound.tags.join(", "),
      isPartOf: { "@id": pageId },
    })),
  );
}
