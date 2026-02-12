"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "@/app/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Booking, Movie } from "@/types";
import Barcode from "../components/barcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader2 } from "lucide-react";

export default function TicketPageClient() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") || "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true)

  const ticketRef = useRef<HTMLDivElement>(null);

  const urlToBase64 = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const downloadPDF = async () => {
    if (!ticketRef.current || !movie) return;

    const ticketElement = ticketRef.current;

    const base64Poster = await urlToBase64(movie.poster);

    const imgElement = ticketElement.querySelector("img");
    const originalSrc = imgElement?.src;

    if (imgElement) imgElement.src = base64Poster;

    const canvas = await html2canvas(ticketElement, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    if (imgElement) imgElement.src = originalSrc as string;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [ticketElement.clientWidth, ticketElement.clientHeight],
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      ticketElement.clientWidth,
      ticketElement.clientHeight
    );

    pdf.save(`ticket-${booking?.bookingId}.pdf`);
  };

  useEffect(() => {
    if (!bookingId) return;

    axios
      .get(`/bookings?bookingId=${bookingId}`)
      .then((res) => {
        const data = res.data?.[0];

        if (!data) return;

        setBooking(data);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.movieId) return;

    axios
      .get(`/movies/${booking.movieId}`)
      .then((res) => setMovie(res.data))
  }, [booking?.movieId]);

  useEffect(() => {
    if (!booking || !movie) return;
     if (booking.status !== "BOOKED") return; 

    const showKey = `${booking.movieId}-${booking.date}-${booking.time}-${booking.screen}`;
    const booked = JSON.parse(localStorage.getItem("bookedSeats") || "{}");
    const alreadyBooked = booked[showKey] || [];

    booked[showKey] = Array.from(new Set([...alreadyBooked, ...booking.seats]));
    localStorage.setItem("bookedSeats", JSON.stringify(booked));
  }, [booking, movie]);

  if (loading || !booking || !movie) {
    return (
       <div className="min-h-screen flex justify-center items-center py-10">
        Loading Tickect...
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-14 bg-black flex flex-col items-center p-4 sm:p-6">
      <div
        id="ticket-area"
        ref={ticketRef}
        className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white">
          <h1 className="text-center text-xl sm:text-2xl font-extrabold tracking-wide">
            🎬 MOVIE TICKET
          </h1>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Image
              src={movie.poster}
              alt={movie.title}
              width={100}
              height={130}
              className="rounded-lg shadow-md"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {movie.title}
              </h2>
              <p className="text-gray-600 text-sm">{movie.language}</p>
              <p className="text-gray-600 text-sm">Screen {booking.screen}</p>
            </div>
          </div>

          <div className="relative my-6">
            <div className="border-t border-dashed border-gray-400"></div>
            <div className="absolute -left-3 -top-3 bg-black w-6 h-6 rounded-full"></div>
            <div className="absolute -right-3 -top-3 bg-black w-6 h-6 rounded-full"></div>
          </div>

          <div className="space-y-3 text-sm sm:text-base">
            <p>
              <span className="font-semibold">Date:</span> {booking.date}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {booking.time}
            </p>
            <p>
              <span className="font-semibold">Seats:</span>{" "}
              {booking.seats.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹
              {booking.totalPrice}
            </p>
            <p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === "BOOKED"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {booking.status}
              </span>
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="border-t border-dashed border-gray-400"></div>
          <div className="absolute -left-3 -top-3 bg-black w-6 h-6 rounded-full"></div>
          <div className="absolute -right-3 -top-3 bg-black w-6 h-6 rounded-full"></div>
        </div>

        <div className="p-5 flex flex-col items-center">
          <Barcode code={`BOOKING ID: ${booking.bookingId}`} />
          <p className="text-center mt-4 text-gray-500 text-sm">
            Enjoy your movie! 🍿
          </p>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex-1 text-center py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          Go Home
        </Link>

        <Link
          href="/my-tickets"
          className="flex-1 text-center py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          My Tickets
        </Link>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-4 w-full max-w-md py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
      >
        Download Ticket (PDF)
      </button>
    </div>
  );
}
