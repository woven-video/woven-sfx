interface Env {
  ASSETS: Fetcher;
}

const SFX_ASSET_ORIGIN = "https://assets.sfx.woven.video";
const CANONICAL_SFX_ORIGIN = "https://www.woven.video";

function canonicalSfxPath(pathname: string): string {
  if (pathname === "/" || pathname === "") {
    return "/sfx";
  }

  return `/sfx${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "sfx.woven.video") {
      return Response.redirect(
        `${CANONICAL_SFX_ORIGIN}${canonicalSfxPath(url.pathname)}${url.search}`,
        301,
      );
    }

    if (url.pathname.startsWith("/sfx/")) {
      return Response.redirect(`${SFX_ASSET_ORIGIN}${url.pathname}`, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
