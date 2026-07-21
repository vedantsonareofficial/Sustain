-- =====================================================
-- SUSTAIN — FLAT RLS FIX (no PL/pgSQL, just plain SQL)
-- Paste this ENTIRE block into Supabase SQL Editor
-- =====================================================

-- Drop old policies (covers every name we've ever used)
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow select for users" ON public.users;
DROP POLICY IF EXISTS "Allow insert for users" ON public.users;
DROP POLICY IF EXISTS "Allow update for users" ON public.users;
DROP POLICY IF EXISTS "users_select" ON public.users;
DROP POLICY IF EXISTS "users_insert" ON public.users;
DROP POLICY IF EXISTS "users_update" ON public.users;
DROP POLICY IF EXISTS "users_delete" ON public.users;

DROP POLICY IF EXISTS "Allow select for organizers" ON public.organizers;
DROP POLICY IF EXISTS "Allow insert for organizers" ON public.organizers;
DROP POLICY IF EXISTS "Allow update for organizers" ON public.organizers;
DROP POLICY IF EXISTS "organizers_select" ON public.organizers;
DROP POLICY IF EXISTS "organizers_insert" ON public.organizers;
DROP POLICY IF EXISTS "organizers_update" ON public.organizers;
DROP POLICY IF EXISTS "organizers_delete" ON public.organizers;

DROP POLICY IF EXISTS "Allow select for ngos" ON public.ngos;
DROP POLICY IF EXISTS "Allow insert for ngos" ON public.ngos;
DROP POLICY IF EXISTS "Allow update for ngos" ON public.ngos;
DROP POLICY IF EXISTS "ngos_select" ON public.ngos;
DROP POLICY IF EXISTS "ngos_insert" ON public.ngos;
DROP POLICY IF EXISTS "ngos_update" ON public.ngos;
DROP POLICY IF EXISTS "ngos_delete" ON public.ngos;

DROP POLICY IF EXISTS "Allow select for events" ON public.events;
DROP POLICY IF EXISTS "Allow insert for events" ON public.events;
DROP POLICY IF EXISTS "Allow update for events" ON public.events;
DROP POLICY IF EXISTS "events_select" ON public.events;
DROP POLICY IF EXISTS "events_insert" ON public.events;
DROP POLICY IF EXISTS "events_update" ON public.events;
DROP POLICY IF EXISTS "events_delete" ON public.events;

DROP POLICY IF EXISTS "Anyone can view food listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "Organizers can insert own listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "Organizers can update own listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "Allow select for surplus_listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "Allow insert for surplus_listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "Allow update for surplus_listings" ON public.surplus_listings;
DROP POLICY IF EXISTS "surplus_listings_select" ON public.surplus_listings;
DROP POLICY IF EXISTS "surplus_listings_insert" ON public.surplus_listings;
DROP POLICY IF EXISTS "surplus_listings_update" ON public.surplus_listings;
DROP POLICY IF EXISTS "surplus_listings_delete" ON public.surplus_listings;

DROP POLICY IF EXISTS "Anyone can view claims" ON public.claims;
DROP POLICY IF EXISTS "NGOs can insert own claims" ON public.claims;
DROP POLICY IF EXISTS "Organizers and NGOs can update claims" ON public.claims;
DROP POLICY IF EXISTS "Allow select for claims" ON public.claims;
DROP POLICY IF EXISTS "Allow insert for claims" ON public.claims;
DROP POLICY IF EXISTS "Allow update for claims" ON public.claims;
DROP POLICY IF EXISTS "claims_select" ON public.claims;
DROP POLICY IF EXISTS "claims_insert" ON public.claims;
DROP POLICY IF EXISTS "claims_update" ON public.claims;
DROP POLICY IF EXISTS "claims_delete" ON public.claims;


-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;


-- USERS: allow everything
CREATE POLICY "users_select" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON public.users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON public.users FOR DELETE USING (true);

-- ORGANIZERS: allow everything
CREATE POLICY "organizers_select" ON public.organizers FOR SELECT USING (true);
CREATE POLICY "organizers_insert" ON public.organizers FOR INSERT WITH CHECK (true);
CREATE POLICY "organizers_update" ON public.organizers FOR UPDATE USING (true);
CREATE POLICY "organizers_delete" ON public.organizers FOR DELETE USING (true);

-- NGOS: allow everything
CREATE POLICY "ngos_select" ON public.ngos FOR SELECT USING (true);
CREATE POLICY "ngos_insert" ON public.ngos FOR INSERT WITH CHECK (true);
CREATE POLICY "ngos_update" ON public.ngos FOR UPDATE USING (true);
CREATE POLICY "ngos_delete" ON public.ngos FOR DELETE USING (true);

-- EVENTS: allow everything
CREATE POLICY "events_select" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update" ON public.events FOR UPDATE USING (true);
CREATE POLICY "events_delete" ON public.events FOR DELETE USING (true);

-- SURPLUS_LISTINGS: allow everything
CREATE POLICY "surplus_listings_select" ON public.surplus_listings FOR SELECT USING (true);
CREATE POLICY "surplus_listings_insert" ON public.surplus_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "surplus_listings_update" ON public.surplus_listings FOR UPDATE USING (true);
CREATE POLICY "surplus_listings_delete" ON public.surplus_listings FOR DELETE USING (true);

-- CLAIMS: allow everything
CREATE POLICY "claims_select" ON public.claims FOR SELECT USING (true);
CREATE POLICY "claims_insert" ON public.claims FOR INSERT WITH CHECK (true);
CREATE POLICY "claims_update" ON public.claims FOR UPDATE USING (true);
CREATE POLICY "claims_delete" ON public.claims FOR DELETE USING (true);
