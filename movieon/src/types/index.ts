// src/types/index.ts
//  ================= USERS =================

export interface User {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  password: string;
  profileImage?:string;
  phone?:number;
  age?:number;
  place?:string;
  blocked?: boolean;
  theaterId?:string;
  // theaterName?:string;
  role: "user" | "admin" | "manager";
}
export interface UserManager {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  password: string;
  profileImage?:string;
  phone?:number;
  age?:number;
  place?:string;
  blocked?: boolean;
  theaterId?:string;
  // theaterName?:string;
  role: "user" | "admin" | "manager";
}

// ================= MOVIES =================

export interface MovieCast {
  actor: string;
  character: string;
  picture: string;
}

export interface MovieDay {
  date: string;
  showtimes: string[];
}

export interface MovieScreen {
  screen: number;
  showtimes: string[];
}

export interface MovieSeats {
  [date: string]: {
    [showTime: string]: string[];
  };
}

export interface Movie {
  _id: string;
  title: string;
  rating: number;
  poster: string;
  banner: string;
  genre: string[];
  language: string;
  duration: string;
  description: string;
  director:string;
  releaseDate:string;
  releaseYear: number;
  ticketPrice: number;

  days: MovieDay[];
  cast: MovieCast[];
  seats: MovieSeats;
  status:"NOW_SHOWING" | "UPCOMING" | "EXPIRED";
  trailer?: string;
  
}

// ================= THEATERS =================

export interface TheaterScreen {
  screen: number;
  showtimes: string[];
  seats: {
    [date: string]: {
      [showTime: string]: string[];
    };
  };
}
export interface TheaterMovieDay {
  date: string;
  showtimes:string[];
}
export interface TheaterMovie {
  movieId: string;     
  movieTitle:string;
   days: TheaterMovieDay[];  
   screens: TheaterScreen[]; 
}

export interface Theater {
  _id: string;
  managerId:string;
  movieId: string; 
  theaterId:string;
  // theaterName:string;
  name: string;
  city: string;
  screening: string[];
  movies: TheaterMovie[];
  screen: number;
  showtimes: string[];
  createdAt: string;
  seats: {
    [date: string]: {
      [showTime: string]: string[];
    };
  };
}
export interface TheaterStats {
  id: string;
  name: string;
  totalBookings: number;
  revenue: number;
  moviesCount: number;
  occupancyRate: number;
}

// ================= TICKET =================


export interface Ticket {
  bookingId: string;
  ticketId: string;
  movieId: string;
  theaterId?: string;
  // theaterName?:string;
  screen: number;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  paymentId?: string;
  userId?:string;
  createdAt: string;
  readableDateTime:string;
  moviePoster: string;
  movieTitle: string;
  language: string;
  
  status: "BOOKED" | "CANCELLED" | "COMPLETED";
}

// ================= BOOKING =================

export interface Booking {
  id:string;
  bookingId: string;
  ticketId: string;
  userId: string;
  movieId: string;
  theaterId: string;
  screen: number;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  paymentId: string;
  createdAt: string;
  status: "BOOKED" | "CANCELLED" | "COMPLETED";
}
// ================= RAZORPAY =================
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  method?: string;
}
export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: "INR";
  receipt: string;
}
export interface RazorpayInstance {
  open: () => void;
  close?: () => void;
}
export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: "INR";
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };
  modal?: {
  backdropclose?: boolean;
  escape?: boolean;
  confirm_close?: boolean;
  handleback?: boolean;
  ondismiss?: () => void;
};

}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}