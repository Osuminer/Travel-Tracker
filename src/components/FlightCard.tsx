"use client";

import { useRouter } from "next/navigation";

interface FlightCardProps {
  flight: {
    id: string;
    airline: string;
    flightNumber: string | null;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string | Date;
    arrivalTime: string | Date | null;
    confirmationCode: string | null;
    seat: string | null;
    notes: string | null;
  };
}

export default function FlightCard({ flight }: FlightCardProps) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/flights/${flight.id}`, { method: "DELETE" });
    router.refresh();
  }

  const dep = new Date(flight.departureTime);
  const arr = flight.arrivalTime ? new Date(flight.arrivalTime) : null;

  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-800 shadow-sm flex flex-col gap-1">
      <div className="flex items-start justify-between">
        <div className="font-semibold text-slate-100">
          {flight.airline} {flight.flightNumber && `· ${flight.flightNumber}`}
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-400 text-sm"
        >
          Delete
        </button>
      </div>
      <div className="text-sm text-slate-300">
        {flight.departureAirport} → {flight.arrivalAirport}
      </div>
      <div className="text-xs text-slate-500">
        Departs {dep.toLocaleString()}
        {arr && ` · Arrives ${arr.toLocaleString()}`}
      </div>
      {(flight.confirmationCode || flight.seat) && (
        <div className="text-xs text-slate-500">
          {flight.confirmationCode && `Confirmation: ${flight.confirmationCode}`}
          {flight.confirmationCode && flight.seat && " · "}
          {flight.seat && `Seat: ${flight.seat}`}
        </div>
      )}
      {flight.notes && (
        <p className="text-xs text-slate-500 mt-1">{flight.notes}</p>
      )}
    </div>
  );
}
