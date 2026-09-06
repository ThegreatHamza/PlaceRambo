import { Suspense } from "react";
import SearchClient from "@/components/search/search-client";
import type { Category } from "@/lib/types";

const TITLES: Record<string, { title: string; desc: string }> = {
  vehicles: {
    title: "Vehicle marketplace",
    desc: "Cars, motorcycles, trucks and rentals from verified dealers.",
  },
  "real-estate": {
    title: "Real estate in Djibouti",
    desc: "Buy, sell or rent houses, apartments, land and offices.",
  },
  rentals: {
    title: "Rentals",
    desc: "Homes, cars and equipment for rent.",
  },
  services: {
    title: "Services in Djibouti",
    desc: "Trusted professionals for every job in Djibouti.",
  },
  electronics: {
    title: "Electronics",
    desc: "Phones, computers, TVs and gaming devices.",
  },
  "buy-sell": {
    title: "Buy & Sell",
    desc: "Furniture, fashion, agriculture, construction and more.",
  },
};

export function generateStaticParams() {
  return [
    { category: "vehicles" },
    { category: "real-estate" },
    { category: "electronics" },
    { category: "buy-sell" },
    { category: "rentals" },
    { category: "services" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = TITLES[category] || TITLES["buy-sell"];
  return { title: meta.title, description: meta.desc };
}

export default async function CategorySearchPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = TITLES[category] || TITLES["buy-sell"];
  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-7">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{meta.title}</h1>
          <p className="mt-1.5 text-sm text-muted sm:text-base">{meta.desc}</p>
        </div>
      </div>
      <Suspense fallback={null}>
        <SearchClient initialCategory={category as Category} fixedCategory />
      </Suspense>
    </div>
  );
}
