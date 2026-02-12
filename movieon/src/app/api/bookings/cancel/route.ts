import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Booking, ShowTime } from "@/types/manager-index";
import { Theater, Ticket } from "@/types";

const DB_PATH = path.join(process.cwd(), "db.json");

export async function PATCH(req: Request) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

    // 1️⃣ Find booking
    const booking = db.bookings.find(
      (b: Booking) => b.bookingId === bookingId
    );
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    booking.status = "CANCELLED";

    const ticket = db.tickets.find(
      (t: Ticket) => t.bookingId === bookingId
    );
    if (ticket) ticket.status = "CANCELLED";

    const theater = db.theaters.find(
      (t: Theater) => t.id === booking.theaterId
    );

    const movie = theater?.movies.find(
      (m: Theater) => m.movieId === booking.movieId
    );

    const screen = movie?.screens.find(
      (s: ShowTime) => s.screen === booking.screen
    );

    const seatMap =
      screen?.seats?.[booking.date]?.[booking.time];

    if (seatMap) {
      // remove booked seats
      screen.seats[booking.date][booking.time] =
        seatMap.filter(
          (seat: string) => !booking.seats.includes(seat)
        );

      // cleanup empty arrays (optional but clean)
      if (screen.seats[booking.date][booking.time].length === 0) {
        delete screen.seats[booking.date][booking.time];
      }
      if (Object.keys(screen.seats[booking.date]).length === 0) {
        delete screen.seats[booking.date];
      }
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }
}

