"use client";

import { Theater } from "@/types";
import { getShowtimeStatus } from "@/utils/showtimeStatus";
import { isPastTimeToday, isPastDate, timeToMinutes } from "@/utils/dateTime";

interface Props {
  theaters: Theater[];
  movieId: string;
  selectedDate: string;
  onSelectShowtime: (time: string, screenId: number, theaterId: string) => void;
  onSelectTheater: (id: string) => void;
}

export default function TheaterList({
  theaters,
  movieId,
  selectedDate,
  onSelectShowtime,
  onSelectTheater,
}: Props) {
  if (theaters.length === 0)
    return <p className="text-gray-300">No theaters found.</p>;

  return (
    <div className="space-y-4">
      {theaters.map((theater) => {
        const shows = theater.shows?.filter((s: any) => {
          const movieRef =
            typeof s.movieId === "object" ? s.movieId._id : s.movieId;

          return String(movieRef) === String(movieId);
        });

        if (!shows || shows.length === 0) return null;

        // group shows by date
        const groupedByDate = shows.reduce((acc: any, show: any) => {
          const date = show.showDate.split("T")[0];

          if (!acc[date]) acc[date] = [];
          acc[date].push(show);

          return acc;
        }, {});

        // remove past dates
        const validDates = Object.keys(groupedByDate).filter(
          (date) => !isPastDate(date),
        );
        const dayShows = groupedByDate[selectedDate];
        if (!dayShows)
          return (
            <div
              key={theater._id}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700"
            >
              <h2 className="text-xl text-white font-semibold">
                {theater.name}
              </h2>
              <p className="text-gray-300">{theater.city}</p>
              <p className="text-gray-400 text-sm mt-2">
                No showtimes available.
              </p>
            </div>
          );

        return (
          <div
            key={theater._id}
            className="bg-[#0f0f0f] p-5 rounded-xl border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl text-white font-semibold">
                  {theater.name}
                </h2>
                <p className="text-gray-400 text-sm">{theater.city}</p>
              </div>

              <div className="flex gap-2">
                {theater.screening?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-lg bg-gray-800 text-gray-300 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

           <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
  {dayShows?.map((show: any) => {
    const time = show.showTime;
    const screenNumber = show.screenId?.screenNumber;
    const screenId = show.screenId?._id;

    const isPast = isPastTimeToday(selectedDate, time);

    return (
      <div key={show._id} className="relative group">
        <button
          disabled={isPast}
          onClick={() => {
            if (!isPast) {
              onSelectTheater(String(theater._id));
              onSelectShowtime(time, screenId, theater._id);
            }
          }}
          className={`px-3 py-2 rounded-lg border bg-gray-900 transition-all duration-200 text-sm w-full
            ${
              isPast
                ? "border-gray-700 text-gray-500 bg-gray-800 cursor-not-allowed"
                : "border-green-600 text-green-400 hover:bg-green-900/20"
            }
          `}
        >
          <div className="font-semibold">{time}</div>
          <div className="text-[10px] opacity-60">
            Screen {screenNumber}
          </div>
        </button>
      </div>
    );
  })}
</div>
          </div>
        );
      })}
    </div>
  );
}
