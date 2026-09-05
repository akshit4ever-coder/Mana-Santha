import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-CCehujYb.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { t as Header } from "./Header-HVVZP3-J.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/reset-password.tsx?tsr-split=component
function ResetPassword() {
	const navigate = useNavigate();
	const [token, setToken] = useState(null);
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");
	const [loading, setLoading] = useState(false);
	useEffect(() => {}, []);
	const validate = () => {
		if (newPass.length < 6) {
			toast.error("Password must be at least 6 characters");
			return false;
		}
		if (newPass !== confirmPass) {
			toast.error("Passwords do not match");
			return false;
		}
		return true;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: newPass });
			if (error) toast.error(error.message || "Failed to reset password");
			else {
				toast.success("Password updated successfully. Please sign in.");
				navigate({ to: "/auth" });
			}
		} catch (err) {
			toast.error(err?.message || "Failed to reset password");
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
							children: "Reset Password"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Enter a new password to finish resetting your account."
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "rp-pass",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "New Password"
							}), /* @__PURE__ */ jsx(Input, {
								id: "rp-pass",
								type: "password",
								placeholder: "New password",
								value: newPass,
								onChange: (e) => setNewPass(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "rp-conf",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Confirm Password"
							}), /* @__PURE__ */ jsx(Input, {
								id: "rp-conf",
								type: "password",
								placeholder: "Confirm password",
								value: confirmPass,
								onChange: (e) => setConfirmPass(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: loading,
									children: loading ? "Updating..." : "Update Password"
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => navigate({ to: "/auth" }),
									children: "Back to Login"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ResetPassword as component };
