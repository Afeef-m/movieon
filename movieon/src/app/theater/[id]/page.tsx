"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Theater, Movie, TheaterMovie } from "@/types";
import api from "@/app/lib/axios";
import TheaterList from "@/app/components/theaterList";
import MovieDays from "@/app/components/movie/movieDays";
import { Clapperboard, Loader2 } from "lucide-react";

export default function TheaterPage() {
  const { id } = useParams();
  const movieId = String(id);
  const router = useRouter();

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null
  );

  useEffect(() => {
    Promise.all([api.get("/theaters"), api.get("/movies")])
      .then(([theatersRes, moviesRes]) => {
        const matchedTheaters = theatersRes.data.filter((t: Theater) =>
          t.movies.some((m) => m.movieId === movieId)
        );

        setTheaters(matchedTheaters);

        const foundMovie = moviesRes.data.find((m: Movie) => m.id === movieId);
        setMovie(foundMovie || null);

        const firstTheater = matchedTheaters[0];
        const movieEntry = firstTheater?.movies.find(
          (m: TheaterMovie) => m.movieId === movieId
        );

        const defaultDate = movieEntry?.days?.[0]?.date;

        if (defaultDate) {
          setSelectedDate(defaultDate);
          setSelectedTheaterId(firstTheater.id);
        }
        if (matchedTheaters.length === 0) {
          setLoading(false);
          return;
        }
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  const handleTheaterSelect = (id: string) => {
    setSelectedTheaterId(id);

    const theater = theaters.find((t) => t.id === id);
    const movieEntry = theater?.movies.find((m) => m.movieId === movieId);

    const firstDate = movieEntry?.days?.[0]?.date;
    if (firstDate) {
      setSelectedDate(firstDate);
    }
  };

  const handleShowtimeSelect = (
    time: string,
    screenId: number,
    theaterId: string,
  ) => {
    router.push(
      `/seat-selection?movieId=${movieId}&theaterId=${theaterId}&date=${selectedDate}&screen=${screenId}&time=${time}`
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center py-10">
        Loading Theatres...
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  if (!movie)
    return (
      <div className="min-h-screen flex justify-center items-center py-10">
        Movie Not Found...
        <Clapperboard size={32} />
      </div>
    );

 const convertedDays = theaters.flatMap((theater) => {
  const movieEntry = theater.movies.find((m) => m.movieId === movieId);
  return movieEntry?.days ?? [];
});


  return (
    <div className="max-w-6xl mx-auto p-6 mt-12">
      <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
      <p className="text-gray-300 mb-4">
        {movie.duration} • {movie.genre.join(", ")}
      </p>

      <MovieDays
        days={convertedDays}
        selectedDate={selectedDate}
        onChange={setSelectedDate}
      />

      <TheaterList
        theaters={theaters}
        movieId={movieId}
        selectedDate={selectedDate}
        onSelectShowtime={handleShowtimeSelect}
        onSelectTheater={handleTheaterSelect}
      />
    </div>
  );
}
