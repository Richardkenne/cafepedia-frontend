"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const SUGGESTIONS = [
  { label: "Work", q: "work cafes" },
  { label: "Quiet", q: "quiet cafes" },
  { label: "Premium", q: "premium cafes" },
  { label: "Outdoor", q: "outdoor cafes" },
  { label: "Hidden Gems", q: "hidden gem" },
  { label: "View", q: "mountain view" },
  { label: "Coffee", q: "coffee" },
  { label: "Brunch", q: "brunch" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [shake, setShake] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

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
      alert("Location not supported on this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        router.push(`/search?q=&near=${pos.coords.latitude},${pos.coords.longitude}`);
      },
      (err) => {
        if (err.code === 1) alert("Location access denied. Enable it in your browser settings.");
        else if (err.code === 3) alert("Location timed out. Try again.");
        else alert("Could not get your location. Try searching instead.");
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
    <main className="flex flex-col items-center justify-center min-h-dvh px-6">
      {/* Logo */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
        Cafepedia
      </h1>
      <p className="text-sm text-[var(--muted2)] mb-1">
        Discover cafes in Bandung
      </p>
      <p className="text-xs text-[var(--muted2)] mb-8">
        600+ cafes with photos, hours & directions
      </p>

      {/* Search + Near Me */}
      <div className={`w-full max-w-md flex gap-2 ${shake ? "animate-shake" : ""}`} ref={searchRef}>
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={go}
            placeholder="Search cafes, areas, vibes..."
            large
            autoFocus
          />
        </div>
        <button
          onClick={goNear}
          className="px-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] text-[var(--muted)]
            hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
          aria-label="Near me"
          title="Near me"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 mt-5 flex-wrap justify-center">
        {SUGGESTIONS.map(s => (
          <button
            key={s.q}
            onClick={() => go(s.q)}
            className="px-4 py-2 rounded-full text-[13px] font-medium border border-[var(--border)] text-[var(--muted)]
              hover:bg-[var(--surface)] active:scale-95 transition-all min-h-[44px]"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* AI Pick */}
      <button
        onClick={() => goAI(query)}
        className="mt-8 px-8 py-3.5 rounded-xl bg-[var(--foreground)] text-white text-[15px] font-semibold
          hover:opacity-85 active:scale-95 transition-all min-h-[48px]"
      >
        Pick for me
      </button>
      <p className="text-xs text-[var(--muted2)] mt-2">
        Describe what you want — AI finds it
      </p>

      {/* Install banner */}
      {showInstall && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] px-6 py-4 flex items-center justify-between gap-4 z-50 shadow-lg">
          <p className="text-[13px] text-[var(--muted)]">
            Add Cafepedia to your home screen
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={dismissInstall}
              className="text-[13px] text-[var(--muted2)] px-3 py-2 min-h-[44px]"
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              className="text-[13px] font-semibold bg-[var(--foreground)] text-white px-4 py-2 rounded-lg min-h-[44px]"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-[11px] text-[var(--muted2)] flex items-center gap-2">
        cafepedia.id — Bandung, Indonesia
        <span>·</span>
        <a href="/blog" className="underline hover:text-[var(--foreground)] transition-colors">Blog</a>
      </footer>
    </main>
  );
}
