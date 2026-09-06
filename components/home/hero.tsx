"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, Star, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const POPULAR = [
  { label: "Toyota Prado", q: "Toyota Prado" },
  { label: "Apartment for rent", q: "Apartment for rent" },
  { label: "Samsung phone", q: "Samsung phone" },
  { label: "Construction worker", q: "Construction worker" },
];

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    alt: "Car in Djibouti",
  },
  {
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    alt: "Modern home",
  },
];

export default function Hero() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent, query = q) => {
    e.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#d1fae5,transparent_55%),linear-gradient(160deg,#f0fdfa_0%,#f8fafc_60%)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="container relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t("hero.badge")}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t("hero.title").split(" ").slice(0, -3).join(" ")}{" "}
              <span className="text-gradient">
                {t("hero.title").split(" ").slice(-3).join(" ")}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <form
              onSubmit={submit}
              className="relative z-10 mt-7 flex flex-col gap-2 rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_18px_50px_rgba(13,148,136,0.14)] backdrop-blur sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 rounded-2xl px-3 py-2 sm:px-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                  <Search className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("hero.searchPlaceholder")}
                    className="w-full bg-transparent text-sm font-semibold text-ink outline-none sm:text-base"
                  />
                  <p className="hidden text-[11px] text-slate-400 sm:block">{t("hero.searchHint")}</p>
                </div>
              </div>
              <button type="submit" className="btn btn-primary px-6 py-3 text-base">
                <Search className="h-4 w-4" />
                {t("hero.cta")}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">{t("hero.popular")}</span>
              {POPULAR.map((p) => (
                <button
                  key={p.q}
                  onClick={(e) => submit(e, p.q)}
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
              {[
                { icon: "⚡", value: "12K+", label: t("hero.statListings") },
                { icon: "✓", value: "3K+", label: t("hero.statSellers") },
                { icon: "★", value: "98%", label: t("hero.statSatisfaction") },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white bg-white/70 p-3 shadow-sm backdrop-blur sm:p-4"
                >
                  <div className="text-2xl font-extrabold text-brand">{s.value}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-slate-500 sm:text-xs">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto h-[560px]">
              <div className="animate-fade-up absolute right-2 top-4 h-[360px] w-[300px] rotate-3 overflow-hidden rounded-[2rem] shadow-[0_30px_70px_rgba(13,148,136,0.25)]">
                <Image
                  src={HERO_IMAGES[0].url}
                  alt={HERO_IMAGES[0].alt}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div
                className="animate-fade-up absolute bottom-2 left-0 h-[340px] w-[290px] -rotate-3 overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_30px_70px_rgba(15,23,42,0.2)]"
                style={{ animationDelay: "150ms" }}
              >
                <Image
                  src={HERO_IMAGES[1].url}
                  alt={HERO_IMAGES[1].alt}
                  fill
                  sizes="290px"
                  className="object-cover"
                />
              </div>
              <div className="animate-scale-in absolute left-4 top-14 z-10 card flex items-center gap-3 p-3" style={{ animationDelay: "250ms" }}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-extrabold">{t("common.verified")} Seller</div>
                  <div className="text-xs text-slate-400">Ayan Auto</div>
                </div>
              </div>
              <div className="animate-scale-in absolute bottom-8 right-4 z-10 card flex items-center gap-3 p-3" style={{ animationDelay: "400ms" }}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-extrabold">4.9 / 5</div>
                  <div className="text-xs text-slate-400">184 reviews</div>
                </div>
              </div>
              <div className="animate-scale-in absolute bottom-1/3 left-8 z-10 card flex items-center gap-3 p-3" style={{ animationDelay: "550ms" }}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-extrabold">300+</div>
                  <div className="text-xs text-slate-400">Active sellers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
