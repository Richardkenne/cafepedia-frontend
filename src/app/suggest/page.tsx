"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function SuggestPage() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [gmaps, setGmaps] = useState("");
  const [instagram, setInstagram] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSending(true);
    setError("");
    try {
      const r = await fetch(`${API_BASE}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          area: area.trim(),
          google_maps_link: gmaps.trim(),
          instagram: instagram.trim(),
          notes: notes.trim(),
        }),
      });
      if (!r.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Gagal mengirim. Coba lagi nanti.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h1 className="text-xl font-bold mb-2">Terima kasih!</h1>
        <p className="text-[var(--muted)] text-sm mb-6">
          Saran kamu akan kami review dan tambahkan ke Cafepedia.
        </p>
        <Link href="/" className="text-sm font-medium text-blue-600">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-white/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-[var(--muted)] text-sm font-medium p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center">
            &larr; Kembali
          </Link>
          <h1 className="text-sm font-semibold truncate flex-1">Sarankan Cafe</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <p className="text-[var(--muted)] text-sm mb-6">
          Tahu cafe bagus yang belum ada di Cafepedia? Beritahu kami!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--muted2)] uppercase tracking-wider">
              Nama cafe *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Kopi Kenangan Dago"
              required
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[var(--border)] text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--muted2)] uppercase tracking-wider">
              Area / Lokasi
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="contoh: Dago, Braga, Buah Batu"
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[var(--border)] text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--muted2)] uppercase tracking-wider">
              Link Google Maps
            </label>
            <input
              type="url"
              value={gmaps}
              onChange={(e) => setGmaps(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[var(--border)] text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--muted2)] uppercase tracking-wider">
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@namacafe"
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[var(--border)] text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--muted2)] uppercase tracking-wider">
              Catatan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kenapa cafe ini bagus? Apa yang spesial?"
              rows={3}
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[var(--border)] text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={sending || !name.trim()}
            className="mt-2 py-3.5 rounded-xl bg-[var(--foreground)] text-white text-[14px] font-semibold
              disabled:opacity-50 active:scale-95 transition-transform min-h-[48px]"
          >
            {sending ? "Mengirim..." : "Kirim Saran"}
          </button>
        </form>
      </main>
    </div>
  );
}
