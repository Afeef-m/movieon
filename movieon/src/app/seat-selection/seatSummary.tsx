"use client";

import React from "react";
import Image from "next/image";

interface SeatSummaryProps {
  movie: {
    title: string;
    poster: string;
    ticketPrice: number;
  };
  selectedSeats: string[];
  selectedDate: string;
  selectedTime: string;
  screen: number;
  onProceed: () => void;
  processing?: boolean;
}

const SeatSummary: React.FC<SeatSummaryProps> = ({
  movie,
  selectedSeats,
  selectedDate,
  selectedTime,
  screen,
  onProceed,
  processing = false,
}) => {
  const total = selectedSeats.length * movie.ticketPrice;

  return (
    <div className="
    
      w-full 
      bg-[#0f1115] 
      rounded-xl 
      p-5 
      text-white 
      space-y-5 
      border 
      border-white/10 
      flex-shrink-0
      md:max-w-xs 
    ">
      <div className="flex gap-3 items-center">
        <div className="w-[60px] sm:w-[70px]">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={70}
            height={100}
            className="rounded-lg object-cover w-full h-auto"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 mt-1">Screen {screen}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm sm:text-base">
        <div>
          <p className="text-gray-400 text-sm">Date</p>
          <p className="font-medium break-words">{selectedDate}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Time</p>
          <p className="font-medium break-words">{selectedTime}</p>
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm">Selected Seats</p>
        <p className="font-semibold text-base sm:text-lg break-words">
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "No seats selected"}
        </p>
      </div>

      <div className="border-t border-white/10 pt-4 space-y-3 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-gray-300">Ticket Price</span>
          <span>₹{movie.ticketPrice}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">
            Seats × {selectedSeats.length}
          </span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between text-xl font-bold text-yellow-400">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={selectedSeats.length === 0 || processing}
        className="
          w-full 
          bg-yellow-500 
          hover:bg-yellow-600 
          disabled:bg-gray-600 
          disabled:cursor-not-allowed 
          py-3 
          rounded-xl 
          font-semibold 
          transition
          flex
          items-center
          justify-center
          gap-2
        "
      >
        {processing ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          "Proceed to Payment"
        )}
      </button>
    </div>
  );
};

export default SeatSummary;