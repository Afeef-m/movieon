import { MovieDay } from "@/types";

interface Props {
  days: MovieDay[];
  selectedDate: string;
  onChange: (date: string) => void;
}

export default function MovieDays({ days, selectedDate, onChange }: Props) {

  const isPastDate = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  return date < today;
};


  const validDays = Array.isArray(days)
  ? days.filter((d) => d?.date && !isPastDate(d.date))
  : [];


  if (!validDays.length)
    return <p className="text-gray-400 mt-6">No dates available</p>;

  const mergedDaysMap: Record<string, string[]> = {};

  validDays.forEach((d) => {
    if (!mergedDaysMap[d.date]) {
      mergedDaysMap[d.date] = [...(d.showtimes ?? [])];
    } else {
      const combined = [...mergedDaysMap[d.date], ...(d.showtimes ?? [])];

      mergedDaysMap[d.date] = [...new Set(combined)];
    }
  });
  const mergedDays = Object.keys(mergedDaysMap).map((date) => ({
    date,
    showtimes: mergedDaysMap[date],
  }));

  mergedDays.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-3">Select Date</h2>

      <div className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x">
        {mergedDays.map((day) => {
          const d = new Date(day.date);
          const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
          const dayNum = d.getDate();
          const month = d.toLocaleDateString("en-US", { month: "short" });

          const isSelected = selectedDate === day.date;

          return (
            <button
              key={`${day.date}-${day.showtimes.join("_")}`} 
              onClick={() => onChange(day.date)}
              className={`
                snap-center px-4 py-3 rounded-xl border min-w-[70px] flex flex-col items-center
                transition-all
                ${
                  isSelected
                    ? "bg-yellow-600 text-white border-yellow-400 shadow-lg scale-105"
                    : "bg-white/10 text-gray-200 border-white/20 hover:bg-white/20"
                }
              `}
            >
              <span className="text-xs opacity-80">{weekday}</span>
              <span className="text-lg font-bold leading-tight">{dayNum}</span>
              <span className="text-xs opacity-80">{month}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
