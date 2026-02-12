
import React, { Suspense } from 'react'
import ManagerMovieClient from './managerMovieClient'
export const dynamic = "force-dynamic";

export default function MovieManagement() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
    <ManagerMovieClient />
     </Suspense>
  )
}


