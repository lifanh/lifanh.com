import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPublishedPosts, postPath } from "../lib/posts";
import { site } from "../site";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();

  return rss({
    title: `${site.name} · Writing`,
    description: site.defaultDescription,
    site: context.site ?? new URL(site.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postPath(post),
      categories: post.data.tags,
    })),
  });
};
