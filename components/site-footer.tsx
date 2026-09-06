"use client";

import Link from "next/link";
import { Store, Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                <Store className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Place<span className="text-brand">Rambo</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-600" />
                Djibouti City, Djibouti
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-600" />
                +253 77 00 00 00
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-600" />
                hello@placerambo.dj
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-ink">{t("footer.marketplace")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li><Link className="hover:text-teal-600" href="/search/vehicles">{t("nav.vehicles")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/search/real-estate">{t("nav.realestate")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/search/rentals">{t("nav.rentals")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/search/services">{t("nav.services")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/sell">{t("nav.sell")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-ink">{t("footer.company")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li><Link className="hover:text-teal-600" href="/">{t("footer.about")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.careers")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.contact")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.download")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-ink">{t("footer.legal")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li><Link className="hover:text-teal-600" href="/">{t("footer.privacy")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.terms")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.safety")}</Link></li>
              <li><Link className="hover:text-teal-600" href="/">{t("footer.help")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-ink">{t("footer.safety")}</h4>
            <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
              <ShieldCheck className="h-6 w-6 text-teal-600" />
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {t("footer.safety")} — PlaceRambo
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <span>{t("footer.rights")}</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> for Djibouti
          </span>
        </div>
      </div>
    </footer>
  );
}
