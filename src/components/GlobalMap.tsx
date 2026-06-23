"use client";

import Link from "next/link";
import MapView, { MapPlace } from "./MapViewClient";

interface TripWithPlaces {
  id: string;
  name: string;
  places: { id: string; name: string; lat: number; lng: number; category: string; rating: number | null }[];
}

interface GlobalMapProps {
  trips: TripWithPlaces[];
}

export default function GlobalMap({ trips }: GlobalMapProps) {
  const places: MapPlace[] = trips.flatMap((trip) =>
    trip.places.map((p) => ({
      id: p.id,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      category: p.category,
      rating: p.rating,
      tripId: trip.id,
      tripName: trip.name,
    }))
  );

  return (
    <MapView
      places={places}
      fitToPlaces={places.length > 0}
      height="500px"
      renderPopup={(place) => (
        <div>
          <strong>{place.name}</strong>
          <div className="text-xs text-slate-400">{place.category}</div>
          {place.tripId && (
            <Link
              href={`/trips/${place.tripId}`}
              className="text-blue-400 underline text-sm"
            >
              {place.tripName}
            </Link>
          )}
        </div>
      )}
    />
  );
}
