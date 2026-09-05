import { a as useAuth } from "./router-CCehujYb.js";
import { d as useWishlist, t as Header } from "./Header-HVVZP3-J.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { t as ProductCard } from "./ProductCard-B8QiOZmx.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Heart } from "lucide-react";
//#region src/routes/wishlist.tsx?tsr-split=component
function WishlistPage() {
	const { user } = useAuth();
	const { data: wl } = useWishlist(user?.id);
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
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "Your Wishlist"
				}), !wl || wl.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border bg-card p-16 text-center shadow-card",
					children: [
						/* @__PURE__ */ jsx(Heart, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-lg font-semibold",
							children: "No saved items"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "mt-4 inline-block text-primary underline",
							children: "Browse products"
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
					children: wl.map((w) => w.products && /* @__PURE__ */ jsx(ProductCard, { product: w.products }, w.id))
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { WishlistPage as component };
