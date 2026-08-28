import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCategories, t as Header } from "./Header-CfTf-_A6.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kirana-essentials-CHZRGuMh.js
var import_jsx_runtime = require_jsx_runtime();
function KiranaPage() {
	const { data: cats } = useCategories();
	const kiranaCats = (cats || []).filter((c) => {
		const n = (c.name || "").toLowerCase();
		const s = (c.slug || "").toLowerCase();
		return !(/fruit|veget|milk|dairy|egg|meat/.test(n) || /fruit|veget|milk|dairy|egg|meat/.test(s));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold md:text-3xl",
						children: "Kirana essentials"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "All categories except fruits & vegetables"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
					children: kiranaCats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/category/${c.slug}`,
						className: "group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-28 w-28 items-center justify-center overflow-hidden bg-gradient-fresh text-3xl",
							children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image_url,
								alt: c.name,
								className: "h-full w-full object-cover rounded-none"
							}) : c.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium leading-tight",
							children: c.name
						})]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { KiranaPage as component };
