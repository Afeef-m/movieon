import api from "./axios";
import { Movie } from "@/types";

export const getMovies = async () => {
  try {
    const res = await api.get<Movie[]>("/movies");
    return res.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovieById = async (id: string | number) => {
  try {
    const res = await api.get<Movie>(`/movies/${String(id)}`);
    return res.data;
  } catch {
    return null;
  }
};
