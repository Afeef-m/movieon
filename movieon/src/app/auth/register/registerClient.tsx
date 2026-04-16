"use client";

import React, { useState } from "react";
import api from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPageClient() {
  const [form, setForm] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!form.firstName || !form.email || !form.password) {
    setError("Fill the required fields");
    return;
  }

  try {
    await api.post("/auth/register", {
      firstName: form.firstName,
      email: form.email,
      password: form.password,
    });

    router.push("/auth/login?registered=1");

  } catch (err: any) {
    setError(err?.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <p className="text-red-400 bg-red-500/20 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 rounded bg-slate-800 outline-none"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 rounded bg-slate-800 outline-none"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-12 rounded bg-slate-800 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-yellow-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
