import { i as Route } from "./router-DKDYeeFZ.js";
import { s as useProducts, t as Header } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { t as ProductCard } from "./ProductCard-DrlZuPNB.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/search.tsx?tsr-split=component
function SearchPage() {
	const { q } = Route.useSearch();
	const { data } = useProducts({ search: q });
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-6",
				children: [
					/* @__PURE__ */ jsxs("h1", {
						className: "mb-4 text-2xl font-bold",
						children: ["Search results", q ? ` for "${q}"` : ""]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mb-6 text-sm text-muted-foreground",
						children: [data?.length ?? 0, " products found"]
					}),
					data && data.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						children: data.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
					}) : /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border bg-card p-16 text-center text-muted-foreground shadow-card",
						children: "No products match your search."
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };
