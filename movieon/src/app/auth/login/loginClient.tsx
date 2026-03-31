"use client";

import { useState, useEffect } from "react";
import api from "@/app/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPageClient() {
  const router = useRouter();
  const search = useSearchParams();

  const redirect = search.get("redirect") || "/";
  const registered = search.get("registered");

  const { login, isAuthenticated, user } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registered) {
      toast.success("Registration successful! Please login.");
    }
  }, [registered]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/admin-dashboard");
      } else if (user.role === "manager") {
        router.push("/managers/manager-dashboard");
      } else {
        router.push(redirect);
      }
    }
  }, [isAuthenticated, user, redirect, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/users?email=${form.email}`);
      const found = res.data[0];

      if (!found) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (found.status === "blocked" || found.blocked) {
        setError("Your account has been blocked.");
        setLoading(false);
        return;
      }

      if (found.password !== form.password) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      login(found);

      toast.success("Login successful!");

      if (found.role === "admin") {
        router.push("/admin/admin-dashboard");
      } else if (found.role === "manager") {
        router.push("/managers/manager-dashboard");
      } else {
        router.push(redirect);
      }
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <p className="text-red-400 bg-red-500/20 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded bg-slate-800 outline-none pr-12"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-yellow-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
