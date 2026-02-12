"use client";

import { RevenueRow } from "@/types/manager-index";
import { HandCoins } from "lucide-react";

interface Props {
  rows: RevenueRow[];
}

export default function RevenueTable({ rows }: Props) {
  if (!rows.length) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
      <HandCoins size={20} />
      <span>No Revenue In Your Theater</span>
    </div>
    );
  }

  const grandTotal = rows.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-800 rounded-lg">
        <thead className="bg-gray-900">
          <tr>
            <th className="p-3 text-left">Movie</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Bookings</th>
            <th className="p-3 text-center">Seats Sold</th>
            <th className="p-3 text-center">Revenue (₹)</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td className="p-3">{r.movieTitle}</td>
              <td className="p-3 text-center">{r.date}</td>
              <td className="p-3 text-center">{r.totalBookings}</td>
              <td className="p-3 text-center">{r.seatsSold}</td>
              <td className="p-3 text-center font-semibold">
                ₹{r.revenue}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-gray-900">
          <tr>
            <td colSpan={4} className="p-3 text-right font-bold">
              Total Revenue
            </td>
            <td className="p-3 text-center font-bold text-green-400">
              ₹{grandTotal}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
