"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TRIP_STATUSES } from "@/lib/types";

export default function TripForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PLANNED");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
          status,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("PLANNED");
        setOpen(false);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500"
      >
        + New Trip
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-700 rounded-lg p-4 flex flex-col gap-3 bg-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-slate-100">New Trip</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
      </div>
      <input
        required
        placeholder="Trip name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
      />
      <div className="flex gap-3">
        <label className="flex flex-col text-sm flex-1 text-slate-300">
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm flex-1 text-slate-300">
          End date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-3 py-2"
          />
        </label>
      </div>
      <label className="flex flex-col text-sm text-slate-300">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-3 py-2"
        >
          {TRIP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Trip"}
      </button>
    </form>
  );
}
