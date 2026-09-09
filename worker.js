/**
 * worker.js
 * -----------------------------------------------------------------------
 * Entry point for the unified Workers+static-assets deploy model (what
 * this Cloudflare project's build pipeline actually runs: `wrangler
 * deploy`, not `wrangler pages deploy`). Static files are served straight
 * from the [assets] binding by the platform whenever a request matches a
 * real file; this fetch handler only runs for paths that don't match one
 * — which in practice means just /api/*. It reuses the exact same
 * onRequest() handler from functions/api/[[path]].js, so nothing about
 * the API logic changes.
 * -----------------------------------------------------------------------
 */
import { onRequest as apiHandler } from "./functions/api/[[path]].js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const path = url.pathname.slice(4).split("/").filter(Boolean); // strip leading "/api"
      return apiHandler({ request, env, params: { path } });
    }

    // Any other path that reaches the Worker (i.e. didn't match a static
    // asset) falls back to index.html — fine here since this app routes
    // via the URL hash, so the real pathname requested is always "/".
    return env.ASSETS.fetch(request);
  },
};
