export const timeToMinutes = (time: string) => {
  const match = time.match(/(\d{1,2}):(\d{2})(AM|PM)/);
  if (!match) return Infinity;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
};

export const getTodayMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isPastDate = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate < today;
};

export const isPastTimeToday = (date: string, time: string) => {
  const today = new Date().toISOString().split("T")[0];
  if (date !== today) return false;

  return timeToMinutes(time) < getTodayMinutes();
};
