import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BQz0ixQ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)({
	session: null,
	user: null,
	isAdmin: false,
	loading: true,
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
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
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
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
var useAuth = () => (0, import_react.useContext)(Ctx);
//#endregion
export { useAuth as n, AuthProvider as t };
