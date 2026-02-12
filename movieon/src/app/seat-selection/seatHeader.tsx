"use client";
import { Movie } from "@/types";
import Image from "next/image";

interface SeatHeaderProps {
  movie: Movie;
}

export default function SeatHeader({
  movie,
}: SeatHeaderProps) {
  return (
  <div className="w-full">
  <div className="relative w-full h-[400px] md:h-[550px]">
    <Image
      src={movie.banner}
      alt={movie.title}
      fill
      className="object-cover brightness-[0.55]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
  </div>

  <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-32 relative z-10">
    <div className="flex flex-col md:flex-row gap-8">
      
      <div className="w-full md:w-72 flex justify-center flex-shrink-0">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={300}
          height={450}
          className="rounded-xl shadow-xl border border-white/20"
        />
      </div>

      <div className="text-center md:text-left z-20 flex flex-col justify-center ">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="text-gray-300 mt-1">
          {movie.language} • {movie.duration}
        </p>
        <p className="text-yellow-400 mt-2 text-lg font-semibold">
          ⭐ {movie.rating}
        </p>
      </div>
      
    </div>
  </div>
</div>
  );
}
