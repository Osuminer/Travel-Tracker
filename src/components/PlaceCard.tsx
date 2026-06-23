"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import PhotoUpload from "./PhotoUpload";

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
    photos: Photo[];
  };
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const router = useRouter();
  const [comment, setComment] = useState(place.comment ?? "");
  const [savingComment, setSavingComment] = useState(false);

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

  async function handlePhotoDelete(photoId: string) {
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-800 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-100">{place.name}</h4>
          <span className="text-xs text-slate-400">{place.category}</span>
          {place.address && (
            <p className="text-xs text-slate-500">{place.address}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-400 text-sm"
        >
          Delete
        </button>
      </div>

      <StarRating value={place.rating} onChange={handleRatingChange} size="sm" />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onBlur={handleCommentBlur}
        placeholder="Add a comment..."
        className="border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-2 py-1 text-sm"
      />
      {savingComment && (
        <span className="text-xs text-slate-500">Saving...</span>
      )}

      {place.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {place.photos.map((photo) => (
            <div key={photo.id} className="relative group">
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
        </div>
      )}

      <PhotoUpload placeId={place.id} />
    </div>
  );
}
