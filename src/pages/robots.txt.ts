import type { APIRoute } from "astro";
import { site } from "../site";

export const GET: APIRoute = (context) => {
  const baseUrl = context.site ?? new URL(site.url);
  const sitemapUrl = new URL("/sitemap-index.xml", baseUrl).toString();

  return new Response(
    [`User-agent: *`, `Disallow: /demo/`, `Sitemap: ${sitemapUrl}`, ``].join(
      "\n",
    ),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
