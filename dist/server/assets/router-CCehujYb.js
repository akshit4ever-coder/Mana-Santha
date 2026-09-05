import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as supabase } from "./client-Dxm-ZOZR.js";
import * as React$1 from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AlertCircle } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { z } from "zod";
//#region src/components/UI/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
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
//#endregion
//#region src/components/UI/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React$1.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/components/Layout/ErrorBoundary.tsx
var ErrorBoundary = class extends React.Component {
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
		if (this.state.hasError) return this.props.fallback || /* @__PURE__ */ jsx("div", {
			className: "flex min-h-screen items-center justify-center bg-background px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-md rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 rounded-lg bg-destructive/10 p-3",
						children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-semibold text-destructive",
							children: "Oops! Something went wrong"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-destructive/80",
							children: this.state.error?.message
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: () => {
								this.setState({ hasError: false });
								window.location.href = "/";
							},
							className: "w-full rounded-full",
							children: "Go Home"
						}), /* @__PURE__ */ jsx(Button, {
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
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-kOIiTqdk.css";
//#endregion
//#region src/lib/auth.tsx
var Ctx = createContext({
	session: null,
	user: null,
	isAdmin: false,
	loading: true,
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const checkAdminRole = async (user) => {
		try {
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
			if (data) {
				setIsAdmin(true);
				return;
			}
			if (user.user_metadata?.role === "admin") {
				setIsAdmin(true);
				try {
					await supabase.from("user_roles").insert({
						user_id: user.id,
						role: "admin"
					});
				} catch {}
				return;
			}
			setIsAdmin(false);
		} catch {
			const metaRole = user.user_metadata?.role;
			setIsAdmin(metaRole === "admin");
		}
	};
	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
			if (data.session?.user) checkAdminRole(data.session.user);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			setLoading(false);
			if (s?.user) checkAdminRole(s.user);
			else setIsAdmin(false);
		});
		return () => {
			try {
				if (sub && sub.subscription && typeof sub.subscription.unsubscribe === "function") sub.subscription.unsubscribe();
			} catch (e) {
				console.warn("Failed to unsubscribe auth listener", e);
			}
		};
	}, []);
	const signOut = async () => {
		await supabase.auth.signOut();
		setSession(null);
		setIsAdmin(false);
	};
	return /* @__PURE__ */ jsx(Ctx.Provider, {
		value: {
			session,
			user: session?.user ?? null,
			isAdmin,
			loading,
			signOut
		},
		children
	});
}
var useAuth = () => useContext(Ctx);
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
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
	useEffect(() => {
		console.error(error);
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try again or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$26 = createRootRouteWithContext()({
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
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(AuthProvider, { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	}) });
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$25 = () => import("./routes-RkGlr5Q5.js");
var Route$25 = createFileRoute("/")({
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
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$24 = () => import("./admin-xdM5LpHo.js");
var Route$24 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — Mana Santha" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$23 = () => import("./auth-F7gslGLB.js");
var Route$23 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Mana Santha" }, {
		name: "description",
		content: "Sign in or create your Mana Santha account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/cart.tsx
var $$splitComponentImporter$22 = () => import("./cart-DUWY2h_S.js");
var Route$22 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Your Cart — Mana Santha" }, {
		name: "description",
		content: "Review your cart and proceed to checkout."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/checkout.tsx
var $$splitComponentImporter$21 = () => import("./checkout-ZjP-sR4C.js");
var Route$21 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — Mana Santha" }, {
		name: "description",
		content: "Complete your order with cash on delivery."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/forgot-password.tsx
var $$splitComponentImporter$20 = () => import("./forgot-password-BhKGnLpY.js");
var Route$20 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot Password — Mana Santha" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/kirana-essentials.tsx
var $$splitComponentImporter$19 = () => import("./kirana-essentials-mbo2WX39.js");
var Route$19 = createFileRoute("/kirana-essentials")({
	head: () => ({ meta: [{ title: "Kirana Essentials — Mana Santha" }, {
		name: "description",
		content: "Kirana essentials and household items."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/orders.tsx
var $$splitComponentImporter$18 = () => import("./orders-CKfBH4WF.js");
var Route$18 = createFileRoute("/orders")({
	head: () => ({ meta: [{ title: "My Orders — Mana Santha" }, {
		name: "description",
		content: "Track your Mana Santha orders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$17 = () => import("./reset-password-CEAUbdxI.js");
var Route$17 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset Password — Mana Santha" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/search.tsx
var $$splitComponentImporter$16 = () => import("./search-BtSdBFln.js");
var searchSchema = z.object({ q: z.string().optional() });
var Route$16 = createFileRoute("/search")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Search — Mana Santha" }, {
		name: "description",
		content: "Search Mana Santha for groceries and kirana essentials."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/shop-fresh.tsx
var $$splitComponentImporter$15 = () => import("./shop-fresh-DA8Qokz1.js");
var Route$15 = createFileRoute("/shop-fresh")({
	head: () => ({ meta: [{ title: "Shop Fresh — Mana Santha" }, {
		name: "description",
		content: "Fresh fruits, vegetables, dairy, eggs & meat."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/wishlist.tsx
var $$splitComponentImporter$14 = () => import("./wishlist-Den21r2w.js");
var Route$14 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — Mana Santha" }, {
		name: "description",
		content: "Your saved products."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/admin.index.tsx
var $$splitComponentImporter$13 = () => import("./admin.index-C5gIe82U.js");
var Route$13 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.banners.tsx
var $$splitComponentImporter$12 = () => import("./admin.banners-CxSBzfrp.js");
var Route$12 = createFileRoute("/admin/banners")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.categories.tsx
var $$splitComponentImporter$11 = () => import("./admin.categories-DCKgajA1.js");
var Route$11 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.coupons.tsx
var $$splitComponentImporter$10 = () => import("./admin.coupons-CqIBtn5O.js");
var Route$10 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.customers.tsx
var $$splitComponentImporter$9 = () => import("./admin.customers-C5bigUm4.js");
var Route$9 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/admin.delivery.tsx
var $$splitComponentImporter$8 = () => import("./admin.delivery-CdH68Mmx.js");
var Route$8 = createFileRoute("/admin/delivery")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.inventory.tsx
var $$splitComponentImporter$7 = () => import("./admin.inventory-CTnONb_W.js");
var Route$7 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.orders.tsx
var $$splitComponentImporter$6 = () => import("./admin.orders-eEYnr1Gv.js");
var Route$6 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/admin.products.tsx
var $$splitComponentImporter$5 = () => import("./admin.products-CJRGOYjp.js");
var Route$5 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
//#endregion
//#region src/routes/admin.reports.tsx
var $$splitComponentImporter$4 = () => import("./admin.reports-ireFGQYE.js");
var Route$4 = createFileRoute("/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin.settings.tsx
var $$splitComponentImporter$3 = () => import("./admin.settings-CvGGblmV.js");
var Route$3 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.subcategories.tsx
var $$splitComponentImporter$2 = () => import("./admin.subcategories-C5sRrkqC.js");
var Route$2 = createFileRoute("/admin/subcategories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/category.$slug.tsx
var $$splitComponentImporter$1 = () => import("./category._slug-yh52POIn.js");
var Route$1 = createFileRoute("/category/$slug")({
	head: ({ params }) => ({ meta: [{ title: `Shop ${params.slug.replace(/-/g, " ")} — Mana Santha` }, {
		name: "description",
		content: `Browse and buy ${params.slug.replace(/-/g, " ")} online. Fresh, best prices, fast delivery.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/product.$slug.tsx
var $$splitComponentImporter = () => import("./product._slug-CF_OeMOa.js");
var Route = createFileRoute("/product/$slug")({
	head: ({ params }) => ({ meta: [{ title: `${params.slug.replace(/-/g, " ")} — Mana Santha` }, {
		name: "description",
		content: `Buy ${params.slug.replace(/-/g, " ")} online at best prices.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AdminRoute = Route$24.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$26
});
var AuthRoute = Route$23.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$26
});
var CartRoute = Route$22.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$26
});
var CheckoutRoute = Route$21.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$26
});
var ForgotPasswordRoute = Route$20.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$26
});
var KiranaEssentialsRoute = Route$19.update({
	id: "/kirana-essentials",
	path: "/kirana-essentials",
	getParentRoute: () => Route$26
});
var OrdersRoute = Route$18.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$26
});
var ResetPasswordRoute = Route$17.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$26
});
var SearchRoute = Route$16.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$26
});
var ShopFreshRoute = Route$15.update({
	id: "/shop-fresh",
	path: "/shop-fresh",
	getParentRoute: () => Route$26
});
var WishlistRoute = Route$14.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$26
});
var AdminIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminBannersRoute = Route$12.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$11.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$10.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$9.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminDeliveryRoute = Route$8.update({
	id: "/delivery",
	path: "/delivery",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$7.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$6.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$5.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminReportsRoute = Route$4.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSubcategoriesRoute = Route$2.update({
	id: "/subcategories",
	path: "/subcategories",
	getParentRoute: () => AdminRoute
});
var CategorySlugRoute = Route$1.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$26
});
var ProductSlugRoute = Route.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$26
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
	ForgotPasswordRoute,
	KiranaEssentialsRoute,
	OrdersRoute,
	ResetPasswordRoute,
	SearchRoute,
	ShopFreshRoute,
	WishlistRoute,
	CategorySlugRoute,
	ProductSlugRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useAuth as a, getRouter, Route$16 as i, Route as n, Button as o, Route$1 as r, router_exports as t };
