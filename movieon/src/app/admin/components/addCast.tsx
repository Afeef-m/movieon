"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Movie, MovieCast } from "@/types";

interface Props {
  movie: Movie;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCast({ movie, onClose, onSuccess }: Props) {
  const [cast, setCast] = useState<MovieCast>({
    actor: "",
    character: "",
    picture: "",
  });

  const submit = async () => {
    if (!cast.actor.trim() || !cast.character.trim()) {
      toast.error("Actor & Character are required");
      return;
    }

    const updatedMovie: Movie = {
      ...movie,
      cast: [...(movie.cast ?? []), cast], // <-- FIXED safe cast array
    };

    try {
      await api.put(`/movies/${movie.id}`, updatedMovie);
      toast.success("Cast added!");
      onSuccess();
    } catch {
      toast.error("Failed to update movie");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-zinc-900 p-6 rounded-xl w-full max-w-md z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Cast</h2>
          <button className="bg-zinc-700 p-1 rounded" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Inputs */}
        <div className="mt-4 space-y-3">
          <input
            placeholder="Actor Name"
            className="p-2 bg-zinc-800 rounded w-full"
            value={cast.actor}
            onChange={(e) => setCast({ ...cast, actor: e.target.value })}
          />

          <input
            placeholder="Character Name"
            className="p-2 bg-zinc-800 rounded w-full"
            value={cast.character}
            onChange={(e) => setCast({ ...cast, character: e.target.value })}
          />

          <input
            placeholder="Picture URL (optional)"
            className="p-2 bg-zinc-800 rounded w-full"
            value={cast.picture ?? ""}
            onChange={(e) => setCast({ ...cast, picture: e.target.value })}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={submit}
          className="mt-4 bg-blue-600 w-full py-2 rounded hover:bg-blue-700 flex gap-2 justify-center"
        >
          <Save size={16} /> Save
        </button>
      </div>
    </div>
  );
}
