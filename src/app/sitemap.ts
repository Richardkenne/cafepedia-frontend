import type { MetadataRoute } from "next";
import { makeSlug } from "@/lib/api";
import { blogPosts } from "@/lib/blog";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cafepedia.id";
const SITE_URL = "https://cafepedia.id";
const SUPABASE_URL = "https://fkpxolnsqjfgcbkiqbld.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcHhvbG5zcWpmZ2Nia2lxYmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzM5MTMsImV4cCI6MjA4ODI0OTkxM30.zVk8B3AxLCWkgomZxxsoOCQkugAmVxphjtGtFwkCJdE";

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
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
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

  // SEO pages from Supabase
  const seoPages: MetadataRoute.Sitemap = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/seo_pages?is_published=eq.true&select=slug`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 86400 },
      }
    );
    const rows: { slug: string }[] = await r.json();
    for (const row of rows) {
      seoPages.push({
        url: `${SITE_URL}/${row.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // If Supabase fails, skip SEO pages
  }

  return [...staticPages, ...blogPages, ...cafePages, ...seoPages];
}
