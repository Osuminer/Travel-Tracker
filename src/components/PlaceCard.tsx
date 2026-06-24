"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import PhotoUpload from "./PhotoUpload";
import ConfirmButton from "./ui/ConfirmButton";
import Card from "./ui/Card";
import { toDateTimeLocalValue } from "@/lib/datetime";
import { CATEGORY_ICONS } from "@/lib/categories";

interface Photo {
  id: string;
  filePath: string;
  caption: string | null;
}

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    category: string;
    address: string | null;
    rating: number | null;
    comment: string | null;
    visitDate: string | Date | null;
    photos: Photo[];
  };
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const router = useRouter();
  const [comment, setComment] = useState(place.comment ?? "");
  const [savingComment, setSavingComment] = useState(false);
  const [visitDate, setVisitDate] = useState(
    toDateTimeLocalValue(place.visitDate)
  );

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

  async function handleVisitDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setVisitDate(value);
    await updatePlace({ visitDate: value || null });
  }

  async function handleDelete() {
    await fetch(`/api/places/${place.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handlePhotoDelete(photoId: string) {
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
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
        <ConfirmButton onConfirm={handleDelete} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <StarRating value={place.rating} onChange={handleRatingChange} size="sm" />
        <input
          type="datetime-local"
          value={visitDate}
          onChange={handleVisitDateChange}
          title="Visited on"
          className="border border-slate-600 bg-slate-900 text-slate-300 rounded px-2 py-1 text-xs"
        />
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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {place.photos.map((photo) => (
          <div key={photo.id} className="relative group shrink-0">
            <Image
              src={photo.filePath}
              alt={photo.caption ?? place.name}
              width={80}
              height={80}
              className="rounded object-cover h-20 w-20"
            />
            <button
              onClick={() => handlePhotoDelete(photo.id)}
              className="absolute top-0 right-0 bg-black/60 text-white text-xs rounded-bl px-1 opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
        <PhotoUpload placeId={place.id} />
      </div>
    </Card>
  );
}
