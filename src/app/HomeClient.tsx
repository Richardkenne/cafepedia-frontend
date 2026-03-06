"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTrendingCafes, makeSlug } from "@/lib/api";
import { Cafe } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import LangToggle from "@/components/LangToggle";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

const DISCOVERY_LISTS = [
  { label: "Best Cafes in Bandung", href: "/best-cafes-bandung" },
  { label: "Best Cafes to Work", href: "/best-cafes-to-work-bandung" },
  { label: "Most Aesthetic Cafes", href: "/aesthetic-cafes-bandung" },
  { label: "Best Cheap Coffee", href: "/cheap-cafes-bandung" },
  { label: "Best Date Cafes", href: "/date-cafes-bandung" },
];

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function TrendingCard({ cafe }: { cafe: Cafe }) {
  const tags = (cafe.tags || [])
    .filter(t => ["cozy", "outdoor", "work_friendly", "aesthetic", "hidden_gem", "modern", "vintage", "quiet", "rooftop_view", "garden", "romantic", "specialty_coffee"].includes(t))
    .slice(0, 2);

  return (
    <Link
      href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
      className="flex-shrink-0 w-[220px] sm:w-[260px] group"
    >
      <div className="relative w-full h-[160px] sm:h-[180px] rounded-2xl overflow-hidden bg-[var(--surface)]">
        {cafe.hero_photo ? (
          <Image
            src={cafe.hero_photo}
            alt={cafe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="260px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--muted2)]">
            ☕
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="font-semibold text-[15px] leading-tight truncate">
          {cafe.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          {cafe.rating && (
            <span className="text-[13px] text-[var(--accent)] font-semibold">
              ★ {cafe.rating}
            </span>
          )}
          {cafe.rating_count && (
            <span className="text-xs text-[var(--muted2)]">
              {cafe.rating_count.toLocaleString()} reviews
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {tags.map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] font-medium">
                {formatTag(t)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [shake, setShake] = useState(false);
  const [trending, setTrending] = useState<Cafe[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();
  const aiRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    getTrendingCafes().then(cafes => {
      setTrending(cafes.slice(0, 9));
      if (cafes.length > 0 && cafes[0].hero_photo) {
        setHeroImage(cafes[0].hero_photo);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = sessionStorage.getItem("pwa-dismissed");
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (installPrompt as any).prompt();
    setShowInstall(false);
  }

  function dismissInstall() {
    setShowInstall(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }

  function go(q: string) {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function goNear() {
    if (!("geolocation" in navigator)) {
      alert(t("alert.location_not_supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        router.push(`/search?q=&near=${pos.coords.latitude},${pos.coords.longitude}`);
      },
      (err) => {
        if (err.code === 1) alert(t("alert.location_denied"));
        else if (err.code === 3) alert(t("alert.location_timeout"));
        else alert(t("alert.location_error"));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  function goAI(q: string) {
    if (!q.trim()) {
      setShake(true);
      aiRef.current?.querySelector("input")?.focus();
      setTimeout(() => setShake(false), 500);
      return;
    }
    router.push(`/pick?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <main className="min-h-dvh">
      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-30">
        <LangToggle />
      </div>

      {/* HERO */}
      <section className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Cafe in Bandung"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-stone-800" />
        )}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-xl text-center">
          <h1 className="text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Find your next cafe in Bandung
          </h1>
          <p className="text-white/75 text-sm sm:text-base mt-3">
            Discover the best places to work, relax or hang out.
          </p>

          <div className="w-full mt-6 flex gap-2">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={go}
                placeholder={t("home.search_placeholder")}
                large
                autoFocus
              />
            </div>
            <button
              onClick={goNear}
              className="px-4 rounded-2xl bg-white/15 backdrop-blur-sm text-white border border-white/20
                hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
              aria-label={t("home.near_me")}
              title={t("home.near_me")}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </button>
          </div>

          <button
            onClick={() => goAI(query)}
            className="mt-4 px-6 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold
              hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
              <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/>
            </svg>
            Pick for me →
          </button>
          <p className="text-white/50 text-xs mt-2">AI match</p>
        </div>
      </section>

      {/* TRENDING CAFES */}
      {trending.length > 0 && (
        <section className="w-full max-w-5xl mx-auto px-5 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              🔥 Trending cafes in Bandung
            </h2>
            <Link
              href="/search?q=*"
              className="text-sm text-[var(--accent)] font-medium hover:opacity-75 transition-opacity"
            >
              Explore all &rsaquo;
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {trending.map(cafe => (
              <TrendingCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="w-full max-w-4xl mx-auto px-5 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" />
              </svg>
            </div>
            <h3 className="font-bold text-base">Discover by vibe</h3>
            <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
              Find cafes for work, dates<br />or quiet moments.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-4">
              <svg viewBox="0 0 20 20" className="w-6 h-6 text-[var(--accent)]" fill="currentColor">
                <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/>
              </svg>
            </div>
            <h3 className="font-bold text-base">AI picks for you</h3>
            <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
              Tell us what you want and<br />get the best matches.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--accent)]" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="font-bold text-base">600+ cafes in Bandung</h3>
            <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
              Photos, vibe, prices<br />and directions.
            </p>
          </div>
        </div>
      </section>

      {/* DISCOVERY LINKS */}
      <section className="w-full max-w-xl mx-auto px-5 py-8">
        <nav>
          <ul className="flex flex-col divide-y divide-[var(--border)]">
            {DISCOVERY_LISTS.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
                >
                  <span>{item.label}</span>
                  <span className="text-[var(--muted2)] group-hover:text-[var(--muted)] transition-colors text-xs">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* AI PICK SECTION */}
      <section className="w-full max-w-xl mx-auto px-5 py-12 sm:py-16 text-center">
        <div className="flex justify-center mb-3">
          <svg viewBox="0 0 20 20" className="w-7 h-7 text-[var(--accent)]" fill="currentColor">
            <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z"/>
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Pick a cafe with AI
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
          Describe what kind of cafe you&apos;re looking for and<br />let AI find the best matches.
        </p>
        <div className={`mt-6 flex gap-2 max-w-md mx-auto ${shake ? "animate-shake" : ""}`} ref={aiRef}>
          <div className="flex-1">
            <SearchBar
              value={aiQuery}
              onChange={setAiQuery}
              onSubmit={(q) => goAI(q)}
              placeholder="quiet cafe to work near dago"
            />
          </div>
        </div>
        <button
          onClick={() => goAI(aiQuery)}
          className="mt-4 px-8 py-3 rounded-full bg-[var(--accent)] text-white text-sm font-semibold
            hover:opacity-90 active:scale-95 transition-all"
        >
          Try AI picks
        </button>
      </section>

      {/* FOOTER */}
      <footer className="w-full max-w-xl mx-auto px-5 pt-8 pb-8 text-center border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="var(--accent)"/>
            <path d="M16 8.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6L16 14.5l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L16 8.5z" fill="#fff"/>
          </svg>
          <span className="font-bold text-base">Cafepedia</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted)]">
          <a href="/about" className="hover:text-[var(--foreground)] transition-colors">About</a>
          <a href="/suggest" className="hover:text-[var(--foreground)] transition-colors">Submit a Cafe</a>
          <a href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
          <a href="/blog" className="hover:text-[var(--foreground)] transition-colors">Blog</a>
          <a href="/browse" className="hover:text-[var(--foreground)] transition-colors">Browse</a>
          <a href="/claim" className="hover:text-[var(--foreground)] transition-colors">Claim your Cafe</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[var(--muted2)] mt-3">
          <a href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
        </div>
        <p className="text-[11px] text-[var(--muted2)] mt-3">cafepedia.id — Bandung, Indonesia</p>
      </footer>

      {/* Install banner */}
      {showInstall && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] px-6 py-4 flex items-center justify-between gap-4 z-50 shadow-lg">
          <p className="text-[13px] text-[var(--muted)]">
            {t("home.install_prompt")}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={dismissInstall}
              className="text-[13px] text-[var(--muted2)] px-3 py-2 min-h-[44px]"
            >
              {t("home.later")}
            </button>
            <button
              onClick={handleInstall}
              className="text-[13px] font-semibold bg-[var(--foreground)] text-white px-4 py-2 rounded-lg min-h-[44px]"
            >
              {t("home.install")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
