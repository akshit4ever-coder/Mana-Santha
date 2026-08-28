import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-VRwF8TTl.js
var $$splitComponentImporter = () => import("./search-CIy_xn9H.mjs");
var searchSchema = objectType({ q: stringType().optional() });
var Route = createFileRoute("/search")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Search — Mana Santha" }, {
		name: "description",
		content: "Search Mana Santha for groceries and kirana essentials."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
