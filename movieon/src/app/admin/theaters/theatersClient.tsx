"use client"
import React from 'react'
import TheaterTable from '../components/theaterTable'

export default function TheatersClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Theaters</h1>
      <TheaterTable />
    </div>
  )
}


