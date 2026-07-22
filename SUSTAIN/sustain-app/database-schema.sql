-- ============================================================
-- SUSTAIN Database Schema Blueprint
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ── 1. USERS TABLE ──
-- Stores authenticated user profiles with their role assignment.
-- Linked to Supabase Auth via `auth.users(id)`.

CREATE TABLE public.users (
  id         UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
  role       TEXT CHECK (role IN ('organizer', 'ngo')) NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view users"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);


-- ── 2. FOOD LISTINGS TABLE ──
-- Stores food donation entries posted by organizers.
-- Includes geospatial coordinates for map rendering.

CREATE TABLE public.food_listings (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organizer_id  UUID REFERENCES public.users(id) NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  quantity       TEXT NOT NULL,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  status        TEXT CHECK (status IN ('available', 'claimed', 'picked_up'))
                     DEFAULT 'available' NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Row Level Security
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings"
  ON public.food_listings FOR SELECT USING (true);

CREATE POLICY "Organizers can insert own listings"
  ON public.food_listings FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own listings"
  ON public.food_listings FOR UPDATE USING (auth.uid() = organizer_id);


-- ── 3. CLAIMS TABLE ──
-- Tracks NGO claims against specific food listings.

CREATE TABLE public.claims (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id  UUID REFERENCES public.food_listings(id) NOT NULL,
  ngo_id      UUID REFERENCES public.users(id) NOT NULL,
  status      TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed'))
                   DEFAULT 'pending' NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Row Level Security
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view claims"
  ON public.claims FOR SELECT USING (true);

CREATE POLICY "NGOs can insert own claims"
  ON public.claims FOR INSERT WITH CHECK (auth.uid() = ngo_id);
