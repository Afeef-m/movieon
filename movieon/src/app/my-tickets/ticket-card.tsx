"use client"
import React, { useState } from "react";
import { Ticket, Booking } from "@/types";
import Image from "next/image";
import Barcode from "../components/barcode";
import { X } from "lucide-react";
import CancelConfirm from "../components/cancelConfirm";
import toast from "react-hot-toast";

interface Props {
  ticket: Ticket & { bookingInfo: Booking | null };
}

export default function TicketCard({ ticket }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false)

 const handleCancel = async () => {
  try {
    await fetch("/api/bookings/cancel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: ticket.bookingId }),
    });
    setOpenConfirm(false);
  } catch (err) {
    console.error("Cancel failed", err);
    toast.error("Cancel failed")
  }
};
  return (
    <div className="bg-white shadow-lg p-5 rounded-xl border border-gray-200 flex gap-5 items-start">
      <div className="mt-3">
        <div className="relative w-36 h-52 rounded-lg overflow-hidden flex-shrink-0 mt-4 ml-3">
          {ticket.moviePoster ? (
            <Image
              src={ticket.moviePoster}
              alt={ticket.movieTitle || "Movie Poster"}
              fill
              className="object-cover "
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            disabled={ticket.status !== "BOOKED"}
            onClick={() => setOpenConfirm(true)}
            className={`
      flex items-center gap-1 text-xs px-3 py-1 rounded-full border
      transition-all duration-200
      ${
        ticket.status === "BOOKED"
          ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          : "text-gray-400 border-gray-300 cursor-not-allowed"
      }
    `}
          >
            <X size={14} />
            Cancel
          </button>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.status === "BOOKED"
                ? "bg-green-100 text-green-700"
                : ticket.status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight">
            {ticket.movieTitle || "Unknown Movie"}
          </h3>

          <p className="text-sm text-gray-500">{ticket.language || "N/A"}</p>

          <div className="text-sm text-gray-700 space-y-1 mt-2">
            <p>
              <strong>Date:</strong> {ticket.date || "-"}
            </p>
            <p>
              <strong>Time:</strong> {ticket.time || "-"}
            </p>
            <p>
              <strong>Screen:</strong> {ticket.screen ?? "-"}
            </p>
            <p>
              <strong>Seats:</strong> {ticket.seats?.join(", ") || "-"}
            </p>
          </div>

          <div className="text-sm space-y-1 mt-2">
            <p>
              <strong>Total:</strong> ₹{ticket.totalPrice ?? 0}
            </p>

            {ticket.bookingInfo && (
              <p className="text-gray-600">
                <strong>Payment ID:</strong>{" "}
                {ticket.bookingInfo.paymentId || "-"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Barcode code={`BOOKING ID: ${ticket.bookingId}`} />
        </div>
      </div>
      {openConfirm && ticket.status === "BOOKED" &&(
        <CancelConfirm 
        description={`Cancel Your Ticket ${ticket.movieTitle}`}
        onClose={()=>setOpenConfirm(false)}
        onConfirm={handleCancel}
        />
      )}
    </div>
  );
}
