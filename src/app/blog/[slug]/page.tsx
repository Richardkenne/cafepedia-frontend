import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog"

const SITE_URL = "https://cafepedia.id"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return { title: "Post Not Found — Cafepedia" }
  }

  return {
    title: `${post.title} — Cafepedia`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "Cafepedia",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Cafepedia",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Cafepedia",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  }

  return (
    <main className="min-h-dvh">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
            Cafepedia
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[var(--muted)]">
            <Link href="/blog" className="hover:text-[var(--foreground)] transition-colors">
              Blog
            </Link>
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              Search
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 text-sm text-[var(--muted2)] mb-4">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 leading-tight">
          {post.title}
        </h1>

        <div
          className="prose-cafepedia"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Back to blog */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          All articles
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-4">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-[11px] text-[var(--muted2)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            cafepedia.id
          </Link>
          {" "}— Bandung, Indonesia
        </div>
      </footer>
    </main>
  )
}
