"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TRIP_STATUSES } from "@/lib/types";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import Card from "./ui/Card";

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
    return <Button onClick={() => setOpen(true)}>+ New Trip</Button>;
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-slate-100">New Trip</h3>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            ✕
          </Button>
        </div>
        <Input
          required
          placeholder="Trip name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-3">
          <label className="flex flex-col text-sm flex-1 text-slate-300 gap-1">
            Start date
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-sm flex-1 text-slate-300 gap-1">
            End date
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col text-sm text-slate-300 gap-1">
          Status
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {TRIP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Trip"}
        </Button>
      </form>
    </Card>
  );
}
