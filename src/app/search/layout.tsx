import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Cafe di Bandung — Cafepedia",
  description: "Cari cafe berdasarkan suasana, lokasi, harga. 4.000+ tempat di Bandung dengan foto & info lengkap.",
  alternates: { canonical: "https://cafepedia.id/search" },
  openGraph: {
    title: "Cari Cafe di Bandung — Cafepedia",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
