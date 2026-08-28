// Configure store location and delivery radius here.
// You can provide an explicit latitude/longitude to use as the center
// for the delivery radius calculation. If `STORE_LAT` and `STORE_LNG`
// are not set (null), the app will fall back to geocoding `STORE_LOCATION`.
//
// To set coordinates via environment variables:
//   STORE_LAT=16.123456 STORE_LNG=80.123456
// Or edit this file and replace the `null` values below.
export const STORE_LOCATION = process.env.STORE_LOCATION || "534449, Kamavarapukota, Eluru, Andhra Pradesh, India";
export const STORE_LAT = process.env.STORE_LAT ? Number(process.env.STORE_LAT) : 17.0108773; // user-provided latitude
export const STORE_LNG = process.env.STORE_LNG ? Number(process.env.STORE_LNG) : 81.2058380; // user-provided longitude
export const DELIVERY_RADIUS_KM = Number(process.env.DELIVERY_RADIUS_KM) || 5; // kilometers

// Example: to hardcode the center here, uncomment and set the values below:
// export const STORE_LAT = 17.0108773;
// export const STORE_LNG = 81.2058380;
