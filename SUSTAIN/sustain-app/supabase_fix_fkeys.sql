-- =========================================================================
-- SUSTAIN — Fix Foreign Keys
-- Run this in Supabase Dashboard > SQL Editor
-- =========================================================================

-- 1. ORGANIZERS
ALTER TABLE public.organizers DROP CONSTRAINT IF EXISTS organizers_user_id_fkey;
ALTER TABLE public.organizers ADD CONSTRAINT organizers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. NGOS
ALTER TABLE public.ngos DROP CONSTRAINT IF EXISTS ngos_user_id_fkey;
ALTER TABLE public.ngos ADD CONSTRAINT ngos_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 3. EVENTS
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organizer_id_fkey;
ALTER TABLE public.events ADD CONSTRAINT events_organizer_id_fkey 
  FOREIGN KEY (organizer_id) REFERENCES public.organizers(id) ON DELETE CASCADE;

-- 4. SURPLUS_LISTINGS
ALTER TABLE public.surplus_listings DROP CONSTRAINT IF EXISTS surplus_listings_event_id_fkey;
ALTER TABLE public.surplus_listings ADD CONSTRAINT surplus_listings_event_id_fkey 
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.surplus_listings DROP CONSTRAINT IF EXISTS surplus_listings_created_by_fkey;
ALTER TABLE public.surplus_listings ADD CONSTRAINT surplus_listings_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.organizers(id) ON DELETE CASCADE;

-- 5. CLAIMS
ALTER TABLE public.claims DROP CONSTRAINT IF EXISTS claims_listing_id_fkey;
ALTER TABLE public.claims ADD CONSTRAINT claims_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.surplus_listings(id) ON DELETE CASCADE;

ALTER TABLE public.claims DROP CONSTRAINT IF EXISTS claims_ngo_id_fkey;
ALTER TABLE public.claims ADD CONSTRAINT claims_ngo_id_fkey 
  FOREIGN KEY (ngo_id) REFERENCES public.ngos(id) ON DELETE CASCADE;
