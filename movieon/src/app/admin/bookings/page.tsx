// app/admin/bookings/page.tsx
import { Suspense } from "react";
import BookingsClient from "./bokingsClient";
export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
      <BookingsClient />
    </Suspense>
  );
}
