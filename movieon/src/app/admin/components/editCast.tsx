"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Movie, MovieCast } from "@/types";

interface Props {
  movie: Movie;
  cast: MovieCast;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCast({ movie, cast, onClose, onSuccess }: Props) {
  const [updatedCast, setUpdatedCast] = useState<MovieCast>(cast);

  const save = async () => {
    if (!updatedCast.actor.trim() || !updatedCast.character.trim()) {
      toast.error("Actor & Character required");
      return;
    }

    const castList = movie.cast ?? []; // <-- FIXED: prevent undefined

    // Find correct index instead of matching by text
    const index = castList.findIndex(
      (c) =>
        c.actor === cast.actor &&
        c.character === cast.character &&
        c.picture === cast.picture
    );

    if (index === -1) {
      toast.error("Cast member not found!");
      return;
    }

    const updatedList = [...castList];
    updatedList[index] = updatedCast;

    const updatedMovie: Movie = {
      ...movie,
      cast: updatedList,
    };

    try {
      await api.put(`/movies/${movie._id}`, updatedMovie);
      toast.success("Cast updated!");
      onSuccess();
    } catch {
      toast.error("Failed to update cast");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-zinc-900 p-6 rounded-xl w-full max-w-md z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Cast</h2>
          <button className="bg-zinc-700 p-1 rounded" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            placeholder="Actor Name"
            className="p-2 bg-zinc-800 rounded w-full"
            value={updatedCast.actor}
            onChange={(e) =>
              setUpdatedCast({ ...updatedCast, actor: e.target.value })
            }
          />

          <input
            placeholder="Character Name"
            className="p-2 bg-zinc-800 rounded w-full"
            value={updatedCast.character}
            onChange={(e) =>
              setUpdatedCast({ ...updatedCast, character: e.target.value })
            }
          />

          <input
            placeholder="Picture URL"
            className="p-2 bg-zinc-800 rounded w-full"
            value={updatedCast.picture}
            onChange={(e) =>
              setUpdatedCast({ ...updatedCast, picture: e.target.value })
            }
          />
        </div>

        <button
          onClick={save}
          className="mt-4 bg-blue-600 w-full py-2 rounded hover:bg-blue-700 flex gap-2 justify-center"
        >
          <Save size={16} /> Update
        </button>
      </div>
    </div>
  );
}
