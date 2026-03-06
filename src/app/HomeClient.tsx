"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import LangToggle from "@/components/LangToggle";
import { useTranslation } from "@/lib/i18n";

export default function HomeClient({ discoveryLinks }: { discoveryLinks: ReactNode }) {
  const [query, setQuery] = useState("");
  const [shake, setShake] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    <>
      {/* Language toggle — top right */}
      <div className="absolute top-4 right-4 z-10">
        <LangToggle />
      </div>

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
          className="px-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)] text-[var(--muted)]
            hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
          aria-label={t("home.near_me")}
          title={t("home.near_me")}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>
      </div>

      {/* Discovery links (server-rendered, passed as slot) */}
      {discoveryLinks}

      {/* AI Pick */}
      <button
        onClick={() => goAI(query)}
        className="mt-10 px-8 py-4 rounded-2xl bg-[var(--accent)] text-white text-base font-semibold
          hover:opacity-85 active:scale-95 transition-all min-h-[48px]"
      >
        {t("home.pick_for_me")}
      </button>
      <p className="text-xs text-[var(--muted2)] mt-2">
        {t("home.pick_description")}
      </p>

      {/* Install banner */}
      {showInstall && (
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-[var(--border)] px-6 py-4 flex items-center justify-between gap-4 z-50 shadow-lg">
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
    </>
  );
}
