-- =========================================================================
-- SUSTAIN — Hard Reset Foreign Keys (Drops ALL existing FKs first)
-- Run this in Supabase Dashboard > SQL Editor
-- =========================================================================

DO $$ 
DECLARE 
  r RECORD;
BEGIN
  -- Drop all foreign keys on organizers
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.organizers'::regclass AND contype = 'f') LOOP
    EXECUTE 'ALTER TABLE public.organizers DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;

  -- Drop all foreign keys on ngos
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.ngos'::regclass AND contype = 'f') LOOP
    EXECUTE 'ALTER TABLE public.ngos DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;

  -- Drop all foreign keys on events
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.events'::regclass AND contype = 'f') LOOP
    EXECUTE 'ALTER TABLE public.events DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;

  -- Drop all foreign keys on surplus_listings
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.surplus_listings'::regclass AND contype = 'f') LOOP
    EXECUTE 'ALTER TABLE public.surplus_listings DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;

  -- Drop all foreign keys on claims
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.claims'::regclass AND contype = 'f') LOOP
    EXECUTE 'ALTER TABLE public.claims DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;


-- Now add the correct ones back:

ALTER TABLE public.organizers ADD CONSTRAINT organizers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.ngos ADD CONSTRAINT ngos_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.events ADD CONSTRAINT events_organizer_id_fkey 
  FOREIGN KEY (organizer_id) REFERENCES public.organizers(id) ON DELETE CASCADE;

ALTER TABLE public.surplus_listings ADD CONSTRAINT surplus_listings_event_id_fkey 
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.surplus_listings ADD CONSTRAINT surplus_listings_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES public.organizers(id) ON DELETE CASCADE;

ALTER TABLE public.claims ADD CONSTRAINT claims_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES public.surplus_listings(id) ON DELETE CASCADE;

ALTER TABLE public.claims ADD CONSTRAINT claims_ngo_id_fkey 
  FOREIGN KEY (ngo_id) REFERENCES public.ngos(id) ON DELETE CASCADE;
