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


// "use client";

// import { useState, useEffect } from "react";
// import api from "@/app/lib/axios";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";

// export default function LoginPage() {
//   const router = useRouter();
//   const search = useSearchParams();

//   const redirect = search.get("redirect") || "/";
//   const registered = search.get("registered");

//   const { login, isAuthenticated, user } = useAuthStore();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (registered) {
//       toast.success("Registration successful! Please login.");
//     }
//   }, [registered]);

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       if (user.role === "admin") router.push("/admin/admin-dashboard");
//       else router.push(redirect);
//     }
//   }, [isAuthenticated, user, redirect, router]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!form.email || !form.password) {
//       setError("Email and password are required");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Fetch by email only (safer)
//       const res = await api.get(`/api/users?email=${form.email}`);
//       const found = res.data[0];

//       if (!found || found.password !== form.password) {
//         setError("Invalid email or password");
//         setLoading(false);
//         return;
//       }

//       login(found);

//       toast.success("Login successful!");

//       if (found.role === "admin") {
//         router.push("/admin/admin-dashboard");
//       } else {
//         router.push(redirect);
//       }
//     } catch {
//       setError("Login failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // Load Google Identity Services
//       const { google } = window as any;

//       if (!google) {
//         setError("Google Sign-In not available");
//         setLoading(false);
//         return;
//       }

//       // Initialize Google Sign-In
//       google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//         callback: handleGoogleCallback,
//       });

//       // Trigger Google Sign-In popup
//       google.accounts.id.prompt();
//     } catch (err) {
//       setError("Google Sign-In failed. Please try again.");
//       setLoading(false);
//     }
//   };

//   const handleGoogleCallback = async (response: any) => {
//     try {
//       // Decode the JWT token from Google
//       const credential = response.credential;
//       const payload = JSON.parse(atob(credential.split(".")[1]));

//       const googleUser = {
//         email: payload.email,
//         name: payload.name,
//         picture: payload.picture,
//         googleId: payload.sub,
//       };

//       // Check if user exists in your database
//       const res = await api.get(`/api/users?email=${googleUser.email}`);
//       let user = res.data[0];

//       if (!user) {
//         // Create new user if doesn't exist
//         const newUser = {
//           email: googleUser.email,
//           name: googleUser.name,
//           picture: googleUser.picture,
//           googleId: googleUser.googleId,
//           role: "user",
//           createdAt: new Date().toISOString(),
//         };

//         const createRes = await api.post("/api/users", newUser);
//         user = createRes.data;
//       }

//       login(user);
//       toast.success("Login successful!");

//       if (user.role === "admin") {
//         router.push("/admin/admin-dashboard");
//       } else {
//         router.push(redirect);
//       }
//     } catch (err) {
//       setError("Failed to authenticate with Google");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load Google Identity Services script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
//       <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-xl">
//         <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

//         {error && (
//           <p className="text-red-400 bg-red-500/20 p-2 rounded mb-4 text-center">
//             {error}
//           </p>
//         )}

//         <div className="space-y-5">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 rounded bg-slate-800 outline-none"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 rounded bg-slate-800 outline-none pr-12"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </div>

//         <div className="mt-6 relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-700"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-slate-900 text-gray-400">Or continue with</span>
//           </div>
//         </div>

//         <button
//           onClick={handleGoogleLogin}
//           disabled={loading}
//           className="mt-6 w-full bg-white text-gray-900 p-3 rounded font-semibold hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24">
//             <path
//               fill="currentColor"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="currentColor"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           Sign in with Google
//         </button>

//         <p className="mt-4 text-center text-gray-400">
//           Don't have an account?{" "}
//           <Link href="/auth/register" className="text-yellow-400 hover:underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
