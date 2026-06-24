import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`border border-slate-700 rounded-lg bg-slate-800 shadow-sm ${
        hover ? "hover:shadow-md hover:border-slate-600 transition-shadow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
