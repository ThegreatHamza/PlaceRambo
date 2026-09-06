"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  ImagePlus,
  Wand2,
  LineChart,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import type { Category, Condition, Listing, ListingKind } from "@/lib/types";
import Link from "next/link";

const CATEGORY_OPTIONS: { value: Category; labelKey: string; kind: ListingKind; sample: string }[] = [
  { value: "vehicles", labelKey: "categories.vehicles", kind: "vehicles", sample: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80" },
  { value: "real-estate", labelKey: "categories.realEstate", kind: "real-estate", sample: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80" },
  { value: "electronics", labelKey: "categories.electronics", kind: "products", sample: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80" },
  { value: "buy-sell", labelKey: "categories.buySell", kind: "products", sample: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80" },
  { value: "rentals", labelKey: "categories.rentals", kind: "rentals", sample: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80" },
  { value: "services", labelKey: "categories.services", kind: "services", sample: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=900&q=80" },
];

const LOCATIONS = [
  "Djibouti City", "Djibouti City Centre", "Balbala", "Heron", "Sheik Ismail",
  "Tadjourah", "Ali Sabieh", "Dikhil", "Obock", "Arta",
];

const CONDITIONS: { value: Condition; key: string }[] = [
  { value: "new", key: "listing.condition.new" },
  { value: "used", key: "listing.condition.used" },
  { value: "refurbished", key: "listing.condition.refurbished" },
  { value: "for-rent", key: "listing.condition.for-rent" },
  { value: "service", key: "listing.condition.service" },
];

export default function SellForm() {
  const { t } = useI18n();
  const router = useRouter();
  const store = useStore();
  const { user, demoLogin } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<ListingKind>("products");
  const [category, setCategory] = useState<Category>("buy-sell");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [priceLabel, setPriceLabel] = useState("");
  const [location, setLocation] = useState("Djibouti City");
  const [condition, setCondition] = useState<Condition>("used");
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [error, setError] = useState("");

  const pickOption = (opt: (typeof CATEGORY_OPTIONS)[number]) => {
    setCategory(opt.value);
    setKind(opt.kind);
    setImages((imgs) => (imgs.length ? imgs : [opt.sample]));
    if (opt.value === "rentals") setCondition("for-rent");
    if (opt.value === "services") setCondition("service");
    if (opt.kind === "real-estate") setPriceLabel(opt.value === "real-estate" ? t("listing.surface") : t("common.perMonth"));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((old) => [...old, ...next].slice(0, 6));
  };

  const runAi = () => {
    if (!title.trim()) return;
    setAiLoading(true);
    setAiScore(null);
    setTimeout(() => {
      const base = `Premium ${category} listing in ${location}. This ${title} is in excellent condition and ready for immediate use.`;
      const extra =
        category === "vehicles"
          ? " The vehicle has been regularly maintained and comes with complete documentation, a clean history and optional financing. Perfect for families, business or city driving in Djibouti."
          : category === "real-estate" || category === "rentals"
          ? " The property is located in a convenient, secure neighbourhood with easy access to shops, transport and services. The interior is clean, well-lit and move-in ready."
          : category === "services"
          ? " Professional and reliable service, available on flexible schedules with a satisfaction guarantee. Contact us today for a free quote."
          : " Well-packaged, authentic and in great working condition. Fast communication and safe delivery or pickup across Djibouti.";
      setDescription(base + extra);
      if (price === "") {
        const suggested = category === "vehicles" ? 6500000 : category === "real-estate" ? 40000000 : category === "services" ? 50000 : 180000;
        setPrice(suggested);
      }
      setAiLoading(false);
      setAiScore(Math.min(98, Math.max(72, 70 + title.length + description.length)));
    }, 900);
  };

  const computeScore = useMemo(() => {
    if (aiScore !== null) return aiScore;
    let s = 35;
    s += title.length > 8 ? 12 : 4;
    s += description.length > 60 ? 20 : description.length > 20 ? 10 : 3;
    s += price ? 12 : 0;
    s += images.length > 0 ? 10 : 0;
    s += location ? 5 : 0;
    return Math.min(98, s);
  }, [title, description, price, images, location, aiScore]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      demoLogin();
      return;
    }
    if (!title.trim() || !description.trim() || !price) {
      setError(t("auth.error"));
      return;
    }
    const listing: Listing = {
      id: `my${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      priceLabel: priceLabel || undefined,
      category,
      kind,
      images: images.map((url, i) => ({ id: `my${i}`, url, alt: title })),
      location,
      condition,
      sellerId: user.id,
      createdAt: new Date().toISOString(),
      featured: true,
      views: 0,
      favorites: 0,
      tags: [category, location, "placerambo"],
      reviews: [],
      status: "active",
    };
    store.addListing(listing);
    setSubmitted(true);
    setTimeout(() => router.push(`/listing/${listing.id}`), 1200);
  };

  return (
    <div className="container py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              <Sparkles className="h-3.5 w-3.5" /> AI Powered Listing
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">{t("sell.title")}</h1>
            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">{t("sell.subtitle")}</p>
          </div>
        </div>

        {submitted && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-800 animate-scale-in">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <div>
              <div className="font-bold">{t("sell.submitted")}</div>
              <div className="text-sm">Redirecting to your new listing…</div>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6">
              <h2 className="mb-4 font-extrabold">{t("sell.category")}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pickOption(opt)}
                    className={`rounded-2xl border-2 p-4 text-center font-bold transition ${
                      category === opt.value
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-2xl">{opt.value === "vehicles" ? "🚗" : opt.value === "real-estate" ? "🏠" : opt.value === "electronics" ? "📱" : opt.value === "buy-sell" ? "🛒" : opt.value === "rentals" ? "🔑" : "🔧"}</div>
                    <div className="mt-1 text-sm">{t(opt.labelKey)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <label className="label">{t("sell.titleField")}</label>
              <input
                className="input"
                placeholder={t("sell.titlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">{t("sell.price")} (DJF)</label>
                  <input className="input" type="number" placeholder="180000" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div>
                  <label className="label">{t("sell.priceLabel")}</label>
                  <input className="input" value={priceLabel} placeholder={`${t("common.perDay")} / ${t("common.perMonth")}`} onChange={(e) => setPriceLabel(e.target.value)} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">{t("sell.location")}</label>
                  <select className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{t("sell.condition")}</label>
                  <select className="select" value={condition} onChange={(e) => setCondition(e.target.value as Condition)}>
                    {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{t(c.key)}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <label className="label">{t("sell.description")}</label>
              <textarea className="input min-h-[180px]" value={description} placeholder={t("sell.descriptionPlaceholder")} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-extrabold">{t("sell.images")}</h2>
                <span className="text-xs text-slate-400">{images.length}/6</span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                    <Image src={src} alt="upload" fill sizes="120px" className="object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button type="button" onClick={() => fileRef.current?.click()} className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-teal-400 hover:text-teal-600">
                    <ImagePlus className="h-6 w-6" />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="card sticky top-24 p-6">
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-teal-600"><Wand2 className="h-5 w-5" /></span>
                <h2 className="font-extrabold">{t("sell.aiHelp")}</h2>
              </div>
              <p className="mt-3 text-xs text-slate-500">Automatic descriptions, pricing and quality checks will help your listing sell faster.</p>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">{t("sell.aiQuality")}</span>
                  <span className="font-extrabold text-teal-700">{computeScore}/100</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all" style={{ width: `${computeScore}%` }} />
                </div>
              </div>
              <button type="button" onClick={runAi} disabled={aiLoading} className="btn btn-outline mt-4 w-full text-sm">
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {t("sell.aiGenerate")}
              </button>
              {aiScore !== null && (
                <div className="mt-3 rounded-2xl bg-teal-50 p-3 text-xs font-semibold text-teal-700 animate-scale-in">
                  <span className="flex items-center gap-1"><LineChart className="h-3.5 w-3.5" /> {t("sell.aiScore")}: {aiScore}/100</span>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-extrabold text-slate-600">{t("sell.sellerInfo")}</h3>
              {user ? (
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 font-bold text-white">{user.name.charAt(0)}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.location}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">You will be signed in to a demo account to publish.</p>
              )}
            </div>

            {error && <div className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-600">{error}</div>}

            <button type="submit" className="btn btn-primary w-full py-3.5 text-base">
              <Plus className="h-5 w-5" /> {t("sell.submit")}
            </button>
            <p className="text-center text-xs text-slate-400">By publishing you agree to the {<Link href="/" className="underline">terms</Link>} & safety rules.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
