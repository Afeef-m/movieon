// app/admin/bookings/BookingsClient.tsx
"use client";

import BookingTable from "../components/bookingTable";

export default function BookingsClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Bookings</h1>
      <BookingTable />
    </div>
  );
}
