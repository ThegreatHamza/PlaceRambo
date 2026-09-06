"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  BadgeCheck,
  Share2,
  MessageCircle,
  Star,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { getSeller } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { formatPriceLabel, relativeTime } from "@/lib/utils";

export function ListingCard({
  listing,
  index = 0,
}: {
  listing: Listing;
  index?: number;
}) {
  const { t, lang } = useI18n();
  const { isFavorite, toggleFavorite } = useStore();
  const { user } = useAuth();
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
        }
      : getSeller(listing.sellerId);
  const fav = isFavorite(listing.id);
  const savedLabel =
    listing.kind === "products"
      ? listing.rental
        ? (listing.rental.perDay ? t("common.perDay") : t("common.perMonth"))
        : listing.priceLabel
      : listing.priceLabel;

  return (
    <div
      className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
    >
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={listing.images[0]?.url}
            alt={listing.images[0]?.alt || listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.featured && (
              <span className="badge badge-green shadow">
                {lang === "fr" ? "À la une" : lang === "so" ? "Caanka" : lang === "ar" ? "مميز" : "Featured"} ✨
              </span>
            )}
            <span className="badge glass text-white shadow">DJ</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(listing.id);
            }}
            aria-label={t("listing.favorite")}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-105"
          >
            <Heart
              className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
            />
          </button>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (navigator.share) {
                  navigator.share({
                    title: listing.title,
                    url: `${window.location.origin}/listing/${listing.id}`,
                  });
                } else {
                  navigator.clipboard.writeText(`${window.location.origin}/listing/${listing.id}`);
                }
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-105"
              aria-label={t("listing.share")}
            >
              <Share2 className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium text-slate-500">
              {listing.brand ? `${listing.brand} ${listing.model || ""}` : listing.category}
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{seller.rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="mt-1 line-clamp-1 font-bold leading-snug text-ink">
            {listing.title}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold tracking-tight text-brand">
                {formatPriceLabel(listing.price, savedLabel)}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{listing.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-100">
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span className="truncate text-xs font-medium text-slate-600">
                {seller.name}
              </span>
              {seller.verified && (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sky-500" />
              )}
            </div>
            <span className="shrink-0 text-xs text-slate-400">
              {relativeTime(listing.createdAt, lang)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ListingCardSmall({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const seller = getSeller(listing.sellerId);
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="card group overflow-hidden transition hover:shadow-[var(--shadow-hover)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={listing.images[0]?.url}
          alt={listing.images[0]?.alt || listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="text-lg font-extrabold text-white">
            {formatPriceLabel(listing.price, listing.priceLabel)}
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">
          {listing.title}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          {listing.location}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">{seller.name}</span>
          {seller.verified && <BadgeCheck className="h-3.5 w-3.5 text-sky-500" />}
        </div>
      </div>
    </Link>
  );
}

export function ListingCardCompact({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="card flex gap-3 overflow-hidden p-3 transition hover:shadow-[var(--shadow-hover)]"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={listing.images[0]?.url}
          alt={listing.images[0]?.alt || listing.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-1 text-sm font-bold">{listing.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" /> {listing.location}
        </div>
        <div className="mt-2 text-sm font-extrabold text-brand">
          {formatPriceLabel(listing.price, listing.priceLabel)}
        </div>
      </div>
    </Link>
  );
}
