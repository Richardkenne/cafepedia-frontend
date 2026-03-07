"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface CafePick {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  tags: string[];
  hero_photo?: string;
  reason: string;
}

interface GroupPickResponse {
  preferences: string[];
  intents: string[];
  picks: {
    best: CafePick;
    runner_up: CafePick;
  };
}

function buildSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function PickCard({
  pick,
  label,
  primary,
}: {
  pick: CafePick;
  label: string;
  primary?: boolean;
}) {
  const slug = buildSlug(pick.name);
  const href = `/cafe/${pick.id}-${slug}`;

  return (
    <Link href={href} className="block">
      <div
        className={`rounded-2xl overflow-hidden border transition-shadow hover:shadow-lg ${
          primary
            ? "border-amber-300 bg-white shadow-md"
            : "border-gray-200 bg-white"
        }`}
      >
        {pick.hero_photo && (
          <div className={`relative w-full ${primary ? "h-56" : "h-40"}`}>
            <Image
              src={pick.hero_photo}
              alt={pick.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className={primary ? "p-5" : "p-4"}>
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
              primary ? "text-amber-600" : "text-gray-400"
            }`}
          >
            {label}
          </p>

          <h3
            className={`font-bold ${primary ? "text-xl" : "text-lg"} text-gray-900`}
          >
            {pick.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span>{pick.neighborhood}</span>
            {pick.rating > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-500 font-medium">
                  {pick.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {pick.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pick.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {pick.reason}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function GroupPick() {
  const [preferences, setPreferences] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GroupPickResponse | null>(null);

  const updatePref = (index: number, value: string) => {
    setPreferences((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPerson = () => {
    if (preferences.length < 5) {
      setPreferences((prev) => [...prev, ""]);
    }
  };

  const removePerson = (index: number) => {
    if (preferences.length > 2) {
      setPreferences((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    const filled = preferences.filter((p) => p.trim().length > 0);
    if (filled.length < 2) {
      setError("At least 2 people must write a preference.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/premium/group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: filled }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data: GroupPickResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Group Pick</h2>
      <p className="text-sm text-gray-500 mb-6">
        Everyone writes what they want — we find the compromise.
      </p>

      <div className="space-y-3 mb-4">
        {preferences.map((pref, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 w-6 shrink-0">
              #{i + 1}
            </span>
            <input
              type="text"
              value={pref}
              onChange={(e) => updatePref(i, e.target.value)}
              placeholder={`What does person ${i + 1} want?`}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {preferences.length > 2 && (
              <button
                onClick={() => removePerson(i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
                aria-label="Remove person"
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-8">
        {preferences.length < 5 && (
          <button
            onClick={addPerson}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            + Add person
          </button>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Finding compromise..." : "Find Compromise"}
      </button>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <PickCard pick={result.picks.best} label="Best Compromise" primary />
          <PickCard pick={result.picks.runner_up} label="Runner Up" />
        </div>
      )}
    </div>
  );
}
