"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";
import MovieForm from "./movieForm";
import ConfirmDelete from "./confirmDelete";
import AddCast from "./addCast";
import EditCast from "./editCast";
import type { Movie, MovieCast } from "@/types/index";
import Image from "next/image";

export default function MovieTable() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [activeTab, setActiveTab] = useState<"movies" | "cast">("movies");

  const [castSearch, setCastSearch] = useState("");
  const [movieSearch, setMovieSearch] = useState("");

  const [openAddCast, setOpenAddCast] = useState(false);
  const [castMovie, setCastMovie] = useState<Movie | null>(null);

  const [openEditCast, setOpenEditCast] = useState(false);
  const [editCastData, setEditCastData] = useState<{
    movie: Movie;
    cast: MovieCast;
  } | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [castDelete, setCastDelete] = useState<MovieCast | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "NOW_SHOWING" | "UPCOMING" | "EXPIRED"
  >("ALL");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/movies");
      const data = res.data.movies ?? res.data ?? [];
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchMovies(), 400);
  }, []);

  const openAddModal = () => {
    setEditingMovie(null);
    setOpenForm(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setOpenForm(true);
  };

  const confirmDelete = (movie: Movie) => {
    setMovieToDelete(movie);
    setOpenConfirm(true);
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setOpenConfirm(false);
      setMovieToDelete(null);
    }
  };

  const handleUpsertSuccess = (movie: Movie, isEdit: boolean) => {
    if (isEdit) {
      setMovies((prev) => prev.map((m) => (m.id === movie.id ? movie : m)));
    } else {
      setMovies((prev) => [movie, ...prev]);
    }
    setOpenForm(false);
  };

  const filteredMoviesForCast = movies.filter((movie) => {
    const term = castSearch.toLowerCase();

    return (
      movie.title.toLowerCase().includes(term) ||
      movie.cast?.some(
        (c) =>
          c.actor.toLowerCase().includes(term) ||
          c.character.toLowerCase().includes(term)
      )
    );
  });
  const filteredMovies = movies.filter((movie) => {
    const term = movieSearch.toLowerCase();

    const matchesSearch =
      movie.title.toLowerCase().includes(term) ||
      movie.cast?.some(
        (c) =>
          c.actor.toLowerCase().includes(term) ||
          c.character.toLowerCase().includes(term)
      );

    const matchesStatus =
      statusFilter === "ALL" || movie.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteCast = async () => {
    if (!selectedMovie || !castDelete) return;

    const updatedCast = selectedMovie.cast.filter(
      (c) =>
        c.actor !== castDelete.actor || c.character !== castDelete.character
    );

    try {
      await api.patch(`/movies/${selectedMovie.id}`, { cast: updatedCast });
      fetchMovies();
    } catch (err) {
      console.error("Cast delete failed:", err);
    } finally {
      setCastDelete(null);
      setSelectedMovie(null);
      setOpenConfirm(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        Loading Movies...
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("movies")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "movies"
              ? "bg-yellow-600"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          Movies
        </button>

        <button
          onClick={() => setActiveTab("cast")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "cast" ? "bg-yellow-600" : "bg-zinc-800 text-gray-300"
          }`}
        >
          Cast
        </button>
      </div>

      {activeTab === "movies" && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <div className="flex gap-2 flex-wrap">
              {(["ALL", "NOW_SHOWING", "UPCOMING", "EXPIRED"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1 rounded-md text-sm font-medium transition ${
                      statusFilter === status
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {status === "ALL"
                      ? "All"
                      : status === "NOW_SHOWING"
                      ? "Now Showing"
                      : status === "UPCOMING"
                      ? "Upcoming"
                      : "Expired"}
                  </button>
                )
              )}
            </div>
            <div className="relative mt-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 "
                size={18}
              />
              <input
                placeholder="Search movie..."
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 w-96 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              onClick={openAddModal}
              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Add Movie
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full">
              <thead className="bg-zinc-800 text-center">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Poster</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Release</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovies.map((m) => (
                  <tr
                    key={m.id}
                    className={`text-center border-b border-zinc-800 ${
                      m.status === "UPCOMING" ? "bg-zinc-800/60" : ""
                    }`}
                  >
                    <td className="p-3">{m.id}</td>
                    <td className="p-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={m.poster}
                          alt={m.poster}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3">{m.title}</td>
                    <td className="p-3">{m.genre.join(", ")}</td>
                    <td className="p-3">{m.language}</td>
                    <td className="p-3">{m.releaseYear}</td>
                    <td className="p-3">
                      {m.status === "UPCOMING" ? (
                        <span className="text-zinc-400 italic">N/A</span>
                      ) : (
                        <>₹{m.ticketPrice}</>
                      )}
                    </td>

                    <td
                      className={`p-3 font-semibold ${
                        m.status === "NOW_SHOWING"
                          ? "text-green-400"
                          : m.status === "UPCOMING"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {m.status === "NOW_SHOWING"
                        ? "Now Showing"
                        : m.status === "UPCOMING"
                        ? "Upcoming"
                        : "Expired"}
                    </td>

                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(m)}
                          className="bg-blue-500 px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <Edit2 size={16} /> Edit
                        </button>

                        <button
                          onClick={() => confirmDelete(m)}
                          className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filteredMovies.length && (
              <p className="text-center text-zinc-400 py-3">No movies found</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "cast" && (
        <div className="space-y-6">
          <div className="relative mt-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              placeholder="Search cast or movie..."
              value={castSearch}
              onChange={(e) => setCastSearch(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 w-96 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {filteredMoviesForCast.map((movie) => (
            <div
              key={movie.id}
              className="border border-zinc-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="text-xl font-semibold">
                    {movie.title} {movie.releaseDate}{"-"}({movie.releaseYear})
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setCastMovie(movie);
                    setOpenAddCast(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center gap-2"
                >
                  <Plus size={16} /> Add Cast
                </button>
              </div>

              {movie.cast?.length === 0 ? (
                <p className="text-zinc-400">No cast added</p>
              ) : (
                <div className="space-y-2">
                  {movie.cast?.map((c, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-800 p-3 rounded-lg flex justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={c.picture?.trim() ? c.picture :  "/user-profile.svg"}
                            alt={c.actor || "Actor"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-semibold">{c.actor}</p>
                          <p className="text-zinc-400 text-sm">{c.character}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditCastData({ movie, cast: c });
                            setOpenEditCast(true);
                          }}
                          className="bg-blue-500 px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <Edit2 size={16} /> Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedMovie(movie);
                            setCastDelete(c);
                            setOpenConfirm(true);
                          }}
                          className="bg-red-600 rounded hover:bg-red-700 px-3 py-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {openForm && (
        <MovieForm
          movie={editingMovie}
          onClose={() => setOpenForm(false)}
          onSuccess={handleUpsertSuccess}
        />
      )}

      {openConfirm && movieToDelete && (
        <ConfirmDelete
          title="Delete Movie?"
          description={`Are you sure you want to delete ${movieToDelete.title}?`}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => handleDeleteMovie(movieToDelete.id)}
        />
      )}

      {openConfirm && castDelete && (
        <ConfirmDelete
          title="Delete Cast?"
          description={`Delete "${castDelete.actor}" (${castDelete.character}) ?`}
          onClose={() => {
            setCastDelete(null);
            setOpenConfirm(false);
          }}
          onConfirm={handleDeleteCast}
        />
      )}

      {openAddCast && castMovie && (
        <AddCast
          movie={castMovie}
          onClose={() => setOpenAddCast(false)}
          onSuccess={() => {
            setOpenAddCast(false);
            fetchMovies();
          }}
        />
      )}

      {openEditCast && editCastData && (
        <EditCast
          movie={editCastData.movie}
          cast={editCastData.cast}
          onClose={() => setOpenEditCast(false)}
          onSuccess={() => {
            setOpenEditCast(false);
            fetchMovies();
          }}
        />
      )}
    </div>
  );
}
