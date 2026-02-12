import React, { Suspense } from 'react'
import ShowtimeManageClient from './showtimeClient'
export const dynamic = "force-dynamic";

function Showtime() {
  return (
     <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
       <ShowtimeManageClient />
    
      </Suspense>
  )
}

export default Showtime
