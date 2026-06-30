-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  role text check (role in ('organizer', 'ngo')) not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Food Listings Table
create table public.food_listings (
  id uuid default uuid_generate_v4() primary key,
  organizer_id uuid references public.users(id) not null,
  title text not null,
  description text,
  quantity text not null,
  lat double precision,
  lng double precision,
  status text check (status in ('available', 'claimed', 'picked_up')) default 'available' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Claims Table
create table public.claims (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.food_listings(id) not null,
  ngo_id uuid references public.users(id) not null,
  status text check (status in ('pending', 'approved', 'rejected', 'completed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.food_listings enable row level security;
alter table public.claims enable row level security;

-- Basic Policies (can be expanded based on requirements)
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Anyone can view food listings" on public.food_listings for select using (true);
create policy "Organizers can insert own listings" on public.food_listings for insert with check (auth.uid() = organizer_id);
create policy "Organizers can update own listings" on public.food_listings for update using (auth.uid() = organizer_id);

create policy "Anyone can view claims" on public.claims for select using (true);
create policy "NGOs can insert own claims" on public.claims for insert with check (auth.uid() = ngo_id);
create policy "Organizers and NGOs can update claims" on public.claims for update using (true); -- Usually restricted to specific roles in app logic
