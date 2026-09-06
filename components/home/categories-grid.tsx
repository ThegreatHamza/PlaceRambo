"use client";

import Link from "next/link";
import {
  Home,
  Car,
  Smartphone,
  ShoppingBag,
  KeyRound,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_COUNT } from "@/lib/data";

const CATS = [
  { key: "realEstate", cat: "real-estate", icon: Home, color: "from-teal-500 to-teal-600", bg: "bg-teal-50 text-teal-600" },
  { key: "vehicles", cat: "vehicles", icon: Car, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 text-emerald-600" },
  { key: "electronics", cat: "electronics", icon: Smartphone, color: "from-sky-500 to-sky-600", bg: "bg-sky-50 text-sky-600" },
  { key: "buySell", cat: "buy-sell", icon: ShoppingBag, color: "from-amber-500 to-amber-600", bg: "bg-amber-50 text-amber-600" },
  { key: "rentals", cat: "rentals", icon: KeyRound, color: "from-rose-500 to-rose-600", bg: "bg-rose-50 text-rose-600" },
  { key: "services", cat: "services", icon: Wrench, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 text-indigo-600" },
];

export function CategoriesGrid({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {CATS.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.key}
            href={`/search/${c.cat}`}
            className="group card flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className={`grid h-14 w-14 place-items-center rounded-2xl ${c.bg} transition group-hover:scale-110`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink">{t(`categories.${c.key}`)}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                {CATEGORY_COUNT[c.cat] || 0} items
              </div>
            </div>
            <span className="mt-auto grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-teal-300 group-hover:text-teal-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
