import { t as cn } from "./utils-C_uf36nf.js";
import { t as supabase } from "./client-Dxm-ZOZR.js";
import { a as useAuth, o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { r as useCart, t as Header } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import * as React$1 from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Circle, Loader2, MapPin, Wallet } from "lucide-react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
//#region src/components/UI/radio-group.tsx
var RadioGroup = React$1.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(RadioGroupPrimitive.Root, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React$1.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(RadioGroupPrimitive.Item, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
//#endregion
//#region src/lib/config.ts
var STORE_LOCATION = process.env.STORE_LOCATION || "534449, Kamavarapukota, Eluru, Andhra Pradesh, India";
var STORE_LAT = process.env.STORE_LAT ? Number(process.env.STORE_LAT) : 17.0108773;
var STORE_LNG = process.env.STORE_LNG ? Number(process.env.STORE_LNG) : 81.205838;
var DELIVERY_RADIUS_KM = Number(process.env.DELIVERY_RADIUS_KM) || 5;
//#endregion
//#region src/routes/checkout.tsx?tsr-split=component
function Checkout() {
	const { user } = useAuth();
	const { data: cart } = useCart(user?.id);
	const navigate = useNavigate();
	const [slot, setSlot] = useState("today-evening");
	const [submitting, setSubmitting] = useState(false);
	const [addr, setAddr] = useState({
		full_name: "",
		phone: "",
		line1: "",
		line2: "",
		city: "",
		state: "",
		pincode: ""
	});
	const [savedAddresses, setSavedAddresses] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState(null);
	const [deliveryAvailable, setDeliveryAvailable] = useState(null);
	const [deliveryError, setDeliveryError] = useState(null);
	const [deliveryDistance, setDeliveryDistance] = useState(null);
	const [addressNotFound, setAddressNotFound] = useState(false);
	const [checkingDelivery, setCheckingDelivery] = useState(false);
	const checkAbortRef = useRef(null);
	const checkRequestIdRef = useRef(0);
	const storeCoordsRef = useRef(null);
	const sanitizeLine1 = (value) => {
		const parts = String(value).split(",").map((s) => s.trim()).filter(Boolean);
		if (parts.length <= 2) return {
			line1: parts.join(", "),
			line2: ""
		};
		return {
			line1: parts.slice(0, 2).join(", "),
			line2: parts.slice(2).join(", ")
		};
	};
	const distanceKm = (lat1, lon1, lat2, lon2) => {
		const toRad = (v) => v * Math.PI / 180;
		const R = 6371;
		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
	};
	const checkDeliveryAvailability = async (addressQuery) => {
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
				if (typeof STORE_LAT === "number" && typeof STORE_LNG === "number") storeCoordsRef.current = {
					lat: STORE_LAT,
					lng: STORE_LNG
				};
				else {
					const sres = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(STORE_LOCATION)}&format=json&limit=1`, { signal: ac.signal });
					if (!sres.ok) throw new Error("Failed to geocode store location");
					const sbody = await sres.json();
					if (!sbody || sbody.length === 0) throw new Error("Unable to resolve store location");
					storeCoordsRef.current = {
						lat: Number(sbody[0].lat),
						lng: Number(sbody[0].lon)
					};
				}
			}
			const geocodeOnce = async (qstr) => {
				const q = encodeURIComponent(qstr);
				console.debug("Geocoding query:", qstr);
				const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`, { signal: ac.signal });
				if (!r.ok) throw new Error(`Geocode failed: ${r.status}`);
				const b = await r.json();
				console.debug("Nominatim response for query:", qstr, b);
				return b && b.length > 0 ? b[0] : null;
			};
			const normalized = String(addressQuery).replace(/\s*,?\s*India\s*$/i, "").trim();
			const pinMatch = normalized.match(/(\d{5,6})/);
			const pin = pinMatch ? pinMatch[0] : addr.pincode || "";
			const cityPart = addr.city || "";
			const statePart = addr.state || "";
			const attempts = Array.from(new Set([
				normalized,
				`${cityPart || normalized}, ${pin || ""}`.replace(/,\s*$/g, "").trim(),
				`${cityPart || normalized}, ${statePart || ""}, ${pin || ""}`.replace(/,\s*$/g, "").trim(),
				`${cityPart || normalized}, ${statePart || ""}`.replace(/,\s*$/g, "").trim(),
				pin ? `${pin}, India` : ""
			].filter(Boolean)));
			let geo = null;
			for (const candidate of attempts) try {
				geo = await geocodeOnce(candidate);
				if (geo) {
					console.debug("Geocode success for attempt:", candidate);
					break;
				}
			} catch (e) {
				if (e?.name === "AbortError") throw e;
				console.warn("Geocode attempt failed for", candidate, e);
			}
			if (requestId !== checkRequestIdRef.current) return null;
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
			const { lat: storeLat, lng: storeLng } = storeCoordsRef.current;
			const d = distanceKm(storeLat, storeLng, lat, lon);
			const ok = d <= DELIVERY_RADIUS_KM;
			setDeliveryDistance(d);
			setAddressNotFound(false);
			setDeliveryError(null);
			console.info("Delivery check — store:", storeCoordsRef.current, "customer:", {
				lat,
				lon
			}, "distance_km:", d, "radius_km:", DELIVERY_RADIUS_KM, "ok:", ok);
			setDeliveryAvailable(ok);
			return ok;
		} catch (err) {
			if (err?.name === "AbortError") return null;
			console.warn("Delivery check failed", err);
			setDeliveryAvailable(null);
			setAddressNotFound(false);
			setDeliveryDistance(null);
			setDeliveryError("Delivery check failed — please retry");
			return null;
		} finally {
			if (checkRequestIdRef.current === 0 || requestId === checkRequestIdRef.current) setCheckingDelivery(false);
		}
	};
	const useCurrentLocation = async () => {
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			toast.error("Geolocation not supported in this browser");
			return;
		}
		setCheckingDelivery(true);
		try {
			const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, {
				enableHighAccuracy: true,
				timeout: 15e3
			}));
			const lat = pos.coords.latitude;
			const lon = pos.coords.longitude;
			const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
			if (!res.ok) throw new Error("Failed to reverse geocode");
			const body = await res.json();
			const addrParts = body.address ?? {};
			let rawLine1 = [
				addrParts.house_number,
				addrParts.road,
				addrParts.neighbourhood,
				addrParts.suburb
			].filter(Boolean).join(", ");
			if (!rawLine1 && body.display_name) rawLine1 = String(body.display_name).replace(/\s*,\s*India\s*$/i, "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2).join(", ");
			const sanitized = sanitizeLine1(rawLine1);
			const line1 = sanitized.line1;
			const line2 = sanitized.line2 || [addrParts.suburb, addrParts.neighbourhood].filter(Boolean).join(", ") || "";
			const city = addrParts.city || addrParts.town || addrParts.village || addrParts.county || addrParts.state_district || "";
			const state = addrParts.state || "";
			const pincode = addrParts.postcode || "";
			setAddr((a) => ({
				...a,
				line1,
				line2,
				city,
				state,
				pincode
			}));
			const q = [
				line1,
				line2,
				city,
				state,
				pincode
			].filter(Boolean).join(", ");
			await checkDeliveryAvailability(q + ", India");
			toast.success("Location detected — please verify address details before saving or placing order");
		} catch (e) {
			console.warn("Geolocation/reverse geocode failed", e);
			toast.error(e?.message || "Failed to detect location");
		} finally {
			setCheckingDelivery(false);
		}
	};
	const saveAddressNow = async () => {
		if (!user) {
			toast.error("Please sign in to save addresses");
			return;
		}
		if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
			toast.error("Please fill all address fields before saving");
			return;
		}
		try {
			const { data: newAddr, error: addrErr } = await supabase.from("addresses").insert({
				user_id: user.id,
				full_name: addr.full_name,
				phone: addr.phone,
				line1: addr.line1,
				line2: addr.line2 ?? null,
				city: addr.city,
				state: addr.state,
				pincode: addr.pincode,
				is_default: false
			}).select().single();
			if (addrErr) throw addrErr;
			setSavedAddresses((s) => [newAddr, ...s ?? []]);
			setSelectedAddressId(newAddr.id);
			toast.success("Address saved");
		} catch (e) {
			console.warn("Failed to save address", e);
			toast.error(e?.message || "Failed to save address");
		}
	};
	useEffect(() => {
		let qParts = [];
		if (addr.line1 && addr.line1.trim().length > 0) qParts = [
			addr.line1,
			addr.line2,
			addr.city,
			addr.state,
			addr.pincode
		].filter(Boolean);
		else if (addr.city && addr.pincode) qParts = [addr.city, addr.pincode].filter(Boolean);
		if (qParts.length === 0) {
			setDeliveryAvailable(null);
			return;
		}
		const qStr = `${qParts.join(" ")}, India`;
		const id = setTimeout(() => {
			checkDeliveryAvailability(qStr);
		}, 700);
		return () => clearTimeout(id);
	}, [
		addr.line1,
		addr.line2,
		addr.city,
		addr.state,
		addr.pincode
	]);
	useEffect(() => {
		if (!user) return;
		let mounted = true;
		(async () => {
			try {
				const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
				if (!mounted) return;
				setSavedAddresses(data ?? []);
			} catch (e) {
				console.warn("Failed to load saved addresses", e);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [user]);
	const items = cart ?? [];
	const subtotal = items.reduce((s, i) => s + Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity, 0);
	const deliveryFee = subtotal >= 899 ? 0 : 29;
	const total = subtotal + deliveryFee;
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
			className: "py-20 text-center",
			children: [
				"Please ",
				/* @__PURE__ */ jsx(Link, {
					to: "/auth",
					className: "text-primary underline",
					children: "sign in"
				}),
				"."
			]
		})]
	});
	if (items.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
			className: "py-20 text-center",
			children: [
				"Your cart is empty. ",
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "text-primary underline",
					children: "Shop now"
				}),
				"."
			]
		})]
	});
	const placeOrder = async (e) => {
		e.preventDefault();
		if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.pincode) {
			toast.error("Please fill all address fields");
			return;
		}
		const qStr = `${[
			addr.line1,
			addr.line2,
			addr.city,
			addr.state,
			addr.pincode
		].filter(Boolean).join(" ")}, India`;
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
		setSubmitting(true);
		try {
			const { data: currentProducts } = await supabase.from("products").select("id, stock").in("id", items.map((i) => i.product_id));
			const variantIds = items.map((i) => i.variant_id).filter(Boolean);
			const { data: currentVariants } = variantIds.length > 0 ? await supabase.from("product_variants").select("id, stock").in("id", variantIds) : { data: [] };
			const insufficientStock = items.find((item) => {
				if (item.variant_id) {
					const variant = currentVariants?.find((v) => v.id === item.variant_id);
					return !variant || variant.stock < item.quantity;
				}
				const product = currentProducts?.find((p) => p.id === item.product_id);
				return !product || product.stock < item.quantity;
			});
			if (insufficientStock) {
				const productName = insufficientStock.products?.name || "One or more products";
				toast.error(`${productName} is out of stock or insufficient quantity available`);
				setSubmitting(false);
				return;
			}
			const authUser = user;
			if (!authUser) throw new Error("Unable to fetch authenticated user.");
			const { data: authData, error: authError } = await supabase.auth.getUser();
			if (authError) throw authError;
			const supabaseUser = authData.user;
			if (!supabaseUser?.id) throw new Error("Unable to place order: no authenticated session found.");
			if (supabaseUser.id !== authUser.id) console.warn("Supabase auth user ID mismatch:", {
				supabaseUserId: supabaseUser.id,
				hookUserId: authUser.id
			});
			let addressId = selectedAddressId;
			if (!addressId) {
				const found = savedAddresses.find((s) => s.full_name === addr.full_name && s.phone === addr.phone && s.line1 === addr.line1 && (s.line2 ?? "") === (addr.line2 ?? "") && s.city === addr.city && s.state === addr.state && s.pincode === addr.pincode);
				if (found) {
					addressId = found.id;
					setSelectedAddressId(addressId);
				} else {
					const { data: newAddr, error: addrErr } = await supabase.from("addresses").insert({
						user_id: supabaseUser.id,
						full_name: addr.full_name,
						phone: addr.phone,
						line1: addr.line1,
						line2: addr.line2 ?? null,
						city: addr.city,
						state: addr.state,
						pincode: addr.pincode,
						is_default: false
					}).select().single();
					if (addrErr) throw addrErr;
					addressId = newAddr.id;
					setSavedAddresses((s) => [newAddr, ...s]);
					setSelectedAddressId(addressId);
				}
			}
			const orderPayload = {
				user_id: supabaseUser.id,
				subtotal,
				delivery_fee: deliveryFee,
				total,
				payment_method: "cod",
				payment_status: "pending",
				status: "pending",
				address_snapshot: addr,
				address_id: addressId ?? null,
				delivery_slot: slot
			};
			console.log("Authenticated user:", supabaseUser);
			console.log("Order payload:", JSON.stringify(orderPayload, null, 2));
			const { data: order, error: oe } = await supabase.from("orders").insert(orderPayload).select().single();
			console.log("Order insert error:", JSON.stringify(oe, null, 2));
			if (oe) throw oe;
			const orderItems = items.map((i) => ({
				order_id: order.id,
				product_id: i.product_id,
				variant_id: i.variant_id ?? null,
				name: i.products?.name ?? "",
				variant_name: i.variant_name ?? null,
				image_url: i.variant_image_url ?? i.products?.image_url,
				unit: i.variant_unit ?? i.products?.unit,
				price: i.variant_price ?? i.products?.price,
				quantity: i.quantity,
				subtotal: Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity
			}));
			const { error: ie } = await supabase.from("order_items").insert(orderItems);
			if (ie) throw ie;
			await supabase.from("cart_items").delete().eq("user_id", user.id);
			try {
				const orderNotificationPayload = {
					orderId: String(order.id),
					customerName: addr.full_name,
					customerPhone: addr.phone,
					customerEmail: user.email || "",
					deliveryAddress: [
						addr.line1,
						addr.line2,
						addr.city,
						addr.state,
						addr.pincode
					].filter(Boolean).join(", "),
					orderItems: items.map((item) => ({
						name: item.products?.name || "Product",
						quantity: item.quantity,
						price: Number(item.variant_price ?? item.products?.price ?? 0),
						subtotal: Number((item.variant_price ?? item.products?.price ?? 0) * item.quantity)
					})),
					quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
					totalAmount: total,
					paymentMethod: "Cash on Delivery",
					orderTime: (/* @__PURE__ */ new Date()).toISOString()
				};
				try {
					const { notifyOrder } = await import("./notifyOrder.functions-BN4mGvDF.js");
					const res = await notifyOrder({ data: orderNotificationPayload });
					if (!res || res.success === false) console.error("Order notification failed after order creation:", res);
					else console.log("Order notification sent successfully:", res);
				} catch (notificationError) {
					console.error("Order notification call failed after order creation:", notificationError);
				}
			} catch (notificationError) {
				console.error("Order notification call failed after order creation:", notificationError);
			}
			toast.success("Order placed successfully!");
			navigate({ to: "/orders" });
		} catch (err) {
			toast.error(err.message ?? "Failed to place order");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "Checkout"
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: placeOrder,
					className: "grid gap-6 lg:grid-cols-[1fr_360px]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							savedAddresses.length > 0 && /* @__PURE__ */ jsxs("section", {
								className: "rounded-xl border bg-card p-4 shadow-card",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "mb-3 font-bold",
									children: "Saved addresses"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid gap-3",
									children: savedAddresses.map((a) => /* @__PURE__ */ jsxs("div", {
										className: `flex items-start justify-between gap-3 rounded-lg border p-3 ${selectedAddressId === a.id ? "border-primary bg-primary/5" : "hover:bg-secondary"}`,
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
											className: "font-medium",
											children: [
												a.full_name,
												" ",
												/* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground",
													children: ["• ", a.phone]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-sm text-muted-foreground",
											children: [
												a.line1,
												a.line2 ? ", " + a.line2 : "",
												", ",
												a.city,
												a.state ? `, ${a.state}` : "",
												" — ",
												a.pincode
											]
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-end gap-2",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												className: "text-sm text-primary underline",
												onClick: () => {
													setAddr({
														full_name: a.full_name,
														phone: a.phone,
														line1: a.line1,
														line2: a.line2 ?? "",
														city: a.city,
														state: a.state ?? "",
														pincode: a.pincode
													});
													setSelectedAddressId(a.id);
													const q = [
														a.line1,
														a.line2,
														a.city,
														a.state,
														a.pincode
													].filter(Boolean).join(" ");
													checkDeliveryAvailability(q + ", India");
												},
												children: "Use"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												className: "text-sm text-destructive",
												onClick: async () => {
													try {
														const { error } = await supabase.from("addresses").delete().eq("id", a.id).eq("user_id", user.id);
														if (error) throw error;
														setSavedAddresses((s) => s.filter((x) => x.id !== a.id));
														if (selectedAddressId === a.id) {
															setSelectedAddressId(null);
															setAddr({
																full_name: "",
																phone: "",
																line1: "",
																line2: "",
																city: "",
																state: "",
																pincode: ""
															});
														}
														toast.success("Address removed");
													} catch (e) {
														toast.error(e.message || "Failed to remove address");
													}
												},
												children: "Remove"
											})]
										})]
									}, a.id))
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-4 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "flex items-center gap-2 font-bold",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }), " Delivery Address"]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: useCurrentLocation,
											className: "text-sm text-primary underline",
											disabled: checkingDelivery,
											children: checkingDelivery ? "Detecting…" : "Use my current location"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: saveAddressNow,
											className: "ml-2 rounded-full border px-3 py-1 text-sm",
											disabled: checkingDelivery,
											children: "Save address"
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Full Name" }), /* @__PURE__ */ jsx(Input, {
											required: true,
											value: addr.full_name,
											onChange: (e) => setAddr({
												...addr,
												full_name: e.target.value
											})
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Phone" }), /* @__PURE__ */ jsx(Input, {
											required: true,
											type: "tel",
											value: addr.phone,
											onChange: (e) => setAddr({
												...addr,
												phone: e.target.value
											})
										})] }),
										/* @__PURE__ */ jsxs("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ jsx(Label, { children: "Address Line 1" }), /* @__PURE__ */ jsx(Input, {
												placeholder: "House No., Street, Landmark",
												required: true,
												value: addr.line1,
												onChange: (e) => {
													const v = e.target.value;
													const { line1, line2 } = sanitizeLine1(v);
													setAddr((a) => ({
														...a,
														line1,
														line2: line2 || a.line2
													}));
												}
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ jsx(Label, { children: "Address Line 2 (optional)" }), /* @__PURE__ */ jsx(Input, {
												value: addr.line2,
												onChange: (e) => setAddr({
													...addr,
													line2: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "City" }), /* @__PURE__ */ jsx(Input, {
											required: true,
											value: addr.city,
											onChange: (e) => setAddr({
												...addr,
												city: e.target.value
											})
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "State" }), /* @__PURE__ */ jsx(Input, {
											required: true,
											value: addr.state,
											onChange: (e) => setAddr({
												...addr,
												state: e.target.value
											})
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Pincode" }), /* @__PURE__ */ jsx(Input, {
											required: true,
											value: addr.pincode,
											onChange: (e) => setAddr({
												...addr,
												pincode: e.target.value
											})
										})] }),
										addressNotFound && /* @__PURE__ */ jsx("div", {
											className: "sm:col-span-2 text-sm text-warning",
											children: "⚠️ We couldn't verify this address. Please check the address, enter a nearby landmark, or use Current Location."
										}),
										!addressNotFound && deliveryAvailable === false && /* @__PURE__ */ jsxs("div", {
											className: "sm:col-span-2 text-sm text-destructive",
											children: [
												"❌ Delivery is unavailable because this address is outside our ",
												DELIVERY_RADIUS_KM,
												" km delivery area."
											]
										}),
										!addressNotFound && deliveryAvailable === true && /* @__PURE__ */ jsxs("div", {
											className: "sm:col-span-2 text-sm text-success",
											children: ["✅ Delivery available", deliveryDistance ? ` (${deliveryDistance.toFixed(2)} km from store)` : ""]
										}),
										!addressNotFound && deliveryAvailable === null && checkingDelivery && /* @__PURE__ */ jsx("div", {
											className: "sm:col-span-2 text-sm text-muted-foreground",
											children: "Checking delivery availability…"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "mb-4 font-bold",
									children: "Delivery Slot"
								}), /* @__PURE__ */ jsx(RadioGroup, {
									value: slot,
									onValueChange: setSlot,
									className: "grid gap-2 sm:grid-cols-3",
									children: [
										{
											v: "today-evening",
											l: "Today 6–9 PM"
										},
										{
											v: "tomorrow-morning",
											l: "Tomorrow 8–11 AM"
										},
										{
											v: "tomorrow-evening",
											l: "Tomorrow 6–9 PM"
										}
									].map((s) => /* @__PURE__ */ jsxs("label", {
										className: `flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${slot === s.v ? "border-primary bg-primary/5" : ""}`,
										children: [
											/* @__PURE__ */ jsx(RadioGroupItem, { value: s.v }),
											" ",
											s.l
										]
									}, s.v))
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "mb-4 flex items-center gap-2 font-bold",
									children: [/* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-primary" }), " Payment Method"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground",
										children: /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-semibold",
										children: "Cash on Delivery"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: "Pay in cash when your order arrives."
									})] })]
								})]
							})
						]
					}), /* @__PURE__ */ jsx("aside", {
						className: "lg:sticky lg:top-24 lg:self-start",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border bg-card p-5 shadow-card",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "mb-4 text-lg font-bold",
									children: "Order Summary"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mb-3 max-h-56 space-y-2 overflow-auto text-sm",
									children: items.map((i) => /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between gap-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "line-clamp-1",
											children: [
												i.products?.name,
												" ",
												i.variant_name ? /* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground",
													children: ["— ", i.variant_name]
												}) : null,
												" ",
												/* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground",
													children: ["× ", i.quantity]
												})
											]
										}), /* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: formatINR(Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity)
										})]
									}, i.id))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2 border-t pt-3 text-sm",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Subtotal"
											}), /* @__PURE__ */ jsx("span", { children: formatINR(subtotal) })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Delivery"
											}), /* @__PURE__ */ jsx("span", { children: deliveryFee === 0 ? /* @__PURE__ */ jsx("span", {
												className: "text-success",
												children: "FREE"
											}) : formatINR(deliveryFee) })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-2 flex justify-between border-t pt-2 text-lg font-bold",
											children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: formatINR(total) })]
										})
									]
								}),
								/* @__PURE__ */ jsxs(Button, {
									type: "submit",
									size: "lg",
									disabled: submitting || deliveryAvailable === false || checkingDelivery,
									className: "mt-4 w-full rounded-full",
									children: [submitting ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Place Order (COD)"]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { Checkout as component };
