"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "@/app/lib/axios";
import SeatGrid from "./seatGrid";
import SeatSummary from "./seatSummary";
import SeatHeader from "./seatHeader";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Movie,
  Theater,
  RazorpayOrderResponse,
  RazorpayCheckoutOptions,
  RazorpaySuccessResponse,
} from "@/types";
import { Loader2Icon } from "lucide-react";
import { isPastTimeToday, isPastDate, timeToMinutes } from "@/utils/dateTime";

interface SeatState {
  selectedSeats: string[];
  selectedDate: string;
  selectedTime: string;
  selectedScreen: number;
}

export default function SeatSelectPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const movieId = search.get("movieId") || "";
  const theaterId = search.get("theaterId") || "";
  const queryDate = search.get("date") || "";
  const queryTime = search.get("time") || "";
  const queryScreen = Number(search.get("screen")) || 1;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);

  const user = useAuthStore((state) => state.user);

  const [seatState, setSeatState] = useState<SeatState>({
    selectedSeats: [],
    selectedDate: queryDate,
    selectedTime: queryTime,
    selectedScreen: queryScreen,
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!theaterId || !movieId) return;
    const key = `seat-selection:${theaterId}:${movieId}`;

    if (seatState.selectedSeats.length > 0) {
      localStorage.setItem(
        key,
        JSON.stringify({ ...seatState, timestamp: Date.now() }),
      );
    } else {
      localStorage.removeItem(key);
    }
  }, [seatState, theaterId, movieId]);

  useEffect(() => {
    if (!movieId || !theaterId) return;

    const fetchData = async () => {
      try {
        const [movieRes, theaterRes] = await Promise.all([
          axios.get(`/movies/${movieId}`),
          axios.get(`/theaters/${theaterId}`),
        ]);
        setMovie(movieRes.data);
        setTheater(theaterRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking info");
      }
    };

    fetchData();
  }, [movieId, theaterId]);

  useEffect(() => {
    const key = `seat-selection:${theaterId}:${movieId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return;

    try {
      const data: Partial<SeatState> & { timestamp?: number } =
        JSON.parse(saved);
      if (
        data.selectedDate === queryDate &&
        data.selectedTime === queryTime &&
        data.selectedScreen === queryScreen
      ) {
        const now = Date.now();
        const selectionAge = data.timestamp ? now - data.timestamp : 0;
        const maxAge = 10 * 60 * 1000;
        if (selectionAge > maxAge) {
          localStorage.removeItem(key);
          toast.error("Previous seat selection expired. Select again.");
          return;
        }

        setSeatState((prev) => ({
          ...prev,
          selectedSeats: data.selectedSeats ?? [],
          selectedDate: data.selectedDate ?? queryDate,
          selectedTime: data.selectedTime ?? queryTime,
          selectedScreen: data.selectedScreen ?? queryScreen,
        }));

        if (data.selectedSeats?.length) {
          const minutesAgo = Math.floor(selectionAge / 60000);
          toast.success(
            `${data.selectedSeats.length} seat(s) restored from ${minutesAgo} minute(s) ago`,
          );
        }
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem(key);
    }
  }, [movieId, theaterId, queryDate, queryTime, queryScreen]);

  const theaterMovie = theater?.movies?.find(
    (m) => String(m.movieId) === String(movieId),
  );
  const screenObj = theaterMovie?.screens?.find(
    (s) => s.screen === seatState.selectedScreen,
  );
  const bookedSeats: string[] =
    screenObj?.seats?.[seatState.selectedDate]?.[seatState.selectedTime] ?? [];

  const currentUrl = `${pathname}${search ? "?" + search.toString() : ""}`;

  const selectedDay = theaterMovie?.days?.find(
    (d) => d.date === seatState.selectedDate,
  );

  const handleProceed = async () => {
    if (!user) {
      toast.error("Login required to proceed");
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (user.blocked) {
      toast.error("Your account is blocked. Payment is not allowed.");
      return;
    }

    if (seatState.selectedSeats.length === 0) {
      toast.error("Select at least one seat");
      return;
    }

    const alreadyBooked = seatState.selectedSeats.filter((s) =>
      bookedSeats.includes(s),
    );

    if (alreadyBooked.length > 0) {
      toast.error(`Seats ${alreadyBooked.join(", ")} are already booked.`);
      setSeatState((prev) => ({
        ...prev,
        selectedSeats: prev.selectedSeats.filter(
          (s) => !bookedSeats.includes(s),
        ),
      }));
      return;
    }

    const ticketPrice = movie?.ticketPrice ?? 0;
    const amount = seatState.selectedSeats.length * ticketPrice;

    setProcessing(true);
    toast.loading("Creating order...");

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100, currency: "INR" }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const order: RazorpayOrderResponse = await orderRes.json();

      toast.dismiss();

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error("Razorpay key not configured");

      const options: RazorpayCheckoutOptions = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: movie?.title || "Movie Booking",
        description: "Movie Ticket Booking",
        order_id: order.id,

        handler: async (res: RazorpaySuccessResponse) => {
          try {
            toast.loading("Confirming booking...");

            const bookingRes = await fetch("/api/bookings/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_signature: res.razorpay_signature,
                movieId,
                theaterId,
                seats: seatState.selectedSeats,
                date: seatState.selectedDate,
                time: seatState.selectedTime,
                screen: seatState.selectedScreen,
                totalPrice: amount,
                userId: user.id,
                status: "BOOKED",
              }),
            });
            if (!bookingRes.ok) throw new Error("Booking failed");
            const bookingData = await bookingRes.json();

            toast.dismiss();
            toast.success("Booking confirmed!");

            localStorage.removeItem(`seat-selection:${theaterId}:${movieId}`);

            router.push(
              `/ticket?bookingId=${bookingData.bookingId}&ticketId=${bookingData.ticketId}`,
            );
          } catch (err: any) {
            console.error(err);
            toast.dismiss();
            toast.error(err?.message || "Booking failed");
          }
        },

        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone?.toString(),
        },

        theme: { color: "#FACC15" },

        modal: {
          ondismiss: () => {
            toast.dismiss();
            setProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (err: any) {
      console.error(err);
      toast.dismiss();
      toast.error(err?.message || "Payment could not start");
      setProcessing(false);
    }
  };

  if (!theater)
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500 gap-2">
        Loading tickets...
        <Loader2Icon size={20} className="animate-spin" />
      </div>
    );
  if (!movie)
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500 gap-2">
        Loading Movies...
        <Loader2Icon size={20} className="animate-spin" />
      </div>
    );

  return (
    <div className="text-white pb-20 bg-slate-900 min-h-screen">
      <SeatHeader movie={movie} />
      <div className="max-w-6xl mx-auto px-4 mt-5">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {theaterMovie?.screens?.flatMap((screen) => {
            const validTimes = screen.showtimes.filter((time) =>
              selectedDay?.showtimes.includes(time),
            );

            const sortedTimes = validTimes.sort(
              (a, b) => timeToMinutes(a) - timeToMinutes(b),
            );

            return sortedTimes.map((time) => {
              const isActive =
                seatState.selectedTime === time &&
                seatState.selectedScreen === screen.screen;

              const isDisabled =
                isPastDate(seatState.selectedDate) ||
                isPastTimeToday(seatState.selectedDate, time);

              return (
                <button
                  key={`${screen.screen}-${time}`}
                  disabled={isDisabled}
                  onClick={() =>
                    !isDisabled &&
                    setSeatState((prev) => ({
                      ...prev,
                      selectedTime: time,
                      selectedScreen: screen.screen,
                      selectedSeats: [],
                    }))
                  }
                  className={`min-w-[120px] px-4 py-2 rounded-xl border text-center transition-all
            ${
              isDisabled
                ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                : isActive
                  ? "bg-yellow-500 border-yellow-500 text-black font-bold"
                  : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            }
          `}
                >
                  <p className="text-lg">{time}</p>
                  <p className="text-xs opacity-70">Screen {screen.screen}</p>
                </button>
              );
            });
          })}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-5 mt-4">
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-400">Theater</p>
              <p className="font-semibold text-white">{theater.name}</p>
            </div>

            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-semibold text-white">
                {seatState.selectedDate}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Time</p>
              <p className="font-semibold text-white">
                {seatState.selectedTime}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Screen</p>
              <p className="font-semibold text-white">
                {seatState.selectedScreen}
              </p>
            </div>
          </div>
        </div>
      </div>

      {seatState.selectedDate && seatState.selectedTime && (
        <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-5 flex flex-col lg:flex-row gap-10">
          {/* Seat Grid */}
          <div className="flex-1 w-full">
            <SeatGrid
              selectedSeats={seatState.selectedSeats}
              setSelectedSeats={(seats) =>
                setSeatState((prev) => ({ ...prev, selectedSeats: seats }))
              }
              bookedSeats={bookedSeats}
              screen={seatState.selectedScreen}
            />
          </div>

          {/* Desktop Seat Summary */}
          <div className="hidden lg:block w-[350px]">
            <div className="sticky top-28">
              <SeatSummary
                movie={movie}
                selectedSeats={seatState.selectedSeats}
                selectedDate={seatState.selectedDate}
                selectedTime={seatState.selectedTime}
                screen={seatState.selectedScreen}
                onProceed={handleProceed}
                processing={processing}
              />
            </div>
          </div>
        </div>
      )}
      {seatState.selectedDate &&
        seatState.selectedTime &&
        seatState.selectedSeats.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 p-4">
            <SeatSummary
              movie={movie}
              selectedSeats={seatState.selectedSeats}
              selectedDate={seatState.selectedDate}
              selectedTime={seatState.selectedTime}
              screen={seatState.selectedScreen}
              onProceed={handleProceed}
              processing={processing}
            />
          </div>
        )}
    </div>
  );
}
