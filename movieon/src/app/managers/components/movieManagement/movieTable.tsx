"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, Film } from "lucide-react";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { MovieForTheater, Theater } from "@/types/manager-index";
import { useAuthStore } from "@/store/useAuthStore";
import ConfirmDelete from "@/app/admin/components/confirmDelete";


export default function MovieManagerTable() {
  const { user, hydrated } = useAuthStore();
  const [movies, setMovies] = useState<MovieForTheater[]>([]);
  const [loading, setLoading] = useState(true);

  const [openConfirm, setOpenConfirm] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<MovieForTheater | null>(null);

  useEffect(() => {
    if (!hydrated || !user) return;
    fetchMovies();
  }, [hydrated, user]);

  const fetchMovies = async () => {
    try {
      if (user?.role !== "manager") return;

      const theaterId = user.theaterId;
      if (!theaterId) {
        toast.error("No theater assigned to this manager");
        return;
      }

      const theater = (
        await api.get<Theater>(`/theaters/${theaterId}`)
      ).data;

      if (!theater.movies?.length) {
        setMovies([]);
        return;
      }

      const movieIds = theater.movies.map((m) => m.movieId);

      const allMovies = (
        await api.get<MovieForTheater[]>("/movies")
      ).data;

      const filtered = allMovies.filter((m) => movieIds.includes(m.id));
      setMovies(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

   const confirmDelete = (movie: MovieForTheater) => {
      setMovieToDelete(movie);
      setOpenConfirm(true);
    };
  
    const handleDeleteMovie = async (movieId: string) => {
      try {
        if (!user?.theaterId) return;
       const theater = (await api.get<Theater>(`/theaters/${user.theaterId}`)).data;

       const updatedMovies = theater.movies.filter((m)=>m.movieId !== movieId);
        await api.patch(`/theaters/${user.theaterId}`, {
        movies: updatedMovies,
      });

      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      toast.success("Movie removed from theater");
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setOpenConfirm(false);
        setMovieToDelete(null);
      }
    };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-zinc-400">
        Loading movies...
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-zinc-400 gap-2">
        <Film size={32} />
        <p>No movies assigned to this theater</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-zinc-800 rounded-xl overflow-hidden">
        <thead className="bg-zinc-900 text-zinc-400 text-sm">
          <tr>
            <th className="p-3 text-left">Movie</th>
            <th className="p-3 text-left">Genre</th>
            <th className="p-3 text-left">Language</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr
              key={movie.id}
              className="border-t border-zinc-800 hover:bg-zinc-900/60 transition"
            >
              <td className="p-3 flex items-center gap-3">
                <div className="relative w-12 h-16 rounded-md overflow-hidden">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{movie.title}</span>
              </td>
              <td className="p-3">{movie.genre.join(", ")}</td>
              <td className="p-3">{movie.language}</td>
              <td className="p-3">{movie.duration}</td>
              <td className="p-3">
                <div className="flex justify-center gap-3">
                  
                  <button
                   onClick={() => confirmDelete(movie)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openConfirm && movieToDelete && (
        <ConfirmDelete
          title="Remove Movie?"
          description={`Remove ${movieToDelete.title} from this your theater?`}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => handleDeleteMovie(movieToDelete.id)}
        />
      )}
    </div>
  );
}
