interface Env {
  ASSETS: Fetcher;
  SFX_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/sfx/")) {
      const key = url.pathname.slice(1);
      const object = await env.SFX_BUCKET.get(key);
      if (!object) {
        return new Response("Not found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Content-Type", "audio/wav");
      headers.set("Cache-Control", "public, max-age=31536000, immutable");

      return new Response(object.body, { headers });
    }

    return env.ASSETS.fetch(request);
  },
};