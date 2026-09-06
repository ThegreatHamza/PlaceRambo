"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  MapPin,
  Star,
  MessageCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Package,
  Check,
  Phone,
} from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n";
import { getSeller, LISTINGS } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SellerClient({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const seller = getSeller(id);
  const listings = LISTINGS.filter((l) => l.sellerId === id);

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
                <Image src={seller.avatar} alt={seller.name} fill sizes="96px" className="object-cover" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{seller.name}</h1>
                  {seller.verified && (
                    <span className="badge badge-blue">
                      <ShieldCheck className="h-3 w-3" /> {seller.business ? t("listing.verifiedBusiness") : t("listing.verifiedSeller")}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-teal-600" /> {seller.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-teal-600" /> {t("account.joined")} {formatDate(seller.joined, lang)}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-teal-600" /> {seller.followers} followers</span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{seller.bio}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/messages?seller=${seller.id}`)}
                className="btn btn-primary"
              >
                <MessageCircle className="h-4 w-4" /> {t("listing.contact")}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-extrabold">{seller.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">/5</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{seller.reviewCount} reviews</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-600" />
                <span className="text-xl font-extrabold">{seller.listingsCount}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{t("admin.listings")}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-bold">{seller.phone || "Available on chat"}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">Phone verified</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {seller.skills && seller.skills.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-extrabold">Skills & services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {seller.skills.map((s) => (
                <span key={s} className="badge badge-grey">
                  <Check className="h-3 w-3 text-teal-600" /> {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-end justify-between">
          <h2 className="section-title text-ink">{t("admin.listings")} <span className="text-slate-300">({listings.length})</span></h2>
          <Link href={`/search?q=${encodeURIComponent(seller.name)}`} className="text-sm font-bold text-brand hover:underline">
            {t("common.viewAll")}
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="card grid place-items-center p-12 text-center text-slate-500">
            No active listings yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="section-title text-ink">{t("listing.reviews")} ({seller.reviewCount})</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {listings.flatMap((l) => l.reviews).slice(0, 6).map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-100">
                      <Image src={r.authorAvatar} alt={r.author} fill sizes="36px" className="object-cover" />
                    </span>
                    <div>
                      <div className="text-sm font-bold">{r.author}</div>
                      <div className="text-xs text-slate-400">{formatDate(r.date, lang)}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
