import { Suspense } from "react";
import SeatSelectPageClient from "./seatsectionClient";
export const dynamic = "force-dynamic";

export default function SeatSelectionPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
    <SeatSelectPageClient />
     </Suspense>
  );
}
