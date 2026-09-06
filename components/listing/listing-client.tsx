"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  MapPin,
  BadgeCheck,
  MessageCircle,
  ShieldCheck,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Flag,
  CalendarDays,
  Check,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  Building2,
  UserRound,
  CheckCircle2,
  ArrowLeft,
  Play,
} from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { getSeller, getListing, formatPrice, LISTINGS } from "@/lib/data";
import { formatDate, formatPriceLabel, relativeTime } from "@/lib/utils";
import type { Listing } from "@/lib/types";

export default function ListingClient({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const store = useStore();
  const { user } = useAuth();

  const listing = useMemo(
    () => getListing(id) || store.myListings.find((l) => l.id === id),
    [id, store.myListings]
  );
  const [active, setActive] = useState(0);
  const [reported, setReported] = useState(false);

  if (!listing) {
    return (
      <div className="container grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <div className="text-6xl">😕</div>
          <h1 className="mt-4 text-2xl font-extrabold">Listing not found</h1>
          <Link href="/search" className="btn btn-primary mt-5">
            <ArrowLeft className="h-4 w-4" /> {t("search.title")}
          </Link>
        </div>
      </div>
    );
  }

  const seller =
    user && user.id === listing.sellerId
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D9488&color=fff`,
          location: user.location,
          verified: !!user.verified,
          rating: 5,
          reviewCount: 0,
          joined: user.joined,
          bio: user.bio || "",
          followers: 0,
          listingsCount: store.myListings.filter((l) => l.sellerId === user.id).length,
        }
      : getSeller(listing.sellerId);
  const fav = store.isFavorite(listing.id);
  const similar = LISTINGS.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 3);

  const goContact = () => {
    router.push(`/messages?listing=${listing.id}&seller=${seller.id}`);
  };

  const goBooking = () => {
    router.push(`/messages?listing=${listing.id}&seller=${seller.id}&booking=1`);
  };

  const share = async () => {
    const url = `${window.location.origin}/listing/${listing.id}`;
    if (navigator.share) {
      await navigator.share({ title: listing.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setReported(true);
      setTimeout(() => {
        setReported(false);
      }, 2000);
    }
  };

  const report = () => {
    store.reportListing(listing.id);
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  const conditionLabel = t(`listing.condition.${listing.condition}`);

  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/search" className="btn btn-ghost px-3 py-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("common.back")}</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
            {t(`categories.${catKey(listing.category)}`)}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
            {conditionLabel}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <Eye className="h-3 w-3" /> {listing.views || 0} {t("listing.views")}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main */}
        <div className="lg:col-span-7">
          {/* Gallery */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="relative aspect-[16/10] bg-slate-100">
              {listing.images[active] && (
                <Image
                  src={listing.images[active].url}
                  alt={listing.images[active].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((a) => (a - 1 + listing.images.length) % listing.images.length)}
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-lg transition hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActive((a) => (a + 1) % listing.images.length)}
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-lg transition hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
                <Play className="h-3 w-3" /> {listing.images.length} photos
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
                {active + 1} / {listing.images.length}
              </div>
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 hide-scrollbar">
                {listing.images.map((im, i) => (
                  <button
                    key={im.id}
                    onClick={() => setActive(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      i === active ? "border-teal-500" : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <Image src={im.url} alt={im.alt} fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {listing.brand && (
                  <div className="text-sm font-semibold text-slate-500">
                    {listing.brand} {listing.model} · {listing.year}
                  </div>
                )}
                <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                  {listing.title}
                </h1>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => store.toggleFavorite(listing.id)}
                  className={`btn ${fav ? "btn-outline" : "btn-ghost"} px-3`}
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
                <button onClick={share} className="btn btn-ghost px-3" aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-teal-600" /> {listing.location}
              </span>
              <span>·</span>
              <span>{t("listing.posted")} {relativeTime(listing.createdAt, lang)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {seller.rating.toFixed(1)} ({seller.reviewCount})
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat icon={<Check className="h-4 w-4" />} label={t("listing.condition")} value={conditionLabel} />
            {listing.condition === "for-rent" && (
              <Stat icon={<CalendarDays className="h-4 w-4" />} label={t("listing.rentalInfo")} value={t("listing.available")} />
            )}
            {listing.bedrooms !== undefined && typeof listing.bedrooms === "number" && listing.bedrooms > 0 && (
              <Stat icon={<Building2 className="h-4 w-4" />} label={t("listing.bedrooms")} value={String(listing.bedrooms)} />
            )}
            {listing.bathrooms !== undefined && typeof listing.bathrooms === "number" && listing.bathrooms > 0 && (
              <Stat icon={<UserRound className="h-4 w-4" />} label={t("listing.bathrooms")} value={String(listing.bathrooms)} />
            )}
            {listing.area && (
              <Stat icon={<CheckCircle2 className="h-4 w-4" />} label={t("listing.area")} value={`${listing.area} ${t("listing.surface")}`} />
            )}
            {listing.mileage !== undefined && (
              <Stat icon={<Gauge className="h-4 w-4" />} label={t("listing.mileage")} value={`${listing.mileage.toLocaleString()} ${t("common.km")}`} />
            )}
            {listing.fuel && (
              <Stat icon={<Fuel className="h-4 w-4" />} label={t("listing.fuel")} value={t(`fuel.${listing.fuel}`)} />
            )}
            {listing.transmission && (
              <Stat icon={<Settings2 className="h-4 w-4" />} label={t("listing.transmission")} value={t(`transmission.${listing.transmission}`)} />
            )}
            {listing.color && (
              <Stat icon={<Palette className="h-4 w-4" />} label={t("listing.color")} value={listing.color} />
            )}
          </div>

          {/* Description */}
          <div className="card mt-6 p-6">
            <h2 className="text-lg font-extrabold">{t("listing.about")}</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
              {listing.description}
            </p>
            {listing.tags && listing.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rental info */}
          {listing.rental && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-teal-100 bg-teal-50/50 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-teal-900">{t("listing.rentalInfo")}</h2>
                  <p className="mt-1 text-sm text-teal-700">
                    {listing.rental.perDay && `Daily: ${formatPriceLabel(listing.rental.perDay, t("common.perDay"))}`}
                    {listing.rental.perWeek && ` · Weekly: ${formatPriceLabel(listing.rental.perWeek, t("common.perWeek"))}`}
                    {listing.rental.perMonth && ` · Monthly: ${formatPriceLabel(listing.rental.perMonth, t("common.perMonth"))}`}
                  </p>
                </div>
                <button onClick={goBooking} className="btn btn-primary shrink-0 text-sm">
                  <CalendarDays className="h-4 w-4" /> {t("listing.askBooking")}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold text-slate-400">{t("listing.available")} from</div>
                  <div className="mt-1 font-bold">{listing.rental.availableFrom ? formatDate(listing.rental.availableFrom, lang) : t("listing.available")}</div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold text-slate-400">Until</div>
                  <div className="mt-1 font-bold">{listing.rental.availableTo ? formatDate(listing.rental.availableTo, lang) : t("listing.available")}</div>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-lg font-extrabold">{t("listing.location")}</h2>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-teal-600" /> {listing.location}
              </span>
            </div>
            <div className="relative aspect-[16/9] bg-[linear-gradient(120deg,#dbeafe,#e0f2fe)]">
              <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 600 300" preserveAspectRatio="none">
                <path d="M0 180 L150 120 L300 200 L450 110 L600 170" fill="none" stroke="#7dd3fc" strokeWidth="8" strokeLinecap="round" />
                <path d="M80 0 L120 300 M260 0 L280 300 M430 0 L410 300" fill="none" stroke="#bae6fd" strokeWidth="4" />
                <rect x="130" y="90" width="110" height="80" rx="24" fill="#99f6e4" opacity="0.7" />
                <rect x="350" y="60" width="90" height="70" rx="20" fill="#a5f3fc" opacity="0.7" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-teal-600 text-white shadow-xl ring-8 ring-white/60">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold shadow backdrop-blur">
                📍 {listing.location}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{t("listing.reviews")} ({listing.reviews.length})</h2>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {listing.reviews.length ? listing.reviews.reduce((n, r) => n + r.rating, 0) / listing.reviews.length : 5}
                <span className="text-slate-400">/5</span>
              </div>
            </div>
            {listing.reviews.length === 0 ? (
              <div className="card p-6 text-center text-sm text-slate-500">{t("listing.noReviews")}</div>
            ) : (
              <div className="space-y-3">
                {listing.reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                          <Image src={r.authorAvatar} alt={r.author} fill sizes="40px" className="object-cover" />
                        </span>
                        <div>
                          <div className="font-bold">{r.author}</div>
                          <div className="text-xs text-slate-400">{formatDate(r.date, lang)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="card p-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("listing.price")}
                  </div>
                  <div className="mt-1 text-3xl font-extrabold tracking-tight text-teal-700">
                    {formatPriceLabel(listing.price, listing.priceLabel)}
                  </div>
                </div>
                {listing.rental && (
                  <span className="badge badge-green">{t("listing.available")}</span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button onClick={goContact} className="btn btn-primary w-full py-3 text-base">
                  <MessageCircle className="h-4 w-4" /> {t("listing.contact")}
                </button>
                <button onClick={share} className="btn btn-ghost w-full">
                  <Share2 className="h-4 w-4" /> {t("listing.share")}
                </button>
                <button onClick={report} className="btn btn-ghost w-full text-rose-600 hover:bg-rose-50">
                  <Flag className="h-4 w-4" /> {reported ? "Reported ✓" : t("listing.report")}
                </button>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-center text-xs text-slate-500">
                <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-teal-600" />
                {t("footer.safety")}
              </div>
            </div>

            {/* Seller */}
            <div className="card p-6">
              <h3 className="mb-4 flex items-center gap-2 font-extrabold">
                <UserRound className="h-4 w-4 text-brand" />
                {t("listing.seller")}
              </h3>
              <Link href={`/seller/${seller.id}`} className="flex items-center gap-3">
                <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                  <Image src={seller.avatar} alt={seller.name} fill sizes="56px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-bold">{seller.name}</span>
                    {seller.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-sky-500" />}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {seller.location}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {seller.rating.toFixed(1)} ({seller.reviewCount})
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-base font-extrabold">{seller.listingsCount}</div>
                  <div className="text-[10px] text-slate-400">{t("admin.listings")}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-base font-extrabold">{seller.followers}</div>
                  <div className="text-[10px] text-slate-400">Followers</div>
                </div>
              </div>
              <Link href={`/seller/${seller.id}`} className="btn btn-outline mt-4 w-full text-sm">
                {t("listing.seller")}
              </Link>
            </div>

            {/* Safety */}
            <div className="card p-5">
              <h3 className="text-sm font-extrabold">🛡 {t("footer.safety")}</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500">
                <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-teal-600" /> {t("listing.verifiedSeller")}</li>
                <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-teal-600" /> {t("listing.sendMessage")}</li>
                <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-teal-600" /> {t("listing.report")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title text-ink">{t("listing.similar")}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {similar.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <span className="text-teal-600">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 truncate text-sm font-bold">{value}</div>
    </div>
  );
}

function catKey(cat: string): string {
  const map: Record<string, string> = {
    "real-estate": "realEstate",
    vehicles: "vehicles",
    electronics: "electronics",
    "buy-sell": "buySell",
    rentals: "rentals",
    services: "services",
  };
  return map[cat] || "all";
}
