"use client";

import api from "@/app/lib/axios";
import { Booking, DashboardStats, Theater } from "@/types/manager-index";
import { BookMarked, Film, IndianRupee, Loader2Icon, Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
// export const dynamic = 'force-dynamic';

export default function ManagerDashboard() {
  const { user, hydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalShowtimes: 0,
    totalBookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!hydrated || !user) return;
    fetchDashboard();
  }, [hydrated, user]);

  const fetchDashboard = async () => {
    try {
      if (user?.role !== "manager") {
        toast.error("Unauthorized");
        return;
      }

      const theaterId = user.theaterId;

      if (!theaterId) {
        toast.error("No theater assigned to this manager");
        return;
      }

      const theater = (await api.get<Theater>(`/theaters/${theaterId}`)).data;

      const bookings =
        (await api.get<Booking[]>(`/bookings?theaterId=${theaterId}`))
          .data || [];

      const totalShowtimes = theater.movies.reduce(
        (movieSum, movie) =>
          movieSum +
          movie.days.reduce((daySum, day) => daySum + day.showtimes.length, 0),
        0
      );
      const revenue = bookings.reduce(
  (sum, b) => sum + (b.totalPrice || 0), 0);
      setStats({
        totalMovies: theater.movies.length,
        totalShowtimes,
        totalBookings: bookings.length,
        revenue,
      });
    } catch (err) {
      console.error(err);
      toast.error("Dashboard loading failed");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated || loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] gap-2 text-gray-400">
        Loading Dashboard...
        <Loader2Icon className="animate-spin" size={20} />
      </div>
    );
  }

  const items = [
    { label: "Movies", icon: <Film />, value: stats.totalMovies, color: "bg-green-500/10 text-green-400"},
    { label: "Showtimes", icon: <Ticket />, value: stats.totalShowtimes, color: "bg-purple-500/10 text-purple-400",},
    { label: "Bookings", icon: <BookMarked />, value: stats.totalBookings, color: "bg-yellow-500/10 text-yellow-400",},
    { label: "Revenue", icon: <IndianRupee />, value:`₹${stats.revenue}`,  color: "bg-emerald-500/10 text-emerald-400", },
  ];

  return (
   <div className="p-6">
  <h1 className="text-2xl font-semibold mb-6">Manager Dashboard</h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {items.map((item) => (
      <div
        key={item.label}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 
                   hover:border-zinc-700 transition-all
                   flex flex-col items-center text-center" >
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.color} mb-3`}
        >
          {item.icon}
        </div>
        <p className="text-sm text-gray-400 mb-1">{item.label}</p>
        <p className="text-2xl font-bold">{item.value}</p>
      </div>
    ))}
  </div>
</div>

  );
}
