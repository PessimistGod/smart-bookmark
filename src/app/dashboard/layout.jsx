"use client";
import Link from "next/link";
import FloatingBookmarks from "./components/FloatingBookmarks";
import UserBar from "./components/UserBar";
import { FiHome, FiBookmark } from "react-icons/fi";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const enforceAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        await supabase.auth.signOut();
        router.replace("/login");
      }
    };

    enforceAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const navItem = (href, label, Icon) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium
          ${
            active
              ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
          }`}
      >
        <Icon className="text-lg" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r shadow-lg px-6 py-8 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-blue-800 tracking-tight">
            Smart Bookmark
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Personal link manager
          </p>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          {navItem("/dashboard", "Dashboard", FiHome)}
          {navItem("/dashboard/bookmarks", "Bookmarks", FiBookmark)}
        </nav>

        <div className="pt-6 border-t text-xs text-gray-400 space-y-1">
          <div>© Smart Bookmark By Rahul R</div>

          <div className="flex flex-col gap-1">
            <a
              href="mailto:rahulramesh0004@gmail.com"
              className="hover:text-blue-700 transition"
            >
              rahulramesh0004@gmail.com
            </a>

            <a
              href="tel:+919886993842"
              className="hover:text-blue-700 transition"
            >
              +91 98869 93842
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 relative bg-slate-50">
        <UserBar />
        {children}
        <FloatingBookmarks />
      </main>
    </div>
  );
}
