"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface DbUser {
  id: number;
  auth_id: string;
  email: string;
  role: "organizer" | "ngo";
  full_name: string;
}

export interface OrganizerProfile {
  id: number;
  user_id: number;
  organization_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
}

export interface NgoProfile {
  id: number;
  user_id: number;
  ngo_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
  is_verified: boolean;
}

export function isOrganizerProfile(
  profile: OrganizerProfile | NgoProfile | null
): profile is OrganizerProfile {
  return profile !== null && "organization_name" in profile;
}

export function isNgoProfile(
  profile: OrganizerProfile | NgoProfile | null
): profile is NgoProfile {
  return profile !== null && "ngo_name" in profile;
}

interface AuthContextType {
  authUser: User | null;
  dbUser: DbUser | null;
  profile: OrganizerProfile | NgoProfile | null;
  role: "organizer" | "ngo" | null;
  loading: boolean;
  profileReady: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  dbUser: null,
  profile: null,
  role: null,
  loading: true,
  profileReady: false,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [profile, setProfile] = useState<OrganizerProfile | NgoProfile | null>(null);
  const [role, setRole] = useState<"organizer" | "ngo" | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const router = useRouter();

  const fetchProfile = useCallback(async (authUuid: string) => {
    const { data: dbUserData, error: dbUserErr } = await supabase
      .from("users")
      .select("id, auth_id, email, role, full_name")
      .eq("auth_id", authUuid)
      .maybeSingle();

    if (dbUserErr) throw dbUserErr;
    if (!dbUserData) {
      setDbUser(null);
      setProfile(null);
      setRole(null);
      return;
    }

    setDbUser(dbUserData);
    setRole(dbUserData.role);

    if (dbUserData.role === "organizer") {
      const { data: orgData, error: orgErr } = await supabase
        .from("organizers")
        .select("*")
        .eq("user_id", dbUserData.id)
        .maybeSingle();
      if (orgErr) throw orgErr;
      setProfile(orgData ?? null);
    } else if (dbUserData.role === "ngo") {
      const { data: ngoData, error: ngoErr } = await supabase
        .from("ngos")
        .select("*")
        .eq("user_id", dbUserData.id)
        .maybeSingle();
      if (ngoErr) throw ngoErr;
      setProfile(ngoData ?? null);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const resolveAuth = async (session: { user: User | null } | null) => {
      const currentUser = session?.user ?? null;
      setAuthUser(currentUser);

      if (!currentUser) {
        setDbUser(null);
        setProfile(null);
        setRole(null);
        setProfileReady(true);
        return;
      }

      setProfileReady(false);
      try {
        await fetchProfile(currentUser.id);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setDbUser(null);
        setProfile(null);
        setRole(null);
      } finally {
        if (active) setProfileReady(true);
      }
    };

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      await resolveAuth(session);
      if (active) setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!active) return;
        setLoading(true);
        await resolveAuth(session);
        if (active) setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setDbUser(null);
    setProfile(null);
    setRole(null);
    setProfileReady(true);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbUser,
        profile,
        role,
        loading,
        profileReady,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
