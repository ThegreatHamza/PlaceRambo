"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  MapPin,
  Filter,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { ListingCard, ListingCardCompact } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { LISTINGS, SELLERS } from "@/lib/data";
import type { Category, Condition, ListingKind, SearchFilters } from "@/lib/types";
import { cn } from "@/lib/utils";
import { parseSearchIntent } from "@/lib/store";

const CATEGORIES: { value: Category | "all"; key: string }[] = [
  { value: "all", key: "categories.all" },
  { value: "real-estate", key: "categories.realEstate" },
  { value: "vehicles", key: "categories.vehicles" },
  { value: "electronics", key: "categories.electronics" },
  { value: "buy-sell", key: "categories.buySell" },
  { value: "rentals", key: "categories.rentals" },
  { value: "services", key: "categories.services" },
];

const LOCATIONS = [
  "Djibouti City",
  "Balbala",
  "Heron",
  "Sheik Ismail",
  "Tadjourah",
  "Ali Sabieh",
  "Dikhil",
  "Obock",
  "Arta",
];

const CONDITIONS: { value: Condition; key: string }[] = [
  { value: "new", key: "listing.condition.new" },
  { value: "used", key: "listing.condition.used" },
  { value: "refurbished", key: "listing.condition.refurbished" },
  { value: "for-rent", key: "listing.condition.for-rent" },
  { value: "service", key: "listing.condition.service" },
];

export default function SearchClient({
  initialCategory = "all",
  fixedCategory = false,
  initialQuery = "",
}: {
  initialCategory?: Category | "all";
  fixedCategory?: boolean;
  initialQuery?: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useStore();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: initialCategory,
    kind: "all",
    query: initialQuery,
    sort: "newest",
    minPrice: undefined,
    maxPrice: undefined,
    location: "",
    condition: undefined,
    dateAdded: "any",
    minRating: 0,
    verifiedOnly: false,
  });

  useEffect(() => {
    const sp = searchParams;
    setFilters((prev) => ({
      ...prev,
      query: sp.get("q") || initialQuery,
      category: (sp.get("category") as Category) || initialCategory,
      location: sp.get("location") || "",
      minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      condition: (sp.get("condition") as Condition) || undefined,
      dateAdded: (sp.get("dateAdded") as any) || "any",
      minRating: sp.get("minRating") ? Number(sp.get("minRating")) : 0,
      verifiedOnly: sp.get("verifiedOnly") === "true",
      sort: (sp.get("sort") as any) || "newest",
    }));
  }, [searchParams, initialQuery, initialCategory]);

  const allListings = useMemo(() => [...LISTINGS, ...store.myListings], [store.myListings]);

  const intent = useMemo(
    () => parseSearchIntent(filters.query || ""),
    [filters.query]
  );

  const results = useMemo(
    () => applyListings(allListings, filters),
    [allListings, filters]
  );

  function applyListings(base: typeof LISTINGS, f: SearchFilters) {
    // small local re-declare to avoid circular import complexity at build
    let out = [...base];
    const query = (f.query || "").trim();
    const detect = parseSearchIntent(query);
    // Apply natural-language intent (location & price preference) automatically.
    if (query && detect.location && !f.location) {
      out = out.filter((l) => l.location.toLowerCase().includes(detect.location!.toLowerCase()));
    }
    if (query && detect.priceMax && !f.maxPrice) {
      out = out.filter((l) => l.price <= (detect.priceMax || Infinity));
    }
    if (query && detect && detect.category !== "buy-sell") {
      if (detect.kind === "rentals" || f.kind === "rentals") {
        out = out.filter((l) => l.kind === "rentals" || !!l.rental);
      } else if (detect.kind !== "products") {
        out = out.filter((l) => l.kind === detect.kind);
      } else if (f.kind !== "products" && f.kind !== "all") {
        out = out.filter((l) => l.kind === f.kind);
      } else {
        out = out.filter((l) => l.category === detect.category);
      }
    } else if (query) {
      const q = query.toLowerCase();
      out = out.filter((l) => {
        const hay = [l.title, l.description, l.location, l.brand || "", l.model || "", (l.tags || []).join(" ")]
          .join(" ")
          .toLowerCase();
        return q.split(/\s+/).every((w) => hay.includes(w));
      });
    }
    if (f.category !== "all") out = out.filter((l) => l.category === f.category);
    if (f.kind === "rentals")
      out = out.filter((l) => l.kind === "rentals" || !!l.rental);
    if (f.location) out = out.filter((l) => l.location.toLowerCase().includes(f.location!.toLowerCase()));
    if (typeof f.minPrice === "number") out = out.filter((l) => l.price >= f.minPrice!);
    if (typeof f.maxPrice === "number") out = out.filter((l) => l.price <= f.maxPrice!);
    if (f.condition) out = out.filter((l) => l.condition === f.condition);
    if (f.dateAdded && f.dateAdded !== "any") {
      const days = f.dateAdded === "today" ? 1 : f.dateAdded === "week" ? 7 : 30;
      out = out.filter((l) => Date.now() - new Date(l.createdAt).getTime() <= days * 86400000);
    }
    if (f.minRating && f.minRating > 0) {
      out = out.filter((l) => {
        const s = SELLERS.find((x) => x.id === l.sellerId);
        return s && s.rating >= f.minRating!;
      });
    }
    if (f.verifiedOnly) {
      out = out.filter((l) => {
        const s = SELLERS.find((x) => x.id === l.sellerId);
        return s && s.verified;
      });
    }
    if (f.bedrooms) out = out.filter((l) => (l.bedrooms ?? 0) >= f.bedrooms!);
    if (f.fuel) out = out.filter((l) => l.fuel === f.fuel);
    if (f.transmission) out = out.filter((l) => l.transmission === f.transmission);
    const sort = f.sort || "newest";
    out.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.reviews.length || 0) - (a.reviews.length || 0);
      if (sort === "popular") return (b.views || 0) - (a.views || 0);
      if (sort === "relevance") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return out;
  }

  const activeFilters = [
    filters.query ? `"${filters.query}"` : "",
    filters.location,
    filters.minPrice ? `≥ ${filters.minPrice}` : "",
    filters.maxPrice ? `≤ ${filters.maxPrice}` : "",
    filters.condition ? t(`listing.condition.${filters.condition}`) : "",
    filters.verifiedOnly ? t("search.verifiedOnly") : "",
  ].filter(Boolean);

  const update = (patch: Partial<SearchFilters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  const applyToUrl = () => {
    const p = new URLSearchParams();
    if (filters.query) p.set("q", filters.query);
    if (filters.category && filters.category !== "all") p.set("category", filters.category);
    if (filters.location) p.set("location", filters.location);
    if (filters.minPrice) p.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) p.set("maxPrice", String(filters.maxPrice));
    if (filters.condition) p.set("condition", filters.condition);
    if (filters.dateAdded && filters.dateAdded !== "any") p.set("dateAdded", filters.dateAdded);
    if (filters.minRating) p.set("minRating", String(filters.minRating));
    if (filters.verifiedOnly) p.set("verifiedOnly", "true");
    if (filters.sort && filters.sort !== "newest") p.set("sort", filters.sort);
    router.push(`/search?${p.toString()}`);
    setFilterOpen(false);
  };

  const clearAll = () => {
    setFilters({
      category: initialCategory,
      kind: "all",
      query: "",
      sort: "newest",
      location: "",
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      dateAdded: "any",
      minRating: 0,
      verifiedOnly: false,
    });
    router.push(initialCategory === "all" ? "/search" : `/search/${initialCategory}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {fixedCategory
                ? t(`categories.${categoryKey(initialCategory)}`)
                : t("search.title")}
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted">
            {results.length} {t("search.results")}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as any })}
            className="select w-auto min-w-[150px]"
          >
            <option value="newest">{t("search.sort.newest")}</option>
            <option value="price-asc">{t("search.sort.price-asc")}</option>
            <option value="price-desc">{t("search.sort.price-desc")}</option>
            <option value="rating">{t("search.sort.rating")}</option>
            <option value="popular">{t("search.sort.popular")}</option>
            <option value="relevance">{t("search.sort.relevance")}</option>
          </select>
          <button onClick={() => setFilterOpen((v) => !v)} className="btn btn-ghost md:hidden">
            <Filter className="h-4 w-4" /> {t("search.filters")}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className={cn("lg:block", filterOpen ? "block" : "hidden")}>
          <div className="card sticky top-24 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-extrabold">
                <SlidersHorizontal className="h-4 w-4 text-brand" />
                {t("search.filters")}
              </h2>
              <button onClick={clearAll} className="text-xs font-bold text-rose-500 hover:underline">
                {t("search.clearAll")}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label">{t("search.placeholder")}</label>
                <div className="relative">
                  <input
                    className="input"
                    value={filters.query}
                    placeholder={t("search.placeholder")}
                    onChange={(e) => update({ query: e.target.value })}
                  />
                  <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="label">{t("search.category")}</label>
                <select
                  className="select"
                  value={filters.category}
                  disabled={fixedCategory}
                  onChange={(e) => update({ category: e.target.value as any })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {t(c.key)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("search.location")}</label>
                <select
                  className="select"
                  value={filters.location}
                  onChange={(e) => update({ location: e.target.value })}
                >
                  <option value="">{t("search.allLocations")}</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("search.price")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="input"
                    placeholder={t("search.minPrice")}
                    value={filters.minPrice ?? ""}
                    onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder={t("search.maxPrice")}
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div>
                <label className="label">{t("search.condition")}</label>
                <select
                  className="select"
                  value={filters.condition || ""}
                  onChange={(e) => update({ condition: (e.target.value || undefined) as any })}
                >
                  <option value="">{t("common.viewAll")}</option>
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.key)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("search.dateAdded")}</label>
                <select
                  className="select"
                  value={filters.dateAdded}
                  onChange={(e) => update({ dateAdded: e.target.value as any })}
                >
                  <option value="any">{t("search.anytime")}</option>
                  <option value="today">{t("search.today")}</option>
                  <option value="week">{t("search.week")}</option>
                  <option value="month">{t("search.month")}</option>
                </select>
              </div>

              <div>
                <label className="label">{t("search.minRating")}</label>
                <select
                  className="select"
                  value={filters.minRating}
                  onChange={(e) => update({ minRating: Number(e.target.value) })}
                >
                  <option value="0">{t("common.viewAll")}</option>
                  <option value="4">4.0+ ★</option>
                  <option value="4.5">4.5+ ★</option>
                  <option value="4.8">4.8+ ★</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => update({ verifiedOnly: e.target.checked })}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                {t("search.verifiedOnly")}
              </label>

              <button onClick={applyToUrl} className="btn btn-primary w-full">
                {t("search.apply")}
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          {intent.category !== "buy-sell" && filters.query && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50/60 p-3 text-sm">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="font-semibold text-teal-800">{t("search.intent")}</span>
              <span className="badge badge-green">
                {t(`categories.${categoryKey(intent.category)}`)}
              </span>
              {intent.location && <span className="badge badge-blue">{intent.location}</span>}
              {intent.priceMax && <span className="badge badge-amber">≤ {intent.priceMax}</span>}
            </div>
          )}

          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((f, i) => (
                <span key={i} className="badge badge-grey">
                  {f}
                  <button onClick={clearAll} className="ml-1 text-slate-400 hover:text-rose-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="card grid place-items-center p-12 text-center">
              <div className="text-5xl">🔎</div>
              <h3 className="mt-4 text-lg font-extrabold">{t("search.noResults")}</h3>
              <button onClick={clearAll} className="btn btn-outline mt-4 text-sm">
                <RotateCcw className="h-4 w-4" /> {t("search.clear")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l, i) => (
                <ListingCard key={l.id} listing={l} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function categoryKey(cat: string): string {
  const map: Record<string, string> = {
    all: "all",
    "real-estate": "realEstate",
    vehicles: "vehicles",
    electronics: "electronics",
    "buy-sell": "buySell",
    rentals: "rentals",
    services: "services",
  };
  return map[cat] || "all";
}
