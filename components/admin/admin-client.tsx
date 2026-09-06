"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Package,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  ShieldCheck,
  BadgeCheck,
  Check,
  Flag,
  X,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { LISTINGS, SELLERS } from "@/lib/data";
import { formatPriceLabel } from "@/lib/utils";
import type { Listing } from "@/lib/types";

type Status = Listing["status"];

export default function AdminClient() {
  const { t } = useI18n();
  const { allUsers, user } = useAuth();
  const store = useStore();
  const [tab, setTab] = useState<"stats" | "users" | "listings">("stats");
  const [listings, setListings] = useState<Listing[]>(() => [
    ...LISTINGS.map((l) => ({ ...l })),
    ...store.myListings,
  ]);

  const totals = useMemo(() => {
    const active = listings.filter((l) => l.status === "active").length;
    const pending = listings.filter((l) => l.status === "pending").length;
    const flagged = listings.filter((l) => l.status === "flagged").length;
    return { active, pending, flagged };
  }, [listings]);

  const updateStatus = (id: string, status: Status) => {
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const stats = [
    { label: t("admin.totalUsers"), value: 12840, icon: Users, delta: "+12.4%", color: "text-teal-600 bg-teal-50" },
    { label: t("admin.totalListings"), value: 8624, icon: Package, delta: "+18.2%", color: "text-sky-600 bg-sky-50" },
    { label: t("admin.categories"), value: 6, icon: Layers, delta: "Live", color: "text-indigo-600 bg-indigo-50" },
    { label: t("admin.transactions"), value: 3210, icon: BarChart3, delta: "+9.8%", color: "text-amber-600 bg-amber-50" },
  ];

  const recentUsers = allUsers.length >= 3 ? allUsers : [
    { id: "u1", name: "Amina Hassan", email: "amina@placerambo.dj", location: "Djibouti City", joined: "2026-09-01T00:00:00.000Z", verified: true, business: false },
    { id: "u2", name: "Mohamed Ali", email: "mohamed@mail.dj", location: "Balbala", joined: "2026-08-28T00:00:00.000Z", verified: false, business: true },
    { id: "u3", name: "Fatma Dirie", email: "fatma@mail.dj", location: "Tadjourah", joined: "2026-08-21T00:00:00.000Z", verified: true, business: false },
    { id: "u4", name: "Youssouf Omar", email: "youssouf@mail.dj", location: "Ali Sabieh", joined: "2026-08-15T00:00:00.000Z", verified: false, business: false },
  ];

  const chartData = [42, 58, 50, 72, 68, 88, 94];
  const months = ["Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août"];

  const statusBadge: Record<Status, string> = {
    active: "badge-green",
    pending: "badge-amber",
    flagged: "badge-red",
    rejected: "badge-grey",
  };

  return (
    <div className="container py-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin panel
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{t("admin.title")}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{t("admin.subtitle")}</p>
        </div>
        <button onClick={() => setListings([...LISTINGS.map((l) => ({ ...l })), ...store.myListings])} className="btn btn-ghost text-sm">
          <RefreshCw className="h-4 w-4" /> {t("admin.fetch")}
        </button>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="badge badge-green">{s.delta}</span>
              </div>
              <div className="mt-4 text-2xl font-extrabold">{s.value.toLocaleString()}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-extrabold"><TrendingUp className="h-4 w-4 text-teal-600" /> {t("admin.monthlyGrowth")}</h3>
            <span className="badge badge-green">+18.2%</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {chartData.map((v, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-teal-300 transition group-hover:from-teal-600 group-hover:to-teal-400" style={{ height: `${v}%`, maxHeight: 180 }} />
                <span className="text-[10px] font-semibold text-slate-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-extrabold"><PieChart className="h-4 w-4 text-indigo-600" /> {t("admin.categories")}</h3>
          <div className="mt-5 space-y-3">
            {[
              { label: t("categories.realEstate"), pct: 34, color: "bg-teal-500" },
              { label: t("categories.vehicles"), pct: 26, color: "bg-emerald-500" },
              { label: t("categories.electronics"), pct: 18, color: "bg-sky-500" },
              { label: t("categories.buySell"), pct: 12, color: "bg-amber-500" },
              { label: t("categories.services"), pct: 10, color: "bg-indigo-500" },
            ].map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{c.label}</span>
                  <span className="text-slate-400">{c.pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="text-3xl font-extrabold text-teal-600">{totals.active}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{t("admin.active")} listings</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-extrabold text-amber-500">{totals.pending}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{t("admin.pendingListings")}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-extrabold text-rose-500">{totals.flagged}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{t("admin.flagged")}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 hide-scrollbar">
        {([
          { id: "stats", label: t("admin.analytics") },
          { id: "users", label: t("admin.users") },
          { id: "listings", label: t("admin.listings") },
        ] as const).map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              tab === item.id ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-extrabold">{t("admin.report") || t("admin.reports")}</h3>
            <div className="mt-4 space-y-3">
              {[
                { text: "Duplicate listing reported", time: "2h ago", icon: AlertTriangle },
                { text: "Suspicious car price", time: "5h ago", icon: Flag },
                { text: "Unverified business search", time: "1d ago", icon: ShieldCheck },
              ].map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{r.text}</div>
                      <div className="text-xs text-slate-400">{r.time}</div>
                    </div>
                    <button className="badge badge-red">Review</button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-extrabold">{t("admin.verifiedSellers")}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Businesses", value: 642 },
                { label: "Individuals", value: 2180 },
                { label: "Cars dealers", value: 185 },
                { label: "Agents", value: 94 },
              ].map((v) => (
                <div key={v.label} className="rounded-2xl border border-slate-100 p-4 text-center">
                  <div className="text-xl font-extrabold text-teal-700">{v.value.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">{v.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="card mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">{t("search.location")}</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 font-bold text-white">{u.name.charAt(0)}</span>
                      <div>
                        <div className="font-bold">{u.name}</div>
                        {u.verified && <span className="badge badge-blue mt-0.5"><BadgeCheck className="h-3 w-3" /> Verified</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4 text-slate-500">{u.location}</td>
                  <td className="p-4"><span className={`badge ${u.verified ? "badge-green" : "badge-grey"}`}>{u.verified ? "Verified" : "Unverified"}</span></td>
                  <td className="p-4">
                    <button
                      className="btn btn-outline px-3 py-1.5 text-xs"
                      onClick={() => {
                        // demo verify action
                      }}
                    >
                      <Check className="h-3 w-3" /> {t("admin.verify")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "listings" && (
        <div className="card mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="p-4 font-bold">Listing</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">{t("search.location")}</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image src={l.images[0]?.url} alt={l.title} fill sizes="64px" className="object-cover" />
                      </span>
                      <div className="min-w-0">
                        <Link href={`/listing/${l.id}`} className="truncate font-bold hover:text-teal-700">{l.title}</Link>
                        <div className="text-xs text-slate-400">{l.category} · {l.kind}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold">{formatPriceLabel(l.price, l.priceLabel)}</td>
                  <td className="p-4 text-slate-500">{l.location}</td>
                  <td className="p-4"><span className={`badge ${statusBadge[l.status]}`}>{t(`admin.status${capitalize(l.status)}`)}</span></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => updateStatus(l.id, "active")} className="btn btn-ghost px-2 py-1.5 text-xs" title={t("admin.approve")}><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => updateStatus(l.id, "flagged")} className="btn btn-ghost px-2 py-1.5 text-xs text-amber-600" title={t("admin.flag")}><Flag className="h-3.5 w-3.5" /></button>
                      <button onClick={() => updateStatus(l.id, "rejected")} className="btn btn-ghost px-2 py-1.5 text-xs text-rose-600" title={t("admin.reject")}><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
