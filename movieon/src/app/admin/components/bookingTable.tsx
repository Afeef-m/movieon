"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Booking, Movie, Theater, User } from "@/types";
import { BookMinus, Loader2, Search, X } from "lucide-react";

interface Ticket {
  bookingId: string;
  movieTitle: string;
  moviePoster: string;
  theaterId: string;
}

interface BookingWithRefs extends Booking {
  movieTitle?: string;
  moviePoster?: string;
  theaterName?: string;
  userEmail?: string;
}

export default function BookingTable() {
  const [bookings, setBookings] = useState<BookingWithRefs[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [movieFilter, setMovieFilter] = useState("");
  const [theaterFilter, setTheaterFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchAll = async () => {
    try {
      const [bookingsRes, moviesRes, usersRes, theatersRes, ticketsRes] =
        await Promise.all([
          api.get("/bookings"),
          api.get("/movies"),
          api.get("/users"),
          api.get("/theaters"),
          api.get("/tickets"),
        ]);

      const bookingList = bookingsRes.data.bookings ?? bookingsRes.data ?? [];

      const movieList = moviesRes.data.movies ?? moviesRes.data ?? [];
      const theaterList = theatersRes.data.theaters ?? theatersRes.data ?? [];
      const userList = usersRes.data.users ?? usersRes.data ?? [];
      const ticketList = ticketsRes.data.tickets ?? ticketsRes.data ?? [];

      const mapped = bookingList.map((b: Booking) => {
        const mv = movieList.find((m: Movie) => m.id === b.movieId);

        const th = theaterList.find(
          (t: Theater) => String(t.id) === String(b.theaterId)
        );

        const usr = userList.find(
          (u: User) => u.id === b.userId || u.email === b.userId
        );

        const tkt = ticketList.find((t: Ticket) => t.bookingId === b.bookingId);
        return {
          ...b,
          movieTitle: tkt?.movieTitle ?? mv?.title ?? "Unknown Movie",
          moviePoster: tkt?.moviePoster ?? mv?.poster ?? "",
          theaterName: th?.name ?? "Unknown Theater",
          userEmail: usr?.email ?? "Unknown",
        };
      });

      setBookings(mapped);
      setMovies(movieList);
      setTheaters(theaterList);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId?.toLowerCase().includes(search.toLowerCase());

    const matchMovie = movieFilter ? b.movieId === movieFilter : true;
    const matchTheater = theaterFilter ? b.theaterId === theaterFilter : true;
    const matchDate = dateFilter ? b.date === dateFilter : true;

    return matchSearch && matchMovie && matchTheater && matchDate;
  });

  if (loading)
    return (
      <div className="flex justify-center py-10">
        Loading...
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center bg-zinc-800 px-3 py-2 rounded-lg w-full sm:w-64">
          <Search size={18} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Search Email or Booking ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm ml-2 w-full"
          />
        </div>

        <select
          className="bg-zinc-800 px-3 py-2 rounded-lg text-sm"
          value={movieFilter}
          onChange={(e) => setMovieFilter(e.target.value)}
        >
          <option value="">All Movies</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-800 px-3 py-2 rounded-lg text-sm"
          value={theaterFilter}
          onChange={(e) => setTheaterFilter(e.target.value)}
        >
          <option value="">All Theaters</option>
          {theaters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-zinc-800 px-3 py-2 rounded-lg">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {(search || movieFilter || theaterFilter || dateFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setMovieFilter("");
              setTheaterFilter("");
              setDateFilter("");
            }}
            className="flex items-center bg-red-600 px-3 py-2 text-sm rounded-lg"
          >
            <X size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-800">
            <th className="py-3">Booking ID</th>
            <th>User</th>
            <th>Movie</th>
            <th>Theater</th>
            <th>Screen</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((b) => (
            <tr
              key={`${b.bookingId}-${b.ticketId}`}
              className="border-b border-zinc-800 hover:bg-zinc-800/50"
            >
              <td className="py-3">{b.bookingId}</td>
              <td>{b.userEmail}</td>
              <td>{b.movieTitle}</td>
              <td>{b.theaterName}</td>
              <td>{b.screen}</td>
              <td>{b.seats.join(", ")}</td>
              <td>₹{b.totalPrice}</td>
              <td>{b.date}</td>
              <td>{b.time}</td>
              <td>
                 <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  b.status === "BOOKED"
                    ? "bg-green-100 text-green-700"
                    : b.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {b.status}
              </span>
             </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredBookings.length === 0 && (
        <div className="py-6 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
            <BookMinus size={20} />
            <span>No Booking Found</span>
          </div>
        </div>
      )}
    </div>
  );
}
