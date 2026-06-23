import { prisma } from "@/lib/prisma";
import GlobalMap from "@/components/GlobalMap";
import TripCard from "@/components/TripCard";
import TripForm from "@/components/TripForm";

export default async function Home() {
  const trips = await prisma.trip.findMany({
    include: { places: true, flights: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Travel Tracker</h1>
          <p className="text-slate-400">
            Plan upcoming trips and remember the ones you&apos;ve taken.
          </p>
        </div>
        <TripForm />
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-100">All trips on the map</h2>
        <div className="rounded-lg overflow-hidden border border-slate-700">
          <GlobalMap trips={trips} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-100">Your trips</h2>
        {trips.length === 0 ? (
          <p className="text-slate-400">
            No trips yet. Create your first one above.
          </p>
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
