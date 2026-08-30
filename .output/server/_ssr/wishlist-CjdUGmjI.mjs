import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-BQz0ixQ6.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Heart } from "../_libs/lucide-react.mjs";
import { d as useWishlist, t as Header } from "./Header-D1MszUzt.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as ProductCard } from "./ProductCard-DHHgqrVR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-CjdUGmjI.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const { user } = useAuth();
	const { data: wl } = useWishlist(user?.id);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "Your Wishlist"
				}), !wl || wl.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-16 text-center shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold",
							children: "No saved items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mt-4 inline-block text-primary underline",
							children: "Browse products"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
					children: wl.map((w) => w.products && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: w.products }, w.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { WishlistPage as component };
