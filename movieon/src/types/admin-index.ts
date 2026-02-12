//src/types/admin-index.ts
// ================= ADMIN INDEX TYPES =================

import type { User, Movie, Theater, Booking } from "./index";

export interface MovieRevenue {
  movieId: string;
  movieTitle: string;
  totalBookings: number;
  seatsSold: number;
  revenue: number;
}

// ================= HEADER =================
export interface AdminHeaderProps {
  toggleSidebar: () => void;
}

// ================= SIDEBAR =================
export interface AdminSidebarItem {
  label: string;
  icon?: React.ReactNode;
  path: string;
}

// ================= DASHBOARD STATS =================
export interface AdminDashboardStats {
  totalUsers: number;
  totalManagers: number;
  totalMovies: number;
  totalBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  todayBookings: number;
}

// ================= PAGINATION =================
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// ================= SORTING =================
export interface SortOptions {
  field: string;        
  order: "asc" | "desc";
}

// ================= FILTERS =================
export interface MovieFilter {
  genre?: string;
  language?: string;
  releaseYear?: number;
}

export interface UserFilter {
  role?: "user" | "admin";
  email?: string;
}

export interface BookingFilter {
  date?: string;
  movieId?: string;
  theaterId?: string;
}

// ================= ADMIN TABLE RESPONSES =================

// Users Table
export interface AdminUsersResponse {
  users: User[];
  pagination: Pagination;
}

// Movies Table
export interface AdminMoviesResponse {
  movies: Movie[];
  pagination: Pagination;
}

// Theaters Table
export interface AdminTheatersResponse {
  theaters: Theater[];
  pagination: Pagination;
}

// Bookings Table
export interface AdminBookingsResponse {
  bookings: Booking[];
  pagination: Pagination;
}

// Revenue Graph/Stats
export interface AdminRevenueDay {
  date: string;
  revenue: number;
  bookings: number;
}

export interface AdminRevenueResponse {
  stats: AdminRevenueDay[];
  totalRevenue: number;
}
