"use client";

import Link from "next/link";
import { ArrowRight, UserRound, Package, MessageCircle, ShieldCheck, Zap, Globe2, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function CtaBanner() {
  const { t } = useI18n();
  return (
    <section className="container py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-8 text-white shadow-2xl sm:p-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="badge badge-green !bg-white/15 !text-white">
            <Zap className="h-3 w-3" /> 2 min
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.ctaTitle")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/85">{t("home.ctaSub")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sell" className="btn bg-white !text-teal-700 hover:bg-teal-50">
              {t("home.ctaButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className="btn border border-white/30 bg-white/10 !text-white hover:bg-white/20">
              <Globe2 className="h-4 w-4" />
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: UserRound, title: t("home.step1Title"), sub: t("home.step1Sub") },
    { icon: Package, title: t("home.step2Title"), sub: t("home.step2Sub") },
    { icon: MessageCircle, title: t("home.step3Title"), sub: t("home.step3Sub") },
  ];
  return (
    <section className="container py-12">
      <div className="mb-8 text-center">
        <h2 className="section-title text-ink">{t("home.howTitle")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted sm:text-base">{t("home.howSub")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="card relative p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
            >
              <span className="absolute right-5 top-5 text-5xl font-extrabold text-teal-100">{`0${i + 1}`}</span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WhySection() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck, title: t("footer.safety"), desc: t("home.whySub") },
    { icon: Zap, title: "Fast & mobile-first", desc: "Built for the modern web, from Djibouti City to Ali Sabieh." },
    { icon: CreditCard, title: "Ready for payments", desc: "Prepared for mobile money, cards and bank transfer." },
    { icon: Globe2, title: "Multilingual", desc: "Français · Soomaali · العربية · English" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="section-title text-ink">{t("home.whyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted sm:text-base">{t("home.whySub")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-100 p-6 text-center transition hover:border-teal-200 hover:bg-teal-50/30">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold">{it.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
