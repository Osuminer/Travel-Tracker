import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TripMapSection from "@/components/TripMapSection";
import PlaceCard from "@/components/PlaceCard";
import FlightForm from "@/components/FlightForm";
import FlightCard from "@/components/FlightCard";
import TripStatusSelect from "@/components/TripStatusSelect";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      places: { include: { photos: true }, orderBy: { createdAt: "asc" } },
      flights: { orderBy: { departureTime: "asc" } },
    },
  });

  if (!trip) notFound();

  const dateRange =
    trip.startDate && trip.endDate
      ? `${trip.startDate.toLocaleDateString()} – ${trip.endDate.toLocaleDateString()}`
      : null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <Link href="/" className="text-sm text-blue-400 hover:underline">
        ← All trips
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{trip.name}</h1>
          {dateRange && <p className="text-slate-400 mt-1">{dateRange}</p>}
          {trip.description && (
            <p className="text-slate-400 mt-2 max-w-2xl">{trip.description}</p>
          )}
        </div>
        <TripStatusSelect tripId={trip.id} status={trip.status} />
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-100">Map & Places</h2>
        <TripMapSection tripId={trip.id} places={trip.places} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {trip.places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-slate-100">Flights</h2>
          <FlightForm tripId={trip.id} />
        </div>
        {trip.flights.length === 0 ? (
          <p className="text-slate-400">No flights added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trip.flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
