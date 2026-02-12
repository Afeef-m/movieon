"use client";

import { useState } from "react";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { MovieForTheater, Theater } from "@/types/manager-index";
import { TimeChanger } from "@/utils/timeChanger";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  movie: MovieForTheater & { days?: { date: string; showtimes: string[] }[]; screens?: { screen: number; showtimes: string[]; seats: Record<string, Record<string, string[]>> }[] };
  theaterId: string;
  onClose: () => void;
  onSaved: () => void;
}

interface ShowTime {
  date: string;
  showtimes: string[];
}

export default function ManageShowtimeModal({ movie, onClose, onSaved }: Props) {
  const { user } = useAuthStore();
const theaterId = user?.theaterId;

  const [days, setDays] = useState<ShowTime[]>(movie.days ? [...movie.days] : []);
  const [screens, setScreens] = useState(movie.screens ? [...movie.screens] : []);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [screenNumber, setScreenNumber] = useState(1);

  const addShowtime = () => {
    if (!date || !time || !screenNumber) return;

    const formattedTime = TimeChanger(time);

    // Update days
    setDays(prev => {
      const existing = prev.find(d => d.date === date);
      if (existing) {
        return prev.map(d => d.date === date
          ? { ...d, showtimes: Array.from(new Set([...d.showtimes, formattedTime])).sort() }
          : d
        );
      }
      return [...prev, { date, showtimes: [formattedTime] }];
    });

    // Update screens
    setScreens(prev => {
      const existingScreen = prev.find(s => s.screen === screenNumber);
      if (existingScreen) {
        return prev.map(s => s.screen === screenNumber
          ? { ...s, showtimes: Array.from(new Set([...s.showtimes, formattedTime])).sort(), seats: s.seats || {} }
          : s
        );
      }
      return [...prev, { screen: screenNumber, showtimes: [formattedTime], seats: {} }];
    });

    setTime("");
  };

  const removeShowtime = (date: string, time: string, screen?: number) => {
    // Remove from days
    setDays(prev =>
      prev.map(d => d.date === date ? { ...d, showtimes: d.showtimes.filter(t => t !== time) } : d)
        .filter(d => d.showtimes.length > 0)
    );

    // Remove from screen
    if (screen) {
      setScreens(prev =>
        prev.map(s => s.screen === screen ? { ...s, showtimes: s.showtimes.filter(t => t !== time) } : s)
          .filter(s => s.showtimes.length > 0)
      );
    }
  };
  const today = new Date();
const minDate = today.toLocaleDateString("en-CA"); 

  const save = async () => {
    try {
      const theater = (await api.get<Theater>(`/theaters/${theaterId}`)).data;
      const updatedMovies = theater.movies.map(m =>
        m.movieId === movie.id ? { ...m, days, screens } : m
      );
      await api.patch(`/theaters/${theaterId}`, { movies: updatedMovies });
      toast.success("Showtimes updated");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save showtimes");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
  <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl">
    
    {/* HEADER */}
    <div className="px-6 py-4 border-b border-zinc-800">
      <h2 className="text-lg font-semibold text-white">
        Manage Showtimes
      </h2>
      <p className="text-xl text-zinc-400 mt-1">
        {movie.title}
      </p>
    </div>

    {/* INPUT SECTION */}
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <input
          type="number"
          min={1}
          value={screenNumber}
          onChange={(e) => setScreenNumber(Number(e.target.value))}
          placeholder="Screen"
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <button
          onClick={addShowtime}
          className="rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
        >
          Add
        </button>
      </div>

      {/* SHOWTIME LIST */}
      <div className="max-h-64 overflow-y-auto space-y-5 pr-1">
        {days.map((d) => (
          <div key={d.date}>
            <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
              {d.date}
            </p>

            <div className="flex flex-wrap gap-2">
              {d.showtimes.map((t) => {
                const screen = screens.find(s => s.showtimes.includes(t))?.screen;
                return (
                  <button
                    key={t}
                    onClick={() => removeShowtime(d.date, t)}
                    className="group flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-1.5 text-sm text-white hover:bg-red-500 transition"
                  >
                    {t}
                    {screen && (
                      <span className="text-xs text-zinc-400 group-hover:text-white">
                        • Screen {screen}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {!days.length && (
          <p className="text-center text-sm text-zinc-500 py-8">
            No showtimes added yet
          </p>
        )}
      </div>
    </div>

    {/* FOOTER */}
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800">
      <button
        onClick={onClose}
        className="rounded-lg px-4 py-2 text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
      >
        Cancel
      </button>
      <button
        onClick={save}
        className="rounded-lg px-5 py-2 text-sm bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>

  );
}
