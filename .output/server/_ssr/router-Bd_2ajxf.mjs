import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as AuthProvider } from "./auth-uHCqpL7U.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { G as CircleAlert } from "../_libs/lucide-react.mjs";
import { t as Route$20 } from "./category._slug-DIhDuVv7.mjs";
import { t as Route$21 } from "./product._slug-Co-y_Hwx.mjs";
import { t as Route$22 } from "./search-DZVbMdpC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bd_2ajxf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		if (typeof window !== "undefined" && window.__SENTRY__) window.__SENTRY__.captureException(error, { contexts: { react: errorInfo } });
	}
	render() {
		if (this.state.hasError) return this.props.fallback || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center bg-background px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg bg-destructive/10 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold text-destructive",
							children: "Oops! Something went wrong"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive/80",
							children: this.state.error?.message
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								this.setState({ hasError: false });
								window.location.href = "/";
							},
							className: "w-full rounded-full",
							children: "Go Home"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => window.location.reload(),
							className: "w-full rounded-full",
							children: "Reload"
						})]
					}),
					false
				]
			})
		});
		return this.props.children;
	}
};
var styles_default = "/assets/styles-BOvCHLVI.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mana Santha — Fresh Groceries Delivered to Your Doorstep" },
			{
				name: "description",
				content: "Shop fresh fruits, vegetables, dairy, kirana essentials and household needs online. Fast delivery, best prices — Mana Santha."
			},
			{
				property: "og:title",
				content: "Mana Santha — Fresh Groceries Delivered"
			},
			{
				property: "og:description",
				content: "Fresh groceries delivered to your doorstep. Kirana, produce, dairy, snacks and more."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	}) });
}
var $$splitComponentImporter$18 = () => import("./routes-C15jIyMj.mjs");
var Route$18 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Mana Santha — Fresh Groceries Delivered to Your Doorstep" },
		{
			name: "description",
			content: "Order fresh fruits, vegetables, dairy, atta, dal, oil, snacks and everyday kirana essentials online with fast home delivery."
		},
		{
			property: "og:title",
			content: "Mana Santha — Fresh Groceries Delivered"
		},
		{
			property: "og:description",
			content: "Shop kirana, produce, dairy and household essentials with same-day delivery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./admin-B1rud52u.mjs");
var Route$17 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — Mana Santha" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./auth-CkkBKDZt.mjs");
var Route$16 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Mana Santha" }, {
		name: "description",
		content: "Sign in or create your Mana Santha account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./cart-HUrlxwUR.mjs");
var Route$15 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Your Cart — Mana Santha" }, {
		name: "description",
		content: "Review your cart and proceed to checkout."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./checkout-CDeQrnAp.mjs");
var Route$14 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — Mana Santha" }, {
		name: "description",
		content: "Complete your order with cash on delivery."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./orders-BPPrsGs7.mjs");
var Route$13 = createFileRoute("/orders")({
	head: () => ({ meta: [{ title: "My Orders — Mana Santha" }, {
		name: "description",
		content: "Track your Mana Santha orders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./wishlist-DUTf1YhH.mjs");
var Route$12 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — Mana Santha" }, {
		name: "description",
		content: "Your saved products."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin.index-C5gIe82U.mjs");
var Route$11 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.banners-DgXP3Kat.mjs");
var Route$10 = createFileRoute("/admin/banners")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.categories-BghGOD-O.mjs");
var Route$9 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.coupons-CIjnWo0R.mjs");
var Route$8 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.customers-C5bigUm4.mjs");
var Route$7 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.delivery-DgeWIWmu.mjs");
var Route$6 = createFileRoute("/admin/delivery")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.inventory-DfLj3x1P.mjs");
var Route$5 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.orders-DkhERKOD.mjs");
var Route$4 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.products-DAQT6rjJ.mjs");
var Route$3 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.reports-ireFGQYE.mjs");
var Route$2 = createFileRoute("/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.settings-Lx8NVQAP.mjs");
var Route$1 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.subcategories-CvOKSjh_.mjs");
var Route = createFileRoute("/admin/subcategories")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AdminRoute = Route$17.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$19
});
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$19
});
var CartRoute = Route$15.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$19
});
var CheckoutRoute = Route$14.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$19
});
var OrdersRoute = Route$13.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$19
});
var SearchRoute = Route$22.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$19
});
var WishlistRoute = Route$12.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$19
});
var AdminIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminBannersRoute = Route$10.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$9.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$8.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$7.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminDeliveryRoute = Route$6.update({
	id: "/delivery",
	path: "/delivery",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$5.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$4.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$3.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminReportsRoute = Route$2.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$1.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSubcategoriesRoute = Route.update({
	id: "/subcategories",
	path: "/subcategories",
	getParentRoute: () => AdminRoute
});
var CategorySlugRoute = Route$20.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$19
});
var ProductSlugRoute = Route$21.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$19
});
var AdminRouteChildren = {
	AdminBannersRoute,
	AdminCategoriesRoute,
	AdminCouponsRoute,
	AdminCustomersRoute,
	AdminDeliveryRoute,
	AdminInventoryRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminReportsRoute,
	AdminSettingsRoute,
	AdminSubcategoriesRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AuthRoute,
	CartRoute,
	CheckoutRoute,
	OrdersRoute,
	SearchRoute,
	WishlistRoute,
	CategorySlugRoute,
	ProductSlugRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
