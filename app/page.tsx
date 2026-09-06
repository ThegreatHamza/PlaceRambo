import Link from "next/link";
import Hero from "@/components/home/hero";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { TrustedSellers } from "@/components/home/trusted-sellers";
import { CtaBanner, HowItWorks, WhySection } from "@/components/home/cta-steps";
import { ListingCard } from "@/components/listing-card";
import { SectionHeading } from "@/components/home/section-heading";
import { LISTINGS, SELLERS } from "@/lib/data";

export default function HomePage() {
  const featured = LISTINGS.filter((l) => l.featured).slice(0, 8);
  const recent = [...LISTINGS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <>
      <Hero />
      <div className="container -mt-2">
        <CategoriesGrid />
      </div>

      {/* Featured */}
      <section className="container py-14">
        <SectionHeading
          title="Featured listings"
          subtitle="Hand-picked premium listings from trusted sellers."
          href="/search?sort=relevance"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="bg-white py-14">
        <div className="container">
          <SectionHeading
            title="Recently added"
            subtitle="Fresh arrivals from across Djibouti."
            href="/search?sort=newest"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />

      {/* Trusted sellers */}
      <section className="container pb-14">
        <SectionHeading
          title="Trusted sellers"
          subtitle="Businesses and people verified by the PlaceRambo team."
          href="/search?verifiedOnly=true"
        />
        <TrustedSellers />
      </section>

      {/* Popular categories / services teaser */}
      <section className="border-y border-slate-200 bg-white py-14">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="section-title text-ink">Popular categories</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted sm:text-base">
              From vehicles to professional services — everything your life and business needs.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Cars", href: "/search/vehicles", emoji: "🚗" },
              { label: "Smartphones", href: "/search/electronics", emoji: "📱" },
              { label: "Apartments", href: "/search/real-estate", emoji: "🏠" },
              { label: "Jobs / Services", href: "/search/services", emoji: "🔧" },
              { label: "Furniture", href: "/search/buy-sell", emoji: "🛋️" },
              { label: "Rentals", href: "/search/rentals", emoji: "🔑" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="card group flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              >
                <span className="text-3xl transition group-hover:scale-110">{c.emoji}</span>
                <span className="text-sm font-bold">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <WhySection />
    </>
  );
}
