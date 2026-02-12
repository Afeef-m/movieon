"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Ticket, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, hydrated } = useAuthStore();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleProfileClick = () => {
    setOpen(!open);
  };
  const isProtectedDashboardRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/manager");
  if (isProtectedDashboardRoute) {
    return null;
  }
  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/auth/login");
  };

  if (!hydrated) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-black/30 backdrop-blur-md shadow z-50" />
    );
  }

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3
             bg-black/30 backdrop-blur-md shadow"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/Logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-md"
        />
        <h2 className="text-2xl font-bold text-white">MOVION</h2>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center gap-3">
        {!isAuthenticated ? (
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-4 py-1 text-white border border-white rounded-lg hover:bg-white hover:text-black transition"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/auth/register")}
              className="px-4 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div ref={dropdownRef} className="relative">
            {/* Profile Trigger */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-white/10 transition"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-yellow-500 transition">
                <Image
                  src={user?.profileImage || "/user-profile.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>

              <span className="text-sm text-gray-300 font-medium hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 text-white rounded-lg shadow-lg py-2 border border-slate-700 z-10">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-700 transition"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>

                <p className="px-4 py-2 text-sm text-gray-300 border-b border-slate-700">
                  Hello,{" "}
                  <span className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                </p>

                <button
                  onClick={() => {
                    router.push("/user/profile");
                    setOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-slate-700 transition gap-2"
                >
                  <User className="h-4 w-4 text-gray-300" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    router.push("/my-tickets");
                    setOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 hover:bg-slate-700 transition gap-2"
                >
                  <Ticket className="h-4 w-4 text-gray-300" />
                  <span>My Tickets</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 hover:bg-red-600/40 text-red-400 transition gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
