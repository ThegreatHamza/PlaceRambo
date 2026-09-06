import type { Locale } from "./types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(iso: string, lang: Locale = "en"): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "ar" ? "ar" : lang === "fr" ? "fr-FR" : lang === "so" ? "so-SO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function relativeTime(iso: string, lang: Locale = "en"): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const labels: Record<Locale, Record<string, string>> = {
    en: { now: "just now", min: "min ago", hour: "h ago", day: "d ago", month: "mo ago" },
    fr: { now: "à l'instant", min: "min", hour: "h", day: "j", month: "mois" },
    so: { now: "hadda", min: "daq", hour: "saac", day: "maalin", month: "bil" },
    ar: { now: "الآن", min: "د", hour: "س", day: "ي", month: "ش" },
  };
  const l = labels[lang];
  if (mins < 1) return l.now;
  if (mins < 60) return `${mins} ${l.min}`;
  if (hours < 24) return `${hours} ${l.hour}`;
  if (days < 30) return `${days} ${l.day}`;
  return `${months} ${l.month}`;
}

export function formatPriceLabel(price: number, suffix?: string): string {
  const p = new Intl.NumberFormat("fr-FR").format(price);
  return suffix ? `${p} ${suffix}` : `${p} DJF`;
}
