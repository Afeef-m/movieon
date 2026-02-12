import { Suspense } from "react";
import MovieTable from "../components/movieTable";
export const dynamic = "force-dynamic";

export default function MoviesPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
      <MovieTable />
     </Suspense>
  );
}
