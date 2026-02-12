import { Suspense } from "react";
import UsersClient from "./usersClient";
export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
      <UsersClient />
     </Suspense>
  );
}
