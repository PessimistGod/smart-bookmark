"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    archived: 0,
    week: []
  });

  const [todayItems, setTodayItems] = useState([]);

  const load = async () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    /* Optimised count queries */
    const [{ count: total }, { count: archived }] = await Promise.all([
      supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("is_archived", true)
    ]);

    const { data: todayData } = await supabase
      .from("bookmarks")
      .select("*")
      .gte("created_at", today.toISOString())
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    /* Weekly grouped data (last 7 days) */
    const { data: weekData } = await supabase.rpc("bookmarks_last_7_days");

    setStats({
      total,
      archived,
      today: todayData?.length || 0,
      week: weekData || []
    });

    setTodayItems(todayData || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-10">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-3 gap-6">

        <StatCard title="Total" value={stats.total} />

        <StatCard title="Today" value={stats.today} />

        <StatCard title="Archived" value={stats.archived} />

      </div>

      {/* Mini analytics */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <p className="font-semibold mb-3">Last 7 Days Activity</p>

        <Chart
          type="area"
          height={160}
          series={[
            { name: "Bookmarks", data: stats.week.map(d => d.count) }
          ]}
          options={{
            chart: { toolbar: { show: false } },
            stroke: { curve: "smooth" },
            dataLabels: { enabled: false },
            xaxis: {
              categories: stats.week.map(d => d.day),
            },
            colors: ["#6366f1"],
            grid: { strokeDashArray: 4 }
          }}
        />
      </div>

      {/* Today's bookmarks */}
      <div>
        <h2 className="font-semibold mb-4">Today’s Bookmarks</h2>

        {todayItems.length === 0 && (
          <p className="text-gray-500 text-sm">No bookmarks yet</p>
        )}

        <div className="space-y-3">
          {todayItems.map(b => (
            <div
              key={b.id}
              className="flex justify-between items-center bg-white border rounded-xl p-4 hover:shadow-sm transition"
            >
              <div>
                <a
                  href={b.url}
                  target="_blank"
                  className="font-medium text-blue-600"
                >
                  {b.title}
                </a>
                <p className="text-xs text-gray-500">
                  {new Date(b.created_at).toLocaleTimeString()}
                </p>
              </div>

              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                {b.domain}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
