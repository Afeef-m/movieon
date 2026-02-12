"use client";

import { useEffect, useState } from "react";
import ShowtimeTable from "../components/movieManagement/showtimeTable";
import ManageShowtimeModal from "../components/movieManagement/ManageShowtime";
import { MovieForTheater, Theater, TheaterMovie } from "@/types/manager-index";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
// export const dynamic = 'force-dynamic';

type MovieWithTheaterData = MovieForTheater & {
  days: TheaterMovie["days"];
  screens: TheaterMovie["screens"];
};

export default function ShowtimeManageClient() {
  const { user, hydrated } = useAuthStore();

  const [movies, setMovies] = useState<MovieWithTheaterData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithTheaterData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchMovies = async () => {
    try {
      if (user?.role !== "manager") return;
      const theaterId = user.theaterId;
      if (!theaterId) {
        toast.error("No theater assigned");
        return;
      }
      const theater = (await api.get<Theater>(`/theaters/${theaterId}`)).data;

      if (!theater.movies || theater.movies.length === 0) {
        setMovies([]);
        setLoading(false); 
        return;
      }

      const movieIds = theater.movies.map((m) => m.movieId);
      const allMovies = (await api.get<MovieForTheater[]>("/movies")).data;

      const merged: MovieWithTheaterData[] = allMovies
        .filter((m) => movieIds.includes(m.id))
        .map((movie) => {
          const theaterMovie = theater.movies.find(
            (tm) => tm.movieId === movie.id
          )!;

          return {
            ...movie,
            days: theaterMovie.days || [],
            screens: theaterMovie.screens || [],
          };
        });

      setMovies(merged);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if (!hydrated || !user) return;
    fetchMovies();
  }, [hydrated, user]);

  if (loading) {
    return (
    <div className="flex justify-center items-center h-[50vh] text-gray-500 gap-2">
        Loading Movies...
        <Loader2Icon size={20} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Showtime Management</h1>

      <ShowtimeTable
        movies={movies}
        onManage={(movie) => setSelectedMovie(movie)}
      />

      {selectedMovie && (
        <ManageShowtimeModal
          movie={selectedMovie}
          theaterId={user!.theaterId || ""}
          onClose={() => setSelectedMovie(null)}
          onSaved={fetchMovies}
        />
      )}
    </div>
  );
}
