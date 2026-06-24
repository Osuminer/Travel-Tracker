"use client";

import { useRouter } from "next/navigation";
import { TRIP_STATUSES } from "@/lib/types";
import Select from "./ui/Select";

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
    <Select value={status} onChange={handleChange} className="text-sm px-2 py-1">
      {TRIP_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
