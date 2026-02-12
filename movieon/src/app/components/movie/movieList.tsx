"use client";

import { useEffect, useState } from "react";
import { getMovies } from "@/app/lib/movieApi";
import MovieCard from "./movieCard";
import { Movie } from "@/types";
import { Clapperboard, Hourglass, Loader2Icon } from "lucide-react";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const LANGUAGES = ["English", "Hindi", "Tamil", "Malayalam"];
  const GENRES = [
    "Action",
    "Biography",
    "Adventure",
    "Horror",
    "crime",
    "Fantasy",
    "Drama",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Sports",
    "War",
    "Comedy",];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data || []);
      } catch {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500 gap-2">
        Loading Movies...
        <Loader2Icon size={20} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10 text-xl">{error}</p>;
  }

const filteredMovies = movies.filter((movie) => {
  if (movie.status !== "NOW_SHOWING") return false;
  if (selectedLanguage && movie.language !== selectedLanguage) return false;
  if (selectedGenre && !movie.genre.includes(selectedGenre)) return false;
  return true;
});
const isFiltering = selectedLanguage || selectedGenre;
const nowShowing = movies.filter((movie) => movie.status === "NOW_SHOWING");
const upcoming = movies.filter((movie) => movie.status === "UPCOMING");

const moviesToShow = isFiltering ? filteredMovies : nowShowing;


  return (
    <div className="py-8 bg-gray-900 space-y-14">
      <div className="px-6 md:px-20">
        <div className="max-w-7xl mx-auto space-y-12">

          <section className="space-y-6">
  <h2 className="text-2xl md:text-3xl font-bold text-white border-b border-gray-700 pb-2">
    Browse Movies
  </h2>

  {/* Language Filters */}
  <div className="space-y-2">
    <p className="text-gray-400 text-sm">Languages</p>
    <div className="flex flex-wrap gap-3">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() =>
  setSelectedLanguage(
    selectedLanguage === lang ? null : lang
  )
}

          className={`px-4 py-2 rounded-full text-sm border transition
            ${
              selectedLanguage === lang
                ? "bg-yellow-400 text-black border-yellow-400"
                : "border-gray-600 text-gray-300 hover:border-yellow-400"
            }
          `}
        >
          {lang}
        </button>
      ))}
    </div>
  </div>

  {/* Genre Filters */}
  <div className="space-y-2">
    <p className="text-gray-400 text-sm">Genres</p>
    <div className="flex flex-wrap gap-3">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => setSelectedGenre(selectedGenre === genre ? null: genre)}
          className={`px-4 py-2 rounded-full text-sm border transition
            ${
              selectedGenre === genre
                ? "bg-yellow-400 text-black border-yellow-400"
                : "border-gray-600 text-gray-300 hover:border-yellow-400"
            }
          `}
        >
          {genre}
        </button>
      ))}
    </div>
  </div>

  {/* Clear Filter */}
  {(selectedLanguage || selectedGenre) && (
    <button
      onClick={() => {
        setSelectedLanguage(null);
        setSelectedGenre(null);
      }}
      className="text-sm text-yellow-400 hover:underline"
    >
      Clear Filters
    </button>
  )}
</section>


           {moviesToShow.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
              <Clapperboard 
              className="w-6 h-6 text-yellow-400"/>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                 Now Showing
              </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-700 pb-2">
                <Hourglass 
                className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Coming Soon
                </h2>
              </div>

              <div
                className="
    grid 
    grid-cols-2 
    sm:grid-cols-3 
    md:grid-cols-4 
    lg:grid-cols-5 
    gap-6
    place-items-stretch
  "
              >
                {upcoming.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {!nowShowing.length && !upcoming.length && (
            <p className="text-center text-gray-400 text-lg">
              No movies available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
