"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiLogOut } from "react-icons/fi";

export default function UserBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return null;

  const logout = async () => {
    await supabase.auth.signOut();
    location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-xl font-semibold">
        Welcome, {user.user_metadata?.full_name || user.email}
      </h1>

      <div className="flex items-center gap-4">
        {user.user_metadata?.avatar_url && (
          <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full" />
        )}

        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 cursor-pointer">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}
