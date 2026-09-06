# PlaceRambo — Djibouti's Modern Marketplace

PlaceRambo is a premium, mobile-first online marketplace for Djibouti where users can **buy, sell, rent and discover** products, properties, vehicles and local services. The UI is inspired by modern consumer products (Airbnb, OLX, Amazon, Autotrader) and intentionally avoids the "cheap classifieds" look.

## Highlights

- Premium responsive homepage with hero search, category grid, featured & recent listings, trusted sellers and CTAs.
- **6 main categories**: Real Estate, Vehicles, Electronics, Buy & Sell, Rentals, Services.
- Advanced search with filters (category, location, price, condition, date, seller rating, verified sellers) and **natural-language intent detection** ("cheap Toyota near Balbala").
- Professional listing details with gallery, specs, rental info, reviews, seller card, sharing, favorites and reporting.
- Vehicle marketplace fields (brand, model, year, mileage, fuel, transmission, color, dealer/verified seller).
- Real-estate fields (rooms, bathrooms, surface, year built, map placeholder, rental price).
- Rental system with availability dates, per-day/week/month pricing and booking request flow.
- Service marketplace (electricians, plumbers, mechanics, teachers, designers…) with skills, experience and reviews.
- User auth (register/login), profile, favorites, messages, and a polished admin dashboard.
- Internal messaging with images, voice-message placeholders, conversation history, unread badges and an **AI translation stub**.
- Trust & safety: verified/business badges, ratings & reviews, report listing/user, admin moderation.
- **AI-ready**: Listing Assistant (auto-description, price suggestion, quality score), image assistant, fraud detection and search intent stubs.
- Multilingual English / Français / Soomaali / العربية with a clean translation dictionary and RTL support for Arabic.

## Tech stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react.
- **Backend**: currently seeded demo data + browser persistence (localStorage) for the MVP. A production-ready **Supabase/PostgreSQL schema** is included in [`supabase/schema.sql`](supabase/schema.sql).
- **Interfaces**: Env stubs in [`.env.example`](.env.example) for Supabase, AI providers and Google Maps.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm run start
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/search` | Global search & filters |
| `/search/vehicles` `…/real-estate` `…/electronics` `…/buy-sell` `…/rentals` `…/services` | Category browsing |
| `/listing/[id]` | Listing detail |
| `/seller/[id]` | Seller profile |
| `/login`, `/register` | Authentication |
| `/account` | Profile, listings, settings |
| `/sell` | Publish a listing (with AI assistant) |
| `/favorites` | Saved listings |
| `/messages` | Buyer/seller chat |
| `/admin` | Admin dashboard & moderation |
| `/categories` | All categories |

## Built for MVPs that feel production-ready

- State management is split into lightweight React contexts: `lib/i18n.tsx`, `lib/auth.tsx`, `lib/store.tsx`.
- Data and demo content live in `lib/data.ts`; typed models in `lib/types.ts`.
- SEO metadata, sitemap (`app/sitemap.ts`) and robots (`app/robots.ts`).
- The codebase is structured so swap `lib/data.ts` + localStorage for Supabase clients, and the AI stubs for real model calls, without redesigning the UI.

## Roadmap

- Wire Supabase auth, Postgres, storage, realtime messages.
- Connect AI providers for listing descriptions, image enhancement, fraud detection and chat translation.
- Add payments (mobile money / cards) and verified onboarding.
- Build the React Native / Expo mobile app against the same API.
