import { prisma } from "@/lib/prisma";
import GlobalMap from "@/components/GlobalMap";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trips = await prisma.trip.findMany({
    include: { places: true, flights: true },
    orderBy: { createdAt: "desc" },
  });

  const placeCount = trips.reduce((sum, t) => sum + t.places.length, 0);
  const flightCount = trips.reduce((sum, t) => sum + t.flights.length, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Your Trips</h1>
          <p className="text-slate-400 mt-1">
            Plan upcoming trips and remember the ones you&apos;ve taken.
          </p>
          {trips.length > 0 && (
            <div className="flex gap-4 mt-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span aria-hidden>🧳</span> {trips.length} trips
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden>📍</span> {placeCount} places
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden>✈️</span> {flightCount} flights
              </span>
            </div>
          )}
        </div>
        <TripForm />
      </header>

      <section>
        <SectionHeading>All trips on the map</SectionHeading>
        <Card className="overflow-hidden">
          <GlobalMap trips={trips} />
        </Card>
      </section>

      <section>
        <SectionHeading>Your trips</SectionHeading>
        {trips.length === 0 ? (
          <Card className="p-6 text-center text-slate-400">
            No trips yet. Create your first one above.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
