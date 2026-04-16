import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api" || "https://movieon-xu6c.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export default api;
