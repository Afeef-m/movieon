import api from "./axios";
import { Theater } from "@/types";

export const getTheaters = async () => {
  try {
    const res = await api.get<Theater[]>("/theaters");
    return res.data;
  } catch (error) {
    console.error("Error fetching theaters:", error);
    return [];
  }
};

export const getTheaterById = async (id: number | string) => {
  try {
    const res = await api.get<Theater>(`/theaters/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching theater ${id}:`, error);
    return null;
  }
};
