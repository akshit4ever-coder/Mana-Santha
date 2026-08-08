import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (user: User) => {
    try {
      // Method 1: Check user_roles table
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (data) {
        setIsAdmin(true);
        return;
      }

      // Method 2: Fallback — check user_metadata.role
      const metaRole = user.user_metadata?.role;
      if (metaRole === "admin") {
        setIsAdmin(true);
        // Also try to sync into user_roles table for future lookups
        try {
          await supabase.from("user_roles").insert({
            user_id: user.id,
            role: "admin" as any,
          });
        } catch {
          // Ignore — may fail due to RLS or duplicates
        }
        return;
      }

      setIsAdmin(false);
    } catch {
      // If user_roles query fails (e.g., table doesn't exist, RLS blocks),
      // fall back to user_metadata check
      const metaRole = user.user_metadata?.role;
      setIsAdmin(metaRole === "admin");
    }
  };

  useEffect(() => {
    // 1. Initial Session check
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        checkAdminRole(data.session.user);
      }
    });

    // 2. Real-time auth state listener
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);

      if (s?.user) {
        checkAdminRole(s.user);
      } else {
        setIsAdmin(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, isAdmin, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
