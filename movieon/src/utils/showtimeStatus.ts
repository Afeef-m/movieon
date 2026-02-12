import { Theater } from "@/types";

export function getShowtimeStatus(
  theater: Theater,
  movieId: string,
  screen: number,
  date: string,
  time: string
) {
  const movie = theater.movies.find(m => String(m.movieId) === String(movieId));
  if (!movie) return "AVAILABLE";

  const screenData = movie.screens.find(s => s.screen === screen);
  if (!screenData) return "AVAILABLE";

  const bookedSeats =
    screenData.seats?.[date]?.[time] ?? [];

  const booked = bookedSeats.length;

  const TOTAL_SEATS = 100;

  const percent = (booked / TOTAL_SEATS) * 100;

  if (percent >= 100) return "SOLD OUT";
  if (percent >= 80) return "ALMOST FULL";
  if (percent >= 50) return "FAST FILLING";
  return "AVAILABLE";
}
