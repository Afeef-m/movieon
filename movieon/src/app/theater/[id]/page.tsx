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
  Promise.all([api.get("/shows"), api.get("/movies")])
    .then(([showsRes, moviesRes]) => {

      const shows = showsRes.data;

      const filteredShows = shows.filter((s: any) => {
  const movieRef =
    typeof s.movieId === "object" ? s.movieId._id : s.movieId;

  return movieRef === movieId;
});

      const theaterMap = new Map();

      filteredShows.forEach((show: any) => {
        const theater = show.theaterId;

        if (!theaterMap.has(theater._id)) {
          theaterMap.set(theater._id, {
            ...theater,
            shows: []
          });
        }

        theaterMap.get(theater._id).shows.push(show);
      });

      const finalTheaters = Array.from(theaterMap.values());

      setTheaters(finalTheaters);

      const foundMovie = moviesRes.data.find(
        (m: Movie) => m._id === movieId
      );

      setMovie(foundMovie || null);

     if (finalTheaters.length > 0) {
  const firstShow = finalTheaters[0]?.shows?.[0];

  if (firstShow) {
    // normalize date
    const dateOnly = firstShow.showDate.split("T")[0];
    setSelectedDate(dateOnly);
    setSelectedTheaterId(finalTheaters[0]._id);
  }
}

    })
    .finally(() => setLoading(false));
}, [movieId]);

const handleTheaterSelect = (id: string) => {
  setSelectedTheaterId(id);

  const theater = theaters.find((t) => t._id === id);
  const firstShow = theater?.shows?.[0];

  if (firstShow) {
    const dateOnly = firstShow.showDate.split("T")[0];
    setSelectedDate(dateOnly);
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

const convertedDays = theaters.flatMap((theater: any) =>
  theater.shows.map((show: any) => show.showDate)
);


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
