"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Booking, Ticket } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import TicketCard from "./ticket-card";
import Link from "next/link";
import { ArrowLeft, Loader2Icon, Tickets } from "lucide-react";

interface MergedTicket extends Ticket {
  bookingInfo: Booking | null;
}

export default function MyTicket() {
  const { user, hydrated } = useAuthStore();

  const [mergedTickets, setMergedTickets] = useState<MergedTicket[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (!user?.id) {
      setError("User not logged in");
      return;
    }

    const fetchTickets = async () => {
      try {
        const [bookingsRes, ticketsRes] = await Promise.all([
          api.get<Booking[]>(`/bookings?userId=${user.id}`),
          api.get<Ticket[]>(`/tickets?userId=${user.id}`),
        ]);

        const bookings = bookingsRes.data;
        const tickets = ticketsRes.data;

        const merged = tickets.map((ticket) => {
          const bookingMatch = bookings.find(
            (b) => b.bookingId === ticket.bookingId
          );
          return {
            ...ticket,
            bookingInfo: bookingMatch || null,
          };
        });

        setMergedTickets(merged);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
      }
    };

    fetchTickets();
  }, [hydrated, user?.id]);

  if (!hydrated)
    return (
     <div className="flex justify-center items-center h-[50vh] text-gray-500 gap-2">
  Loading tickets...
  <Loader2Icon size={20} className="animate-spin" />
</div>

    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 text-lg">{error}</div>
    );

  if (mergedTickets.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center ">
    <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-400">
      <Tickets size={20} />
      <span>No Tickets Found</span>
    </div>
  </div>
    );

  return (
    <div className="px-6 md:px-20 mt-20 mb-20 ">

  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
    My Tickets <Tickets size={24} />
  </h2>

  <div className="mb-6 flex justify-center md:justify-start">
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
    >
      <ArrowLeft size={20} />
    </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {mergedTickets.map((ticket) => (
      <TicketCard key={ticket.ticketId} ticket={ticket} />
    ))}
  </div>

  {mergedTickets.length === 0 && (
    <p className="text-center text-gray-500 mt-10 text-lg flex items-center justify-center gap-2">
      No tickets found <Tickets size={24} />
    </p>
  )}
</div>

  );
}
