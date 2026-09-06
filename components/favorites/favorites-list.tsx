"use client";

import Link from "next/link";
import { HeartOff, Search } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { LISTINGS } from "@/lib/data";

export default function FavoritesList() {
  const { t } = useI18n();
  const store = useStore();
  const items = LISTINGS.filter((l) => store.favorites.includes(l.id));

  return (
    <div className="container py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span className="text-rose-500">♥</span> {t("favorites.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{t("favorites.sub")}</p>
      </div>
      {items.length === 0 ? (
        <div className="card grid place-items-center p-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-rose-50 text-rose-500">
            <HeartOff className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-extrabold">{t("favorites.empty")}</h3>
          <Link href="/search" className="btn btn-primary mt-5">
            <Search className="h-4 w-4" /> {t("hero.cta")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
