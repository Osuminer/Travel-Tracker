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
    <label className="text-sm text-blue-400 cursor-pointer hover:underline">
      {uploading ? "Uploading..." : "+ Add photo"}
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
