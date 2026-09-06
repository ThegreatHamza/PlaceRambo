"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Star, MapPin, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SELLERS } from "@/lib/data";

export function TrustedSellers() {
  const { t } = useI18n();
  const sellers = SELLERS.filter((s) => s.featured).slice(0, 4);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sellers.map((s, i) => (
        <Link
          key={s.id}
          href={`/seller/${s.id}`}
          className="card group overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] animate-fade-up"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
              <Image src={s.avatar} alt={s.name} fill sizes="56px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="truncate font-bold text-ink">{s.name}</div>
                {s.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-sky-500" />}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" /> {s.location}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{s.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({s.reviewCount})</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {s.listingsCount} {t("admin.listings").toLowerCase()}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{s.bio}</p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-brand">
            <span>{t("listing.contact")}</span>
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
