"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard/bookmarks");
    });
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard/bookmarks`,
      },
    });
  };

return (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-md text-center">

      <h1 className="text-4xl font-bold mb-2 text-slate-900">
        Smart Bookmark
      </h1>

      <p className="text-gray-500 mb-8">
        Save and sync your favorite links instantly
      </p>

      <button
        onClick={signIn}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition text-white font-semibold shadow-md cursor-pointer"
      >
        Continue with Google
      </button>

    </div>
  </div>
);

}
