import { Suspense } from "react";
import TicketPageClient from "./ticketClient";
export const dynamic = "force-dynamic";

export default function TicketPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
    <TicketPageClient />
     </Suspense>
  );
}
