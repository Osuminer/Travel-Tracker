import Link from "next/link";
import TripStatusBadge from "./TripStatusBadge";

interface TripCardProps {
  trip: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    startDate: string | Date | null;
    endDate: string | Date | null;
    places: { id: string }[];
    flights: { id: string }[];
  };
}

export default function TripCard({ trip }: TripCardProps) {
  const dateRange =
    trip.startDate && trip.endDate
      ? `${new Date(trip.startDate).toLocaleDateString()} – ${new Date(
          trip.endDate
        ).toLocaleDateString()}`
      : null;

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block border border-slate-700 rounded-lg p-4 bg-slate-800 shadow-sm hover:shadow-md hover:border-slate-600 transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-lg text-slate-100">{trip.name}</h3>
        <TripStatusBadge status={trip.status} />
      </div>
      {dateRange && <p className="text-sm text-slate-400 mt-1">{dateRange}</p>}
      {trip.description && (
        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
          {trip.description}
        </p>
      )}
      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span>{trip.places.length} places</span>
        <span>{trip.flights.length} flights</span>
      </div>
    </Link>
  );
}
