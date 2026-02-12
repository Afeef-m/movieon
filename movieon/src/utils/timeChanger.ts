export function TimeChanger(time24: string): string {
  const [h, m] = time24.split(":").map(Number);

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${m.toString().padStart(2, "0")}${period}`;
}
