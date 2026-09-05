import { t as cn } from "./utils-C_uf36nf.js";
import { t as supabase } from "./client-Dxm-ZOZR.js";
import { a as useAuth, o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import * as React$1 from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronRight, Circle, Heart, LayoutDashboard, LogOut, Package, Search, ShoppingCart, User } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
//#region src/assets/ManaSantha_Logo.jpeg
var ManaSantha_Logo_default = "/assets/ManaSantha_Logo-DHtIdeVI.jpeg";
//#endregion
//#region src/assets/Mana Santa Title.jpg
var Mana_Santa_Title_default = "/assets/Mana%20Santa%20Title-DqZPVoko.jpg";
//#endregion
//#region src/lib/queries.ts
var useCategories = () => useQuery({
	queryKey: ["categories"],
	queryFn: async () => {
		try {
			const { data, error } = await supabase.from("categories").select("*, subcategories(*)").eq("is_active", true).order("sort_order");
			if (error) throw error;
			return data;
		} catch (err) {
			const msg = err?.message ?? String(err);
			if (typeof msg === "string" && (msg.includes("Failed to fetch") || msg.includes("hostname") || msg.includes("network") || msg.includes("access control checks"))) throw new Error("Unable to reach Supabase backend. Check your network connection and VITE_SUPABASE_URL configuration.");
			throw err;
		}
	}
});
var useProducts = (opts) => useQuery({
	queryKey: ["products", opts],
	queryFn: async () => {
		try {
			let q = supabase.from("products").select("*, categories(name, slug), subcategories(name, slug), product_variants(*)").eq("is_active", true);
			if (opts?.featured) q = q.eq("is_featured", true);
			if (opts?.search) q = q.ilike("name", `%${opts.search}%`);
			if (opts?.limit) q = q.limit(opts.limit);
			const { data, error } = await q.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
			if (error) throw error;
			let rows = data ?? [];
			if (opts?.categorySlug) rows = rows.filter((r) => r.categories?.slug === opts.categorySlug);
			return rows;
		} catch (err) {
			const msg = err?.message ?? String(err);
			if (typeof msg === "string" && (msg.includes("Failed to fetch") || msg.includes("hostname") || msg.includes("network") || msg.includes("access control checks"))) throw new Error("Unable to reach Supabase backend. Check your network connection and VITE_SUPABASE_URL configuration.");
			throw err;
		}
	}
});
var useProduct = (slug) => useQuery({
	queryKey: ["product", slug],
	queryFn: async () => {
		try {
			const { data, error } = await supabase.from("products").select("*, categories(name, slug), subcategories(name, slug), product_variants(*)").eq("slug", slug).maybeSingle();
			if (error) throw error;
			return data;
		} catch (err) {
			const msg = err?.message ?? String(err);
			if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
				const { data, error } = await supabase.from("products").select("*, categories(name, slug), subcategories(name, slug)").eq("slug", slug).maybeSingle();
				if (error) throw error;
				return data;
			}
			throw err;
		}
	}
});
function isMissingTableError(error) {
	if (!error || typeof error !== "object") return false;
	const message = error.message;
	return typeof message === "string" && message.includes("Could not find the table");
}
var useCart = (userId) => useQuery({
	queryKey: ["cart", userId],
	enabled: !!userId,
	queryFn: async () => {
		const { data, error } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", userId);
		if (error) {
			if (isMissingTableError(error)) {
				console.warn("Supabase cart_items table missing; returning empty cart.", error.message);
				return [];
			}
			throw error;
		}
		return data;
	}
});
async function getAuthenticatedCartUser() {
	const { data: { user }, error } = await supabase.auth.getUser();
	console.log("Supabase user:", user);
	if (error) {
		console.error("Supabase getUser error:", error);
		throw new Error("Your Supabase session is invalid or expired. Please sign in again.");
	}
	if (!user?.id) {
		console.error("Supabase user is null. Session was not restored.");
		throw new Error("Please sign in to add items to cart.");
	}
	return user;
}
function useAddToCart(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ productId, quantity = 1, variant }) => {
			const authUser = await getAuthenticatedCartUser();
			const resolvedUserId = userId ?? authUser.id;
			if (!resolvedUserId) throw new Error("Please sign in");
			if (resolvedUserId !== authUser.id) {
				console.error("User mismatch in cart write:", {
					propUserId: userId,
					authUserId: authUser.id
				});
				throw new Error("Session mismatch detected. Please sign in again.");
			}
			let query = supabase.from("cart_items").select("id, quantity").eq("user_id", authUser.id).eq("product_id", productId);
			if (variant?.id) query = query.eq("variant_id", variant.id);
			else query = query.is("variant_id", null);
			const { data: existing, error: selectError } = await query.maybeSingle();
			if (selectError) {
				if (isMissingTableError(selectError)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
				throw selectError;
			}
			if (existing) {
				const { error } = await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id).eq("user_id", authUser.id);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			} else {
				const insertPayload = {
					user_id: authUser.id,
					product_id: productId,
					quantity
				};
				if (variant) {
					insertPayload.variant_id = variant.id ?? null;
					insertPayload.variant_name = variant.name ?? null;
					insertPayload.variant_price = variant.price ?? null;
					insertPayload.variant_image_url = variant.image_url ?? null;
					insertPayload.variant_unit = variant.unit ?? null;
					insertPayload.variant_max_qty = variant.max_qty ?? null;
				}
				console.log("Insert payload:", insertPayload);
				const { error } = await supabase.from("cart_items").insert(insertPayload);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart", userId] });
			toast.success("Added to cart");
		},
		onError: (e) => toast.error(e.message)
	});
}
function useUpdateCartQty(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, quantity }) => {
			const authUser = await getAuthenticatedCartUser();
			const resolvedUserId = userId ?? authUser.id;
			if (!resolvedUserId || resolvedUserId !== authUser.id) throw new Error("Your cart session is invalid. Please sign in again.");
			if (quantity <= 0) {
				const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", authUser.id);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			} else {
				const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id).eq("user_id", authUser.id);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] })
	});
}
function useRemoveCartItem(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const authUser = await getAuthenticatedCartUser();
			const resolvedUserId = userId ?? authUser.id;
			if (!resolvedUserId || resolvedUserId !== authUser.id) throw new Error("Your cart session is invalid. Please sign in again.");
			const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", authUser.id);
			if (error) {
				if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
				throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] })
	});
}
var useWishlist = (userId) => useQuery({
	queryKey: ["wishlist", userId],
	enabled: !!userId,
	queryFn: async () => {
		const { data, error } = await supabase.from("wishlist_items").select("*, products(*)").eq("user_id", userId);
		if (error) throw error;
		return data;
	}
});
function useToggleWishlist(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (productId) => {
			if (!userId) throw new Error("Please sign in");
			const { data: existing } = await supabase.from("wishlist_items").select("id").eq("user_id", userId).eq("product_id", productId).maybeSingle();
			if (existing) {
				await supabase.from("wishlist_items").delete().eq("id", existing.id);
				return "removed";
			}
			await supabase.from("wishlist_items").insert({
				user_id: userId,
				product_id: productId
			});
			return "added";
		},
		onSuccess: (res) => {
			qc.invalidateQueries({ queryKey: ["wishlist"] });
			toast.success(res === "added" ? "Added to wishlist" : "Removed from wishlist");
		},
		onError: (e) => toast.error(e.message)
	});
}
var useOrders = (userId) => useQuery({
	queryKey: ["orders", userId],
	enabled: !!userId,
	queryFn: async () => {
		const { data, error } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", userId).order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	}
});
//#endregion
//#region src/components/UI/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React$1.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React$1.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React$1.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/Layout/Header.tsx
function Header() {
	const { user, isAdmin, signOut } = useAuth();
	const { data: cart } = useCart(user?.id);
	const navigate = useNavigate();
	const [q, setQ] = useState("");
	const cartCount = cart?.reduce((s, i) => s + i.quantity, 0) ?? 0;
	const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split("@")[0] || "Account";
	const onSearch = (e) => {
		e.preventDefault();
		if (q.trim()) navigate({
			to: "/search",
			search: { q: q.trim() }
		});
	};
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "container mx-auto flex h-24 md:h-20 items-center gap-4 px-4",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-none bg-transparent border-0 shadow-none p-0",
						children: /* @__PURE__ */ jsx("img", {
							src: ManaSantha_Logo_default,
							alt: "Mana Santha logo",
							className: "h-14 w-14 md:h-20 md:w-20 object-contain"
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "block",
						children: /* @__PURE__ */ jsx("img", {
							src: Mana_Santa_Title_default,
							alt: "Mana Santha",
							className: "h-12 md:h-16 object-contain"
						})
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: onSearch,
					className: "relative ml-2 hidden max-w-xl flex-1 md:block",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search for atta, dal, milk, snacks...",
						className: "h-10 rounded-full border-secondary bg-secondary/50 pl-10"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-1 sm:gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "ghost",
							size: "icon",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/wishlist",
								children: /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5" })
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "ghost",
							className: "relative gap-2",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/cart",
								children: [
									/* @__PURE__ */ jsx(ShoppingCart, { className: "h-5 w-5" }),
									/* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: "Cart"
									}),
									cartCount > 0 && /* @__PURE__ */ jsx("span", {
										className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground",
										children: cartCount
									})
								]
							})
						}),
						user ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "gap-2 rounded-full px-3",
								children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
									className: "max-w-[100px] truncate text-xs font-semibold",
									children: displayName
								})]
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ jsxs(DropdownMenuLabel, {
									className: "font-normal",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-semibold text-sm",
										children: displayName
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground truncate",
										children: user.email
									})]
								}),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/orders",
										children: [/* @__PURE__ */ jsx(Package, { className: "mr-2 h-4 w-4" }), "My Orders"]
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/wishlist",
										children: [/* @__PURE__ */ jsx(Heart, { className: "mr-2 h-4 w-4" }), "Wishlist"]
									})
								}),
								isAdmin && /* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/admin",
										children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4 text-primary" }), "Admin Dashboard"]
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => signOut(),
									children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4 text-destructive" }), "Sign out"]
								})
							]
						})] }) : /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							className: "rounded-full px-4",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})
					]
				})
			]
		}), /* @__PURE__ */ jsx("form", {
			onSubmit: onSearch,
			className: "border-t bg-secondary/30 px-4 py-2 md:hidden",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search products...",
					className: "h-9 rounded-full bg-background pl-10"
				})]
			})
		})]
	});
}
//#endregion
export { useOrders as a, useRemoveCartItem as c, useWishlist as d, useCategories as i, useToggleWishlist as l, useAddToCart as n, useProduct as o, useCart as r, useProducts as s, Header as t, useUpdateCartQty as u };
