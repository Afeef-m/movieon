// src/app/api/bookings/cancel/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId required" },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    const bookingRes = await fetch(`${API_URL}/bookings?bookingId=${bookingId}`);
    const bookingData = await bookingRes.json();
    const booking = bookingData?.[0];

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    await fetch(`${API_URL}/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    const ticketRes = await fetch(`${API_URL}/tickets?bookingId=${bookingId}`);
    const ticketData = await ticketRes.json();
    const ticket = ticketData?.[0];

    if (ticket) {
      await fetch(`${API_URL}/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
    }

    const theaterRes = await fetch(`${API_URL}/theaters/${booking.theaterId}`);
    const theater = await theaterRes.json();

    if (theater) {
      const theaterMovie = theater.movies?.find(
        (m: any) => String(m.movieId) === String(booking.movieId)
      );

      if (theaterMovie) {
        const screenObj = theaterMovie.screens?.find(
          (s: any) => s.screen === Number(booking.screen)
        );

        const seatMap =
          screenObj?.seats?.[booking.date]?.[booking.time];

        if (seatMap) {
          screenObj.seats[booking.date][booking.time] =
            seatMap.filter(
              (seat: string) => !booking.seats.includes(seat)
            );

          // cleanup
          if (screenObj.seats[booking.date][booking.time].length === 0) {
            delete screenObj.seats[booking.date][booking.time];
          }

          if (Object.keys(screenObj.seats[booking.date]).length === 0) {
            delete screenObj.seats[booking.date];
          }
        }
      }

      await fetch(`${API_URL}/theaters/${booking.theaterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theater),
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Cancel failed" },
      { status: 500 }
    );
  }
}
