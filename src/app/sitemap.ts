import type { MetadataRoute } from "next";
import { makeSlug } from "@/lib/api";
import { blogPosts } from "@/lib/blog";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cafepedia.id";
const SITE_URL = "https://cafepedia.id";
const SUPABASE_URL = "https://fkpxolnsqjfgcbkiqbld.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcHhvbG5zcWpmZ2Nia2lxYmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzM5MTMsImV4cCI6MjA4ODI0OTkxM30.zVk8B3AxLCWkgomZxxsoOCQkugAmVxphjtGtFwkCJdE";

// Fixed dates for static pages (last meaningful content update)
const STATIC_LAST_MODIFIED = "2026-03-01";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages — fixed dates, no changeFrequency/priority (Google ignores them)
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/blog`, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/about`, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/cafe-bandung`, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/browse`, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/contact`, lastModified: new Date(STATIC_LAST_MODIFIED) },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-01-01") },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-01-01") },
  ];

  // Blog pages — use actual post date
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  // Fetch all cafes with updated_at from Supabase directly (has real timestamps)
  const cafePages: MetadataRoute.Sitemap = [];
  try {
    let offset = 0;
    const limit = 1000;
    let hasMore = true;
    while (hasMore) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/places?status=eq.open&select=id,name,google_refreshed_at,created_at&order=id.asc&offset=${offset}&limit=${limit}`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          next: { revalidate: 86400 },
        }
      );
      const rows: { id: string; name: string; google_refreshed_at: string | null; created_at: string | null }[] = await r.json();
      for (const row of rows) {
        const lastMod = row.google_refreshed_at || row.created_at || STATIC_LAST_MODIFIED;
        cafePages.push({
          url: `${SITE_URL}/cafe/${makeSlug(row.id, row.name)}`,
          lastModified: new Date(lastMod),
        });
      }
      hasMore = rows.length === limit;
      offset += limit;
    }
  } catch {
    // If Supabase fails, fall back to API search without real dates
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
            lastModified: new Date(STATIC_LAST_MODIFIED),
          });
        }
        hasMore = results.length === 100;
        page++;
      }
    } catch {
      // If both fail, return static pages only
    }
  }

  // SEO pages from Supabase — fetch with updated_at
  const seoPages: MetadataRoute.Sitemap = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/seo_pages?is_published=eq.true&select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 86400 },
      }
    );
    const rows: { slug: string; updated_at: string | null }[] = await r.json();
    for (const row of rows) {
      seoPages.push({
        url: `${SITE_URL}/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(STATIC_LAST_MODIFIED),
      });
    }
  } catch {
    // If Supabase fails, skip SEO pages
  }

  return [...staticPages, ...blogPages, ...cafePages, ...seoPages];
}
