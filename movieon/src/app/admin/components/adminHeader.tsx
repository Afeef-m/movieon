// src/app/admin/components/adminHeader.tsx
"use client";

import { Menu } from "lucide-react";
import React from "react";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#111] border-b border-zinc-800 p-4 mt-3.5">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-white md:hidden hover:text-zinc-400 transition"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu size={26} />
        </button>

        <h1 className="text-xl font-semibold ml-auto md:ml-0">Admin Dashboard</h1>

        <div className="ml-auto">
        </div>
      </div>
    </header>
  );
}