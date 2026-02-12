"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import type { Movie, Theater, TheaterMovie } from "@/types/index";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Film,
  MapPin,
  Search,
  ListX,
} from "lucide-react";

import ConfirmDelete from "./confirmDelete";
import TheaterForm from "./theaterDataForm";
import AssignMovieModal from "./theaterMovieAssign";
import AssignManager from "./assignManager";

export default function TheaterTable() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [moviesList, setMoviesList] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);

  const [openAssign, setOpenAssign] = useState(false);
  const [assignTheater, setAssignTheater] = useState<Theater | null>(null);

  const [openAssignManager, setOpenAssignManager] = useState(false);
  const [selectedTheaterForManager, setSelectedTheaterForManager] = useState<Theater | null>(null);

  const [theaterSearch, setTheaterSearch] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [theaterToDelete, setTheaterToDelete] = useState<Theater | null>(null);

  const normalizeArray = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
  };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [tRes, mRes] = await Promise.all([
        api.get("/theaters"),
        api.get("/movies"),
      ]);

      const tRaw = tRes.data.theaters ?? tRes.data ?? [];
      const mRaw = mRes.data.movies ?? mRes.data ?? [];

      const theatersArray = normalizeArray(tRaw);
      const moviesArray = normalizeArray(mRaw);

      setTheaters(theatersArray);
      setMoviesList(
        moviesArray.map((m: Movie) => ({ id: m.id, title: m.title }))
      );
    } catch (err) {
      console.error("Fetch Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openEditModal = (t: Theater) => {
    setEditingTheater(t);
    setOpenForm(true);
  };

  const openAssignModal = (t: Theater) => {
    setAssignTheater(t);
    setOpenAssign(true);
  };

  const confirmDelete = (t: Theater) => {
    setTheaterToDelete(t);
    setOpenConfirm(true);
  };

  const handleTheater = (theater: Theater, isEdit: boolean) => {
    setTheaters((prev) =>
      isEdit
        ? prev.map((t) => (t.id === theater.id ? theater : t))
        : [theater, ...prev]
    );

    setOpenForm(false);
    setEditingTheater(null);
  };

  const handleAssignedLocally = (theaterId: string, newMovie: TheaterMovie) => {
    setTheaters((prev) =>
      prev.map((t) =>
        t.id === theaterId
          ? { ...t, movies: [...(t.movies ?? []), newMovie] }
          : t
      )
    );

    setOpenAssign(false);
    setAssignTheater(null);
  };

  const filterTheater = theaters.filter((t) => {
    if (!theaterSearch.trim()) return true;
    const item = theaterSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(item), t.city.toLowerCase().includes(item)
    );
  });
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/theaters/${id}`);
      setTheaters((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setOpenConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative mt-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 "
            size={18}
          />
          <input
            placeholder="Search theater or city"
            value={theaterSearch}
            onChange={(e) => setTheaterSearch(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 w-96 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <button
          onClick={() => setOpenForm(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Add Theater
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-800 text-center">
            <th className="py-3">ID</th>
            <th className="py-3">Name</th>
            <th className="py-3">City</th>
            <th className="py-3">Formats</th>
            <th className="py-3">Movies</th>
            <th className="py-3 flex justify-center ">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filterTheater.map((t) => (
            <tr
              key={t.id}
              className="border-b border-zinc-800 hover:bg-zinc-800/50 text-center justify-center "
            >
              <td className="py-3 flex items-center gap-2">{t.id}</td>

              <td className="py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Film size={16} />
                  {t.name}
                </div>
              </td>

              <td className="py-3">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={14} />
                  {t.city}
                </div>
              </td>

              <td className="py-3 items-center justify-center gap-2">
                {Array.isArray(t.screening)
                  ? t.screening.join(", ")
                  : t.screening}
              </td>

              <td className="py-3">
                <div className="flex items-center justify-center">
                  <div className="relative group">
                    <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                      {(t.movies ?? []).length} Movies
                    </span>

                    {t.movies && t.movies.length > 0 && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block
                     bg-zinc-800 text-white text-xs border border-zinc-700 p-2 
                     rounded-md shadow-xl w-44 z-20 space-y-1"
                      >
                        {(t.movies ?? []).map((m) => {
                          const found = moviesList.find(
                            (x) => x.id === m.movieId
                          );
                          return (
                            <div key={m.movieId}>
                              {found ? found.title : "Unknown"}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="py-3">
                <div className="flex justify-center gap-3 text-center">
                  <button
                    onClick={() => openEditModal(t)}
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-md text-sm"
                  >
                    <Edit2 size={14} /> Edit
                  </button>

                  <button
                    onClick={() => openAssignModal(t)}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 px-2 py-1 rounded-md text-sm"
                  >
                    Assign Movie
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTheaterForManager(t);
                      setOpenAssignManager(true);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-md text-sm"
                  >
                    Assign Manager
                  </button>

                  <button
                    onClick={() => confirmDelete(t)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-2 py-1 rounded-md text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filterTheater.length === 0 && (
        <div className="py-6 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
            <ListX size={20} />
            <span>No Theaters Found</span>
          </div>
        </div>
      )}

      {openForm && (
        <TheaterForm
          theater={editingTheater}
          onClose={() => setOpenForm(false)}
          onSuccess={handleTheater}
        />
      )}

      {openAssign && assignTheater && (
        <AssignMovieModal
          theater={assignTheater}
          movies={moviesList}
          onClose={() => setOpenAssign(false)}
          onAssigned={handleAssignedLocally}
        />
      )}

      {openAssignManager && selectedTheaterForManager && (
        <AssignManager
          theater={selectedTheaterForManager}
          onClose={() => setOpenAssignManager(false)}
          onAssigned={() => {
            setOpenAssignManager(false);
            setSelectedTheaterForManager(null);
            fetchAll();
          }}
        />
      )}

      {openConfirm && theaterToDelete && (
        <ConfirmDelete
          title="Delete Theater"
          description={`Are you sure you want to delete "${theaterToDelete.name}"?`}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => handleDelete(theaterToDelete.id)}
        />
      )}
    </div>
  );
}
