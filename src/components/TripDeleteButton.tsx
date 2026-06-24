"use client";

import { useRouter } from "next/navigation";
import ConfirmButton from "./ui/ConfirmButton";

export default function TripDeleteButton({ tripId }: { tripId: string }) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    router.push("/");
  }

  return (
    <ConfirmButton
      onConfirm={handleDelete}
      label="Delete trip"
      confirmLabel="Delete permanently?"
    />
  );
}
