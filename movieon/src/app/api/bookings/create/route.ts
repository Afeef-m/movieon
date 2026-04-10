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

    // ✅ Validate
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

    // ✅ Verify Razorpay signature
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

    // ✅ Generate IDs
    const bookingId = `bkg_${Date.now()}`;
    const ticketId = `tkt_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const readableDateTime = new Date(createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // ✅ Fetch movie from backend
    const movieRes = await fetch(`${API_URL}/movies/${movieId}`);
    const movie = await movieRes.json();

    // ✅ Booking object
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

    // ✅ Ticket object
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

    // ✅ Save booking
    await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    // ✅ Save ticket
    await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });

    // ✅ Update theater seats
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








// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import fs from "fs";
// import path from "path";
// import { Movie, Theater, TheaterScreen } from "@/types";

// const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
// const DB_PATH = process.env.DB_PATH 
//   ? path.resolve(process.cwd(), process.env.DB_PATH)
//   : path.join(process.cwd(), "db.json");

  
// function readDB() {
//   try {
//     console.log("Reading DB from:", DB_PATH);
    
//     if (!fs.existsSync(DB_PATH)) {
//       console.error("DB file not found at:", DB_PATH);
//       const initialData = {
//         users: [],
//         theaters: [],
//         movies: [],
//         bookings: [],
//         tickets: []
//       };
//       fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
//       return initialData;
//     }
    
//     const raw = fs.readFileSync(DB_PATH, "utf-8");
//     return JSON.parse(raw);
//   } catch (error: any) {
//     console.error("Error reading DB:", error);
//     throw new Error(`Database read error: ${error.message}`);
//   }
// }

// function writeDB(obj: any) {
//   try {
//     console.log("Writing DB to:", DB_PATH);
//     fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2), "utf-8");
//   } catch (error: any) {
//     console.error("Error writing DB:", error);
//     throw new Error(`Database write error: ${error.message}`);
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//       movieId,
//       theaterId,
//       seats,
//       date,
//       time,
//       screen,
//       totalPrice,
//       userId,
//     } = body;

//     // Validate required fields
//     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//       return NextResponse.json(
//         { error: "Missing razorpay response" },
//         { status: 400 }
//       );
//     }

//     if (!movieId || !theaterId || !seats || !date || !time || !userId) {
//       return NextResponse.json(
//         { error: "Missing booking details" },
//         { status: 400 }
//       );
//     }

//     // Verify signature
//     const generated_signature = crypto
//       .createHmac("sha256", KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       console.error("Invalid signature");
//       return NextResponse.json(
//         { error: "Invalid payment signature" },
//         { status: 400 }
//       );
//     }

// const status: "BOOKED" | "CANCELLED" | "COMPLETED" =
//   body?.status === "BOOKED" ||
//   body?.status === "CANCELLED" ||
//   body?.status === "COMPLETED"
//     ? body.status
//     : "BOOKED";

//     console.log("Payment verified successfully");

//     const db = readDB();

//     const bookingId = `bkg_${Date.now()}`;
//     const ticketId = `tkt_${Date.now()}`;
//     const createdAt = new Date().toISOString();
//     const readableDateTime = new Date(createdAt).toLocaleString("en-IN", {
//   dateStyle: "medium",
//   timeStyle: "short",
// });


//     const booking = {
//       id :bookingId,
//       bookingId,
//       ticketId,
//       userId,
//       movieId,
//       theaterId,
//       screen: Number(screen),
//       date,
//       time,
//       seats,
//       totalPrice,
//       paymentId: razorpay_payment_id,
//       readableDateTime,
//       status,
//     };

//     const ticket = {
//       id:ticketId,
//       bookingId,
//       ticketId,
//       movieId,
//       theaterId,
//       screen: Number(screen),
//       date,
//       time,
//       seats,
//       totalPrice,
//       paymentId: razorpay_payment_id,
//       userId,
//       createdAt,
//       moviePoster: "",
//       movieTitle: "",
//       language: "",
//       status,
//     };

//     db.bookings = db.bookings || [];
//     db.tickets = db.tickets || [];
//     db.movies = db.movies || [];
//     db.theaters = db.theaters || [];

//     db.bookings.push(booking);

//     const movie = db.movies.find((m: Movie) => String(m.id) === String(movieId));
//     if (movie) {
//       ticket.moviePoster = movie.poster || "";
//       ticket.movieTitle = movie.title || "";
//       ticket.language = movie.language || "";
//     }

//     db.tickets.push(ticket);

//     const theater = db.theaters.find((t: Theater) => String(t.id) === String(theaterId));
//     if (theater) {
//       const theaterMovie = theater.movies?.find(
//         (m: Theater) => String(m.movieId) === String(movieId)
//       );
      
//       if (theaterMovie) {
//         const screenObj = theaterMovie.screens?.find(
//           (s: TheaterScreen) => s.screen === Number(screen)
//         );
        
//         if (screenObj) {
//           screenObj.seats = screenObj.seats || {};
//           screenObj.seats[date] = screenObj.seats[date] || {};
//           screenObj.seats[date][time] = screenObj.seats[date][time] || [];

//           const existing = new Set(screenObj.seats[date][time]);
//           seats.forEach((s: string) => existing.add(s));
//           screenObj.seats[date][time] = Array.from(existing);
//         }
//       }
//     }

//     writeDB(db);

//     const API_URL = process.env.NEXT_PUBLIC_API_URL;
//     if (API_URL && theater) {
//       try {
//         await fetch(`${API_URL}/theaters/${theaterId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(theater),
//         });
//         console.log("Theater updated in JSON Server");
//       } catch (error) {
//         console.error("Failed to update JSON Server:", error);
//       }
//     }

//     console.log("Booking created successfully:", bookingId);

//     return NextResponse.json({ bookingId, ticketId });
//   } catch (err: any) {
//     console.error("Booking error:", err);
//     return NextResponse.json(
//       { error: err.message || "Booking failed" },
//       { status: 500 }
//     );
//   }
// }