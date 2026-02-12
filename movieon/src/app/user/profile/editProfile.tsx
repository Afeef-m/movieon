"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/app/lib/axios";
import Image from "next/image";

interface Props {
  onClose: () => void;
}

export default function EditProfile({ onClose }: Props) {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    place: "",
    password: "",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone?.toString() || "",
        age: user.age?.toString() || "",
        place: user.place || "",
        password: "",
        profileImage: user.profileImage || "",
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setForm((prev) => ({ ...prev, profileImage: "" })); // We'll upload this separately
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      setError("First name, last name, and email are required.");
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail.com$/.test(form.email)) {
      setError("Invalid email format.");
      return false;
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      setError("Phone must be exactly 10 digits.");
      return false;
    }
    if (form.age && !/^\d+$/.test(form.age)) {
      setError("Age must be numeric.");
      return false;
    }
    if (form.password && !/^(?=.*[A-Za-z])(?=.*\d).{4,}$/.test(form.password)) {
      setError("Password must be at least 4 characters, include letters and numbers.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      let profileImageUrl = user.profileImage || "";
      if (imagePreview && form.profileImage === "") {
        profileImageUrl = imagePreview;
      }

      const updatedUser = {
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone ? Number(form.phone) : undefined,
        age: form.age ? Number(form.age) : undefined,
        place: form.place || "",
        profileImage: profileImageUrl,
        password: form.password || user.password, 
      };

      await axios.put(`/users/${user.id}`, updatedUser);

      updateUser(updatedUser);

      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4 overflow-auto">
      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative">

        <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit Profile</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold hover:text-yellow-400"
        >
          &times;
        </button>

        <div className="flex flex-col gap-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={imagePreview || "/user-profile.svg"}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full shadow-md"
            />
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="text-sm text-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="text"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              value={form.place}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="p-2 rounded-lg bg-slate-700 text-white w-full"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
