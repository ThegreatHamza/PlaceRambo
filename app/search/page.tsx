import { Suspense } from "react";
import SearchClient from "@/components/search/search-client";

export const metadata = {
  title: "Search — PlaceRambo",
  description: "Search products, properties, vehicles and services in Djibouti.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchClient
        initialCategory={(sp.category as any) || "all"}
        initialQuery={sp.q || ""}
      />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="container py-8">
      <div className="skeleton h-10 w-2/3" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="skeleton h-[520px]" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="space-y-2 p-4">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
