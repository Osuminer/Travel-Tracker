export interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
}

export async function geocodeSearch(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "travel-tracker-app" },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>;

  return data.map((item) => ({
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}
