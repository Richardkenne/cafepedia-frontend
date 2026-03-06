import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Cafepedia",
  description:
    "Get in touch with the Cafepedia team. General inquiries, cafe submissions, corrections, partnerships, and press.",
  alternates: { canonical: "https://cafepedia.id/contact" },
  openGraph: {
    title: "Contact — Cafepedia",
    description: "Get in touch with the Cafepedia team.",
    url: "https://cafepedia.id/contact",
    siteName: "Cafepedia",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2"
          >
            &larr; Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 leading-tight">
          Contact Us
        </h1>

        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--muted)]">
          <p>
            Have a question, suggestion, or want to work with us? We&apos;d love
            to hear from you.
          </p>

          <div className="rounded-xl border border-[var(--border)] p-5 text-center">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
              Email us at
            </p>
            <a
              href="mailto:hello@cafepedia.id"
              className="text-lg font-bold text-[var(--foreground)] hover:underline"
            >
              hello@cafepedia.id
            </a>
          </div>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            What you can contact us about
          </h2>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">General</span>
              <span>
                Questions about Cafepedia, how it works, or feedback on your
                experience.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Submissions</span>
              <span>
                Know a cafe that&apos;s not on Cafepedia yet? Let us know and
                we&apos;ll add it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Corrections</span>
              <span>
                Wrong hours, closed permanently, incorrect info? Help us keep
                data accurate.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Partnerships</span>
              <span>
                Interested in collaborating with Cafepedia? We&apos;re open to
                partnerships with brands, platforms, and local businesses.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Press</span>
              <span>
                Media inquiries, interviews, or coverage — reach out and
                we&apos;ll respond promptly.
              </span>
            </li>
          </ul>

          <p>
            We typically respond within 24 hours. For cafe submissions, you can
            also use our{" "}
            <Link href="/suggest" className="text-[var(--foreground)] font-medium underline">
              suggest a cafe
            </Link>{" "}
            form for faster processing.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            &larr; Back to Cafepedia
          </Link>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Cafepedia",
            url: "https://cafepedia.id/contact",
            mainEntity: {
              "@type": "Organization",
              name: "Cafepedia",
              email: "hello@cafepedia.id",
              url: "https://cafepedia.id",
            },
          }),
        }}
      />
    </div>
  );
}
