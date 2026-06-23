"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Default Leaflet marker images don't resolve correctly under Next.js bundling,
// so point the default icon at the CDN-hosted assets instead.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export interface MapPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  rating?: number | null;
  tripId?: string;
  tripName?: string;
}

interface FitBoundsProps {
  places: MapPlace[];
}

function FitBounds({ places }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [places, map]);

  return null;
}

function ClickHandler({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapViewProps {
  places: MapPlace[];
  fitToPlaces?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  renderPopup?: (place: MapPlace) => React.ReactNode;
  pendingMarker?: { lat: number; lng: number } | null;
}

export default function MapView({
  places,
  fitToPlaces = true,
  onMapClick,
  height = "400px",
  renderPopup,
  pendingMarker,
}: MapViewProps) {
  const center = useMemo<[number, number]>(() => {
    if (places.length > 0) return [places[0].lat, places[0].lng];
    return [20, 0];
  }, [places]);

  const initialZoom = places.length > 0 ? 6 : 2;
  const mapRef = useRef(null);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fitToPlaces && <FitBounds places={places} />}
        <ClickHandler onMapClick={onMapClick} />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              {renderPopup ? (
                renderPopup(place)
              ) : (
                <div>
                  <strong>{place.name}</strong>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
        {pendingMarker && (
          <Marker position={[pendingMarker.lat, pendingMarker.lng]} />
        )}
      </MapContainer>
    </div>
  );
}
