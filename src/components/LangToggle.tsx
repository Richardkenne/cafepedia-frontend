"use client";

import { useTranslation } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="inline-flex rounded-lg border border-[var(--border)] text-[11px] font-medium overflow-hidden">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-[var(--foreground)] text-white"
            : "text-[var(--muted2)] hover:bg-[var(--surface)]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("id")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "id"
            ? "bg-[var(--foreground)] text-white"
            : "text-[var(--muted2)] hover:bg-[var(--surface)]"
        }`}
      >
        ID
      </button>
    </div>
  );
}
