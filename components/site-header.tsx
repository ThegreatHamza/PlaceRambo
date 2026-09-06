"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Store,
  Menu,
  X,
  Heart,
  MessageCircle,
  Search,
  Plus,
  ChevronDown,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Languages,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import type { Locale } from "@/lib/types";

const LANG_LABEL: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  so: "SO",
  ar: "ع",
};

const NAV = [
  { href: "/search/vehicles", key: "nav.vehicles" },
  { href: "/search/real-estate", key: "nav.realestate" },
  { href: "/search/rentals", key: "nav.rentals" },
  { href: "/search/services", key: "nav.services" },
];

export default function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { user, logout, demoLogin } = useAuth();
  const store = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
    setUserOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-500/25 transition group-hover:scale-105">
            <Store className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Place<span className="text-brand">Rambo</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/search"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink"
          >
            {t("nav.search")}
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                pathname.includes(item.href.replace("/search", ""))
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100"
              aria-label="Language"
            >
              <Languages className="h-4 w-4" />
              <span className="absolute -bottom-0.5 right-0 text-[8px] font-bold text-slate-500">
                {LANG_LABEL[lang]}
              </span>
            </button>
            {langOpen && (
              <div className="animate-scale-in absolute right-0 top-12 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                {(["en", "fr", "so", "ar"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      lang === l ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {l === "en" ? "English" : l === "fr" ? "Français" : l === "so" ? "Soomaali" : "العربية"}
                    <span className="uppercase text-[10px]">{LANG_LABEL[l]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/favorites"
            className="relative hidden h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:grid"
            aria-label="Favorites"
          >
            <Heart className="h-4 w-4" />
            {store.favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {store.favorites.length}
              </span>
            )}
          </Link>

          <Link
            href="/messages"
            className="relative hidden h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:grid"
            aria-label="Messages"
          >
            <MessageCircle className="h-4 w-4" />
            {store.conversations.some((c) => c.unread && c.unread > 0) && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                {store.conversations.reduce((n, c) => n + (c.unread || 0), 0)}
              </span>
            )}
          </Link>

          <Link href="/sell" className="btn btn-primary hidden text-sm md:inline-flex">
            <Plus className="h-4 w-4" />
            {t("nav.sell")}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((v) => !v)}
                className="flex items-center gap-1 rounded-xl px-1.5 py-1 transition hover:bg-slate-100"
              >
                <span className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-100">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>
              {userOpen && (
                <div className="animate-scale-in absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-base font-bold text-white">
                        {user.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-bold">{user.name}</div>
                        <div className="truncate text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <Link href="/account" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                      <User className="h-4 w-4" /> {t("account.title")}
                    </Link>
                    <Link href="/sell" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                      <Plus className="h-4 w-4" /> {t("nav.sell")}
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setUserOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserOpen(false);
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> {t("nav.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                {t("nav.login")}
              </Link>
              <Link href="/register" className="btn btn-dark text-sm">
                {t("nav.register")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-up border-t border-slate-100 bg-white lg:hidden">
          <div className="container space-y-1 py-4">
            <Link href="/search" className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Search className="h-4 w-4" /> {t("nav.search")}
            </Link>
            {NAV.concat([{ href: "/categories", key: "nav.categories" }]).map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4" /> {t(item.key)}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/favorites" className="btn btn-ghost text-sm">
                <Heart className="h-4 w-4" /> {t("nav.favorites")}
              </Link>
              <Link href="/messages" className="btn btn-ghost text-sm">
                <MessageCircle className="h-4 w-4" /> {t("nav.messages")}
              </Link>
            </div>
            <Link href="/sell" className="btn btn-primary mt-2 w-full">
              <Plus className="h-4 w-4" /> {t("nav.sell")}
            </Link>
            {!user && (
              <button
                onClick={() => demoLogin()}
                className="btn btn-ghost mt-1 w-full text-sm"
              >
                {t("auth.demo")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
