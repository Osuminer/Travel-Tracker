"use client";

import { useState } from "react";

interface ConfirmButtonProps {
  onConfirm: () => Promise<void> | void;
  label?: string;
  confirmLabel?: string;
  className?: string;
}

export default function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm?",
  className = "",
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`text-slate-400 hover:text-red-400 text-sm ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await onConfirm();
          setBusy(false);
          setConfirming(false);
        }}
        className="text-red-400 font-medium hover:text-red-300 disabled:opacity-50"
      >
        {busy ? "..." : confirmLabel}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => setConfirming(false)}
        className="text-slate-500 hover:text-slate-300"
      >
        Cancel
      </button>
    </span>
  );
}
