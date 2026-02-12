import React, { Suspense } from 'react'
export const dynamic = "force-dynamic";
import ManagerDashboard from '../components/managerDashboard'

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ManagerDashboard />
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

