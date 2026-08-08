import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { n as useAuth } from "./auth-uHCqpL7U.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as Heart, N as LayoutDashboard, T as Package, U as Circle, Y as Check, b as Search, h as ShoppingCart, i as User, k as LogOut, q as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Header-CA9hksBN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ManaSantha_Logo_default = "/assets/ManaSantha_Logo-1NzmFXgc.png";
var useCategories = () => useQuery({
	queryKey: ["categories"],
	queryFn: async () => {
		const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
		if (error) throw error;
		return data;
	}
});
function isMissingTableError(error) {
	if (!error || typeof error !== "object") return false;
	const message = error.message;
	return typeof message === "string" && message.includes("Could not find the table");
}
function isMissingColumnOrRelationError(error) {
	if (!error || typeof error !== "object") return false;
	const message = error.message;
	return typeof message === "string" && (message.includes("does not exist") || message.includes("Could not find the relation") || message.includes("Could not find the table") || message.includes("column"));
}
async function fetchProductsWithFallback(opts) {
	const richSelect = "*, categories(name, slug), subcategories(name, slug), product_variants(*)";
	const basicSelect = "id, name, slug, image_url, brand, description, mrp, price, unit, weight, stock, max_qty, status, is_featured, is_active, created_at, updated_at, category_id";
	let q = supabase.from("products").select(richSelect).eq("is_active", true);
	if (opts?.featured) q = q.eq("is_featured", true);
	if (opts?.search) q = q.ilike("name", `%${opts.search}%`);
	if (opts?.limit) q = q.limit(opts.limit);
	const { data, error } = await q.order("created_at", { ascending: false });
	if (!error) {
		let rows = data ?? [];
		if (opts?.categorySlug) rows = rows.filter((r) => r.categories?.slug === opts.categorySlug);
		return rows;
	}
	if (!isMissingColumnOrRelationError(error)) throw error;
	let fallbackQuery = supabase.from("products").select(basicSelect).eq("is_active", true);
	if (opts?.featured) fallbackQuery = fallbackQuery.eq("is_featured", true);
	if (opts?.search) fallbackQuery = fallbackQuery.ilike("name", `%${opts.search}%`);
	if (opts?.limit) fallbackQuery = fallbackQuery.limit(opts.limit);
	const { data: fallbackData, error: fallbackError } = await fallbackQuery.order("created_at", { ascending: false });
	if (fallbackError) throw fallbackError;
	let rows = fallbackData ?? [];
	if (opts?.categorySlug) {
		const { data: categoriesData } = await supabase.from("categories").select("id, slug").eq("is_active", true);
		const matchedCategory = categoriesData?.find((c) => c.slug === opts.categorySlug);
		if (matchedCategory) rows = rows.filter((r) => r.category_id === matchedCategory.id);
		else rows = [];
	}
	return rows;
}
async function fetchProductWithFallback(slug) {
	const richSelect = "*, categories(name, slug), subcategories(name, slug), product_variants(*)";
	const basicSelect = "id, name, slug, image_url, brand, description, mrp, price, unit, weight, stock, max_qty, status, is_featured, is_active, created_at, updated_at, category_id";
	const { data, error } = await supabase.from("products").select(richSelect).eq("slug", slug).maybeSingle();
	if (!error) return data;
	if (!isMissingColumnOrRelationError(error)) throw error;
	const { data: fallbackData, error: fallbackError } = await supabase.from("products").select(basicSelect).eq("slug", slug).maybeSingle();
	if (fallbackError) throw fallbackError;
	return fallbackData;
}
var useProducts = (opts) => useQuery({
	queryKey: ["products", opts],
	queryFn: async () => fetchProductsWithFallback(opts)
});
var useProduct = (slug) => useQuery({
	queryKey: ["product", slug],
	queryFn: async () => fetchProductWithFallback(slug)
});
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
function useAddToCart(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ productId, quantity = 1, variantId }) => {
			if (!userId) throw new Error("Please sign in");
			const { data: productData } = await supabase.from("products").select("id, name, price, mrp, image_url, unit").eq("id", productId).maybeSingle();
			let variantData = null;
			if (variantId) {
				const { data } = await supabase.from("product_variants").select("*").eq("id", variantId).maybeSingle();
				variantData = data;
			}
			let cartQuery = supabase.from("cart_items").select("id, quantity").eq("user_id", userId).eq("product_id", productId);
			if (variantId) cartQuery = cartQuery.eq("variant_id", variantId);
			else cartQuery = cartQuery.is("variant_id", null);
			const { data: existing, error: selectError } = await cartQuery.maybeSingle();
			if (selectError) {
				if (isMissingTableError(selectError)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
				throw selectError;
			}
			if (existing) {
				const { error } = await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			} else {
				const { error } = await supabase.from("cart_items").insert({
					user_id: userId,
					product_id: productId,
					quantity,
					variant_id: variantId ?? null,
					variant_name: variantData?.name ?? null,
					variant_price: Number(variantData?.price ?? productData?.price ?? 0),
					variant_image_url: variantData?.image_url ?? productData?.image_url ?? null,
					variant_unit: variantData?.unit ?? productData?.unit ?? null
				});
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["cart"] });
			toast.success("Added to cart");
		},
		onError: (e) => toast.error(e.message)
	});
}
function useUpdateCartQty(userId) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, quantity }) => {
			if (quantity <= 0) {
				const { error } = await supabase.from("cart_items").delete().eq("id", id);
				if (error) {
					if (isMissingTableError(error)) throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
					throw error;
				}
			} else {
				const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
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
			const { error } = await supabase.from("cart_items").delete().eq("id", id);
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
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function Header() {
	const { user, isAdmin, signOut } = useAuth();
	const { data: cart } = useCart(user?.id);
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const cartCount = cart?.reduce((s, i) => s + i.quantity, 0) ?? 0;
	const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split("@")[0] || "Account";
	const onSearch = (e) => {
		e.preventDefault();
		if (q.trim()) navigate({
			to: "/search",
			search: { q: q.trim() }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto flex h-16 items-center gap-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: ManaSantha_Logo_default,
							alt: "Mana Santha",
							className: "h-6 w-6 object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold leading-tight text-primary",
							children: "Mana Santha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium leading-none text-muted-foreground",
							children: "Fresh to doorstep"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onSearch,
					className: "relative ml-2 hidden max-w-xl flex-1 md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search for atta, dal, milk, snacks...",
						className: "h-10 rounded-full border-secondary bg-secondary/50 pl-10"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "icon",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/wishlist",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "relative gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cart",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Cart"
									}),
									cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground",
										children: cartCount
									})
								]
							})
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "gap-2 rounded-full px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-[100px] truncate text-xs font-semibold",
									children: displayName
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
									className: "font-normal",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-sm",
										children: displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: user.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/orders",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mr-2 h-4 w-4" }), "My Orders"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/wishlist",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mr-2 h-4 w-4" }), "Wishlist"]
									})
								}),
								isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 h-4 w-4 text-primary" }), "Admin Dashboard"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => signOut(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4 text-destructive" }), "Sign out"]
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "rounded-full px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
			onSubmit: onSearch,
			className: "border-t bg-secondary/30 px-4 py-2 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
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
