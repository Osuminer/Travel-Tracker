export const TRIP_STATUSES = ["PLANNED", "ONGOING", "COMPLETED"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

export const PLACE_CATEGORIES = [
  "LOCATION",
  "RESTAURANT",
  "TOUR",
  "ACTIVITY",
  "LODGING",
  "OTHER",
] as const;
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];
