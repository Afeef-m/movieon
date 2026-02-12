"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditProfile from "./editProfile";
import { MoveLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };
  const handleBack = () => {
    router.replace("/");
  };
  return (
    <>
      {editOpen && <EditProfile onClose={() => setEditOpen(false)} />}

      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-28 px-4">
        <div className="w-full max-w-2xl mb-4">
          <MoveLeft
            size={24}
            onClick={handleBack}
            className="cursor-pointer bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition h-5 w-8"
          />
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <div className="flex items-center gap-6">
            <Image
              src={user.profileImage || "/user-profile.svg"}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
            />

            <div className="flex gap-3">
              <h2 className="text-3xl font-bold">{user.firstName}</h2>
              <h2 className="text-3xl font-bold">{user.lastName}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="font-semibold">
                {user.phone || (
                  <span className="text-gray-500">Not provided</span>
                )}
              </p>
            </div>

            <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
              <p className="text-gray-400 text-sm">Age</p>
              <p className="font-semibold">
                {user.age || (
                  <span className="text-gray-500">Not provided</span>
                )}
              </p>
            </div>

            <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
              <p className="text-gray-400 text-sm">Place</p>
              <p className="font-semibold">
                {user.place || (
                  <span className="text-gray-500">Not provided</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
