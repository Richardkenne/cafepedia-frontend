import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilihkan Cafe Untukku — Cafepedia AI",
  description: "Bingung mau ke cafe mana? AI Cafepedia pilihkan 3 cafe terbaik sesuai keinginanmu.",
  openGraph: {
    title: "Pilihkan Cafe Untukku — Cafepedia AI",
  },
};

export default function PickLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
