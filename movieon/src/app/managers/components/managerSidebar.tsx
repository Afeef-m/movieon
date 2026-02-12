"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { MenuItem } from "@/types/manager-index";
import { BadgeIndianRupee, BookMarked, FilmIcon, LayoutDashboard, LogOut, Spotlight, UserCog, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ManagerSidebarProps {
  isOpen: boolean;
  onClose?: () => void; 
}

export default function ManagerSidebar({isOpen, onClose}:ManagerSidebarProps) {
  const pathname = usePathname();
   const handleClose = () => {
    if (onClose) onClose();
  };

  const menu:MenuItem[] = [
    { label: "Dashboard", path: "/managers/manager-dashboard", icon:<LayoutDashboard/> },
    { label: "Movie Manage", path: "/managers/movie", icon:<FilmIcon/> },
    { label: "Showtime Manage", path: "/managers/showtime", icon:<Spotlight/> },
    { label: "Booking Manage", path: "/managers/booking", icon:<BookMarked/> },
    { label: "Revenue", path: "/managers/revenue", icon:<BadgeIndianRupee/> },
    // { label: "Profile", path: "/managers/profile", icon:<UserCog/> },
    
  ];

    const {logout}= useAuthStore  ()
  const handleLogout=()=> {
    logout()
  }
  return (
    <aside
  className={`
    bg-[#0d0d0d] text-white h-screen border-r border-zinc-800 
    fixed top-0 left-0 z-50 transition-all duration-300
    ${isOpen ? "w-64" : "w-0"} md:w-64 overflow-hidden
  `}
>
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

  <div
    className={`
      h-full flex flex-col justify-between
      ${isOpen ? "block" : "hidden md:block"}
    `}
  >
    <nav className="flex flex-col gap-2 px-3 pt-4 overflow-y-auto h-[calc(100vh-80px)]">
      {menu.map((item) => {
        const active = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={handleClose}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg 
              transition-all duration-200 font-medium
              ${active
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 
          hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 "
      >
        <LogOut />
        <span>Logout</span>
      </button>
    </nav>
  </div>
</aside>
  );
}
