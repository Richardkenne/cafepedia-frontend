import type { MetadataRoute } from "next";
import { makeSlug } from "@/lib/api";
import { blogPosts } from "@/lib/blog";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cafepedia.id";
const SITE_URL = "https://cafepedia.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Fetch all cafes (paginate if needed)
  const cafePages: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const r = await fetch(
        `${API_BASE}/search?q=*&per_page=100&page=${page}`,
        { next: { revalidate: 86400 } }
      );
      const data = await r.json();
      const results = data.results || [];
      for (const cafe of results) {
        cafePages.push({
          url: `${SITE_URL}/cafe/${makeSlug(cafe.id, cafe.name)}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      hasMore = results.length === 100;
      page++;
    }
  } catch {
    // If API fails, return static pages only
  }

  return [...staticPages, ...blogPages, ...cafePages];
}
