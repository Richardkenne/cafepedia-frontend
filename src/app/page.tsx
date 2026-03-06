"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import LangToggle from "@/components/LangToggle";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const [query, setQuery] = useState("");
  const [shake, setShake] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const DISCOVERY_LISTS = [
    { label: "Best Cafes in Bandung", href: "/best-cafes-bandung" },
    { label: "Best Cafes to Work", href: "/best-cafes-to-work-bandung" },
    { label: "Most Aesthetic Cafes", href: "/aesthetic-cafes-bandung" },
    { label: "Best Cheap Coffee", href: "/cheap-cafes-bandung" },
    { label: "Best Date Cafes", href: "/date-cafes-bandung" },
  ];

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
      searchRef.current?.querySelector("input")?.focus();
      setTimeout(() => setShake(false), 500);
      return;
    }
    router.push(`/pick?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh px-6">
      {/* Language toggle — top right */}
      <div className="absolute top-4 right-4 z-10">
        <LangToggle />
      </div>

      {/* Logo */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
        Cafepedia
      </h1>
      <p className="text-sm text-[var(--muted2)] mb-1">
        {t("home.subtitle")}
      </p>
      <p className="text-xs text-[var(--muted2)] mb-8">
        {t("home.description")}
      </p>

      {/* Search + Near Me */}
      <div className={`w-full max-w-md flex gap-2 ${shake ? "animate-shake" : ""}`} ref={searchRef}>
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
          className="px-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] text-[var(--muted)]
            hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
          aria-label={t("home.near_me")}
          title={t("home.near_me")}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>
      </div>

      {/* Discovery lists */}
      <nav className="mt-6 w-full max-w-md">
        <ul className="flex flex-col gap-1">
          {DISCOVERY_LISTS.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-2 px-1 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
              >
                <span>{item.label}</span>
                <span className="text-[var(--muted2)] group-hover:text-[var(--muted)] transition-colors text-[11px] ml-2">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Pick */}
      <button
        onClick={() => goAI(query)}
        className="mt-8 px-8 py-3.5 rounded-xl bg-[var(--foreground)] text-white text-[15px] font-semibold
          hover:opacity-85 active:scale-95 transition-all min-h-[48px]"
      >
        {t("home.pick_for_me")}
      </button>
      <p className="text-xs text-[var(--muted2)] mt-2">
        {t("home.pick_description")}
      </p>

      {/* Value Proposition */}
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
            <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">Database terlengkap dengan foto, jam buka, harga & petunjuk arah</p>
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="absolute bottom-4 text-[11px] text-[var(--muted2)] flex items-center gap-2">
        cafepedia.id — Bandung, Indonesia
        <span>·</span>
        <a href="/blog" className="underline hover:text-[var(--foreground)] transition-colors">{t("home.blog")}</a>
        <span>·</span>
        <a href="/about" className="underline hover:text-[var(--foreground)] transition-colors">About</a>
      </footer>
    </main>
  );
}
