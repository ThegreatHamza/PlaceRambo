-- PlaceRambo — Supabase / PostgreSQL schema
-- This schema prepares the marketplace for a real backend while the current
-- MVP uses seeded demo data stored on the server and in localStorage.

create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text unique,
  email text not null,
  phone text,
  avatar_url text,
  location text default 'Djibouti City',
  bio text,
  verified boolean default false,
  business boolean default false,
  created_at timestamptz default now()
);

-- Sellers (business / dealer / service provider)
create table if not exists public.sellers (
  id uuid primary key references public.profiles(id) on delete cascade,
  rating numeric(3,2) default 5,
  review_count integer default 0,
  followers integer default 0,
  languages text[] default array['fr','so','ar','en'],
  skills text[],
  phone_verified boolean default false,
  business_verified boolean default false,
  created_at timestamptz default now()
);

-- Listings
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.sellers(id) on delete cascade,
  title text not null,
  description text,
  price bigint not null,
  price_label text,
  category text not null,
  kind text not null check (kind in ('products','vehicles','real-estate','rentals','services')),
  condition text,
  location text,
  images jsonb default '[]'::jsonb,
  video_url text,
  status text default 'pending' check (status in ('active','pending','flagged','rejected')),
  featured boolean default false,
  views integer default 0,
  favorites integer default 0,
  bedrooms integer,
  bathrooms integer,
  area integer,
  year_built integer,
  brand text,
  model text,
  year integer,
  mileage integer,
  fuel text,
  transmission text,
  color text,
  rental_price_day bigint,
  rental_price_week bigint,
  rental_price_month bigint,
  available_from date,
  available_to date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_location_idx on public.listings(location);
create index if not exists listings_created_idx on public.listings(created_at desc);

-- Listing images
create table if not exists public.listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade,
  url text not null,
  alt text,
  position integer default 0
);

-- Favorites
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, listing_id)
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid references public.profiles(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  type text default 'text' check (type in ('text','image','voice')),
  content text,
  media_url text,
  translated_content text,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Booking requests
create table if not exists public.booking_requests (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade,
  requester_id uuid references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date,
  status text default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  message text,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Reports / moderation
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.profiles(id) on delete cascade,
  target_type text check (target_type in ('listing','user','message')),
  target_id uuid not null,
  reason text,
  status text default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz default now()
);

-- Admin helper: verify a profile
create or replace function public.verify_profile(profile_id uuid)
returns void language sql as $$
  update public.profiles set verified = true where id = profile_id;
  update public.sellers set business_verified = true where id = profile_id;
$$;

-- Row Level Security (basic)
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.booking_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

create policy "public read profiles" on public.profiles for select using (true);
create policy "owners update profiles" on public.profiles for update using (auth.uid() = id);
create policy "public read active listings" on public.listings for select using (status = 'active');
create policy "owners insert listings" on public.listings for insert with check (auth.uid() = seller_id);
create policy "owners update listings" on public.listings for update using (auth.uid() = seller_id);
