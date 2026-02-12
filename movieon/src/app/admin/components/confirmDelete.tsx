"use client";

import { X, Trash2 } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDelete({
  title = "Confirm",
  description = "Are you sure?",
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700 rounded-md">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
