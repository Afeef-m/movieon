"use client";

import api from "@/app/lib/axios";
import { Theater, TheaterMovie } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AssignMovieModal({
  theater,
  movies,
  onClose,
  onAssigned,
}: {
  theater: Theater;
  movies: { id: string; title: string }[];
  onClose: () => void;
  onAssigned: (theaterId: string, movieBlock: TheaterMovie) => void;
}) {
  const [selectedMovieId, setSelectedMovieId] = useState<string>(
    movies[0]?.id ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!selectedMovieId) {
      toast.error("Select a movie.");
      return;
    }

    const block: TheaterMovie = {
      movieId: selectedMovieId,
      movieTitle:selectedMovieId,
      days: [],
      screens: [],
    };

    setSubmitting(true);
    try {
      const exists = theater.movies?.find(
        (m) => String(m.movieId) === String(block.movieId)
      );

      let updatedMovies;
      if (exists) {
        toast("Movie already assigned.");
        return;
      } else {
        updatedMovies = [...(theater.movies ?? []), block];
      }

      await api.put(`/theaters/${theater.id}`, {
        ...theater,
        movies: updatedMovies,
      });

      onAssigned(theater.id, block);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign movie.");
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
      <div className="relative z-10 max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">
          Assign Movie to {theater.name}
        </h3>

        <label className="text-sm text-zinc-300">Movie</label>
        <select
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          className="mt-1 w-full bg-zinc-800 p-2 rounded-md mb-4"
        >
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => !submitting && onClose()}
            className="px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={submitting}
            className="px-4 py-2 bg-amber-600 rounded-md hover:bg-amber-500"
          >
            {submitting ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
