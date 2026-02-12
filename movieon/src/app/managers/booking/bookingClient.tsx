"use client"
import React from 'react'
import ManagerBookingsPage from '../components/ManagerBookingsPage'

export default function BookingClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Bookings</h1>
      <ManagerBookingsPage />
    </div>
  )
}


