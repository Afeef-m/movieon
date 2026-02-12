
export interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
export interface DashboardStats {
  totalMovies: number;
  totalShowtimes: number;
  totalBookings: number;
  revenue: number;
}

export interface Manager {
  managerId:string;
  id: string;
  // theaterName?:string;
  theaterPlace:string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  blocked: boolean;
  theaterId: string; 
}


export interface Booking {
  id: string;
  movieId: string;
  theaterId: string;
  // theaterName?:string;
  movieTitle:string
  userName:string
  screen: number;
  date: string;
  time: string;
  seats: string[];
  totalAmount: number;
  status: "BOOKED" | "CANCELLED" | "COMPLETED";
  userId: string;
  createdAt: string;
  bookingId:string;
  totalPrice:number;
  totalBookings?:number;
  seatsSold?:number;
  revenue?:number;
  readableDateTime:string;
}
export interface RevenueRow {
   movieId?: string;
  movieTitle: string;
  date: string;
  totalBookings: number;
  seatsSold: number;
  revenue: number;
}

export interface TheaterMovieDay {
  date: string;
  showtimes: string[];
}

export interface TheaterMovieScreen {
  screen: number;
  showtimes: string[];
  seats: Record<string, Record<string, string[]>>; 
}

export interface TheaterMovie {
  movieId: string;
  name:string;
  days: TheaterMovieDay[];
  screens: TheaterMovieScreen[];
}

export interface Theater {
  id: string;
  name: string;
  city: string;
  screening: string[];  
  movies: TheaterMovie[];
}

export interface MovieForTheater {
  id: string;
  title: string;
  poster: string;
  duration: string;
  language: string;
  genre: string[];
  // days:string[]
}

export interface SeatLayout {
  seatNumber: string;
  booked: boolean;
  userId?: string;
}

export interface ShowTime {
  id: string;
  movieId: string;
  theaterId: string;
  screen: number;
  date: string;
  time: string;
  showtimes:string
  seatLayout: SeatLayout[];
}


