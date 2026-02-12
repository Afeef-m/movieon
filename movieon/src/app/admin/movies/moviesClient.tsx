"use client"
import React from 'react'
import MovieTable from '../components/movieTable'

export default function MoviesClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Movies Mangement</h1>
      < MovieTable />
    </div>
  )
}