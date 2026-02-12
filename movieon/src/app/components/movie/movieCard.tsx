"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const isUpcoming = movie.status === "UPCOMING";

  return (
    <Link
      href={isUpcoming ? `/movie/upcoming/${movie.id}` : `/movie/${movie.id}`}
      className={`group relative rounded-xl overflow-hidden 
        border border-white/20 shadow-lg transition-transform duration-300 block
        ${isUpcoming ? "hover:shadow-xl" : "hover:shadow-2xl hover:scale-105"}
      `}
    >
      {/* Poster */}
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
          className={`object-cover transition-all duration-300
            ${isUpcoming ? "" : "group-hover:scale-105 group-hover:brightness-110"}
          `}
        />

        {/* UPCOMING BADGE */}
        {isUpcoming && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-md">
            Coming Soon
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-2 bg-gradient-to-b from-black/10 to-black/30">
        <h3 className="text-white text-lg md:text-xl font-bold truncate">
          {movie.title}
        </h3>

        {isUpcoming ? (
          <p className="text-yellow-400 text-sm md:text-base font-medium">
            Releasing:- {movie.releaseDate}
          </p>
        ) : (
          <p className="md:text-base absolute top-3 right-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
            ⭐ {movie.rating} 
          </p>
        )}

        <p className="text-gray-400 text-sm md:text-base">
          {movie.genre.slice(0,2).join(", ")}
        </p>
        <p className="text-gray-400 text-sm md:text-base">
          {movie.language}
        </p>
      </div>
    </Link>
  );
}
