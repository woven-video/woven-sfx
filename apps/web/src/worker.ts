interface Env {
  ASSETS: Fetcher;
}

const SFX_ASSET_ORIGIN = "https://assets.sfx.woven.video";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/sfx/")) {
      return Response.redirect(`${SFX_ASSET_ORIGIN}${url.pathname}`, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
