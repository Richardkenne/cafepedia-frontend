import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Cafe di Bandung — Cafepedia",
  description: "Cari cafe berdasarkan suasana, lokasi, harga. 600+ cafe di Bandung dengan foto & info lengkap.",
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
