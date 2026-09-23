import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { getOrderCutoffStatus } from "@/lib/delivery-cutoff";
import { getCartItemValidationDetail, isProductAvailable, isVariantAvailable, validateVariantAvailability } from "@/lib/product-availability";
import { isComboCurrentlyValid, isComboStatusActive } from "@/lib/combo-status";
import {
  getCartOrderSummary,
  LARGE_OIL_LIMIT_MESSAGE,
  RICE_LIMIT_MESSAGE,
  validateLargeOilRule,
  validateRiceRule,
} from "@/lib/cart-rules";
import { toast } from "sonner";
import { Loader2, MapPin, Wallet } from "lucide-react";
import { STORE_LAT, STORE_LNG, STORE_LOCATION, DELIVERY_RADIUS_KM } from "@/lib/config";
import { lookupLocalVillage, findNearestVillage } from "@/lib/localVillages";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Mana Santa" }, { name: "description", content: "Complete your order with cash on delivery." }] }),
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const { data: cart } = useCart(user?.id);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [addr, setAddr] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [addressNotFound, setAddressNotFound] = useState<boolean>(false);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const checkAbortRef = useRef<AbortController | null>(null);
  const checkRequestIdRef = useRef(0);
  const storeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const currentLocationCoordsRef = useRef<{ lat: number; lng: number; accuracy: number | null } | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{ lat: number; lng: number; accuracy: number | null } | null>(null);

  // Sanitize Address Line 1 to avoid full-address paste. If user pastes a full address
  // we keep the first two comma-separated parts as Line 1 and move the rest to Line 2.
  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const sanitizeLine1 = (value: string) => {
    const parts = String(value).split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length <= 2) return { line1: parts.join(", "), line2: "" };
    const line1 = parts.slice(0, 2).join(", ");
    const line2 = parts.slice(2).join(", ");
    return { line1, line2 };
  };

  const clearCurrentLocation = () => {
    currentLocationCoordsRef.current = null;
    setCurrentLocationCoords(null);
    setDeliveryAvailable(null);
    setDeliveryDistance(null);
    setDeliveryError(null);
  };

  const stripAdminSuffix = (value: string) =>
    String(value)
      .replace(/\s*\b(village|hamlet|mandal|panchayat|ward|colony)\b\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const restoreSavedAddressLocation = (savedAddress: any) => {
    const hasSavedGps = savedAddress && savedAddress.latitude != null && savedAddress.longitude != null && String(savedAddress.latitude).trim() !== "" && String(savedAddress.longitude).trim() !== "";
    if (!hasSavedGps) {
      if (import.meta.env.DEV) {
        console.log("[ADDRESS DEBUG] SAVED ADDRESS HAS NO GPS — USING TEXT GEOCODING");
      }
      return false;
    }

    const latitude = Number(savedAddress.latitude);
    const longitude = Number(savedAddress.longitude);
    const accuracy = savedAddress.location_accuracy == null ? null : Number(savedAddress.location_accuracy);
    const nextCoords = { lat: latitude, lng: longitude, accuracy };

    currentLocationCoordsRef.current = nextCoords;
    setCurrentLocationCoords(nextCoords);

    if (import.meta.env.DEV) {
      console.log("[ADDRESS DEBUG] RESTORING SAVED GPS LOCATION", {
        latitude,
        longitude,
        accuracy,
      });
    }

    const distance = distanceKm(STORE_LAT, STORE_LNG, latitude, longitude);
    const available = distance <= DELIVERY_RADIUS_KM;

    if (import.meta.env.DEV) {
      console.log("[DELIVERY DEBUG] SAVED GPS DISTANCE", {
        distanceKm: distance,
        radiusKm: DELIVERY_RADIUS_KM,
        available,
      });
    }

    setDeliveryDistance(distance);
    setDeliveryAvailable(available);
    setDeliveryError(null);
    return true;
  };

  const parseReverseGeocodedAddress = (body: any) => {
    const feature = body?.features?.[0];
    const geocoding = feature?.properties?.geocoding ?? null;
    const legacyAddress = body?.address ?? {};

    const source = geocoding || legacyAddress;
    if (!source || Object.keys(source).length === 0) {
      return null;
    }

    const houseNumber = source.house_number ?? source.housenumber ?? "";
    const street = source.street ?? source.road ?? source.name ?? "";
    const locality = source.locality ?? "";
    const district = source.district ?? source.city_district ?? source.state_district ?? "";
    const city = source.city ?? "";
    const town = source.town ?? "";
    const village = source.village ?? "";
    const county = source.county ?? "";
    const municipality = source.municipality ?? "";
    const suburb = source.suburb ?? "";
    const neighbourhood = source.neighbourhood ?? "";
    const state = source.state ?? "";
    const postcode = source.postcode ?? source.postalcode ?? "";

    const line1Base = [houseNumber, street].filter(Boolean).join(", ").trim();
    const line2Candidates = [neighbourhood, suburb, locality].filter(Boolean);
    const line2Value = line2Candidates.find((value) => value && value !== city && value !== town && value !== village && value !== municipality) || "";

    const cityCandidates = [town, municipality, city, locality, suburb, neighbourhood, village, district, county].filter(Boolean);
    const normalizeCityCandidate = (value: string) => stripAdminSuffix(String(value).trim().replace(/\s+/g, " "));
    const cityPriority = cityCandidates
      .map((value) => normalizeCityCandidate(value))
      .filter(Boolean)
      .filter((value) => {
        const normalized = value.toLowerCase();
        return !normalized.includes("village") && !normalized.includes("hamlet") && !normalized.includes("mandal") && !normalized.includes("panchayat") && !normalized.includes("ward") && !normalized.includes("colony");
      });

    const line2CityHint = normalizeCityCandidate(line2Value);
    const selectedCity = stripAdminSuffix(cityPriority[0] || line2CityHint || cityCandidates[0] || "");

    let line1 = sanitizeLine1(line1Base).line1 || line1Base;
    const line2 = stripAdminSuffix((line2Value && line2Value !== selectedCity ? line2Value : "").trim());

    if (!line1 && body?.display_name) {
      const segs = String(body.display_name).replace(/\s*,\s*India\s*$/i, "").split(",").map((s: string) => s.trim()).filter(Boolean);
      line1 = segs.slice(0, 2).join(", ");
      if (!line1) {
        line1 = segs[0] || "";
      }
    }

    const finalLine1 = stripAdminSuffix(sanitizeLine1(line1).line1 || line1);
    const selectedAddress = {
      line1: finalLine1,
      line2: stripAdminSuffix(line2),
      city: stripAdminSuffix(selectedCity || city || town || village || municipality || district || county || ""),
      state: stripAdminSuffix(state),
      pincode: postcode,
    };

    if (import.meta.env.DEV) {
      console.log("[ADDRESS DEBUG] SELECTED ADDRESS", {
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      });
    }

    return selectedAddress;
  };

  // Haversine distance (km)
  const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Returns: true = inside radius, false = outside radius, null = address could not be resolved
  const checkDeliveryAvailability = async (addressQuery: string): Promise<boolean | null> => {
    if (!addressQuery || addressQuery.trim().length === 0) {
      setDeliveryAvailable(null);
      setAddressNotFound(false);
      setDeliveryDistance(null);
      setDeliveryError(null);
      return null;
    }

    const requestId = ++checkRequestIdRef.current;
    if (checkAbortRef.current) checkAbortRef.current.abort();
    const ac = new AbortController();
    checkAbortRef.current = ac;
    setCheckingDelivery(true);

    try {
      if (!storeCoordsRef.current) {
        if (typeof STORE_LAT === "number" && typeof STORE_LNG === "number") {
          storeCoordsRef.current = { lat: STORE_LAT, lng: STORE_LNG } as any;
        } else {
          const sq = encodeURIComponent(STORE_LOCATION);
          const sres = await fetch(`https://nominatim.openstreetmap.org/search?q=${sq}&format=json&limit=1`, { signal: ac.signal });
          if (!sres.ok) throw new Error("Failed to geocode store location");
          const sbody = await sres.json();
          if (!sbody || sbody.length === 0) throw new Error("Unable to resolve store location");
          storeCoordsRef.current = { lat: Number(sbody[0].lat), lng: Number(sbody[0].lon) };
        }
      }

      if (import.meta.env.DEV) {
        console.log("[DELIVERY DEBUG] STORE COORDINATES:", {
          latitude: storeCoordsRef.current?.lat,
          longitude: storeCoordsRef.current?.lng,
        });
      }

      const geocodeOnce = async (qstr: string) => {
        const q = encodeURIComponent(qstr);
        console.debug("Geocoding query:", qstr);
        const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`, { signal: ac.signal });
        if (!r.ok) throw new Error(`Geocode failed: ${r.status}`);
        const b = await r.json();
        console.debug("Nominatim response for query:", qstr, b);
        return (b && b.length > 0) ? b[0] : null;
      };

      const storeLat = storeCoordsRef.current?.lat ?? STORE_LAT;
      const storeLng = storeCoordsRef.current?.lng ?? STORE_LNG;

      const gpsCustomerCoords = currentLocationCoordsRef.current;
      if (gpsCustomerCoords) {
        const customerLat = gpsCustomerCoords.lat;
        const customerLng = gpsCustomerCoords.lng;
        const d = distanceKm(storeLat, storeLng, customerLat, customerLng);
        const toleranceKm = gpsCustomerCoords.accuracy != null ? Math.max(0.25, Math.min(0.5, gpsCustomerCoords.accuracy / 1000 / 2)) : 0.25;
        const effectiveRadiusKm = DELIVERY_RADIUS_KM + toleranceKm;
        const ok = d <= effectiveRadiusKm;

        console.info("[DELIVERY DEBUG] GPS CHECK", {
          store: { latitude: storeLat, longitude: storeLng },
          customer: { latitude: customerLat, longitude: customerLng, accuracy: gpsCustomerCoords.accuracy },
          deliveryRadiusKm: DELIVERY_RADIUS_KM,
          toleranceKm,
          effectiveRadiusKm,
          distanceKm: d,
          available: ok,
        });

        setDeliveryDistance(d);
        setAddressNotFound(false);
        setDeliveryError(null);
        setDeliveryAvailable(ok);
        return ok;
      }

      const normalized = String(addressQuery).replace(/\s*,?\s*India\s*$/i, "").trim();
      const pinMatch = normalized.match(/(\d{5,6})/);
      const pin = pinMatch ? pinMatch[0] : (addr.pincode || "");
      const cityPart = addr.city || "";
      const statePart = addr.state || "";

      // Attempt to resolve common local villages from a small offline lookup
      const localMatch = lookupLocalVillage(addr.city) || lookupLocalVillage(addr.line1) || lookupLocalVillage(addr.line2);
      if (localMatch) {
        const d = distanceKm(storeLat, storeLng, localMatch.lat, localMatch.lng);
        const ok = d <= DELIVERY_RADIUS_KM;
        setDeliveryDistance(d);
        setAddressNotFound(false);
        setDeliveryError(null);
        setDeliveryAvailable(ok);
        return ok;
      }

      const attempts = Array.from(new Set([
        normalized,
        `${cityPart || normalized}, ${pin || ""}`.replace(/,\s*$/g, "").trim(),
        `${cityPart || normalized}, ${statePart || ""}, ${pin || ""}`.replace(/,\s*$/g, "").trim(),
        `${cityPart || normalized}, ${statePart || ""}`.replace(/,\s*$/g, "").trim(),
        pin ? `${pin}, India` : "",
      ].filter(Boolean)));

      let geo: any = null;
      for (const candidate of attempts) {
        try {
          geo = await geocodeOnce(candidate);
          if (geo) {
            console.debug("Geocode success for attempt:", candidate);
            break;
          }
        } catch (e: any) {
          if (e?.name === "AbortError") throw e;
          console.warn("Geocode attempt failed for", candidate, e);
        }
      }

      if (requestId !== checkRequestIdRef.current) {
        return null;
      }

      if (!geo) {
        console.warn("Unable to geocode customer address for query:", addressQuery);
        setAddressNotFound(true);
        setDeliveryAvailable(null);
        setDeliveryDistance(null);
        setDeliveryError(null);
        return null;
      }

      const lat = Number(geo.lat);
      const lon = Number(geo.lon);
      const d = distanceKm(storeLat, storeLng, lat, lon);
      const toleranceKm = 0.5;
      const effectiveRadiusKm = DELIVERY_RADIUS_KM + toleranceKm;
      const ok = d <= effectiveRadiusKm;
      setDeliveryDistance(d);
      setAddressNotFound(false);
      setDeliveryError(null);

      console.info("[DELIVERY DEBUG] GEOCODED ADDRESS CHECK", {
        store: { latitude: storeLat, longitude: storeLng },
        customer: { latitude: lat, longitude: lon },
        deliveryRadiusKm: DELIVERY_RADIUS_KM,
        toleranceKm,
        effectiveRadiusKm,
        distanceKm: d,
        available: ok,
        geocodeQuery: normalized,
      });

      if (import.meta.env.DEV) {
        console.log("[DELIVERY DEBUG] CUSTOMER COORDINATES USED:", {
          latitude: lat,
          longitude: lon,
        });
        console.log("[DELIVERY DEBUG] STORE COORDINATES USED:", {
          latitude: storeLat,
          longitude: storeLng,
        });
        console.log("[DELIVERY DEBUG] DELIVERY RADIUS:", DELIVERY_RADIUS_KM);
        console.log("[DELIVERY DEBUG] CALCULATED DISTANCE:", d);
        console.log("[DELIVERY DEBUG] DELIVERY AVAILABLE:", ok);
      }
      console.info("Delivery check — store:", { lat: storeLat, lng: storeLng }, "customer:", { lat, lon }, "distance_km:", d, "radius_km:", effectiveRadiusKm, "ok:", ok);
      setDeliveryAvailable(ok);
      return ok;
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        return null;
      }
      console.warn("Delivery check failed", err);
      setDeliveryAvailable(null);
      setAddressNotFound(false);
      setDeliveryDistance(null);
      setDeliveryError("Delivery check failed — please retry");
      return null;
    } finally {
      if (checkRequestIdRef.current === 0 || requestId === checkRequestIdRef.current) {
        setCheckingDelivery(false);
      }
    }
  };

  const getCurrentPositionWithRetry = async (): Promise<GeolocationPosition> => {
    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    const maxAttempts = 5;
    const backoffMs = [0, 1000, 2000, 4000, 4000];

    const tryGetPosition = async (attempt: number): Promise<GeolocationPosition> => {
      if (import.meta.env.DEV) {
        console.log("[LOCATION DEBUG] GPS ATTEMPT", {
          attempt,
          maxAttempts,
          options,
        });
      }

      return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (import.meta.env.DEV) {
              console.log("[LOCATION DEBUG] GPS SUCCESS", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy ?? null,
                attempt,
              });
            }
            resolve(position);
          },
          (error) => {
            if (import.meta.env.DEV) {
              console.error("[LOCATION DEBUG] GPS FAILURE", {
                code: error.code,
                message: error.message,
                attempt,
                maxAttempts,
              });
            }

            if (error.code === 1) {
              reject(error);
              return;
            }

            const canRetry = (error.code === 2 || error.code === 3) && attempt < maxAttempts;
            if (!canRetry) {
              reject(error);
              return;
            }

            const delay = backoffMs[Math.min(attempt - 1, backoffMs.length - 1)] ?? 0;
            window.setTimeout(() => {
              tryGetPosition(attempt + 1).then(resolve).catch(reject);
            }, delay);
          },
          options,
        );
      });
    };

    return tryGetPosition(1);
  };

  // Use browser geolocation + reverse geocode to fill address fields
  const useCurrentLocation = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation not supported in this browser");
      return;
    }

    setCheckingDelivery(true);
    currentLocationCoordsRef.current = null;
    setCurrentLocationCoords(null);

    try {
      const pos = await getCurrentPositionWithRetry();
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const accuracy = pos.coords.accuracy ?? null;

      if (import.meta.env.DEV) {
        console.log("[LOCATION DEBUG] GPS SUCCESS", {
          latitude,
          longitude,
          accuracy,
          altitude: pos.coords.altitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        });
      }

      if (accuracy !== null && accuracy > 1000) {
        console.warn("[LOCATION DEBUG] GPS accuracy is poor:", { accuracy, latitude, longitude });
        toast.warning("Current location accuracy is low; the detected address may be approximate.");
      }

      const nextCoords = { lat: latitude, lng: longitude, accuracy };
      currentLocationCoordsRef.current = nextCoords;
      setCurrentLocationCoords(nextCoords);

      // Check for a nearby known village before reverse geocoding.
      const nearestVillage = findNearestVillage(latitude, longitude);

      const storeLat = STORE_LAT;
      const storeLng = STORE_LNG;
      const distance = distanceKm(storeLat, storeLng, latitude, longitude);
      const available = distance <= DELIVERY_RADIUS_KM;

      if (import.meta.env.DEV) {
        console.log("[DELIVERY] Distance", {
          distanceKm: distance,
          radiusKm: DELIVERY_RADIUS_KM,
          available,
        });
      }

      setDeliveryDistance(distance);
      setDeliveryAvailable(available);
      setDeliveryError(null);

      let body: any = null;
      try {
        if (import.meta.env.DEV) {
          console.log("[ADDRESS DEBUG] GPS COORDINATES", {
            latitude,
            longitude,
            accuracy,
          });
          console.log("[ADDRESS] Reverse geocoding coordinates", {
            latitude,
            longitude,
          });
        }

        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=geocodejson&addressdetails=1&zoom=18&accept-language=en`);
        if (!res.ok) throw new Error("Failed to reverse geocode");
        body = await res.json();

        if (import.meta.env.DEV) {
          console.log("[ADDRESS] Reverse geocoding SUCCESS", body);
          console.log("[ADDRESS DEBUG] FULL GEOCODEJSON RESPONSE:", body);
          console.log("[ADDRESS DEBUG] GEOCODEJSON FEATURE:", body?.features?.[0]);
          console.log("[ADDRESS DEBUG] GEOCODING PROPERTIES:", body?.features?.[0]?.properties?.geocoding);
        }
      } catch (reverseError: any) {
        if (import.meta.env.DEV) {
          console.error("[ADDRESS] Reverse geocoding FAILED", reverseError);
        }
        toast.warning("Location detected, but we couldn't resolve your address automatically. Please enter your address manually.");
        return;
      }

      const feature = Array.isArray(body?.features) ? body.features[0] : null;
      const geocoding = feature?.properties?.geocoding ?? body?.features?.[0]?.properties?.geocoding ?? {};
      const legacyAddress = body?.address ?? {};

      if (import.meta.env.DEV) {
        console.log("[ADDRESS DEBUG] GPS COORDINATES", { latitude, longitude, accuracy });
        console.log("[ADDRESS DEBUG] GEOCODER RESPONSE", body);
        console.log("[ADDRESS DEBUG] GEOCODING CLASSIFICATION", {
          street: geocoding.street ?? geocoding.road ?? legacyAddress.road ?? legacyAddress.street,
          locality: geocoding.locality ?? legacyAddress.locality,
          district: geocoding.district ?? legacyAddress.district ?? legacyAddress.city_district ?? legacyAddress.state_district,
          city: geocoding.city ?? legacyAddress.city,
          town: geocoding.town ?? legacyAddress.town,
          village: geocoding.village ?? legacyAddress.village,
          suburb: geocoding.suburb ?? legacyAddress.suburb,
          neighbourhood: geocoding.neighbourhood ?? legacyAddress.neighbourhood,
          municipality: geocoding.municipality ?? legacyAddress.municipality,
          state: geocoding.state ?? legacyAddress.state,
          postcode: geocoding.postcode ?? legacyAddress.postcode,
        });
      }

      const parsedAddress = parseReverseGeocodedAddress(body);
      if (import.meta.env.DEV && parsedAddress) {
        console.log("[ADDRESS DEBUG] SELECTED ADDRESS", {
          line1: parsedAddress.line1,
          line2: parsedAddress.line2,
          city: parsedAddress.city,
          state: parsedAddress.state,
          pincode: parsedAddress.pincode,
        });
      }
      if (parsedAddress) {
        // If a nearby village was found via local lookup, prefer that as the city
        // since Nominatim can sometimes return broader locality names.
        if (nearestVillage) {
          parsedAddress.city = nearestVillage.name;
        }
        setAddr((a) => ({ ...a, ...parsedAddress }));
      }

      toast.success("Location detected — please verify address details before saving or placing order");
    } catch (e: any) {
      const code = e?.code;
      let message = "Unable to detect your location right now. Please make sure Location Services are enabled and try again.";

      if (code === 1) {
        message = "Location access was denied. Please allow location access for this site in your browser settings and try again.";
      } else if (code === 2) {
        message = "Your location could not be detected right now. Please make sure Location Services are enabled and try again.";
      } else if (code === 3) {
        message = "Location detection timed out. Please try again.";
      }

      console.warn("Geolocation failed", e);
      setDeliveryAvailable(null);
      setDeliveryDistance(null);
      setDeliveryError(message);
      toast.error(message);
    } finally {
      setCheckingDelivery(false);
    }
  };

  // Save currently entered address for the user (without placing order)
  const saveAddressNow = async () => {
    if (!user) {
      toast.error("Please sign in to save addresses");
      return;
    }
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      toast.error("Please fill all address fields before saving");
      return;
    }

    const currentGps = currentLocationCoordsRef.current;
    const latitude = currentGps?.lat ?? null;
    const longitude = currentGps?.lng ?? null;
    const locationAccuracy = currentGps?.accuracy ?? null;

    if (import.meta.env.DEV && currentGps) {
      console.log("[ADDRESS DEBUG] SAVING GPS-BACKED ADDRESS", {
        latitude,
        longitude,
        accuracy: locationAccuracy,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      });
    }

    try {
      const { data: newAddr, error: addrErr } = await (supabase as any)
        .from("addresses")
        .insert({
          user_id: user.id,
          full_name: addr.full_name,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2 ?? null,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          latitude,
          longitude,
          location_accuracy: locationAccuracy,
          is_default: false,
        })
        .select()
        .single();
      if (addrErr) throw addrErr;
      setSavedAddresses((s) => [newAddr, ...(s ?? [])]);
      setSelectedAddressId(newAddr.id);
      toast.success("Address saved");
    } catch (e: any) {
      console.warn("Failed to save address", e);
      toast.error(e?.message || "Failed to save address");
    }
  };

  // Run check when address fields change (debounced)
  useEffect(() => {
    const hasCurrentLocation = !!currentLocationCoordsRef.current;
    const hasLiveAddressValues = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].some((value) => String(value ?? "").trim().length > 0);
    if (!hasLiveAddressValues) {
      setDeliveryAvailable(null);
      return;
    }

    if (hasCurrentLocation) {
      const current = currentLocationCoordsRef.current;
      if (current) {
        const distance = distanceKm(STORE_LAT, STORE_LNG, current.lat, current.lng);
        const available = distance <= DELIVERY_RADIUS_KM;
        setDeliveryDistance(distance);
        setDeliveryAvailable(available);
        setDeliveryError(null);
        return;
      }
    }

    let qParts: string[] = [];
    if (addr.line1 && addr.line1.trim().length > 0) {
      qParts = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean);
    } else if (addr.city && addr.pincode) {
      qParts = [addr.city, addr.pincode].filter(Boolean);
    }

    if (qParts.length === 0) {
      setDeliveryAvailable(null);
      return;
    }
    const qStr = `${qParts.join(" ")}, India`;
    const id = setTimeout(() => { checkDeliveryAvailability(qStr); }, 700);
    return () => clearTimeout(id);
  }, [addr.line1, addr.line2, addr.city, addr.state, addr.pincode, currentLocationCoords]);

  // Load saved addresses for authenticated user
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const { data } = await (supabase as any)
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!mounted) return;
        setSavedAddresses(data ?? []);
      } catch (e) {
        console.warn("Failed to load saved addresses", e);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    if (!user) {
      toast.info("Please sign in or log in to place your order.");
      navigate({ to: "/auth", search: { redirect: "/checkout" } as any });
    }
  }, [user, navigate]);

  const items: any[] = (cart ?? []) as any[];
  const orderSummary = getCartOrderSummary(items);
  const subtotal = orderSummary.subtotal;
  const deliveryFee = orderSummary.deliveryFee;
  const total = orderSummary.total;
  const riceRule = validateRiceRule(items);
  const oilRule = validateLargeOilRule(items);
  const validationResults = items.map((item) => ({
    ...item,
    validation: getCartItemValidationDetail(item),
  }));
  const unavailableItems = validationResults.filter((item) => !item.validation.isAvailable);

  if (process.env.NODE_ENV !== "production") {
    console.group("Cart validation:");
    validationResults.forEach((item, index) => {
      const v = item.validation;
      console.log(`Item ${index + 1}:`, {
        cartItemId: v.cartItemId,
        productId: v.productId,
        variantId: v.variantId,
        productName: v.productName,
        variantName: v.variantName,
        size: v.size,
        quantity: v.quantity,
        productStock: v.productStock,
        productStatus: v.productStatus,
        variantStock: v.variantStock,
        variantIsActive: v.variantIsActive,
        isAvailable: v.isAvailable,
        availabilityReason: v.availabilityReason,
      });
    });
    console.groupEnd();
  }

  const getExpectedDeliveryDate = (date = new Date()) => {
    return getOrderCutoffStatus(date).deliveryDate.toISOString();
  };

  const isValidUuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
  const isComboCartItem = (item: any) => Boolean(item?.combo_id || item?.combo_snapshot);

  if (!user) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Please sign in or log in to place your order.</div></div>);
  if (items.length === 0) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Your cart is empty. <Link to="/" className="text-primary underline">Shop now</Link>.</div></div>);
  if (unavailableItems.length > 0) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Some items in your cart are no longer available.</h1>
          <p className="mt-2 text-muted-foreground">Please review your cart before placing your order.</p>
          <Button asChild className="mt-6 rounded-full"><Link to="/cart">Review Cart</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.pincode) {
      toast.error("Please fill all address fields"); return;
    }
    // Ensure latest availability check (geocode full address) before placing order
    const qParts = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean);
    const qStr = `${qParts.join(" ")}, India`;
    setCheckingDelivery(true);
    const avail = await checkDeliveryAvailability(qStr);
    if (avail === false) {
      toast.error(`❌ Delivery is unavailable because this address is outside our ${DELIVERY_RADIUS_KM} km delivery area.`);
      setCheckingDelivery(false);
      return;
    }
    if (avail === null) {
      toast.error("⚠️ We couldn't verify this address. Please check the address, enter a nearby landmark, or use Current Location.");
      setCheckingDelivery(false);
      return;
    }

    // Validate stock and business rules for all items
    setSubmitting(true);
    try {
      if (!riceRule.allowed) {
        throw new Error(RICE_LIMIT_MESSAGE);
      }
      if (!oilRule.allowed) {
        throw new Error(LARGE_OIL_LIMIT_MESSAGE);
      }

      const comboItems = items.filter((item) => Boolean(item.combo_id || item.combo_snapshot));
      const productItems = items.filter((item) => !item.combo_id && !item.combo_snapshot);

      const productIds = [...new Set(productItems.map((i) => i.product_id).filter((id): id is string => isValidUuid(id)))];
      const { data: currentProducts } = productIds.length > 0
        ? await supabase
            .from("products")
            .select("id, stock, status, is_active, product_variants(*)")
            .in("id", productIds)
        : { data: [] };

      const comboIds = [...new Set(comboItems.map((item) => item.combo_id ?? item.combo_snapshot?.id).filter((id): id is string => isValidUuid(id)))];
      const { data: currentCombos } = comboIds.length > 0
        ? await supabase.from("combos").select("id, status, date_valid_from, date_valid_to, stock, available_quantity, max_quantity, name").in("id", comboIds)
        : { data: [] };

      // Fetch variant stock for items that have a variant selected
      const variantIds = [...new Set(productItems.map((i) => i.variant_id).filter((id): id is string => isValidUuid(id)))];
      let currentVariants: any[] = [];
      let variantFetchError: any = null;
      if (variantIds.length > 0) {
        const { data, error } = await (supabase as any)
          .from("product_variants")
          .select("id, product_id, stock, is_active, max_qty, name, unit, quantity_value")
          .in("id", variantIds);

        if (error) {
          variantFetchError = error;
          console.error("PRODUCT VARIANT FETCH ERROR", {
            code: error?.code,
            message: error?.message,
            details: error?.details,
            hint: error?.hint,
            data,
            variantIds,
          });
        } else {
          currentVariants = data ?? [];
        }
      }

      if (variantFetchError) {
        toast.error("We couldn't verify product availability right now. Please try again.");
        setSubmitting(false);
        return;
      }

      const insufficientStock = items.find((item) => {
        if (item.combo_id || item.combo_snapshot) {
          const combo = currentCombos?.find((c: any) => c.id === (item.combo_id ?? item.combo_snapshot?.id));
          const comboSnapshot = item.combo_snapshot ?? {};
          const sourceCombo = {
            id: item.combo_id ?? comboSnapshot.id ?? null,
            status: combo?.status ?? comboSnapshot.status ?? "active",
            date_valid_from: combo?.date_valid_from ?? comboSnapshot.date_valid_from ?? null,
            date_valid_to: combo?.date_valid_to ?? comboSnapshot.date_valid_to ?? null,
            stock: combo?.stock ?? comboSnapshot.stock ?? null,
            available_quantity: combo?.available_quantity ?? comboSnapshot.available_quantity ?? combo?.stock ?? comboSnapshot.stock ?? null,
            name: combo?.name ?? comboSnapshot.name ?? "Combo",
          };

          const requestedQty = Number(item.quantity ?? 0);
          const comboActive = isComboStatusActive(sourceCombo.status);
          const comboValidDate = isComboCurrentlyValid(sourceCombo);
          const availableQty = Number(sourceCombo.available_quantity ?? sourceCombo.stock ?? Number.POSITIVE_INFINITY);

          if (!sourceCombo.id) {
            console.error("Checkout rejected combo item due to missing combo id:", { cartItemId: item.id, item, sourceCombo });
            return true;
          }

          if (!comboActive) {
            console.error("Checkout rejected combo item because combo is inactive:", { cartItemId: item.id, comboId: sourceCombo.id, comboName: sourceCombo.name, status: sourceCombo.status, available: false, reason: "combo_inactive" });
            return true;
          }

          if (!comboValidDate) {
            console.error("Checkout rejected combo item because combo date is invalid:", { cartItemId: item.id, comboId: sourceCombo.id, comboName: sourceCombo.name, start: sourceCombo.date_valid_from, end: sourceCombo.date_valid_to, available: false, reason: "combo_date_invalid" });
            return true;
          }

          if (Number.isFinite(availableQty) && requestedQty > availableQty) {
            console.error("Checkout rejected combo item because requested quantity exceeds combo quantity:", { cartItemId: item.id, comboId: sourceCombo.id, comboName: sourceCombo.name, requestedQty, availableQty, available: false, reason: "combo_quantity_exceeded" });
            return true;
          }

          return false;
        }

        const product = currentProducts?.find((p: any) => p.id === item.product_id);

        if (item.variant_id) {
          const variant = currentVariants?.find((v: any) => v.id === item.variant_id);
          const detail = getCartItemValidationDetail(item);

          if (!product) {
            console.error("Checkout rejected item because product is missing:", {
              cartItemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
            });
            return true;
          }

          if (!variant) {
            console.error("Checkout rejected item because the variant no longer exists:", {
              cartItemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              productName: item.products?.name ?? product?.name ?? detail.productName,
              quantity: Number(item.quantity ?? 0),
              available: false,
              reason: "variant_missing",
            });
            return true;
          }

          if (variant.product_id && String(variant.product_id) !== String(item.product_id)) {
            console.error("Checkout rejected item because the variant belongs to a different product:", {
              cartItemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              variantProductId: variant.product_id,
              available: false,
              reason: "variant_product_mismatch",
            });
            return true;
          }

          const variantValidation = validateVariantAvailability(product, variant, Number(item.quantity ?? 0));
          if (variantValidation.status !== "available") {
            console.error("Checkout rejected item due to variant validation:", {
              cartItemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              productName: item.products?.name ?? product?.name ?? detail.productName,
              variantName: item.variant_name ?? variant?.name ?? detail.variantName,
              quantity: Number(item.quantity ?? 0),
              productStock: Number(product?.stock ?? 0),
              productStatus: product?.status ?? detail.productStatus,
              variantStock: Number(variant?.stock ?? 0),
              variantIsActive: variant?.is_active ?? detail.variantIsActive,
              available: false,
              reason: variantValidation.status === "missing" ? "variant_missing" : variantValidation.reason,
              rawProduct: product,
              rawVariant: variant,
            });
            return true;
          }
          return false;
        }

        const detail = getCartItemValidationDetail(item);
        const isInvalid = !product || !isProductAvailable(product) || Number(product.stock ?? 0) < Number(item.quantity ?? 0);
        if (isInvalid) {
          console.error("Checkout rejected item due to stock validation:", {
            cartItemId: item.id,
            productId: item.product_id,
            variantId: item.variant_id ?? null,
            productName: item.products?.name ?? product?.name ?? detail.productName,
            variantName: item.variant_name ?? detail.variantName ?? null,
            quantity: Number(item.quantity ?? 0),
            productStock: Number(product?.stock ?? 0),
            productStatus: product?.status ?? detail.productStatus,
            variantStock: Number(item.variant_stock ?? 0),
            variantIsActive: item.variant?.is_active ?? detail.variantIsActive,
            available: false,
            reason: !product ? "product_missing" : Number(product.stock ?? 0) < Number(item.quantity ?? 0) ? "insufficient_quantity" : "product_inactive_or_unavailable",
            rawProduct: product,
          });
        }
        return isInvalid;
      });

      if (insufficientStock) {
        const isCombo = Boolean(insufficientStock.combo_id || insufficientStock.combo_snapshot);
        const productName = insufficientStock.products?.name || insufficientStock.name || (isCombo ? (insufficientStock.combo_snapshot?.name || "Combo") : "One or more products");
        const detail = getCartItemValidationDetail(insufficientStock);
        const variantName = detail.variantName ? ` / ${detail.variantName}` : "";
        const displayName = `${productName}${variantName}`;
        console.error("Checkout item validation result:", { ...detail, displayName, reason: detail.availabilityReason, isCombo });
        toast.error(`${displayName} is currently unavailable or the requested quantity exceeds available stock.`);
        setSubmitting(false);
        return;
      }

      const authUser = user;
      if (!authUser) throw new Error("Unable to fetch authenticated user.");

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const supabaseUser = authData.user;
      if (!supabaseUser?.id) throw new Error("Unable to place order: no authenticated session found.");
      if (supabaseUser.id !== authUser.id) {
        console.warn("Supabase auth user ID mismatch:", { supabaseUserId: supabaseUser.id, hookUserId: authUser.id });
      }

      // Ensure address is saved in `addresses` table and attach its id to the order
      let addressId = selectedAddressId;
      if (!addressId) {
        // Try to find an identical saved address
        const found = savedAddresses.find((s) => s.full_name === addr.full_name && s.phone === addr.phone && s.line1 === addr.line1 && (s.line2 ?? "") === (addr.line2 ?? "") && s.city === addr.city && s.state === addr.state && s.pincode === addr.pincode);
        if (found) {
          addressId = found.id;
          setSelectedAddressId(addressId);
        } else {
          const currentGps = currentLocationCoordsRef.current;
          const latitude = currentGps?.lat ?? null;
          const longitude = currentGps?.lng ?? null;
          const locationAccuracy = currentGps?.accuracy ?? null;

          const { data: newAddr, error: addrErr } = await (supabase as any)
            .from("addresses")
            .insert({
                user_id: supabaseUser.id,
                full_name: addr.full_name,
                phone: addr.phone,
                line1: addr.line1,
                line2: addr.line2 ?? null,
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                latitude,
                longitude,
                location_accuracy: locationAccuracy,
                is_default: false,
              })
            .select()
            .single();
          if (addrErr) throw addrErr;
          addressId = newAddr.id;
          setSavedAddresses((s) => [newAddr, ...s]);
          setSelectedAddressId(addressId);
        }
      }

      const finalSummary = getCartOrderSummary(items);
      const deliveryStatus = getOrderCutoffStatus();
      const deliveryDate = deliveryStatus.deliveryDate.toISOString();
      const orderPayload = {
        user_id: supabaseUser.id,
        subtotal: finalSummary.subtotal,
        delivery_fee: finalSummary.deliveryFee,
        total: finalSummary.total,
        payment_method: "cod",
        payment_status: "pending",
        status: "pending",
        address_snapshot: addr as any,
        address_id: addressId ?? null,
        delivery_slot: deliveryStatus.isAfterCutoff ? "next_day" : "same_day",
        delivery_date: deliveryDate,
      };

      console.log("Authenticated user:", supabaseUser);
      console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

      const { data: order, error: oe } = await (supabase as any)
        .from("orders")
        .insert(orderPayload as any)
        .select()
        .single();
      console.log("Order insert error:", JSON.stringify(oe, null, 2));
      if (oe) throw oe;

      // Build order_items including combo items
      const orderItems: any[] = [];
      const comboSnapshotsToInsert: any[] = [];
      for (const i of items) {
        if (isComboCartItem(i)) {
          const comboId = i.combo_id ?? i.combo_snapshot?.id ?? null;
          if (!comboId) throw new Error("Combo item is missing its combo reference");

          const { data: combo } = await supabase.from("combos").select("*").eq("id", comboId).maybeSingle();
          if (!combo) throw new Error("Combo is no longer available");
          if (combo.status !== "active") throw new Error("Combo is no longer available");
          if (combo.stock != null && Number(combo.stock) < Number(i.quantity)) throw new Error("Combo is sold out or insufficient stock");

          const price = Number(i.combo_snapshot?.offer_price ?? i.combo_snapshot?.price ?? combo.offer_price ?? combo.price ?? 0);
          orderItems.push({
            order_id: order.id,
            product_id: null,
            variant_id: null,
            name: i.combo_snapshot?.name ?? combo.name ?? "Combo",
            variant_name: null,
            image_url: i.combo_snapshot?.image_url ?? combo.image_url,
            unit: "combo",
            price,
            quantity: i.quantity,
            subtotal: Number(price) * Number(i.quantity),
          });

          comboSnapshotsToInsert.push({ order_id: order.id, combo_id: comboId, snapshot: i.combo_snapshot ?? combo });
        } else {
          const normalizedProductId = isValidUuid(i.product_id) ? i.product_id : null;
          const normalizedVariantId = isValidUuid(i.variant_id) ? i.variant_id : null;
          const linePrice = Number(i.variant_price ?? i.products?.price ?? 0);

          orderItems.push({
            order_id: order.id,
            product_id: normalizedProductId,
            variant_id: normalizedVariantId,
            name: i.products?.name ?? "",
            variant_name: i.variant_name ?? null,
            image_url: i.variant_image_url ?? i.products?.image_url,
            unit: i.variant_unit ?? i.products?.unit,
            price: linePrice,
            quantity: i.quantity,
            subtotal: linePrice * i.quantity,
          });
        }
      }

      if (import.meta.env.DEV) {
        console.log("ORDER_ITEMS INSERT PAYLOAD", orderItems);
      }

      const insertOp = (supabase as any).from("order_items").insert(orderItems as any[]);
      // attempt to select inserted rows for logging without changing server-side schema
      let insertedData: any = null;
      let ie: any = null;
      try {
        const res = await insertOp.select("order_id,product_id,variant_id,name,variant_name,image_url,unit,price,quantity,subtotal");
        insertedData = res.data;
        ie = res.error;
      } catch (err: any) {
        ie = err;
      }

      if (ie) {
        console.error("ORDER_ITEMS INSERT ERROR", {
          code: ie?.code,
          message: ie?.message,
          details: ie?.details,
          hint: ie?.hint,
        });
        // also log any returned data for diagnosis
        if (import.meta.env.DEV) console.log("ORDER_ITEMS INSERT RETURNED DATA", insertedData);
        throw ie;
      }

      if (import.meta.env.DEV) console.log("ORDER_ITEMS INSERTED", insertedData);

      // insert combo snapshots for order history
      if (comboSnapshotsToInsert.length > 0) {
        const { error: csErr } = await supabase.from("combo_order_snapshots").insert(comboSnapshotsToInsert);
        if (csErr) console.warn("Failed to insert combo snapshots:", csErr);
      }

      await supabase.from("cart_items").delete().eq("user_id", user.id);

      // Send admin email after the order has been created successfully.
      // This call is intentionally fire-and-forget from the customer's perspective.
      // If the email API fails, the order stays saved and the customer still sees success.
      try {
        const orderNotificationPayload = {
          orderId: String(order.id),
          customerName: addr.full_name,
          customerPhone: addr.phone,
          customerEmail: user.email || "",
          deliveryAddress: [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", "),
          deliveryDate: deliveryDate,
          orderItems: items.map((item) => {
            const isComboItem = isComboCartItem(item);
            const unitPrice = Number(item.variant_price ?? item.products?.price ?? item.combo_snapshot?.offer_price ?? item.combo_snapshot?.price ?? 0);
            const sizeLabel = isComboItem
              ? [item.combo_snapshot?.name ?? "Combo"].filter(Boolean).join(" ").trim()
              : [item.variant_name, item.variant_unit ?? item.products?.unit ?? item.products?.weight].filter(Boolean).join(" ").trim();
            return {
              name: isComboItem ? (item.combo_snapshot?.name ?? "Combo") : (item.products?.name || "Product"),
              size: sizeLabel || undefined,
              quantity: item.quantity,
              price: unitPrice,
              subtotal: Number(unitPrice * item.quantity),
            };
          }),
          quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
          totalAmount: total,
          paymentMethod: "Cash on Delivery",
          orderTime: new Date().toISOString(),
        };

        // Call the TanStack Start server function for notifications.
        // This imports the server function dynamically so the client code
        // delegates the work to the server at runtime without needing a
        // separate backend process or a proxy.
        try {
          // Import the client stub for the server function. This import is
          // safe in the browser because `notifyOrder` is created via
          // `createServerFn` and will not bundle server-only modules.
          const { notifyOrder } = await import('../serverFns/notifyOrder.functions');
          const res = await notifyOrder({ data: orderNotificationPayload as any });
          if (!res || res.success === false) {
            console.error('Order notification failed after order creation:', res);
          } else {
            console.log('Order notification sent successfully:', res);
          }
        } catch (notificationError) {
          console.error('Order notification call failed after order creation:', notificationError);
        }
      } catch (notificationError) {
        console.error('Order notification call failed after order creation:', notificationError);
      }

      toast.success("Order placed successfully!");
      navigate({ to: "/orders" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Checkout</h1>
        <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Saved addresses selector */}
            {savedAddresses.length > 0 && (
              <section className="rounded-xl border bg-card p-4 shadow-card">
                <h3 className="mb-3 font-bold">Saved addresses</h3>
                <div className="grid gap-3">
                  {savedAddresses.map((a) => (
                    <div key={a.id} className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${selectedAddressId === a.id ? "border-primary bg-primary/5" : "hover:bg-secondary"}`}>
                      <div>
                                        <div className="font-medium">{a.full_name} <span className="text-muted-foreground">• {a.phone}</span></div>
                                                        <div className="text-sm text-muted-foreground">{stripAdminSuffix(a.line1)}{a.line2 ? ", " + stripAdminSuffix(a.line2) : ""}, {stripAdminSuffix(a.city)}{a.state ? `, ${stripAdminSuffix(a.state)}` : ""} — {a.pincode}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button type="button" className="text-sm text-primary underline" onClick={() => {
                          const savedHasGps = a.latitude != null && a.longitude != null && String(a.latitude).trim() !== "" && String(a.longitude).trim() !== "";

                          if (savedHasGps) {
                            const restored = restoreSavedAddressLocation(a);
                            if (restored) {
                              setAddr({
                                full_name: a.full_name,
                                phone: a.phone,
                                line1: a.line1,
                                line2: stripAdminSuffix(a.line2 ?? ""),
                                city: stripAdminSuffix(a.city),
                                state: stripAdminSuffix(a.state ?? ""),
                                pincode: a.pincode,
                              });
                              setSelectedAddressId(a.id);
                              return;
                            }
                          }

                          clearCurrentLocation();
                          setAddr({
                            full_name: a.full_name,
                            phone: a.phone,
                            line1: a.line1,
                            line2: stripAdminSuffix(a.line2 ?? ""),
                            city: stripAdminSuffix(a.city),
                            state: stripAdminSuffix(a.state ?? ""),
                            pincode: a.pincode,
                          });
                          setSelectedAddressId(a.id);
                          const q = [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(" ");
                          checkDeliveryAvailability(q + ", India");
                        }}>Use</button>
                        <button type="button" className="text-sm text-destructive" onClick={async () => {
                          try {
                            const { error } = await (supabase as any).from("addresses").delete().eq("id", a.id).eq("user_id", user.id);
                            if (error) throw error;
                            setSavedAddresses((s) => s.filter((x) => x.id !== a.id));
                            if (selectedAddressId === a.id) {
                              setSelectedAddressId(null);
                              setAddr({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
                            }
                            toast.success("Address removed");
                          } catch (e: any) {
                            toast.error(e.message || "Failed to remove address");
                          }
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={useCurrentLocation} className="text-sm text-primary underline" disabled={checkingDelivery}>
                    {checkingDelivery ? "Detecting…" : "Use my current location"}
                  </button>
                  <button type="button" onClick={saveAddressNow} className="ml-2 rounded-full border px-3 py-1 text-sm" disabled={checkingDelivery}>
                    Save address
                  </button>
                </div>
              </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input required value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} /></div>
                <div><Label>Phone</Label><Input required type="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address Line 1</Label><Input placeholder="House No., Street, Landmark" required value={addr.line1} onChange={(e) => {
                  const v = e.target.value;
                  const { line1, line2 } = sanitizeLine1(v);
                  clearCurrentLocation();
                  setAddr((a) => ({ ...a, line1, line2: line2 || a.line2 }));
                }} /></div>
                <div className="sm:col-span-2"><Label>Address Line 2 (optional)</Label><Input value={addr.line2} onChange={(e) => {
                  clearCurrentLocation();
                  setAddr({ ...addr, line2: e.target.value });
                }} /></div>
                <div><Label>City</Label><Input required value={addr.city} onChange={(e) => {
                  clearCurrentLocation();
                  setAddr({ ...addr, city: e.target.value });
                }} /></div>
                <div><Label>State</Label><Input required value={addr.state} onChange={(e) => {
                  clearCurrentLocation();
                  setAddr({ ...addr, state: e.target.value });
                }} /></div>
                <div><Label>Pincode</Label><Input required value={addr.pincode} onChange={(e) => {
                  clearCurrentLocation();
                  setAddr({ ...addr, pincode: e.target.value });
                }} /></div>
                {addressNotFound && (
                  <div className="sm:col-span-2 text-sm text-warning">⚠️ We couldn't verify this address. Please check the address, enter a nearby landmark, or use Current Location.</div>
                )}
                {!addressNotFound && deliveryAvailable === false && (
                  <div className="sm:col-span-2 text-sm text-destructive">❌ Delivery is unavailable because this address is outside our {DELIVERY_RADIUS_KM} km delivery area.</div>
                )}
                {!addressNotFound && deliveryAvailable === true && (
                  <div className="sm:col-span-2 text-sm text-success">✅ Delivery available{deliveryDistance ? ` (${deliveryDistance.toFixed(2)} km from store)` : ""}</div>
                )}
                {!addressNotFound && deliveryAvailable === null && checkingDelivery && (
                  <div className="sm:col-span-2 text-sm text-muted-foreground">Checking delivery availability…</div>
                )}
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-2 font-bold">Delivery</h3>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
                <div className="font-medium">Same-day delivery</div>
                <div className="mt-1 text-muted-foreground">We will deliver your order within the same day.</div>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-bold"><Wallet className="h-4 w-4 text-primary" /> Payment Method</h3>
              <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Wallet className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Cash on Delivery</div>
                  <div className="text-xs text-muted-foreground">Pay in cash when your order arrives.</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
              <div className="mb-3 max-h-56 space-y-2 overflow-auto text-sm">
                {items.map((i) => {
                  const isComboItem = Boolean(i.combo_id || i.combo_snapshot);
                  const displayName = isComboItem ? (i.combo_snapshot?.name ?? "Combo") : (i.products?.name ?? "Product");
                  const linePrice = Number(i.variant_price ?? i.products?.price ?? i.combo_snapshot?.offer_price ?? i.combo_snapshot?.price ?? 0);

                  return (
                    <div key={i.id} className="flex justify-between gap-2">
                      <span className="line-clamp-1">{displayName} {i.variant_name ? <span className="text-muted-foreground">— {i.variant_name}</span> : null} <span className="text-muted-foreground">× {i.quantity}</span></span>
                      <span className="font-medium">{formatINR(linePrice * i.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 border-t pt-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? <span className="text-success">FREE</span> : formatINR(deliveryFee)}</span></div>
                {orderSummary.hasCombo && (
                  <div className="rounded-md bg-emerald-50 px-2 py-2 text-xs font-medium text-emerald-800">నేటి కాంబోతో ఉచిత డెలివరీ</div>
                )}
                {!orderSummary.hasCombo && subtotal > 0 && subtotal < 499 && (
                  <div className="rounded-md bg-accent/10 px-2 py-2 text-xs text-accent-foreground/80">Add {formatINR(499 - subtotal)} more for free delivery</div>
                )}
                <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div>
              </div>
              <Button type="submit" size="lg" disabled={submitting || deliveryAvailable === false || checkingDelivery} className="mt-4 w-full rounded-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Place Order (COD)
              </Button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}
