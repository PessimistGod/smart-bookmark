"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  FiEdit2,
  FiArchive,
  FiRotateCcw,
  FiTrash2,
  FiClock,
} from "react-icons/fi";

const formatTime = d => new Date(d).toLocaleString();

export default function Bookmarks() {
  const [items, setItems] = useState([]);
  const [archived, setArchived] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  const load = async () => {
    const { data: active } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    const { data: old } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("is_archived", true)
      .order("created_at", { ascending: false });

    setItems(active || []);
    setArchived(old || []);
  };

  useEffect(() => { load(); }, []);

  const validUrl = url =>
    /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i.test(url);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.url.trim()) e.url = "URL required";
    else if (!validUrl(form.url)) e.url = "Enter valid https:// URL";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    if (editing)
      await supabase.from("bookmarks").update(form).eq("id", editing);
    else await supabase.from("bookmarks").insert(form);

    setForm({ title: "", url: "" });
    setEditing(null);
    setErrors({});
    load();
  };

  const edit = b => {
    setForm({ title: b.title, url: b.url });
    setEditing(b.id);
  };

  const archive = async id => {
    await supabase.from("bookmarks").update({ is_archived: true }).eq("id", id);
    load();
  };

  const restore = async id => {
    await supabase.from("bookmarks").update({ is_archived: false }).eq("id", id);
    load();
  };

  const destroy = async id => {
    await supabase.from("bookmarks").delete().eq("id", id);
    load();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-10 text-slate-800">Bookmarks</h1>

      <div className="grid grid-cols-12 gap-4 mb-14 items-start">

        <div className="col-span-5 space-y-1">
          <input
            className={`w-full h-[48px] border rounded-xl p-3 outline-none focus:ring-2 ${
              errors.title ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="col-span-5 space-y-1">
          <input
            className={`w-full h-[48px] border rounded-xl p-3 outline-none focus:ring-2 ${
              errors.url ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Paste URL"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
          />
          {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
        </div>

        <button
          onClick={save}
          className="col-span-2 h-[48px] rounded-xl text-white font-semibold shadow cursor-pointer bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:opacity-90"
        >
          {editing ? "Update" : "Add"}
        </button>
      </div>

      <div className="space-y-4 mb-16">
        {items.map(b => (
          <div
            key={b.id}
            className="flex justify-between items-center bg-white rounded-2xl border p-5 shadow-sm hover:shadow transition"
          >
            <div>
              <a
                href={b.url}
                target="_blank"
                className="font-semibold text-blue-700 hover:underline"
              >
                {b.title}
              </a>

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <FiClock />
                {formatTime(b.created_at)}
              </div>
            </div>

            <div className="flex gap-4 text-lg">

              <span className="tooltip" data-tip="Edit">
                <FiEdit2
                  onClick={() => edit(b)}
                  className="cursor-pointer text-blue-700"
                />
              </span>

              <span className="tooltip" data-tip="Archive">
                <FiArchive
                  onClick={() => archive(b.id)}
                  className="cursor-pointer text-gray-500"
                />
              </span>

            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-gray-600">Archived</h2>

          <div className="space-y-3">
            {archived.map(b => (
              <div
                key={b.id}
                className="flex justify-between items-center bg-gray-50 rounded-xl border p-4"
              >
                <span className="text-gray-500">{b.title}</span>

                <div className="flex gap-4 text-lg">

                  <span className="tooltip" data-tip="Restore">
                    <FiRotateCcw
                      onClick={() => restore(b.id)}
                      className="cursor-pointer text-blue-700"
                    />
                  </span>

                  <span className="tooltip" data-tip="Delete permanently">
                    <FiTrash2
                      onClick={() => destroy(b.id)}
                      className="cursor-pointer text-red-500"
                    />
                  </span>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
