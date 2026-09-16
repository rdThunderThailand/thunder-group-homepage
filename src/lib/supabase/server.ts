import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client for the `thunder_partner` RPC functions
// (supabase/sql/*.sql). Bypasses RLS -- never import this from a Client
// Component or expose the key it reads to the browser.
export function createServiceRoleClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
