// src/app/api/bookings/create/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      movieId,
      theaterId,
      seats,
      date,
      time,
      screen,
      totalPrice,
      userId,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing razorpay response" },
        { status: 400 }
      );
    }

    if (!movieId || !theaterId || !seats || !date || !time || !userId) {
      return NextResponse.json(
        { error: "Missing booking details" },
        { status: 400 }
      );
    }

    const generated_signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    const bookingId = `bkg_${Date.now()}`;
    const ticketId = `tkt_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const readableDateTime = new Date(createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const movieRes = await fetch(`${API_URL}/movies/${movieId}`);
    const movie = await movieRes.json();

    const booking = {
      id: bookingId,
      bookingId,
      ticketId,
      userId,
      movieId,
      theaterId,
      screen: Number(screen),
      date,
      time,
      seats,
      totalPrice,
      paymentId: razorpay_payment_id,
      readableDateTime,
      status: "BOOKED",
    };

    const ticket = {
      id: ticketId,
      bookingId,
      ticketId,
      movieId,
      theaterId,
      screen: Number(screen),
      date,
      time,
      seats,
      totalPrice,
      paymentId: razorpay_payment_id,
      userId,
      createdAt,
      moviePoster: movie?.poster || "",
      movieTitle: movie?.title || "",
      language: movie?.language || "",
      status: "BOOKED",
    };

    await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });

    const theaterRes = await fetch(`${API_URL}/theaters/${theaterId}`);
    const theater = await theaterRes.json();

    if (theater) {
      const theaterMovie = theater.movies?.find(
        (m: any) => String(m.movieId) === String(movieId)
      );

      if (theaterMovie) {
        const screenObj = theaterMovie.screens?.find(
          (s: any) => s.screen === Number(screen)
        );

        if (screenObj) {
          screenObj.seats = screenObj.seats || {};
          screenObj.seats[date] = screenObj.seats[date] || {};
          screenObj.seats[date][time] =
            screenObj.seats[date][time] || [];

          const existing = new Set(screenObj.seats[date][time]);
          seats.forEach((s: string) => existing.add(s));

          screenObj.seats[date][time] = Array.from(existing);
        }
      }

      await fetch(`${API_URL}/theaters/${theaterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theater),
      });
    }

    return NextResponse.json({ bookingId, ticketId });

  } catch (err: any) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: err.message || "Booking failed" },
      { status: 500 }
    );
  }
}
