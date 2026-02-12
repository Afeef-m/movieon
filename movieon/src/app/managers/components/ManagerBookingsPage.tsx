"use client";

import BookingTable from "../components/bookingTable";
import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Loader2 } from "lucide-react";
import { Booking } from "@/types/manager-index";
import { Movie, User } from "@/types";


export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/bookings"), api.get("/movies"), api.get("/users")])
      .then(([bookingRes, movieRes, userRes]) => {
        const rawBookings: Booking[] = bookingRes.data || [];
        const movies: Movie[] = movieRes.data || [];
        const users: User[] = userRes.data || [];

        const bookingAll = rawBookings.map((b: Booking) => {
          const foundMovie = movies.find((m) => m.id === b.movieId);
          const foundUser = users.find((u) => u.id === b.userId);

          return {
            ...b,
            movieTitle: foundMovie?.title ?? "Unknown Movie",
            userName: foundUser?.firstName ?? "Unknown User",
            status: b.status ?? "BOOKED",
          };
        });
        setBookings(bookingAll);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading ...
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
      <BookingTable bookings={bookings} />
    </div>
  );
}
