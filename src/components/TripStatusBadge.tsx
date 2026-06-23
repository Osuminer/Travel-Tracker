const STATUS_STYLES: Record<string, string> = {
  PLANNED: "bg-blue-500/20 text-blue-300",
  ONGOING: "bg-amber-500/20 text-amber-300",
  COMPLETED: "bg-green-500/20 text-green-300",
};

export default function TripStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-500/20 text-slate-300";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
