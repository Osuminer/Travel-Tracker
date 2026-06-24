"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function PhotoUpload({ placeId }: { placeId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await fetch(`/api/places/${placeId}/photos`, {
        method: "POST",
        body: formData,
      });
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <label className="shrink-0 h-20 w-20 flex flex-col items-center justify-center gap-0.5 rounded border border-dashed border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer text-xs">
      <span aria-hidden className="text-lg">
        {uploading ? "…" : "+"}
      </span>
      {uploading ? "Uploading" : "Add photo"}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </label>
  );
}
