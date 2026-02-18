import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pzstpuqunrzlmtuttbsc.supabase.co";
const supabaseAnonKey = "sb_publishable_fX6qqKJWJHQmGYFv77SeGA_cRCLwjpo";

const chromeStorage = {
  getItem: key =>
    new Promise(resolve =>
      chrome.storage.local.get(key, r => resolve(r[key] ?? null))
    ),
  setItem: (key, value) =>
    new Promise(resolve =>
      chrome.storage.local.set({ [key]: value }, resolve)
    ),
  removeItem: key =>
    new Promise(resolve =>
      chrome.storage.local.remove(key, resolve))
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: "pkce",  
    storage: chromeStorage
  }
});
