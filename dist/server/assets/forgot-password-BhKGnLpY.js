import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-CCehujYb.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { t as Header } from "./Header-HVVZP3-J.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/forgot-password.tsx?tsr-split=component
function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}
		setLoading(true);
		try {
			const redirectTo = `${window.location.origin}/reset-password`;
			const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
			if (error) toast.error(error.message || "Failed to send reset email");
			else {
				toast.success("Password reset email sent — check your inbox.");
				navigate({ to: "/auth" });
			}
		} catch (err) {
			toast.error(err?.message || "Failed to request password reset");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-gradient-fresh flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "container mx-auto flex items-center justify-center px-4 py-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-md rounded-2xl border bg-card p-8 shadow-glow",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex flex-col items-center text-center",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold",
							children: "Forgot Password"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Enter your email and we'll send a reset link."
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "fp-email",
							className: "text-xs font-semibold text-muted-foreground uppercase",
							children: "Email"
						}), /* @__PURE__ */ jsx(Input, {
							id: "fp-email",
							type: "email",
							placeholder: "you@example.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "mt-1"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "rounded-full",
								disabled: loading,
								children: loading ? "Sending..." : "Send Reset Email"
							}), /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => navigate({ to: "/auth" }),
								children: "Back to Login"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ForgotPassword as component };
