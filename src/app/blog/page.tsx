import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/lib/blog"

const SITE_URL = "https://cafepedia.id"

export const metadata: Metadata = {
  title: "Blog — Cafepedia",
  description: "Guides, tips, and recommendations for exploring Bandung's cafe scene. Find the best cafes by area, vibe, and purpose.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog — Cafepedia",
    description: "Guides, tips, and recommendations for exploring Bandung's cafe scene.",
    url: `${SITE_URL}/blog`,
    siteName: "Cafepedia",
    type: "website",
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
            Cafepedia
          </Link>
          <nav className="text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              Search
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Blog
        </h1>
        <p className="text-[var(--muted)] mb-12">
          Guides and recommendations for Bandung&apos;s cafe scene
        </p>

        <div className="space-y-12">
          {blogPosts.map((post, i) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[2/1] sm:aspect-[5/2] rounded-xl overflow-hidden mb-5 bg-[var(--border)]">
                  <Image
                    src={post.heroImage}
                    alt={post.heroAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--muted2)] mb-2">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-[var(--orange)] transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-[var(--muted)] leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-[11px] text-[var(--muted2)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            cafepedia.id
          </Link>
          {" "}— Bandung, Indonesia
        </div>
      </footer>
    </main>
  )
}
