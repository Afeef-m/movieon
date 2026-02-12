"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/axios";
import type { Movie } from "@/types";
import Image from "next/image";
import MovieCast from "@/app/components/movie/movieCast";
import ShowTrailer from "@/app/components/movie/showTrailer";


export default function UpcomingMoviePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const data = res.data.movie ?? res.data;

        if (!data || data.status !== "UPCOMING") {
          router.replace(`/movie/${id}`);
          return;
        }
        setMovie(data);
      } catch (err) {
        console.error("Failed to load upcoming movie", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading movie...
      </div>
    );
  }

  if (!movie) return null;

  return (
     <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
          <div className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
                 <Image
              src={movie.banner}
              alt={movie.title}
              fill
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>
    
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <div className="relative group">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={300}
                  height={450}
                    className="w-64 md:w-72 lg:w-80 rounded-2xl shadow-2xl border-2 border-white/10 group-hover:border-red-500/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
    
              <div className="flex-1 space-y-6 pb-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                    {movie.title}
                  </h1>
    
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold text-white">{movie.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{movie.duration}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{movie.language}</span>
                  </div>
    
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/10 text-red-300 rounded-full border border-red-500/30 text-sm font-medium hover:bg-red-600/30 transition-all cursor-default"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                {/*  <button
                 onClick={() => router.push(``)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Notify me</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button> */}
              </div>
            </div>
    
            <div className="mt-16 space-y-8">
              <div className="border-t border-white/10 pt-10">
                <h2 className="text-3xl font-bold mb-6 text-white">About the Movie</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {movie.description}
                </p>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-medium min-w-[100px]">Director:</span>
                      <span className="text-white font-semibold">{movie.director}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-medium min-w-[100px]">Rating:</span>
                      <span className="text-white font-semibold">⭐ {movie.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-medium min-w-[100px]">Genre:</span>
                      <span className="text-white font-semibold">{movie.genre.join(", ")}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-medium min-w-[100px]">Language:</span>
                      <span className="text-white font-semibold">{movie.language}</span>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="border-t border-white/10 pt-10">
                <MovieCast cast={movie.cast} />
              </div>
              <ShowTrailer trailer={movie.trailer}/>
             
            </div>
          </div>
          {/* <div className="hidden lg:block fixed bottom-8 right-8 z-50">
            <button
             onClick={() => router.push(``)}
              className="group relative px-8 py-4 bg-black/90 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl shadow-2xl hover:shadow-red-500/30 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Notify me</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div> */}
        </div>
  );
}
