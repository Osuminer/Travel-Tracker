"use client";

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

export default function StarRating({
  value,
  onChange,
  size = "md",
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const textSize = size === "sm" ? "text-sm" : "text-xl";

  return (
    <div className={`flex gap-0.5 ${textSize}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={
            (value ?? 0) >= star ? "text-yellow-400" : "text-slate-600"
          }
        >
          ★
        </button>
      ))}
    </div>
  );
}
