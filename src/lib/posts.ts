import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function postSlug(post: Post) {
  return post.id.replace(/\.mdx?$/, "");
}

export function postPath(post: Post) {
  return `/writing/${postSlug(post)}/`;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
