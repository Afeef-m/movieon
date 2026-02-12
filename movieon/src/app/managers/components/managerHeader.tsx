"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Menu } from "lucide-react";
import React from "react";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function ManagerHeader({ toggleSidebar }: AdminHeaderProps) {
  const { user } = useAuthStore();
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

        <h1 className="text-xl font-semibold ml-auto md:ml-0">
          Welcome back,
          <span className="text-primary ml-2">
            {user?.firstName || "Manager"} Theater
          </span>
        </h1>

        <div className="ml-auto"></div>
      </div>
    </header>
  );
}
