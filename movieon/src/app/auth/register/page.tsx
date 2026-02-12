import React, { Suspense } from 'react'
import RegisterPageClient from './registerClient'

export default function RegisterPage() {
  return (
   <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
   <RegisterPageClient />
    </Suspense>
  )
}


