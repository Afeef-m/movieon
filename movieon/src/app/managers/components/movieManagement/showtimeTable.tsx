"use client";

import { CalendarDays } from "lucide-react";
import {
  MovieForTheater,
  TheaterMovieDay,
  TheaterMovieScreen,
} from "@/types/manager-index";
import Image from "next/image";

interface MovieRow extends MovieForTheater {
  days: TheaterMovieDay[];
  screens: TheaterMovieScreen[];
}

interface Props {
  movies: MovieRow[];
  
  onManage: (movie: MovieRow) => void;
}

export default function ShowtimeTable({ movies, onManage }: Props) {
  return (
  <div className="space-y-4">
  {movies.map((movie) => {
    const totalShowtimes =
      movie.days?.reduce((sum, day) => sum + day.showtimes.length, 0) || 0;

    return (
      <div
        key={movie.id}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                   bg-zinc-900 border border-zinc-800 rounded-2xl p-4
                   hover:border-zinc-700 transition"
      >
        <div className="flex gap-4">
          <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-white">
              {movie.title}
            </h3>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 text-xs rounded-full border border-red-400/30 text-red-400">
                {movie.days.length} Days
              </span>

              <span className="px-3 py-1 text-xs rounded-full border border-green-400/30 text-green-400">
                {movie.screens.length} Screens
              </span>

              <span className="px-3 py-1 text-xs rounded-full border border-blue-400/30 text-blue-400">
                {totalShowtimes} Showtimes
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onManage(movie)}
          className="flex items-center justify-center gap-2
                     px-5 py-2 rounded-xl
                     bg-yellow-500/10 text-yellow-400
                     hover:bg-yellow-500/20 transition"
        >
          <CalendarDays size={16} />
          Manage
        </button>
      </div>
    );
  })}
</div>

  );
}
