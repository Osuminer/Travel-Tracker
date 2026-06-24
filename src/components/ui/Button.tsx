import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-blue-600 text-white font-medium hover:bg-blue-500",
  secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
  ghost: "text-slate-400 hover:text-slate-200",
  danger: "bg-red-600 text-white font-medium hover:bg-red-500",
};

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    variant === "ghost"
      ? "px-2 py-1 text-sm rounded"
      : "px-4 py-2 rounded-md text-sm";

  return (
    <button
      disabled={disabled}
      className={`${base} ${VARIANT_CLASSES[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
