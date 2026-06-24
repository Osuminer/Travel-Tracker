"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Card from "./ui/Card";

export default function FlightForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [airline, setAirline] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [seat, setSeat] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!airline || !departureAirport || !arrivalAirport || !departureTime)
      return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline,
          flightNumber: flightNumber || undefined,
          departureAirport,
          arrivalAirport,
          departureTime,
          arrivalTime: arrivalTime || undefined,
          confirmationCode: confirmationCode || undefined,
          seat: seat || undefined,
          notes: notes || undefined,
        }),
      });
      if (res.ok) {
        setAirline("");
        setFlightNumber("");
        setDepartureAirport("");
        setArrivalAirport("");
        setDepartureTime("");
        setArrivalTime("");
        setConfirmationCode("");
        setSeat("");
        setNotes("");
        setOpen(false);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Add Flight</Button>;
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-slate-100">Add Flight</h3>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            ✕
          </Button>
        </div>

        <div className="flex gap-3">
          <Input
            required
            placeholder="Airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Flight #"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="w-28"
          />
        </div>

        <div className="flex gap-3">
          <Input
            required
            placeholder="Departure airport (e.g. JFK)"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
            className="flex-1"
          />
          <Input
            required
            placeholder="Arrival airport (e.g. LAX)"
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex gap-3">
          <label className="flex flex-col text-sm flex-1 text-slate-300 gap-1">
            Departure time
            <Input
              required
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-sm flex-1 text-slate-300 gap-1">
            Arrival time
            <Input
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </label>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Seat"
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
            className="w-24"
          />
        </div>

        <Textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Flight"}
        </Button>
      </form>
    </Card>
  );
}
