"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_CONVERSATIONS, LISTINGS, SELLERS } from "./data";
import type {
  Conversation,
  Listing,
  Message,
  SearchFilters,
  SearchIntent,
} from "./types";

const FAV_KEY = "placerambo:favorites";
const LIST_KEY = "placerambo:myListings";
const CONV_KEY = "placerambo:conversations";
const REPORT_KEY = "placerambo:reports";

const LOCATIONS = [
  "Djibouti City",
  "Djibouti City Centre",
  "Balbala",
  "Heron",
  "Sheik Ismail",
  "Tadjourah",
  "Ali Sabieh",
  "Dikhil",
  "Obock",
  "Arta",
];

function catForKeyword(kw: string): { category: any; kind: any } | null {
  const q = kw.toLowerCase();
  if (/(prado|toyota|car|vehicle|camion|truck|moto|motorcycle|land ?cruiser|corolla|honda|mercedes|nissan|hiyace|hi ace|patrol)/.test(q))
    return { category: "vehicles", kind: "vehicles" };
  if (/(apartment|house|villa|land|office|shop|immeuble|terrain|real estate|property|bureau|shop|store)/.test(q))
    return { category: "real-estate", kind: /rent|location|louer|kira/.test(q) ? "rentals" : "real-estate" };
  if (/(phone|samsung|iphone|tv|laptop|computer|macbook|camera|console|gaming|electronics|télé|ordinateur|waswas)/.test(q))
    return { category: "electronics", kind: "products" };
  if (/(electric|plumb|mechanic|teacher|design|worker|construction|freelance|plombier|électricien|professeur|designer|adeeg)/.test(q))
    return { category: "services", kind: "services" };
  if (/(rent|location|louer|kira)/.test(q)) return { category: "rentals", kind: "rentals" };
  return null;
}

export function parseSearchIntent(query: string): SearchIntent {
  const q = query.trim();
  const lower = q.toLowerCase();
  let category: any = "buy-sell";
  let kind: any = "products";
  const detected = catForKeyword(lower);
  if (detected) {
    category = detected.category;
    kind = detected.kind;
  }
  let location: string | null = null;
  for (const loc of LOCATIONS) {
    if (lower.includes(loc.toLowerCase())) {
      location = loc;
      break;
    }
  }
  let priceMax: number | null = null;
  const cheap = /(cheap|pas cher|budget|jaban|رخيص)/.test(lower);
  const expensive = /(luxury|premium|neuf|brand new|جديد|luxe)/.test(lower);
  if (cheap) priceMax = category === "vehicles" ? 8_000_000 : 500_000;
  if (expensive) priceMax = null;
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  return { category, kind, location, priceMax, query, keywords: words };
}

export function applyFilters(
  base: Listing[],
  filters: SearchFilters
): Listing[] {
  let out = [...base];
  const query = (filters.query || "").trim();
  const cat = catForKeyword(query);
  if (query && cat) {
    if (cat.kind !== "products" || filters.kind === "products") {
      out = out.filter((l) => l.category === cat.category);
    }
  }
  if (query && !cat) {
    const q = query.toLowerCase();
    out = out.filter((l) => {
      const hay = [
        l.title,
        l.description,
        l.location,
        l.brand || "",
        l.model || "",
        (l.tags || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }
  if (filters.query && cat) {
    const q = query.toLowerCase();
    out = out.filter((l) => {
      const hay = [l.title, l.description, l.brand || "", l.model || ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q) || q.split(/\s+/).every((w) => hay.includes(w));
    });
  }
  if (filters.category && filters.category !== "all")
    out = out.filter((l) => l.category === filters.category);
  if (filters.kind && filters.kind !== "all") {
    if (filters.kind === "rentals")
      out = out.filter((l) => l.kind === "rentals" || !!l.rental);
    else out = out.filter((l) => l.kind === filters.kind);
  }
  if (filters.location)
    out = out.filter((l) => l.location.toLowerCase().includes(filters.location!.toLowerCase()));
  if (typeof filters.minPrice === "number")
    out = out.filter((l) => l.price >= filters.minPrice!);
  if (typeof filters.maxPrice === "number")
    out = out.filter((l) => l.price <= filters.maxPrice!);
  if (filters.condition) out = out.filter((l) => l.condition === filters.condition);
  if (filters.dateAdded && filters.dateAdded !== "any") {
    const now = Date.now();
    const days = filters.dateAdded === "today" ? 1 : filters.dateAdded === "week" ? 7 : 30;
    out = out.filter((l) => now - new Date(l.createdAt).getTime() <= days * 86400000);
  }
  if (typeof filters.minRating === "number" && filters.minRating > 0) {
    out = out.filter((l) => {
      const s = SELLERS.find((x) => x.id === l.sellerId);
      return s && s.rating >= filters.minRating!;
    });
  }
  if (filters.verifiedOnly) {
    out = out.filter((l) => {
      const d = SELLERS.find((x) => x.id === l.sellerId);
      return d && d.verified;
    });
  }
  if (filters.bedrooms) out = out.filter((l) => (l.bedrooms ?? 0) >= filters.bedrooms!);
  if (filters.fuel) out = out.filter((l) => l.fuel === filters.fuel);
  if (filters.transmission)
    out = out.filter((l) => l.transmission === filters.transmission);

  const sort = filters.sort || "newest";
  out.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") {
      const ra = a.reviews.reduce((s, r) => s + r.rating, 0) || a.sellerId.length;
      const rb = b.reviews.reduce((s, r) => s + r.rating, 0) || b.sellerId.length;
      return rb - ra;
    }
    if (sort === "popular") return (b.views || 0) - (a.views || 0);
    if (sort === "relevance") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return out;
}

interface StoreContextValue {
  favorites: string[];
  myListings: Listing[];
  conversations: Conversation[];
  reports: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addListing: (l: Listing) => void;
  addToListings: (l: Listing) => void;
  reportListing: (id: string) => void;
  reportUser: (id: string) => void;
  markRead: (id: string) => void;
  openConversation: (listingId: string, sellerId: string) => string;
  sendMessage: (convId: string, text: string) => void;
  sendImage: (convId: string, src: string) => void;
  translateMessage: (convId: string, msgId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(
    typeof window === "undefined"
      ? []
      : JSON.parse(localStorage.getItem(CONV_KEY) || "null") || DEMO_CONVERSATIONS
  );
  const [reports, setReports] = useState<string[]>([]);

  useEffect(() => {
    const f = localStorage.getItem(FAV_KEY);
    if (f) setFavorites(JSON.parse(f));
    const ml = localStorage.getItem(LIST_KEY);
    if (ml) setMyListings(JSON.parse(ml));
    const c = localStorage.getItem(CONV_KEY);
    if (c) setConversations(JSON.parse(c));
    else setConversations(DEMO_CONVERSATIONS);
    const r = localStorage.getItem(REPORT_KEY);
    if (r) setReports(JSON.parse(r));
  }, []);

  const persistFavs = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  };
  const persistListings = (next: Listing[]) => {
    setMyListings(next);
    localStorage.setItem(LIST_KEY, JSON.stringify(next));
  };
  const persistConvs = (next: Conversation[]) => {
    setConversations(next);
    localStorage.setItem(CONV_KEY, JSON.stringify(next));
  };
  const persistReports = (next: string[]) => {
    setReports(next);
    localStorage.setItem(REPORT_KEY, JSON.stringify(next));
  };

  const isFavorite = (id: string) => favorites.includes(id);
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    persistFavs(next);
  };

  const addListing = (l: Listing) => {
    persistListings([l, ...myListings]);
  };
  const addToListings = (l: Listing) => {
    persistListings([l, ...myListings]);
  };
  const reportListing = (id: string) => {
    if (reports.includes(id)) return;
    persistReports([...reports, id]);
  };
  const reportUser = (uid: string) => {
    if (reports.includes(uid)) return;
    persistReports([...reports, uid]);
  };

  const markRead = (id: string) => {
    const next = conversations.map((c) =>
      c.id === id ? { ...c, unread: 0 } : c
    );
    persistConvs(next);
  };

  const openConversation = (listingId: string, sellerId: string) => {
    const listing = [...LISTINGS, ...myListings].find((l) => l.id === listingId);
    const seller = SELLERS.find((s) => s.id === sellerId);
    const sellerName = seller?.name || listing?.sellerId || sellerId;
    const existing = conversations.find(
      (c) => c.listingId === listingId
    ) || conversations.find((c) => c.participant === sellerName);
    if (existing) {
      return existing.id;
    }
    const conv: Conversation = {
      id: `c${Date.now()}`,
      participant: sellerName,
      participantAvatar: seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=0D9488&color=fff`,
      listingId,
      listingTitle: listing?.title,
      createdAt: new Date().toISOString(),
      unread: 0,
      messages: [],
    };
    persistConvs([conv, ...conversations]);
    return conv.id;
  };

  const sendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const next = conversations.map((c) => {
      if (c.id !== convId) return c;
      const msg: Message = {
        id: `m${Date.now()}`,
        from: "me",
        kind: "text",
        text,
        at: new Date().toISOString(),
        status: "sent",
      };
      return { ...c, messages: [...c.messages, msg], unread: 0 };
    });
    persistConvs(next);
  };

  const sendImage = (convId: string, src: string) => {
    const next = conversations.map((c) => {
      if (c.id !== convId) return c;
      const msg: Message = {
        id: `m${Date.now()}`,
        from: "me",
        kind: "image",
        src,
        at: new Date().toISOString(),
        status: "sent",
      };
      return { ...c, messages: [...c.messages, msg], unread: 0 };
    });
    persistConvs(next);
  };

  const translateMessage = (convId: string, msgId: string) => {
    const next = conversations.map((c) => {
      if (c.id !== convId) return c;
      return {
        ...c,
        messages: c.messages.map((m) =>
          m.id === msgId
            ? {
                ...m,
                translated: m.translated
                  ? undefined
                  : m.text === "Bonjour, is the apartment still available?"
                  ? "Hello, is the apartment still available?"
                  : "(AI translation placeholder — French → English) Bonjour, est-ce toujours disponible ?",
              }
            : m
        ),
      };
    });
    persistConvs(next);
  };

  const value = useMemo<StoreContextValue>(
    () => ({
      favorites,
      myListings,
      conversations,
      reports,
      isFavorite,
      toggleFavorite,
      addListing,
      addToListings,
      reportListing,
      reportUser,
      markRead,
      openConversation,
      sendMessage,
      sendImage,
      translateMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [favorites, myListings, conversations, reports]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useSearch() {
  return { parseSearchIntent, applyFilters };
}
