-- PlaceRambo production marketplace schema
-- This mirrors the initial Supabase migration used for the project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text, avatar_url text, is_verified boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.categories (id uuid primary key default gen_random_uuid(), slug text unique not null, name_en text not null, name_fr text not null, name_so text not null, icon text, created_at timestamptz not null default now());
create table if not exists public.listings (id uuid primary key default gen_random_uuid(), seller_id uuid references public.profiles(id) on delete set null, category_id uuid references public.categories(id) on delete set null, title text not null, description text, price_djf numeric(14,2) not null default 0, listing_type text not null default 'sale' check (listing_type in ('sale','rent','service')), condition text check (condition in ('new','used','not_applicable')), location text, image_url text, is_featured boolean not null default false, status text not null default 'active' check (status in ('active','sold','rented','archived')), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.favorites (user_id uuid not null references auth.users(id) on delete cascade, listing_id uuid not null references public.listings(id) on delete cascade, created_at timestamptz not null default now(), primary key (user_id, listing_id));

create index if not exists listings_category_idx on public.listings(category_id);
create index if not exists listings_created_idx on public.listings(created_at desc);
create index if not exists listings_status_idx on public.listings(status);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;

create policy "public profiles are viewable" on public.profiles for select using (true);
create policy "users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "categories are public" on public.categories for select using (true);
create policy "active listings are public" on public.listings for select using (status = 'active' or auth.uid() = seller_id);
create policy "authenticated users can create listings" on public.listings for insert with check (auth.uid() = seller_id);
create policy "sellers can update own listings" on public.listings for update using (auth.uid() = seller_id);
create policy "sellers can delete own listings" on public.listings for delete using (auth.uid() = seller_id);
create policy "users can view own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "users can add own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "users can remove own favorites" on public.favorites for delete using (auth.uid() = user_id);

insert into public.categories (slug,name_en,name_fr,name_so,icon) values
('electronics','Electronics','Électronique','Elektaroonig','Smartphone'),('vehicles','Vehicles','Véhicules','Gaadiid','Car'),('homes-sale','Homes for Sale','Maisons à vendre','Guryo iib ah','House'),('homes-rent','Homes for Rent','Maisons à louer','Guryo kiro ah','Building2'),('jobs-services','Jobs & Services','Emplois & Services','Shaqooyin & Adeegyo','BriefcaseBusiness'),('fashion','Fashion','Mode','Dharka','Shirt') on conflict (slug) do nothing;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id,full_name) values (new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
