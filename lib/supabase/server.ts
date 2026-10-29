import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

export async function createClient() {
  const config = supabaseConfig();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        // Render-only Server Components cannot write cookies; Proxy refreshes them.
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Session cookies are written by route handlers or Proxy. */ }
      },
    },
  });
}

