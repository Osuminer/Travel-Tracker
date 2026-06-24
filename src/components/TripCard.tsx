import Link from "next/link";
import TripStatusBadge from "./TripStatusBadge";
import Card from "./ui/Card";

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
    <Link href={`/trips/${trip.id}`} className="block">
      <Card hover className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-slate-100">{trip.name}</h3>
          <TripStatusBadge status={trip.status} />
        </div>
        {dateRange && (
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
            <span aria-hidden>📅</span> {dateRange}
          </p>
        )}
        {trip.description && (
          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
            {trip.description}
          </p>
        )}
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span aria-hidden>📍</span> {trip.places.length} places
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden>✈️</span> {trip.flights.length} flights
          </span>
        </div>
      </Card>
    </Link>
  );
}
