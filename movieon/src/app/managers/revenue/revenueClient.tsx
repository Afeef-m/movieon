"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Loader2 } from "lucide-react";
import RevenueTable from "../components/revenueTable";
import { Booking, RevenueRow } from "@/types/manager-index";
import { Movie } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function ManagerRevenuePage() {
  const { user } = useAuthStore();
  const theaterId = user?.theaterId;

  const [rows, setRows] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/bookings"), api.get("/movies")])
      .then(([bookingRes, movieRes]) => {
        const bookings: Booking[] = bookingRes.data || [];
        const movies: Movie[] = movieRes.data || [];

        const validBookings = bookings.filter(
          (b) => b.status !== "CANCELLED" && b.theaterId === theaterId
        );

        const map = new Map<string, RevenueRow>();

        for (const b of validBookings) {
          const movie = movies.find((m) => m.id === b.movieId);
          const key = `${b.movieId}_${b.date}`;

          if (!map.has(key)) {
            map.set(key, {
              movieTitle: movie?.title ?? "Unknown Movie",
              date: b.date,
              totalBookings: 0,
              seatsSold: 0,
              revenue: 0,
            });
          }

          const row = map.get(key)!;
          row.totalBookings += 1;
          row.seatsSold += b.seats.length;
          row.revenue += Number(b.totalPrice ?? 0);
        }

        setRows(Array.from(map.values()));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
        <Loader2 className="animate-spin ml-2" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue Report</h1>
      <RevenueTable rows={rows} />
    </div>
  );
}
