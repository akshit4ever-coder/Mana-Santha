import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-opp75Yck.js
var $$splitComponentImporter = () => import("./product._slug-Dvb7BOll.mjs");
var Route = createFileRoute("/product/$slug")({
	head: ({ params }) => ({ meta: [{ title: `${params.slug.replace(/-/g, " ")} — Mana Santha` }, {
		name: "description",
		content: `Buy ${params.slug.replace(/-/g, " ")} online at best prices.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
