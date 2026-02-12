"use client"

import React, { useState } from "react";
import ProtectedRoute from "../components/protectedroute";
import ManagerSidebar from "./components/managerSidebar";
import ManagerHeader from "./components/managerHeader";
export const dynamic = 'force-dynamic';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen((prev) => !prev);
   const closeSidebar = () => setOpen(false);
  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="flex min-h-screen bg-[#111] text-white">

        <ManagerSidebar isOpen={open} onClose={closeSidebar}/>
        <div   className={` flex flex-col flex-1 transition-all duration-300
            ${open ? "md:ml-64" : "md:ml-64"}`}>
          <ManagerHeader toggleSidebar={toggleSidebar} />

          <main className="p-6">
              {children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
