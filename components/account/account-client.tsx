"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  ListChecks,
  Settings,
  BadgeCheck,
  Building2,
  MapPin,
  Calendar,
  Plus,
  Save,
  Camera,
  LogOut,
  Star,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { ListingCard } from "@/components/listing-card";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/types";

const LANGS: { v: Locale; label: string }[] = [
  { v: "en", label: "English" },
  { v: "fr", label: "Français" },
  { v: "so", label: "Soomaali" },
  { v: "ar", label: "العربية" },
];

export default function AccountClient() {
  const { t, lang, setLang } = useI18n();
  const { user, demoLogin, updateProfile, logout } = useAuth();
  const store = useStore();
  const [tab, setTab] = useState<"profile" | "listings" | "settings">("profile");
  const [savedToast, setSavedToast] = useState(false);

  if (!user) {
    return (
      <div className="container grid min-h-[60vh] place-items-center">
        <div className="card max-w-md p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-teal-50 text-teal-600">
            <UserRound className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold">{t("auth.loginTitle")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("auth.loginSub")}</p>
          <div className="mt-5 space-y-2">
            <Link href="/login" className="btn btn-primary w-full">{t("auth.login")}</Link>
            <Link href="/register" className="btn btn-ghost w-full">{t("auth.register")}</Link>
            <button onClick={demoLogin} className="btn btn-outline w-full">{t("auth.demo")}</button>
          </div>
        </div>
      </div>
    );
  }

  const myListings = store.myListings.filter((l) => l.sellerId === user.id);

  const save = () => {
    updateProfile({});
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="card h-fit p-6 lg:sticky lg:top-24">
          <div className="text-center">
            <div className="relative mx-auto h-20 w-20">
              <span className="grid h-full w-full place-items-center rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 text-2xl font-extrabold text-white">
                {user.name.charAt(0)}
              </span>
              <button className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-slate-100 text-slate-500">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h1 className="mt-3 text-xl font-extrabold">{user.name}</h1>
            <div className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" /> {user.location}
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {user.verified && <span className="badge badge-blue"><BadgeCheck className="h-3 w-3" /> {t("account.verified")}</span>}
              {user.business && <span className="badge badge-green"><Building2 className="h-3 w-3" /> {t("account.business")}</span>}
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> {t("account.joined")} {formatDate(user.joined, lang)}
            </div>
            <div className="mt-5 flex gap-2 text-center">
              <div className="flex-1 rounded-2xl bg-slate-50 p-3">
                <div className="text-lg font-extrabold">{myListings.length}</div>
                <div className="text-[10px] text-slate-400">{t("admin.listings")}</div>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-50 p-3">
                <div className="text-lg font-extrabold text-amber-500">★</div>
                <div className="text-[10px] text-slate-400">{t("common.rating")}</div>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {[
              { id: "profile" as const, icon: UserRound, label: t("account.profile") },
              { id: "listings" as const, icon: ListChecks, label: t("account.listings") },
              { id: "settings" as const, icon: Settings, label: t("account.settings") },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    tab === item.id ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50">
              <LogOut className="h-4 w-4" /> {t("nav.logout")}
            </button>
          </nav>
        </div>

        <div className="min-w-0">
          {tab === "profile" && (
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-extrabold">{t("account.profile")}</h2>
              <p className="mt-1 text-sm text-slate-500">Keep your contact and profile information up to date.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">{t("auth.name")}</label>
                  <input className="input" value={user.name} onChange={(e) => updateProfile({ name: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t("auth.email")}</label>
                  <input className="input" type="email" value={user.email} onChange={(e) => updateProfile({ email: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t("auth.phone")}</label>
                  <input className="input" value={user.phone} onChange={(e) => updateProfile({ phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t("search.location")}</label>
                  <input className="input" value={user.location} onChange={(e) => updateProfile({ location: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Bio / {t("listing.about")}</label>
                  <textarea className="input min-h-[100px]" value={user.bio || ""} onChange={(e) => updateProfile({ bio: e.target.value })} />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">📱 Phone verification will be enabled in production.</span>
                <button onClick={save} className="btn btn-primary">
                  <Save className="h-4 w-4" /> {t("account.save")}
                </button>
              </div>
              {savedToast && <div className="mt-3 rounded-xl bg-teal-50 p-3 text-sm font-semibold text-teal-700 animate-scale-in">✓ {t("account.saved")}</div>}
            </div>
          )}

          {tab === "listings" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">{t("account.listings")} <span className="text-slate-300">({myListings.length})</span></h2>
                <Link href="/sell" className="btn btn-primary text-sm">
                  <Plus className="h-4 w-4" /> {t("nav.sell")}
                </Link>
              </div>
              {myListings.length === 0 ? (
                <div className="card grid place-items-center p-12 text-center">
                  <div className="text-5xl">📦</div>
                  <h3 className="mt-4 font-extrabold">No listings yet</h3>
                  <p className="mt-1 text-sm text-slate-500">Publish your first listing to reach thousands of buyers.</p>
                  <Link href="/sell" className="btn btn-primary mt-5"><Plus className="h-4 w-4" /> {t("home.ctaButton")}</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {myListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
                </div>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-extrabold">{t("account.settings")}</h2>
              <div className="mt-6">
                <label className="label">{t("account.language")}</label>
                <div className="grid gap-2 sm:grid-cols-4">
                  {LANGS.map((l) => (
                    <button
                      key={l.v}
                      onClick={() => setLang(l.v)}
                      className={`rounded-2xl border-2 p-4 text-center font-bold transition ${
                        lang === l.v ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-slate-700">
                  <BadgeCheck className="h-4 w-4 text-sky-500" /> Verification
                </h3>
                <p className="mt-1 text-xs text-slate-500">Verify your phone and business to get a trusted badge on your listings.</p>
                <div className="mt-3 flex gap-2">
                  <span className="badge badge-green">✓ {t("listing.verifiedSeller")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
