"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500"
      >
        + Add Flight
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-700 rounded-lg p-4 flex flex-col gap-3 bg-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-slate-100">Add Flight</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-3">
        <input
          required
          placeholder="Airline"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 flex-1"
        />
        <input
          placeholder="Flight #"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 w-28"
        />
      </div>

      <div className="flex gap-3">
        <input
          required
          placeholder="Departure airport (e.g. JFK)"
          value={departureAirport}
          onChange={(e) => setDepartureAirport(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 flex-1"
        />
        <input
          required
          placeholder="Arrival airport (e.g. LAX)"
          value={arrivalAirport}
          onChange={(e) => setArrivalAirport(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 flex-1"
        />
      </div>

      <div className="flex gap-3">
        <label className="flex flex-col text-sm flex-1 text-slate-300">
          Departure time
          <input
            required
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm flex-1 text-slate-300">
          Arrival time
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="Confirmation code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 flex-1"
        />
        <input
          placeholder="Seat"
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 w-24"
        />
      </div>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Flight"}
      </button>
    </form>
  );
}
