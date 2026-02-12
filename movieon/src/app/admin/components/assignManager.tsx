"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { Theater } from "@/types";
import { Manager } from "@/types/manager-index";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  theater: Theater;
  onClose: () => void;
  onAssigned: (managerId: string) => void;
}

export default function AssignManager({ theater, onClose, onAssigned }: Props) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selected, setSelected] = useState<string>(theater.managerId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadManagers() {
      try {
        const res = await api.get("/users?role=manager");
        setManagers(res.data);
      } catch (err) {
        console.error("Error fetching managers:", err);
      }
    }
    loadManagers();
  }, []);
if (theater.managerId && theater.managerId !== selected) {
   if (!confirm("This will replace the current manager. Continue?")) return;
}

  const handleAssign = async () => {
    if (!selected) return;

    try {
      setLoading(true);

      if (theater.managerId && theater.managerId !== selected) {
        await api.patch(`/users/${theater.managerId}`, {
          theaterId: null,
        });
      }

      await api.patch(`/users/${selected}`, {
        theaterId: theater.id,
      });

      await api.patch(`/theaters/${theater.id}`, {
        managerId: selected,
      });

      toast.success("Manager Assigned Successfully");

      onAssigned(selected);
      onClose();
    } catch (err) {
      console.error("Assign Manager Failed:", err);
      toast.error("Failed to assign manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Assign Manager to {theater.name}
          </h2>
          <button onClick={onClose}>
            <X className="text-zinc-400 hover:text-white" />
          </button>
        </div>

        <select
          className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 mb-4"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option>Select Manager</option>

          {managers.map((m) => {
            const isCurrentManager = m.id === theater.managerId;
            const isAlreadyAssigned = m.theaterId && m.theaterId !== theater.id;

            return (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.email})
                {isCurrentManager
                  ? " — Current Manager"
                  : isAlreadyAssigned
                  ? " — Already Assigned"
                  : ""}
              </option>
            );
          })}
        </select>

        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
            onClick={handleAssign}
            disabled={!selected || loading}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
