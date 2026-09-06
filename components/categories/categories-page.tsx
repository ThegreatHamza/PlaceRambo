"use client";

import Link from "next/link";
import { ShoppingBag, Home, Car, Smartphone, KeyRound, Wrench, ArrowRight, Microscope } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { LISTINGS } from "@/lib/data";

const EMOJI: Record<string, string> = {
  "real-estate": "🏠",
  vehicles: "🚗",
  electronics: "📱",
  "buy-sell": "🛒",
  rentals: "🔑",
  services: "🔧",
};

export default function CategoriesPage() {
  const { t } = useI18n();
  const catKeys = ["real-estate", "vehicles", "electronics", "buy-sell", "rentals", "services"] as const;
  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <div className="inline-block rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
          🧭 Discover the marketplace
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("categories.title")}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{t("home.categoriesSub")}</p>
      </div>
      <CategoriesGrid />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catKeys.map((cat) => {
          const items = LISTINGS.filter((l) => l.category === cat).slice(0, 3);
          return (
            <Link key={cat} href={`/search/${cat}`} className="card group overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{EMOJI[cat]}</span>
                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600" />
              </div>
              <h2 className="mt-4 text-lg font-extrabold">{t(`categories.${catKey(cat)}`)}</h2>
              <p className="mt-1 text-sm text-slate-500">{t(`categories.${catKey(cat)}Desc`)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((l) => (
                  <span key={l.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{l.title.split(" ").slice(0, 3).join(" ")}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function catKey(cat: string): string {
  const map: Record<string, string> = {
    "real-estate": "realEstate",
    vehicles: "vehicles",
    electronics: "electronics",
    "buy-sell": "buySell",
    rentals: "rentals",
    services: "services",
  };
  return map[cat] || "all";
}
