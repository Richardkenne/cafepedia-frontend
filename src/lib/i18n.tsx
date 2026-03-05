"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Lang = "en" | "id";

const translations = {
  // Homepage
  "home.subtitle": {
    en: "Discover cafes in Bandung",
    id: "Temukan cafe di Bandung",
  },
  "home.description": {
    en: "600+ cafes with photos, hours & directions",
    id: "600+ cafe dengan foto, jam buka & petunjuk arah",
  },
  "home.search_placeholder": {
    en: "Search cafes, areas, vibes...",
    id: "Cari cafe, area, suasana...",
  },
  "home.pick_for_me": {
    en: "Pick for me",
    id: "Pilihkan untukku",
  },
  "home.pick_description": {
    en: "Describe what you want \u2014 AI finds it",
    id: "Deskripsikan yang kamu mau \u2014 AI cari",
  },
  "home.install_prompt": {
    en: "Add Cafepedia to your home screen",
    id: "Tambahkan Cafepedia ke layar utama",
  },
  "home.install": {
    en: "Install",
    id: "Pasang",
  },
  "home.later": {
    en: "Later",
    id: "Nanti",
  },
  "home.blog": {
    en: "Blog",
    id: "Blog",
  },
  "home.near_me": {
    en: "Near me",
    id: "Dekat saya",
  },

  // Suggestion chips
  "chip.work": { en: "Work", id: "Kerja" },
  "chip.quiet": { en: "Quiet", id: "Tenang" },
  "chip.premium": { en: "Premium", id: "Premium" },
  "chip.outdoor": { en: "Outdoor", id: "Outdoor" },
  "chip.hidden_gems": { en: "Hidden Gems", id: "Tersembunyi" },
  "chip.view": { en: "View", id: "Pemandangan" },
  "chip.coffee": { en: "Coffee", id: "Kopi" },
  "chip.brunch": { en: "Brunch", id: "Brunch" },

  // Search page
  "search.cafes_found": {
    en: "cafes found",
    id: "cafe ditemukan",
  },
  "search.cafe_found": {
    en: "cafe found",
    id: "cafe ditemukan",
  },
  "search.sorted_by_distance": {
    en: "sorted by distance",
    id: "urut berdasarkan jarak",
  },
  "search.no_cafes": {
    en: "No cafes found",
    id: "Cafe tidak ditemukan",
  },
  "search.try_different": {
    en: "Try a different search",
    id: "Coba pencarian lain",
  },
  "search.placeholder": {
    en: "Search cafes...",
    id: "Cari cafe...",
  },

  // Pick page
  "pick.back": {
    en: "\u2190 Back",
    id: "\u2190 Kembali",
  },
  "pick.finding": {
    en: "Finding the best cafes for you...",
    id: "Mencari cafe terbaik untukmu...",
  },
  "pick.top_picks": {
    en: "Top picks for you",
    id: "Pilihan terbaik untukmu",
  },
  "pick.also_worth": {
    en: "Also worth checking",
    id: "Juga patut dicoba",
  },
  "pick.no_match": {
    en: "Couldn't find matching cafes. Try a different description.",
    id: "Tidak menemukan cafe yang cocok. Coba deskripsi lain.",
  },
  "pick.loading": {
    en: "Loading...",
    id: "Memuat...",
  },

  // Alerts
  "alert.location_not_supported": {
    en: "Location not supported on this browser",
    id: "Lokasi tidak didukung di browser ini",
  },
  "alert.location_denied": {
    en: "Location access denied. Enable it in your browser settings.",
    id: "Akses lokasi ditolak. Aktifkan di pengaturan browser.",
  },
  "alert.location_timeout": {
    en: "Location timed out. Try again.",
    id: "Lokasi timeout. Coba lagi.",
  },
  "alert.location_error": {
    en: "Could not get your location. Try searching instead.",
    id: "Tidak bisa mendapatkan lokasi. Coba cari manual.",
  },
  "alert.location_error_short": {
    en: "Could not get your location.",
    id: "Tidak bisa mendapatkan lokasi.",
  },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "id",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cafepedia-lang") as Lang | null;
    if (saved && (saved === "en" || saved === "id")) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("cafepedia-lang", newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] || entry["en"] || key;
    },
    [lang]
  );

  // Prevent hydration mismatch: render with default lang until mounted
  const value = {
    lang: mounted ? lang : "id",
    setLang,
    t: mounted ? t : (key: TranslationKey) => translations[key]?.["id"] || key,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
