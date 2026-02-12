"use client"

import React from 'react'
import MovieManagerTable from '../components/movieManagement/movieTable'

export default function ManagerMovieClient() {
  return (
    <div className="p-6">
         <h1 className="text-2xl font-semibold mb-6">Movie Management</h1>
         <MovieManagerTable />
       </div>
  )
}


