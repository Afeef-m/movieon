"use client";

import { useEffect, useState } from "react";
import { Users, Film,BookOpen,IndianRupee, Loader2Icon,Calendar, TrendingUp, Building2, BarChart3,} from "lucide-react";
import { AdminDashboardStats, MovieRevenue } from "@/types/admin-index";
import { Booking, Movie, Theater, TheaterStats, Ticket, User } from "@/types";
import api from "@/app/lib/axios";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalManagers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    todayBookings: 0,
  });

  const [theaterStats, setTheaterStats] = useState<TheaterStats[]>([]);
  const [movieRevenue, setMovieRevenue] = useState<MovieRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [selectedTheater, setSelectedTheater] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [allData, setAllData] = useState<{
    users: User[];
    movies: Movie[];
    bookings: Booking[];
    tickets: Ticket[];
    theaters: Theater[];
  }>({
    users: [],
    movies: [],
    bookings: [],
    tickets: [],
    theaters: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, moviesRes, bookingsRes, ticketsRes, theatersRes] =
        await Promise.all([
          api.get("/users"),
          api.get("/movies"),
          api.get("/bookings"),
          api.get("/tickets"),
          api.get("/theaters"),
        ]);

      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const movies = Array.isArray(moviesRes.data) ? moviesRes.data : [];
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];
      const theaters = Array.isArray(theatersRes.data) ? theatersRes.data : [];

      setAllData({ users, movies, bookings, tickets, theaters });
      setTheaters(theaters);

      calculateStats({ users, movies, bookings, tickets, theaters });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date(today.setHours(23, 59, 59, 999));

    switch (dateRange) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case "7days":
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "30days":
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return { startDate, endDate };
  };

  const calculateStats = (data: typeof allData) => {
    const { users, movies, bookings, tickets, theaters } = data;
    let filteredBookings = bookings.filter(
    (b) => b.status === "BOOKED"
  );

  let filteredTickets = tickets.filter(
    (t) => t.status === "BOOKED" || t.status === "COMPLETED"
  );
    if (selectedTheater !== "all") {
      filteredBookings = filteredBookings.filter(
        (b) => b.theaterId === selectedTheater
      );
      filteredTickets = filteredTickets.filter(
        (t) => t.theaterId === selectedTheater
      );
    }

    const { startDate, endDate } = getDateRange();
    if (startDate && endDate) {
      filteredBookings = filteredBookings.filter((b) => {
        if (!b.createdAt) return false;
        const d = new Date(b.createdAt);
        return d >= startDate && d <= endDate;
      });

      filteredTickets = filteredTickets.filter((t) => {
        if (!t.createdAt) return false;
        const d = new Date(t.createdAt);
        return d >= startDate && d <= endDate;
      });
    }

    const normalUsers = users.filter((u) => u.role === "user");
    const managers = users.filter((u) => u.role === "manager");

    const totalRevenue = filteredTickets.reduce(
      (sum, t) => sum + (t.totalPrice ?? 0),
      0
    );

    const today = new Date().toDateString();

    const todayTickets = filteredTickets.filter((t) => {
      if (!t.createdAt) return false;
      return new Date(t.createdAt).toDateString() === today;
    });

    const todayBookings = todayTickets.length;

    const todayRevenue = todayTickets.reduce(
      (sum, t) => sum + (t.totalPrice ?? 0),
      0
    );

    setStats({
      totalUsers: normalUsers.length,
      totalManagers: managers.length,
      totalMovies:
        selectedTheater === "all"
          ? movies.length
          : theaters.find((t) => t.id === selectedTheater)?.movies.length ?? 0,
      totalBookings: filteredBookings.length,
      totalRevenue,
      todayRevenue,
      todayBookings,
    });

    const theaterStatsData: TheaterStats[] = theaters.map((theater) => {
      const theaterTickets = filteredTickets.filter(
        (t) => t.theaterId === theater.id
      );
      const theaterBookings = filteredBookings.filter(
        (b) => b.theaterId === theater.id
      );

      const revenue = theaterTickets.reduce(
        (sum, t) => sum + (t.totalPrice ?? 0),
        0
      );

      let totalSeats = 0;
      let bookedSeats = 0;

      theater.movies.forEach(movie => {
  movie.screens.forEach(screen => {
    Object.values(screen.seats).forEach(dateSeats => {
      Object.values(dateSeats).forEach(showSeats => {
        totalSeats += showSeats.length;
      });
    });
  });
});


      theaterTickets.forEach((t) => {
        bookedSeats += t.seats?.length ?? 0;
      });

      const occupancyRate =
        totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

      return {
        id: theater.id,
        name: theater.name,
        totalBookings: theaterBookings.length,
        revenue,
        moviesCount: theater.movies.length,
        occupancyRate: Math.min(occupancyRate, 100),
      };
    });

    setTheaterStats(theaterStatsData.sort((a, b) => b.revenue - a.revenue));

    const movieRevenueMap = new Map<string, MovieRevenue>();

    filteredTickets.forEach((ticket) => {
      const movie = movies.find((m) => m.id === ticket.movieId);
      if (!movie) return;

      const existing = movieRevenueMap.get(ticket.movieId);
      if (existing) {
        existing.totalBookings += 1;
        existing.seatsSold += ticket.seats?.length ?? 0;
        existing.revenue += ticket.totalPrice ?? 0;
      } else {
        movieRevenueMap.set(ticket.movieId, {
          movieId: ticket.movieId,
          movieTitle: movie.title,
          totalBookings: 1,
          seatsSold: ticket.seats?.length ?? 0,
          revenue: ticket.totalPrice ?? 0,
        });
      }
    });

    setMovieRevenue(
      Array.from(movieRevenueMap.values()).sort((a, b) => b.revenue - a.revenue)
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allData.users.length) calculateStats(allData);
  }, [selectedTheater, dateRange, customStartDate, customEndDate]);

  const items = [
    {
      label: "Users",
      icon: <Users />,
      value: stats.totalUsers,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Managers",
      icon: <Users />,
      value: stats.totalManagers,
      color: "bg-purple-500/10 text-purple-400",
    },
    {
      label: "Movies",
      icon: <Film />,
      value: stats.totalMovies,
      color: "bg-green-500/10 text-green-400",
    },
    {
      label: "Bookings",
      icon: <BookOpen />,
      value: stats.totalBookings,
      color: "bg-orange-500/10 text-orange-400",
    },
    {
      label: "Total Revenue",
      icon: <IndianRupee />,
      value: `₹${stats.totalRevenue}`,
      color: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Today's Revenue",
      icon: <TrendingUp />,
      value: `₹${stats.todayRevenue}`,
      color: "bg-yellow-500/10 text-yellow-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-400 gap-2">
        <Loader2Icon size={24} className="animate-spin" />
        <span>Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Theater</label>
            <select
              value={selectedTheater}
              onChange={(e) => setSelectedTheater(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All Theaters</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name} - {theater.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Inputs */}
          {dateRange === "custom" && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
          >
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

      {/* Theater Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 size={20} />
            Theater Performance
          </h2>

          {theaterStats.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No theater data available
            </p>
          ) : (
            <div className="space-y-3">
              {theaterStats.map((theater) => (
                <div
                  key={theater.id}
                  className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-750 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{theater.name}</h3>
                    <span className="text-emerald-400 font-bold">
                      ₹{theater.revenue}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Bookings</p>
                      <p className="font-semibold">{theater.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Movies</p>
                      <p className="font-semibold">{theater.moviesCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Occupancy</p>
                      <p className="font-semibold">
                        {theater.occupancyRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(theater.occupancyRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Movie Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Film size={20} />
            Top Movies by Revenue
          </h2>

          {movieRevenue.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No movie data available
            </p>
          ) : (
            <div className="space-y-3">
              {movieRevenue.slice(0, 5).map((movie, index) => (
                <div
                  key={movie.movieId}
                  className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{movie.movieTitle}</h3>
                      <div className="flex gap-4 text-sm text-gray-400 mt-1">
                        <span>{movie.totalBookings} bookings</span>
                        <span>{movie.seatsSold} seats</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">
                        ₹{movie.revenue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Highlights */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Today{"'"}s Highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">
              {stats.todayBookings}
            </p>
            <p className="text-gray-400 mt-1">Bookings Today</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">
              ₹{stats.todayRevenue}
            </p>
            <p className="text-gray-400 mt-1">Revenue Today</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {stats.todayBookings > 0
                ? (stats.todayRevenue / stats.todayBookings).toFixed(0)
                : 0}
            </p>
            <p className="text-gray-400 mt-1">Avg. Ticket Price</p>
          </div>
        </div>
      </div>
    </div>
  );
}
