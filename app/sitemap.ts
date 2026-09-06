import type { MetadataRoute } from "next";
import { LISTINGS, SELLERS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const staticRoutes = [
    "",
    "/search",
    "/categories",
    "/sell",
    "/search/vehicles",
    "/search/real-estate",
    "/search/electronics",
    "/search/buy-sell",
    "/search/rentals",
    "/search/services",
  ].map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const listings = LISTINGS.map((l) => ({
    url: `${base}/listing/${l.id}`,
    lastModified: new Date(l.createdAt),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const sellers = SELLERS.map((s) => ({
    url: `${base}/seller/${s.id}`,
    lastModified: new Date(s.joined),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...listings, ...sellers];
}
