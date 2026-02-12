"use client";

import api from "@/app/lib/axios";
import { Theater } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TheaterForm({
  theater,
  onClose,
  onSuccess,
}: {
  theater: Theater | null;
  onClose: () => void;
  onSuccess: (t: Theater, isEdit: boolean) => void;
}) {
  const [name, setName] = useState(theater?.name ?? "");
  const [city, setCity] = useState(theater?.city ?? "");
  const [formats, setFormats] = useState<string[]>(
    Array.isArray(theater?.screening) ? theater!.screening : []
  );
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(theater);

  const toggleFormat = (f: string) => {
    setFormats((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !city.trim()) {
      toast.error("Name and city are required.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: Partial<Theater> = {
        name: name.trim(),
        city: city.trim(),
        screening: formats,
        movies: theater?.movies ?? [],
      };

      let saved: Theater;

      if (isEdit && theater?.id) {
        const res = await api.put(`/theaters/${theater.id}`, {
          ...theater,
          ...payload,
        });

        saved =
          res.data.theater ?? res.data ?? { ...(theater as Theater), ...payload };
        toast.success("Theater updated successfully");
        onSuccess(saved, true);
      } else {
        const res = await api.post("/theaters", payload);

        const created =
          res.data.theater ??
          res.data ??
          ({
            ...payload,
            id: String(Date.now()), 
          } as Theater);

        if (!created.id) created.id = String(Date.now());
        toast.success("Theater created successfully");
        onSuccess(created as Theater, false);
      }
    } catch (err) {
      console.error("Failed to save theater:", err);
      toast.error("Failed to save theater.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Theater" : "Add Theater"}
          </h3>
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-zinc-300">Theater Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-zinc-800 p-2 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">City *</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full bg-zinc-800 p-2 rounded-md outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-zinc-300">Screening Formats</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["4K", "3D", "IMax"].map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => toggleFormat(f)}
                  className={`px-3 py-2 rounded-md text-sm cursor-pointer outline-none ${
                    formats.includes(f)
                      ? "bg-emerald-600"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : isEdit
              ? "Save Changes"
              : "Create Theater"}
          </button>
        </div>
      </form>
    </div>
  );
}
