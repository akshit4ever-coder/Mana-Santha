// Local village lookup table to supplement geocoding.
// This file is intended to be used by checkout.tsx to resolve common
// nearby villages without calling Nominatim.

export type Village = { name: string; lat: number; lng: number };

// NOTE: This list is intentionally small here as an example. Expand as needed.
export const VILLAGES: Village[] = [
  { name: "Gollagudem", lat: 17.0215, lng: 81.2150 },
  { name: "Narayanapuram", lat: 17.0230, lng: 81.2165 },
  { name: "Uppalapadu", lat: 17.025685, lng: 81.218346 },
  // WARNING: The coordinates for "sayampalem" were copied from "Uppalapadu" and
  // are likely incorrect. Please update to sayampalem's real coordinates.
  { name: "sayampalem", lat: 17.025685, lng: 81.218346 },
  // NOTE: "Adamilli" appears noticeably farther out than the other villages.
  // Verify this entry is intentionally serviceable and within the delivery radius.
  { name: "Adamilli", lat: 17.0350, lng: 81.2400 },
];

const toRad = (v: number) => (v * Math.PI) / 180;
const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const lookupLocalVillage = (query?: string | null): Village | null => {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  if (!q) return null;
  // Exact match first
  for (const v of VILLAGES) {
    if (v.name.toLowerCase() === q) return v;
  }
  // Substring match
  for (const v of VILLAGES) {
    if (v.name.toLowerCase().includes(q) || q.includes(v.name.toLowerCase())) return v;
  }
  return null;
};

// Returns the nearest village within `maxDistanceKm` or null.
export const findNearestVillage = (lat: number, lng: number, maxDistanceKm = 3): Village | null => {
  let nearest: Village | null = null;
  let bestDist = Infinity;
  for (const v of VILLAGES) {
    const d = distanceKm(lat, lng, v.lat, v.lng);
    if (d < bestDist) {
      bestDist = d;
      nearest = v;
    }
  }
  return bestDist <= maxDistanceKm ? nearest : null;
};

export default VILLAGES;
