"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmButton from "./ui/ConfirmButton";
import Card from "./ui/Card";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { toDateTimeLocalValue } from "@/lib/datetime";

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
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [airline, setAirline] = useState(flight.airline);
  const [flightNumber, setFlightNumber] = useState(flight.flightNumber ?? "");
  const [departureAirport, setDepartureAirport] = useState(
    flight.departureAirport
  );
  const [arrivalAirport, setArrivalAirport] = useState(flight.arrivalAirport);
  const [departureTime, setDepartureTime] = useState(
    toDateTimeLocalValue(flight.departureTime)
  );
  const [arrivalTime, setArrivalTime] = useState(
    toDateTimeLocalValue(flight.arrivalTime)
  );
  const [confirmationCode, setConfirmationCode] = useState(
    flight.confirmationCode ?? ""
  );
  const [seat, setSeat] = useState(flight.seat ?? "");
  const [notes, setNotes] = useState(flight.notes ?? "");

  async function handleDelete() {
    await fetch(`/api/flights/${flight.id}`, { method: "DELETE" });
    router.refresh();
  }

  function openEdit() {
    setAirline(flight.airline);
    setFlightNumber(flight.flightNumber ?? "");
    setDepartureAirport(flight.departureAirport);
    setArrivalAirport(flight.arrivalAirport);
    setDepartureTime(toDateTimeLocalValue(flight.departureTime));
    setArrivalTime(toDateTimeLocalValue(flight.arrivalTime));
    setConfirmationCode(flight.confirmationCode ?? "");
    setSeat(flight.seat ?? "");
    setNotes(flight.notes ?? "");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!airline || !departureAirport || !arrivalAirport || !departureTime)
      return;
    setSubmitting(true);
    try {
      await fetch(`/api/flights/${flight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline,
          flightNumber: flightNumber || null,
          departureAirport,
          arrivalAirport,
          departureTime,
          arrivalTime: arrivalTime || null,
          confirmationCode: confirmationCode || null,
          seat: seat || null,
          notes: notes || null,
        }),
      });
      router.refresh();
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  const dep = new Date(flight.departureTime);
  const arr = flight.arrivalTime ? new Date(flight.arrivalTime) : null;

  return (
    <>
      <Card className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span aria-hidden>✈️</span>
            {flight.airline}{" "}
            {flight.flightNumber && `· ${flight.flightNumber}`}
          </div>
          <Button variant="ghost" onClick={openEdit}>
            ✏️ Edit
          </Button>
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
            {flight.confirmationCode &&
              `Confirmation: ${flight.confirmationCode}`}
            {flight.confirmationCode && flight.seat && " · "}
            {flight.seat && `Seat: ${flight.seat}`}
          </div>
        )}
        {flight.notes && (
          <p className="text-xs text-slate-500 mt-1">{flight.notes}</p>
        )}
      </Card>

      {editing && (
        <Modal onClose={() => setEditing(false)}>
          <Card className="p-4">
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-100">Edit Flight</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
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

              <div className="flex items-center justify-between pt-1">
                <ConfirmButton onConfirm={handleDelete} />
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Card>
        </Modal>
      )}
    </>
  );
}
