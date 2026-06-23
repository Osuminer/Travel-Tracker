"use client";

import { useRouter } from "next/navigation";
import { TRIP_STATUSES } from "@/lib/types";

export default function TripStatusSelect({
  tripId,
  status,
}: {
  tripId: string;
  status: string;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await fetch(`/api/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-2 py-1 text-sm"
    >
      {TRIP_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
