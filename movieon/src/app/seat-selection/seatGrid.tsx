"use client";

import React from "react";

interface SeatGridProps {
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  bookedSeats: string[];
  screen: number;
}

export default function SeatGrid({
  selectedSeats,
  setSelectedSeats,
  bookedSeats,
  screen,
}: SeatGridProps) {
  const rows = "ABCDEFGHIJ".split("");
  const lastRow = "K";

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const renderSeat = (seatId: string, seatNumber: number) => {
  const isSelected = selectedSeats.includes(seatId);
  const isBooked = bookedSeats.includes(seatId);

  return (
    <button
      key={seatId}
      disabled={isBooked}
      onClick={() => toggleSeat(seatId)}
      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
        rounded-xl font-semibold text-sm transition-all duration-200

        ${isBooked
          ? "bg-red-600/80 text-white cursor-not-allowed opacity-60 shadow-inner"
          : isSelected
          ? "bg-green-500 text-white shadow-xl scale-105"
          : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105"
        }

        shadow-[0_4px_10px_rgba(0,0,0,0.4)]
      `}
      style={{
        borderBottom: "4px solid rgba(0,0,0,0.4)", 
        borderTop: "2px solid rgba(255,255,255,0.12)",
      }}
    >
      {seatNumber}
    </button>
  );
};


  return (
    <div className="w-full px-6 md:px-20 mt-10 mb-32">
      {/* SCREEN */}
      <div className="relative w-full flex justify-center mb-20 md:mb-24">
        <div className="bg-gray-600 w-2/3 h-2 rounded-b-full shadow-[0_8px_30px_rgba(255,255,255,0.2)]"></div>
        <span className="absolute top-3 text-gray-300 text-sm tracking-widest">
          {`SCREEN ${screen}`}
        </span>
      </div>

      <div className="w-full flex flex-col items-center gap-6">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-6">

            <span className="w-6 text-gray-300 text-sm text-center">{row}</span>

            <div className="flex gap-6">

              <div className="grid grid-cols-2 gap-9">
                {[1, 2].map((num) => renderSeat(`${row}${num}`, num))}
              </div>
              <div className="w-10 md:w-16"></div>
              <div className="grid grid-cols-6 gap-12">
                {[3,4, 5, 6, 7, 8,].map((num) =>
                  renderSeat(`${row}${num}`, num)
                )}
              </div>
              <div className="w-10 md:w-16"></div>
              <div className="grid grid-cols-2 gap-10">
                {[ 9, 10].map((num) => renderSeat(`${row}${num}`, num))}
              </div>
            </div>

            {/* <span className="w-6 text-gray-300 text-sm text-center">{row}</span>  */}
          </div>
        ))}

        <div className="flex items-center gap-6 mt-8">
          <span className="w-6 text-gray-300 text-sm text-center">{lastRow}</span>

          <div className="grid grid-cols-9 md:grid-cols-18 gap-3 mr-4">
            {Array.from({ length: 18 }, (_, i) => {
              const num = i + 1;
              return renderSeat(`${lastRow}${num}`, num);
            })}
          </div>

          {/* <span className="w-6 text-gray-300 text-sm text-center">{lastRow}</span> */}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center mt-14 gap-10 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-800 border border-gray-600 rounded"></div>
          <span className="text-gray-300">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span className="text-gray-300">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-700 rounded opacity-70"></div>
          <span className="text-gray-300">Booked</span>
        </div>
      </div>
    </div>
  );
}
