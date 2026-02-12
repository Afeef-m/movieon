import { Suspense } from "react";
import ManagerRevenuePage from "./revenueClient";
export const dynamic = "force-dynamic";

export default function ManagerPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
    <ManagerRevenuePage />
     </Suspense>
  );
}