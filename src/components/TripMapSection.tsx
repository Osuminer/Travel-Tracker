"use client";

import { useState } from "react";
import MapView, { MapPlace } from "./MapViewClient";
import PlaceForm from "./PlaceForm";

interface TripMapSectionProps {
  tripId: string;
  places: { id: string; name: string; lat: number; lng: number; category: string; rating: number | null }[];
}

export default function TripMapSection({ tripId, places }: TripMapSectionProps) {
  const [pendingMarker, setPendingMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapPlaces: MapPlace[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    category: p.category,
    rating: p.rating,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg overflow-hidden border border-slate-700">
        <MapView
          places={mapPlaces}
          fitToPlaces={places.length > 0}
          height="400px"
          onMapClick={(lat, lng) => setPendingMarker({ lat, lng })}
          pendingMarker={pendingMarker}
        />
      </div>
      <p className="text-xs text-slate-500">
        Click anywhere on the map to drop a pin for a new place, or use the
        search box below.
      </p>
      <PlaceForm
        tripId={tripId}
        pendingLocation={pendingMarker}
        onClearPending={() => setPendingMarker(null)}
      />
    </div>
  );
}
