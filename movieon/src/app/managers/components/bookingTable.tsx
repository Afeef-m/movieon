"use client";

import { useEffect, useState } from "react";
import { BookMinus, Check, CircleCheckBig, X } from "lucide-react";
import { Booking } from "@/types/manager-index";
import api from "@/app/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  bookings: Booking[];
}

export default function BookingTable({ bookings }: Props) {
  const { user } = useAuthStore();
  const theaterId = user?.theaterId;
  const [bookingList, setBookingList] = useState<Booking[]>([]);

  const perPages = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (!theaterId) {
      setBookingList([]);
      return;
    }

    const filtered = bookings.filter((b) => b.theaterId === theaterId);

    setBookingList(filtered);
  }, [bookings, theaterId]);

  const updateStatus = async (bookingId: string, status: Booking["status"]) => {
    try {
      if (!theaterId) {
        toast.error("Unauthorized");
        return;
      }

      const bookingRes = await api.get(
        `/bookings?bookingId=${bookingId}&theaterId=${theaterId}`
      );

      const booking = bookingRes.data?.[0];

      if (!booking) {
        toast.error("Booking not found or unauthorized");
        return;
      }

      await api.patch(`/bookings/${booking.id}`, {
        status,
        updatedAt: new Date().toISOString(),
      });

      const ticketRes = await api.get(`/tickets?bookingId=${bookingId}`);

      const ticket = ticketRes.data?.[0];

      if (ticket?.id) {
        await api.patch(`/tickets/${ticket.id}`, {
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      setBookingList((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b))
      );
      toast.success("Booking status updated");
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };
    const totalperPages = Math.ceil(bookingList.length / perPages);
      const pagination  = bookingList.slice(
        (currentPage - 1) * perPages,
        currentPage * perPages
      );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-800 rounded-lg">
        <thead className="bg-gray-900">
          <tr>
            <th className="p-3 text-left">No:</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Movie</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Seats</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagination.map((b, ind) => (
            <tr key={b.bookingId} className="border-t border-gray-800">
              <td className="p-3">{ind + 1}</td>
              <td className="p-3">{b.userName}</td>
              <td className="p-3">{b.movieTitle}</td>
              <td className="p-3">{b.date}</td>
              <td className="p-3">{b.time}</td>
              <td className="p-3">{b.seats?.join(", ")}</td>
              <td className="p-3 font-semibold">{b.status}</td>
              <td className="p-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateStatus(b.bookingId, "BOOKED")}
                    className="flex items-center gap-1 px-3 py-2 rounded bg-green-700 hover:bg-green-800 text-sm"
                  >
                    <Check size={16} />
                    <span>Booked</span>
                  </button>

                  <button
                    onClick={() => updateStatus(b.bookingId, "CANCELLED")}
                    className="flex items-center gap-1 px-3 py-2 rounded bg-red-700 hover:bg-red-800 text-sm"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={() => updateStatus(b.bookingId, "COMPLETED")}
                    className="flex items-center gap-1 px-3 py-2 rounded bg-blue-700 hover:bg-blue-800 text-sm"
                  >
                    <CircleCheckBig size={16} />
                    <span>Completed</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalperPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalperPages }, (_, i) => i + 1).map(
      (page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-600"
              : "bg-zinc-800"
          }`}
        >
          {page}
        </button>
      )
    )}

    <button
      disabled={currentPage === totalperPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      {pagination.length === 0 && (
        <div className="py-6 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
            <BookMinus size={20} />
            <span>No Booking Found</span>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-4">More Details</h1>

        <table className="w-full border border-gray-800 rounded-lg">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">No:</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Movie</th>
              <th className="p-3">Date</th>
              <th className="p-3">Booked Time</th>
              <th className="p-3">Booking ID</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.map((b,ind) => (
              <tr
                key={`${b.bookingId}-details`}
                className="border-t border-gray-800"
              >
                <td className="p-3">{ind + 1}</td>
                <td className="p-3">{b.userName}</td>
                <td className="p-3">{b.movieTitle}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.readableDateTime}</td>
                <td className="p-3">{b.bookingId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalperPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-6">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalperPages }, (_, i) => i + 1).map(
      (page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-600"
              : "bg-zinc-800"
          }`}
        >
          {page}
        </button>
      )
    )}

    <button
      disabled={currentPage === totalperPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 rounded bg-zinc-800 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

        {bookingList.length === 0 && (
          <div className="py-6 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
              <BookMinus size={20} />
              <span>No Booking Found</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
