import Link from "next/link";
import HomeClient from "./HomeClient";

const DISCOVERY_LISTS = [
  { label: "Best Cafes in Bandung", href: "/best-cafes-bandung" },
  { label: "Best Cafes to Work", href: "/best-cafes-to-work-bandung" },
  { label: "Most Aesthetic Cafes", href: "/aesthetic-cafes-bandung" },
  { label: "Best Cheap Coffee", href: "/cheap-cafes-bandung" },
  { label: "Best Date Cafes", href: "/date-cafes-bandung" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Cafepedia",
  "url": "https://cafepedia.id",
  "description": "Temukan cafe terbaik di Bandung berdasarkan suasana, lokasi & harga",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://cafepedia.id/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  const discoveryLinks = (
    <nav className="mt-6 w-full max-w-md">
      <ul className="flex flex-col gap-1">
        {DISCOVERY_LISTS.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between py-3 px-1 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
            >
              <span>{item.label}</span>
              <span className="text-[var(--muted2)] group-hover:text-[var(--muted)] transition-colors text-[11px] ml-2">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh px-6">
      {/* JSON-LD Schema — server rendered for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-1">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="var(--accent)"/>
          <path d="M16 8.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6L16 14.5l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L16 8.5z" fill="#fff"/>
        </svg>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--primary)' }}>
          Cafepedia
        </h1>
      </div>
      <p className="text-sm text-[var(--muted)] mb-1">
        Discover great places.
      </p>
      <p className="text-xs text-[var(--muted2)] mb-8">
        600+ cafe dengan foto, jam buka &amp; petunjuk arah
      </p>

      {/* Interactive section: search, near me, discovery links, AI pick, install banner, lang toggle */}
      <HomeClient discoveryLinks={discoveryLinks} />

      {/* Value Proposition — server rendered for SEO */}
      <section className="w-full max-w-md mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface)]">
          <span className="text-base leading-none mt-0.5">{"\uD83C\uDFAF"}</span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">Cari berdasarkan suasana</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">Ketik &quot;cafe tenang buat kerja&quot; atau &quot;tempat ngedate estetik&quot; — kami temukan yang cocok</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface)]">
          <span className="text-base leading-none mt-0.5">{"\uD83E\uDD16"}</span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">AI pilihkan untukmu</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">Bingung mau ke mana? AI kami pilihkan 3 cafe terbaik sesuai keinginanmu</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface)]">
          <span className="text-base leading-none mt-0.5">{"\uD83D\uDCCD"}</span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--foreground)]">600+ cafe di Bandung</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">Database terlengkap dengan foto, jam buka, harga &amp; petunjuk arah</p>
          </div>
        </div>
      </section>

      {/* Footer — server rendered for SEO */}
      <footer className="w-full max-w-md mt-12 mb-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted2)]">
          <a href="/about" className="hover:text-[var(--foreground)] transition-colors">About</a>
          <a href="/suggest" className="hover:text-[var(--foreground)] transition-colors">Submit a Cafe</a>
          <a href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted2)] mt-1">
          <a href="/blog" className="hover:text-[var(--foreground)] transition-colors">Blog</a>
          <a href="/browse" className="hover:text-[var(--foreground)] transition-colors">Browse</a>
          <a href="/claim" className="hover:text-[var(--foreground)] transition-colors">Claim your Cafe</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[var(--muted2)] mt-2">
          <a href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
        </div>
        <p className="text-[10px] text-[var(--muted2)] mt-2">cafepedia.id — Bandung, Indonesia</p>
      </footer>
    </main>
  );
}
