"use client";
type Props = {
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
};
import { X, AlertTriangle } from "lucide-react";

function CancelConfirm({
  title = "Cancel Ticket",
  description = "This action cannot be undone. Your seat will be released.",
  onClose,
  onConfirm,
}:Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/15 text-red-500">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-5 h-px bg-zinc-800" />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Keep Ticket
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-500"
          >
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelConfirm
