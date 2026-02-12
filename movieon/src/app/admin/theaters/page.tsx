import { Suspense } from "react";
import TheatersClient from "./theatersClient";
export const dynamic = "force-dynamic";

export default function TheaterPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
    <TheatersClient />
     </Suspense>
  );
}
