"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { X, Save } from "lucide-react";
import type { Movie, MovieCast } from "@/types/index";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";

type Props = {
  movie: Movie | null;
  onClose: () => void;
  onSuccess: (movie: Movie, isEdit: boolean) => void;
};

type FormState = {
  id?: string;
  title: string;
  rating?: number;
  poster: string;
  banner: string;
  description: string;
  director: string;
  genre: string[];
  language: string;
  duration: string;
  releaseDate: string;
  releaseYear?: number;
  ticketPrice?: number;
  trailer?: string;
  status?: "NOW_SHOWING" | "UPCOMING" | "EXPIRED";
};

export default function MovieForm({ movie, onClose, onSuccess }: Props) {
  const normalizeGenre = (g: unknown) => {
    if (!g) return [];
    if (Array.isArray(g)) return g;
    if (typeof g === "string")
      return g
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    return [];
  };

  const [form, setForm] = useState<FormState>({
    id: movie?.id,
    title: movie?.title ?? "",
    rating: movie?.rating,
    poster: movie?.poster ?? "",
    banner: movie?.banner ?? "",
    description: movie?.description ?? "",
    director: movie?.director ?? "",
    genre: normalizeGenre(movie?.genre),
    language: movie?.language ?? "",
    duration: movie?.duration ?? "",
    releaseDate: movie?.releaseDate ?? "",
    releaseYear: movie?.releaseYear,
    ticketPrice: movie?.ticketPrice,
    trailer: movie?.trailer ?? "",
    status: movie?.status ?? "NOW_SHOWING",
  });

  useEffect(() => {
    setForm({
      id: movie?.id,
      title: movie?.title ?? "",
      rating: movie?.rating,
      poster: movie?.poster ?? "",
      banner: movie?.banner ?? "",
      description: movie?.description ?? "",
      director: movie?.director ?? "",
      genre: normalizeGenre(movie?.genre),
      language: movie?.language ?? "",
      duration: movie?.duration ?? "",
      releaseDate: movie?.releaseDate ?? "",
      releaseYear: movie?.releaseYear,
      ticketPrice: movie?.ticketPrice,
      trailer: movie?.trailer ?? "",
      status: movie?.status ?? "NOW_SHOWING",
    });
  }, [movie]);

  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(movie);
  const [openCast, setOpenCast] = useState(false);
  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toDDMMYYYY = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const toISODate = (ddmmyyyy: string) => {
    if (!ddmmyyyy) return "";
    const [day, month, year] = ddmmyyyy.split("-");
    return `${year}-${month}-${day}`;
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.language.trim()) return "Language is required";
    if (!form.releaseYear) return "Release year is required";
    if (form.ticketPrice === undefined || form.ticketPrice === null)
      return "Ticket price is required";
    if (!form.status) return "Status is required";
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSubmitting(true);

      const payload: Partial<Movie> = {
        title: form.title,
        rating: form.rating,
        poster: form.poster,
        banner: form.banner,
        description: form.description,
        director: form.director,
        genre: form.genre,
        language: form.language,
        duration: form.duration,
        releaseDate: form.releaseDate,
        releaseYear: form.releaseYear,
        ticketPrice: form.ticketPrice,
        trailer: form.trailer,
        status: form.status,
      };

      let finalMovie;

      if (isEdit && form.id) {
        const res = await api.patch(`/movies/${form.id}`, payload);
        finalMovie = res.data.movie ?? res.data;
      } else {
        const res = await api.post("/movies", payload);
        finalMovie = res.data.movie ?? res.data;

        if (!finalMovie.id) finalMovie.id = String(Date.now());
      }
      setOpenCast(true);

      toast.success(isEdit ? "Movie updated!" : "Movie created!");
      onSuccess(finalMovie, isEdit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save movie.");
    } finally {
      setSubmitting(false);
    }
  };

  const genreOptions = [
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
    "Comedy",
  ].map((g) => ({ label: g, value: g }));

  const GENRE_CANONICAL_MAP = genreOptions.reduce((acc, g) => {
    acc[g.value.toLowerCase()] = g.value;
    return acc;
  }, {} as Record<string, string>);

  const languages = ["English", "Hindi", "Malayalam"];
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredLanguages = languages.filter((lang) =>
    lang.toLowerCase().includes(form.language.toLowerCase())
  );

  return (
    <>
      {!openCast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !submitting && onClose()}
          />

          <form
            onSubmit={handleSubmit}
            className="
    relative z-10 
    max-w-3xl w-full 
    max-h-[90vh] 
    overflow-y-auto
    bg-zinc-900 
    border border-zinc-800 
    rounded-2xl 
    p-6 
    shadow-2xl 
    scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900
  "
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-zinc-900 z-20 pb-4 border-b border-zinc-800">
              <h3 className="text-xl font-semibold">
                {isEdit ? "Edit Movie" : "Add Movie"}
              </h3>

              <button
                type="button"
                onClick={() => !submitting && onClose()}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.rating ?? ""}
                  onChange={(e) =>
                    updateField(
                      "rating",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm">Poster URL</label>
                <input
                  value={form.poster}
                  onChange={(e) => updateField("poster", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm">Banner URL</label>
                <input
                  value={form.banner}
                  onChange={(e) => updateField("banner", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm">Genre</label>
                <CreatableSelect
                  isMulti
                  options={genreOptions}
                  className="mt-1 text-black"
                  value={form.genre.map((g) => ({ label: g, value: g }))}
                  onChange={(selected) => {
                    const values = (selected || []).map((item) => {
                      const raw = item.value.trim();
                      const key = raw.toLowerCase();

                      if (GENRE_CANONICAL_MAP[key]) {
                        return GENRE_CANONICAL_MAP[key];
                      }
                      return raw
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ");
                    });

                    updateField("genre", values);
                  }}
                />
              </div>

              <div>
                <div className="relative">
                  <label className="text-sm">Language</label>

                  <input
                    type="text"
                    value={form.language}
                    onChange={(e) => {
                      updateField("language", e.target.value);
                      setShowSuggestions(true);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 150)
                    }
                    placeholder="Search language..."
                    className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 
      px-3 py-2 text-sm text-zinc-100 focus:outline-none 
      focus:ring-2 focus:ring-emerald-500"
                  />

                  {showSuggestions && form.language && (
                    <ul
                      className="absolute z-20 mt-1 w-full bg-zinc-800 border border-zinc-700 
      rounded-lg max-h-40 overflow-auto shadow-lg"
                    >
                      {filteredLanguages.length ? (
                        filteredLanguages.map((lang) => (
                          <li
                            key={lang}
                            onMouseDown={() => {
                              updateField("language", lang);
                              setShowSuggestions(false);
                            }}
                            className="px-3 py-2 cursor-pointer text-sm text-zinc-100 hover:bg-zinc-700"
                          >
                            {lang}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-zinc-400">
                          No results
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm">Director Name</label>
                <input
                  value={form.director}
                  onChange={(e) => updateField("director", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm">Duration</label>
                <input
                  value={form.duration}
                  placeholder="02h 30m"
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm">Release Date </label>
                <input
                  type="date"
                  value={form.releaseDate ? toISODate(form.releaseDate) : ""}
                  onChange={(e) =>
                    updateField("releaseDate", toDDMMYYYY(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
             text-sm text-zinc-100 placeholder-zinc-500
             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm">Release Year *</label>
                <input
                  type="number"
                  value={form.releaseYear ?? ""}
                  onChange={(e) =>
                    updateField(
                      "releaseYear",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Ticket Price *</label>
                <input
                  type="number"
                  value={form.ticketPrice ?? ""}
                  onChange={(e) =>
                    updateField(
                      "ticketPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm">Trailer URL</label>
                <input
                  value={form.trailer}
                  onChange={(e) => updateField("trailer", e.target.value)}
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as "NOW_SHOWING" | "UPCOMING" | "EXPIRED"
                    )
                  }
                  className="mt-1 w-full rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-2 
           text-sm text-zinc-100 placeholder-zinc-500
           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="NOW_SHOWING">Now Showing</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => !submitting && onClose()}
                className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500"
              >
                <Save size={16} />
                {submitting ? "Saving..." : isEdit ? "Save" : "Create Movie"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
