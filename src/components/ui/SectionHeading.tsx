import { ReactNode } from "react";

interface SectionHeadingProps {
  icon?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  icon,
  children,
  action,
  className = "mb-3",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
        {icon && <span aria-hidden>{icon}</span>}
        {children}
      </h2>
      {action}
    </div>
  );
}
