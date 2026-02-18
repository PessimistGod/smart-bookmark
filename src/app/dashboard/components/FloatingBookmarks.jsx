"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiClock } from "react-icons/fi";
import { GoPin } from "react-icons/go";

const time = d => new Date(d).toLocaleString();

export default function FloatingBookmarks() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await supabase.from("bookmarks").select("*").eq("is_archived", false).order("created_at", { ascending: false }).limit(8);
    setItems(data || []);
  };

  useEffect(() => {
    load();
    const channel = supabase.channel("floating").on("postgres_changes", { event: "*", schema: "public", table: "bookmarks" }, load).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-5 py-4 rounded-full shadow-xl hover:opacity-90 cursor-pointer"><GoPin /></button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl p-5 max-h-96 overflow-auto">
          <h3 className="font-semibold mb-4">Quick Bookmarks</h3>
          {items.map(b => (
            <div key={b.id} className="mb-4 text-sm">
              <a href={b.url} target="_blank" className="text-blue-700 font-medium block">{b.title}</a>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><FiClock />{time(b.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
