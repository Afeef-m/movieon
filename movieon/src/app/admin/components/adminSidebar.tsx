"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebarItem } from "@/types/admin-index";
import {
  LayoutDashboard,
  Film,
  Users,
  // IndianRupee,
  X,
  Theater,
  BookMarked,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const sidebarItems: AdminSidebarItem[] = [
    {
      label: "Dashboard",
      path: "/admin/admin-dashboard",
      icon: <LayoutDashboard />,
    },
    { label: "Movies", path: "/admin/movies", icon: <Film /> },
    { label: "Users", path: "/admin/users", icon: <Users /> },
    { label: "Theaters", path: "/admin/theaters", icon: <Theater /> },
    { label: "Bookings", path: "/admin/bookings", icon: <BookMarked /> },
    // { label: "Revenue", path: "/admin/revenue", icon: <IndianRupee /> },
  ];

  const {logout}= useAuthStore()
  const handleLogout=()=> {
    logout()
  }
  return (
   <aside
  className={`
    bg-[#0d0d0d] text-white 
    fixed top-0 left-0 
    h-screen 
    border-r border-zinc-800 
    z-50 transition-all duration-300
    ${isOpen ? "w-64" : "w-0"} 
    md:w-64 
    overflow-hidden
  `}
>
  <div className="h-full flex flex-col overflow-y-auto">

    <div
      className={`
        pt-1 border-b border-zinc-800 pb-4 
        ${isOpen ? "block" : "hidden md:block"}
      `}
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3 mt-3">
          <Image
            src="/Logo.jpg"
            alt="Logo"
            width={45}
            height={45}
            className="rounded-md"
          />
          <h2 className="text-xl font-bold tracking-wide whitespace-nowrap">
            MOVION
          </h2>
        </div>

        <button
          onClick={handleClose}
          className="md:hidden text-white hover:text-zinc-400 transition"
        >
          <X size={26} />
        </button>
      </div>
    </div>

    <nav
      className={`flex flex-col gap-2 px-3 pt-4 ${
        isOpen ? "block" : "hidden md:block"
      }`}
    >
      {sidebarItems.map((item) => {
        const active = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={handleClose}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg font-medium
              transition-all duration-200
              ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 
         hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
      >
        <LogOut />
        <span>Logout</span>
      </button>
    </nav>
  </div>
</aside>

  );
}
