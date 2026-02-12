"use client";

import { useState } from "react";
import ProtectedRoute from "../components/protectedroute";
import AdminSidebar from "./components/adminSidebar";
import AdminHeader from "./components/adminHeader";
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const closeSidebar = () => setOpen(false);
  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-[#111] text-white">
        
        <AdminSidebar isOpen={open} onClose={closeSidebar} />

        <div className={`flex flex-col flex-1 transition-all duration-300
            ${open ? "md:ml-64" : "md:ml-64"}`} >
          <AdminHeader toggleSidebar={toggleSidebar} />

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}