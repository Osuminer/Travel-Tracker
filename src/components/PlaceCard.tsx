"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StarRating from "./StarRating";
import ConfirmButton from "./ui/ConfirmButton";
import Card from "./ui/Card";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import { toDateTimeLocalValue, formatDateTime } from "@/lib/datetime";
import { CATEGORY_ICONS } from "@/lib/categories";
import { PLACE_CATEGORIES } from "@/lib/types";

interface Photo {
  id: string;
  filePath: string;
  caption: string | null;
}

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
}

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    category: string;
    lat: number;
    lng: number;
    address: string | null;
    rating: number | null;
    comment: string | null;
    visitDate: string | Date | null;
    photos: Photo[];
  };
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(place.comment ?? "");
  const [savingComment, setSavingComment] = useState(false);

  const [name, setName] = useState(place.name);
  const [category, setCategory] = useState(place.category);
  const [address, setAddress] = useState(place.address ?? "");
  const [lat, setLat] = useState(place.lat);
  const [lng, setLng] = useState(place.lng);
  const [rating, setRating] = useState(place.rating);
  const [editComment, setEditComment] = useState(place.comment ?? "");
  const [visitDate, setVisitDate] = useState(
    toDateTimeLocalValue(place.visitDate)
  );
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function updatePlace(data: Record<string, unknown>) {
    await fetch(`/api/places/${place.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  }

  async function handleRatingChange(value: number) {
    await updatePlace({ rating: value });
  }

  async function handleCommentBlur() {
    if (comment === (place.comment ?? "")) return;
    setSavingComment(true);
    try {
      await updatePlace({ comment });
    } finally {
      setSavingComment(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/places/${place.id}`, { method: "DELETE" });
    router.refresh();
  }

  function openEdit() {
    setName(place.name);
    setCategory(place.category);
    setAddress(place.address ?? "");
    setLat(place.lat);
    setLng(place.lng);
    setRating(place.rating);
    setEditComment(place.comment ?? "");
    setVisitDate(toDateTimeLocalValue(place.visitDate));
    setSearchQuery("");
    setSearchResults([]);
    setEditing(true);
  }

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
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await updatePlace({
        name,
        category,
        address: address || null,
        lat,
        lng,
        rating,
        comment: editComment || null,
        visitDate: visitDate || null,
      });
      setComment(editComment || "");
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  const visitedLabel = formatDateTime(place.visitDate);

  return (
    <>
      <Card className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
              <span aria-hidden>{CATEGORY_ICONS[place.category] ?? "•"}</span>
              {place.name}
            </h4>
            {place.address && (
              <p className="text-xs text-slate-500">{place.address}</p>
            )}
          </div>
          <Button variant="ghost" onClick={openEdit}>
            ✏️ Edit
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <StarRating
            value={place.rating}
            onChange={handleRatingChange}
            size="sm"
          />
          {visitedLabel && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span aria-hidden>📅</span> {visitedLabel}
            </span>
          )}
        </div>

        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={handleCommentBlur}
            placeholder="Add a comment..."
            rows={2}
            className="w-full border border-transparent bg-transparent focus:border-slate-600 focus:bg-slate-900 text-slate-200 placeholder-slate-500 rounded px-2 py-1 text-sm transition-colors resize-none"
          />
          {savingComment && (
            <span className="text-xs text-slate-500">Saving...</span>
          )}
        </div>
      </Card>

      {editing && (
        <Modal onClose={() => setEditing(false)}>
          <Card className="p-4">
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-100">Edit Place</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  ✕
                </Button>
              </div>

              <Input
                required
                placeholder="Place name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="flex flex-col text-sm text-slate-300 gap-1">
                Category
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {PLACE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_ICONS[c] ?? "•"} {c}
                    </option>
                  ))}
                </Select>
              </label>

              <Input
                placeholder="Address (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300">
                  Search for a new location
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search address or place name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSearch}
                    disabled={searching}
                  >
                    {searching ? "..." : "Search"}
                  </Button>
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
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span aria-hidden>📍</span> Current location:{" "}
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              </div>

              <label className="flex flex-col text-sm text-slate-300 gap-1">
                Rating
                <StarRating value={rating} onChange={setRating} />
              </label>

              <label className="flex flex-col text-sm text-slate-300 gap-1">
                Visited on
                <Input
                  type="datetime-local"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </label>

              <Textarea
                placeholder="Comment (optional)"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
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
