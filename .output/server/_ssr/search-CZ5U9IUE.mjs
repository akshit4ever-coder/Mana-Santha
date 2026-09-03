import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as useProducts, t as Header } from "./Header-CqAWbfhW.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as ProductCard } from "./ProductCard-i9r4K_3C.mjs";
import { t as Route } from "./search-DEjLUYR1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CZ5U9IUE.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q } = Route.useSearch();
	const { data } = useProducts({ search: q });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mb-4 text-2xl font-bold",
						children: ["Search results", q ? ` for "${q}"` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-6 text-sm text-muted-foreground",
						children: [data?.length ?? 0, " products found"]
					}),
					data && data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						children: data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-card p-16 text-center text-muted-foreground shadow-card",
						children: "No products match your search."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };
