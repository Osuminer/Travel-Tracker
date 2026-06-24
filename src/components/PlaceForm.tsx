"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLACE_CATEGORIES } from "@/lib/types";

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
}

interface PlaceFormProps {
  tripId: string;
  pendingLocation: { lat: number; lng: number } | null;
  onClearPending: () => void;
}

export default function PlaceForm({
  tripId,
  pendingLocation,
  onClearPending,
}: PlaceFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("LOCATION");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const effectiveLat = pendingLocation?.lat ?? lat;
  const effectiveLng = pendingLocation?.lng ?? lng;

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data);
    } finally {
      setSearching(false);
    }
  }

  function pickResult(result: GeocodeResult) {
    setLat(result.lat);
    setLng(result.lng);
    setAddress(result.displayName);
    setSearchResults([]);
    setSearchQuery(result.displayName);
    onClearPending();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || effectiveLat === null || effectiveLng === null) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          lat: effectiveLat,
          lng: effectiveLng,
          address: address || undefined,
          comment: comment || undefined,
          visitDate: visitDate || undefined,
        }),
      });
      if (res.ok) {
        setName("");
        setAddress("");
        setLat(null);
        setLng(null);
        setComment("");
        setVisitDate("");
        setSearchQuery("");
        setOpen(false);
        onClearPending();
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
        + Add Place
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-700 rounded-lg p-4 flex flex-col gap-3 bg-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-slate-100">Add Place</h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onClearPending();
          }}
          className="text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <input
        required
        placeholder="Place name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
      />

      <label className="flex flex-col text-sm text-slate-300">
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-3 py-2"
        >
          {PLACE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-300">Search for a location</label>
        <div className="flex gap-2">
          <input
            placeholder="Search address or place name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 flex-1"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="rounded-md bg-slate-700 text-slate-100 px-3 py-2 hover:bg-slate-600"
          >
            {searching ? "..." : "Search"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <ul className="border border-slate-600 bg-slate-900 rounded divide-y divide-slate-700 max-h-40 overflow-y-auto">
            {searchResults.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pickResult(r)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-sm text-slate-200"
                >
                  {r.displayName}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm text-slate-400">
        {effectiveLat !== null && effectiveLng !== null ? (
          <span>
            Location set: {effectiveLat.toFixed(4)}, {effectiveLng.toFixed(4)}
          </span>
        ) : (
          <span>
            No location yet — search above or click directly on the map to
            drop a pin.
          </span>
        )}
      </div>

      <label className="flex flex-col text-sm text-slate-300">
        Visited on (optional)
        <input
          type="datetime-local"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="border border-slate-600 bg-slate-900 text-slate-100 rounded px-3 py-2"
        />
      </label>

      <textarea
        placeholder="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={submitting || effectiveLat === null || effectiveLng === null}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Place"}
      </button>
    </form>
  );
}
