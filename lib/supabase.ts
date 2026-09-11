import { createClient } from "@supabase/supabase-js";

// Anon client; safe on server and client (RLS + SECURITY DEFINER RPCs gate everything).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
