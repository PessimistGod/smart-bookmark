import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pzstpuqunrzlmtuttbsc.supabase.co";
const supabaseAnonKey = "sb_publishable_fX6qqKJWJHQmGYFv77SeGA_cRCLwjpo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
