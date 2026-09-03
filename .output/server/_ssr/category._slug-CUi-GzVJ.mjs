import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-CUi-GzVJ.js
var $$splitComponentImporter = () => import("./category._slug-BHDBOatl.mjs");
var Route = createFileRoute("/category/$slug")({
	head: ({ params }) => ({ meta: [{ title: `Shop ${params.slug.replace(/-/g, " ")} — Mana Santha` }, {
		name: "description",
		content: `Browse and buy ${params.slug.replace(/-/g, " ")} online. Fresh, best prices, fast delivery.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
