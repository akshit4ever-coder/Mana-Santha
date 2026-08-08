import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { n as useAuth } from "./auth-uHCqpL7U.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Lock, B as EyeOff, I as Image, N as LayoutDashboard, O as Mail, Q as Bike, T as Package, X as ChartNoAxesColumn, Z as Boxes, d as Ticket, f as Tag, g as ShoppingBag, j as LoaderCircle, o as TriangleAlert, q as ChevronRight, r as Users, v as ShieldCheck, y as Settings, z as Eye } from "../_libs/lucide-react.mjs";
import { t as Header } from "./Header-CA9hksBN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B1rud52u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package
	},
	{
		to: "/admin/categories",
		label: "Categories",
		icon: Tag
	},
	{
		to: "/admin/subcategories",
		label: "Subcategories",
		icon: Boxes
	},
	{
		to: "/admin/banners",
		label: "Banners",
		icon: Image
	},
	{
		to: "/admin/coupons",
		label: "Coupons",
		icon: Ticket
	},
	{
		to: "/admin/customers",
		label: "Customers",
		icon: Users
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: ShoppingBag
	},
	{
		to: "/admin/inventory",
		label: "Inventory",
		icon: Boxes
	},
	{
		to: "/admin/delivery",
		label: "Delivery",
		icon: Bike
	},
	{
		to: "/admin/reports",
		label: "Reports",
		icon: ChartNoAxesColumn
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}
];
function AdminLoginForm() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleAdminLogin = async (e) => {
		e.preventDefault();
		const trimmedEmail = email.trim().toLowerCase();
		if (!trimmedEmail) {
			toast.error("Please enter your admin email");
			return;
		}
		if (!password) {
			toast.error("Please enter your password");
			return;
		}
		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: trimmedEmail,
				password
			});
			if (error) {
				console.error("Admin login error:", error.message);
				throw new Error(error.message);
			}
			if (!data.session) throw new Error("Login failed — no session created.");
			const { data: roleData, error: roleError } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
			if (roleError || !roleData) {
				await supabase.auth.signOut();
				throw new Error("You are not authorized to access the Admin Panel.");
			}
			toast.success("Welcome, Admin! 🛡️");
		} catch (err) {
			toast.error(err.message || "Invalid admin credentials");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center px-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-xl p-8 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-7 w-7" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold text-white",
									children: "Admin Login"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-400 mt-1",
									children: "Authorized personnel only"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAdminLogin,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "admin-email",
									className: "text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Admin Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "admin-email",
										type: "email",
										placeholder: "admin@manasantha.com",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "admin-password",
									className: "text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "admin-password",
										type: showPassword ? "text" : "password",
										placeholder: "Enter admin password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white",
										onClick: () => setShowPassword(!showPassword),
										tabIndex: -1,
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: loading,
									className: "w-full rounded-full py-5 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-black",
									children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 h-4 w-4" }), "Sign in to Admin Panel"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 pt-4 border-t border-slate-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-white transition-colors",
								children: "← Back to Store"
							})
						})
					]
				})
			})
		})]
	});
}
function AdminLayout() {
	const { user, isAdmin, loading, signOut } = useAuth();
	const path = useRouterState({ select: (s) => s.location.pathname });
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoginForm, {});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-10 w-10 text-destructive" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold mb-2",
						children: "403 Access Denied"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "You are not authorized to access the Admin Panel. This area is restricted to administrators only."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Return to Home"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								await signOut();
							},
							className: "w-full sm:w-auto",
							children: "Sign Out / Switch Account"
						})]
					})
				]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "sticky top-24 flex flex-col gap-1 rounded-xl border bg-card p-3 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 px-3 py-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Admin Panel"
						})
					}),
					NAV_ITEMS.map((n) => {
						const active = n.exact ? path === n.to : path.startsWith(n.to) && n.to !== "/admin";
						const exactActive = n.exact && path === "/admin";
						const isActive = n.exact ? exactActive : active;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" }), n.label]
							}), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-70" })]
						}, n.to);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 border-t pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "px-3 text-xs text-muted-foreground",
							children: ["Logged in as ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: user.email
							})]
						})
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AdminLayout as component };
