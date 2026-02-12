import React, { Suspense } from 'react'
import BookingClient from './bookingClient';
export const dynamic = "force-dynamic";

export default function ManagerBookings() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
   <BookingClient />
     </Suspense>
  )
}


