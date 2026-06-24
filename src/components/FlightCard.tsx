"use client";

import { useRouter } from "next/navigation";
import ConfirmButton from "./ui/ConfirmButton";
import Card from "./ui/Card";

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
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
          <span aria-hidden>✈️</span>
          {flight.airline} {flight.flightNumber && `· ${flight.flightNumber}`}
        </div>
        <ConfirmButton onConfirm={handleDelete} />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-200 font-medium">
        <span>{flight.departureAirport}</span>
        <span aria-hidden className="text-slate-500">
          →
        </span>
        <span>{flight.arrivalAirport}</span>
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
    </Card>
  );
}
