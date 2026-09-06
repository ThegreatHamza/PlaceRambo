export type Locale = "en" | "fr" | "so" | "ar";

export type Category =
  | "real-estate"
  | "vehicles"
  | "electronics"
  | "buy-sell"
  | "rentals"
  | "services";

export type ListingKind =
  | "products"
  | "vehicles"
  | "real-estate"
  | "rentals"
  | "services";

export type Condition = "new" | "used" | "refurbished" | "for-rent" | "service";

export type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "electric"
  | "lpg";

export type Transmission = "manual" | "automatic";

export interface ImageAsset {
  id: string;
  url: string;
  alt: string;
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  verified: boolean;
  business?: boolean;
  rating: number;
  reviewCount: number;
  joined: string; // ISO date
  bio: string;
  phone?: string;
  languages?: string[];
  featured?: boolean;
  skills?: string[];
  followers?: number;
  listingsCount?: number;
}

export interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // DJF
  priceLabel?: string;
  category: Category;
  kind: ListingKind;
  images: ImageAsset[];
  location: string;
  condition: Condition;
  sellerId: string;
  createdAt: string; // ISO
  featured?: boolean;
  views?: number;
  favorites?: number;
  tags?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  yearBuilt?: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuel?: FuelType;
  transmission?: Transmission;
  color?: string;
  rental?: {
    perDay?: number;
    perWeek?: number;
    perMonth?: number;
    periods: "day" | "week" | "month";
    availableFrom?: string;
    availableTo?: string;
  };
  service?: {
    duration?: string;
    type?: string;
    experienceYears?: number;
  };
  reviews: Review[];
  status: "active" | "pending" | "flagged" | "rejected";
  reported?: boolean;
}

export interface Conversation {
  id: string;
  participant: string;
  participantAvatar: string;
  listingId?: string;
  listingTitle?: string;
  createdAt: string;
  unread?: number;
  messages: Message[];
}

export interface Message {
  id: string;
  from: "me" | "them";
  kind: "text" | "image" | "voice";
  text?: string;
  src?: string;
  at: string;
  status?: "sent" | "delivered" | "read";
  translated?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  location: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  business?: boolean;
  joined: string;
}

export interface SearchFilters {
  query?: string;
  category?: Category | "all";
  kind?: ListingKind | "all";
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: Condition;
  dateAdded?: "any" | "today" | "week" | "month";
  minRating?: number;
  verifiedOnly?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular" | "relevance";
  bedrooms?: number;
  fuel?: FuelType;
  transmission?: Transmission;
  page?: number;
}

export interface SearchIntent {
  category: Category;
  kind: ListingKind;
  location: string | null;
  priceMax: number | null;
  query: string;
  keywords: string[];
}

export interface AiListingSuggestion {
  description: string;
  price: number;
  tags: string[];
  improvement: string[];
}

export interface AdminStats {
  users: number;
  listings: number;
  categories: number;
  transactions: number;
  reports: number;
  verifiedSellers: number;
}
