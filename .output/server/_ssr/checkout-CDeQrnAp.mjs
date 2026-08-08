import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { n as useAuth } from "./auth-uHCqpL7U.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as MapPin, U as Circle, j as LoaderCircle, n as Wallet } from "../_libs/lucide-react.mjs";
import { r as useCart, t as Header } from "./Header-CA9hksBN.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as resolveCartItemDisplayMeta } from "./variant-utils-CdWziRXU.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/radix-ui__react-radio-group.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CDeQrnAp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
function Checkout() {
	const { user } = useAuth();
	const { data: cart } = useCart(user?.id);
	const navigate = useNavigate();
	const [slot, setSlot] = (0, import_react.useState)("today-evening");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [addr, setAddr] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		line1: "",
		line2: "",
		city: "",
		state: "",
		pincode: ""
	});
	const items = cart ?? [];
	const subtotal = items.reduce((s, i) => {
		const meta = resolveCartItemDisplayMeta(i.products, i.variant_id ? {
			id: i.variant_id,
			name: i.variant_name,
			price: i.variant_price,
			mrp: i.variant_mrp,
			image_url: i.variant_image_url,
			unit: i.variant_unit
		} : null);
		return s + Number(meta.price ?? 0) * i.quantity;
	}, 0);
	const deliveryFee = subtotal > 499 ? 0 : 29;
	const total = subtotal + deliveryFee;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-20 text-center",
			children: [
				"Please ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "text-primary underline",
					children: "sign in"
				}),
				"."
			]
		})]
	});
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-20 text-center",
			children: [
				"Your cart is empty. ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
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
		if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
			toast.error("Please fill all address fields");
			return;
		}
		setSubmitting(true);
		try {
			const { data: currentProducts } = await supabase.from("products").select("id, stock").in("id", items.map((i) => i.product_id));
			const insufficientStock = items.find((item) => {
				const product = currentProducts?.find((p) => p.id === item.product_id);
				return !product || product.stock < item.quantity;
			});
			if (insufficientStock) {
				const productName = insufficientStock.products?.name || "One or more products";
				toast.error(`${productName} is out of stock or insufficient quantity available`);
				setSubmitting(false);
				return;
			}
			const { data: authData, error: authError } = await supabase.auth.getUser();
			if (authError) throw authError;
			const authUser = authData?.data?.user ?? user;
			if (!authUser) throw new Error("Unable to fetch authenticated user.");
			const orderPayload = {
				user_id: authUser.id,
				subtotal,
				delivery_fee: deliveryFee,
				total,
				payment_method: "cod",
				payment_status: "pending",
				status: "pending",
				address_snapshot: addr,
				delivery_slot: slot
			};
			await supabase.from("profiles").upsert({
				id: authUser.id,
				full_name: addr.full_name,
				phone: addr.phone
			}, { onConflict: "id" });
			console.log("Authenticated user:", authUser);
			console.log("Order payload:", orderPayload);
			const { data: order, error: oe } = await supabase.from("orders").insert(orderPayload).select().single();
			if (oe) throw oe;
			const orderItems = items.map((i) => {
				const meta = resolveCartItemDisplayMeta(i.products, i.variant_id ? {
					id: i.variant_id,
					name: i.variant_name,
					price: i.variant_price,
					mrp: i.variant_mrp,
					image_url: i.variant_image_url,
					unit: i.variant_unit
				} : null);
				return {
					order_id: order.id,
					product_id: i.product_id,
					variant_id: i.variant_id ?? null,
					variant_name: i.variant_name ?? null,
					name: meta.name,
					image_url: meta.image_url,
					unit: meta.unit,
					price: Number(meta.price ?? 0),
					quantity: i.quantity,
					subtotal: Number(meta.price ?? 0) * i.quantity
				};
			});
			const { error: ie } = await supabase.from("order_items").insert(orderItems);
			if (ie) throw ie;
			await supabase.from("cart_items").delete().eq("user_id", user.id);
			toast.success("Order placed successfully!");
			navigate({ to: "/orders" });
		} catch (err) {
			toast.error(err.message ?? "Failed to place order");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "Checkout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: placeOrder,
					className: "grid gap-6 lg:grid-cols-[1fr_360px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mb-4 flex items-center gap-2 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), " Delivery Address"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: addr.full_name,
											onChange: (e) => setAddr({
												...addr,
												full_name: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											type: "tel",
											value: addr.phone,
											onChange: (e) => setAddr({
												...addr,
												phone: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address Line 1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												value: addr.line1,
												onChange: (e) => setAddr({
													...addr,
													line1: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address Line 2 (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: addr.line2,
												onChange: (e) => setAddr({
													...addr,
													line2: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: addr.city,
											onChange: (e) => setAddr({
												...addr,
												city: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: addr.state,
											onChange: (e) => setAddr({
												...addr,
												state: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pincode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: addr.pincode,
											onChange: (e) => setAddr({
												...addr,
												pincode: e.target.value
											})
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-4 font-bold",
									children: "Delivery Slot"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
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
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: `flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${slot === s.v ? "border-primary bg-primary/5" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: s.v }),
											" ",
											s.l
										]
									}, s.v))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mb-4 flex items-center gap-2 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), " Payment Method"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "Cash on Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Pay in cash when your order arrives."
									})] })]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:sticky lg:top-24 lg:self-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-5 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-4 text-lg font-bold",
									children: "Order Summary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 max-h-56 space-y-2 overflow-auto text-sm",
									children: items.map((i) => {
										const meta = resolveCartItemDisplayMeta(i.products, i.variant_id ? {
											id: i.variant_id,
											name: i.variant_name,
											price: i.variant_price,
											mrp: i.variant_mrp,
											image_url: i.variant_image_url,
											unit: i.variant_unit
										} : null);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "line-clamp-1",
												children: [
													meta.name,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground",
														children: ["× ", i.quantity]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: formatINR(Number(meta.price ?? 0) * i.quantity)
											})]
										}, i.id);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 border-t pt-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Subtotal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(subtotal) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: deliveryFee === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-success",
												children: "FREE"
											}) : formatINR(deliveryFee) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex justify-between border-t pt-2 text-lg font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(total) })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "lg",
									disabled: submitting,
									className: "mt-4 w-full rounded-full",
									children: [submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Place Order (COD)"]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Checkout as component };
