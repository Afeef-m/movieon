import React from 'react'
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import AdminDashboardPage from '../components/adiminDashboard'

export default function AdiminDashboard() {
  return (
     <Suspense fallback={<Loading />}>
       <AdminDashboardPage />
     </Suspense>
  )
}


function Loading() {
  return (
    <div className="flex justify-center items-center h-[50vh] text-gray-400">
      Loading dashboard...
    </div>
  );
}