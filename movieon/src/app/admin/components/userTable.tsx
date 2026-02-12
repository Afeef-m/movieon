"use client";

import { useEffect, useState } from "react";
import axios from "@/app/lib/axios";
import { User, Theater } from "@/types/index";
import { Loader2, ShieldCheck, Ban, Search, Undo2 } from "lucide-react";
import ConfirmDelete from "./confirmDelete";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"customers" | "managers">(
    "customers"
  );
  const [search, setSearch] = useState("");

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [usersRes, theaterRes] = await Promise.all([
        axios.get("/users"),
        axios.get("/theaters"),
      ]);

      setUsers(usersRes.data);
      setTheaters(theaterRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);
  async function updateRole(id: string, newRole: "user" | "manager") {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    await axios.patch(`/users/${id}`, { role: newRole });

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }

  async function toggleBlock(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus = !user.blocked;

    await axios.patch(`/users/${id}`, { blocked: newStatus });

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, blocked: newStatus } : u))
    );
  }

  async function deleteUser(id: string) {
    await axios.delete(`/users/${id}`);

    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const filteredUsers = users.filter(
    (u) =>
      (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4 w-full max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            activeTab === "customers"
              ? "bg-yellow-600 text-white"
              : "bg-white/10 text-gray-300"
          }`}
        >
          Customers
        </button>

        <button
          onClick={() => setActiveTab("managers")}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            activeTab === "managers"
              ? "bg-yellow-600 text-white"
              : "bg-white/10 text-gray-300"
          }`}
        >
          Managers
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-white">
          <thead className="bg-white/10 text-center w-[150px]">
            <tr>
              <th className="p-3">Fist Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 ">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers
              .filter((u) =>
                activeTab === "customers"
                  ? u.role === "user"
                  : u.role === "manager"
              )
              .map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/10 hover:bg-white/5 text-center w-[150px]"
                >
                  <td className="p-3">{u.firstName}</td>
                  <td className="p-3">{u.lastName}</td>
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    {u.role === "manager" ? (
                      <span className="text-yellow-400 font-semibold">
                        Manager
                      </span>
                    ) : (
                      <span className="text-blue-400 font-semibold">User</span>
                    )}
                  </td>

                  <td className="p-3">
                    {u.blocked ? (
                      <span className="text-red-400">Blocked</span>
                    ) : (
                      <span className="text-green-400">Active</span>
                    )}
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    {u.role === "user" ? (
                      <button
                        title="Promote to Manager"
                        onClick={() => updateRole(u.id, "manager")}
                        className="p-2 rounded bg-blue-500 hover:bg-blue-600"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    ) : (
                      <button
                        title="Demote to User"
                        onClick={() => updateRole(u.id, "user")}
                        className="p-2 rounded bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Undo2 size={16} />
                      </button>
                    )}

                    <button
                      title={u.blocked ? "Unblock" : "Block"}
                      onClick={() => toggleBlock(u.id)}
                      className={`p-2 rounded ${
                        u.blocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <Ban size={16} />
                    </button>

                    <button
                      title="Delete User"
                      onClick={() => {
                        setDeleteUserId(u.id);
                        setDeleteUserName(`${u.firstName} ${u.lastName}`);
                      }}
                      className="p-2 rounded bg-red-700 hover:bg-red-800"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {deleteUserId && (
          <ConfirmDelete
            title="Delete User"
            description={`Are you sure you want to delete "${deleteUserName}"? This action cannot be undone.`}
            onClose={() => {
              setDeleteUserId(null);
              setDeleteUserName("");
            }}
            onConfirm={() => {
              deleteUser(deleteUserId);
              setDeleteUserId(null);
              setDeleteUserName("");
            }}
          />
        )}

        {filteredUsers.filter((u) =>
          activeTab === "customers" ? u.role === "user" : u.role === "manager"
        ).length === 0 && (
          <p className="text-center text-gray-400 py-4">No users found.</p>
        )}
      </div>
    </div>
  );
}
