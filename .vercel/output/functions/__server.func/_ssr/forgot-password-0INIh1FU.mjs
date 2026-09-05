import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Button } from "./router-FeVGlH3n.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { t as Header } from "./Header-DXMouS3f.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-0INIh1FU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPassword() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [phone, setPhone] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		const digits = phone.replace(/\D/g, "");
		if (digits.length !== 10) {
			toast.error("Please enter a valid 10-digit phone number");
			return;
		}
		if (!fullName.trim()) {
			toast.error("Please enter your full name");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		setLoading(true);
		try {
			const res = await (await import("./resetPasswordByPhone.functions-nnqa7AkL.mjs")).resetPasswordByPhone({ data: {
				phone: digits,
				fullName: fullName.trim(),
				newPassword
			} });
			if (!res || res.success === false) toast.error(res?.error || "Failed to reset password");
			else {
				toast.success("Password updated. Please sign in with your new password.");
				navigate({ to: "/auth" });
			}
		} catch (err) {
			toast.error(err?.message || "Reset failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-fresh flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container mx-auto flex items-center justify-center px-4 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border bg-card p-8 shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col items-center text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Forgot Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Reset your password using your registered mobile number and full name."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fp-phone",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Registered Phone Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fp-phone",
								type: "tel",
								placeholder: "9876543210",
								value: phone,
								onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fp-name",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fp-name",
								type: "text",
								placeholder: "Your full name",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fp-newpass",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "New Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fp-newpass",
								type: "password",
								placeholder: "New password (min 6 chars)",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fp-confpass",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Confirm Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fp-confpass",
								type: "password",
								placeholder: "Confirm new password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: loading,
									children: loading ? "Resetting..." : "Reset Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ForgotPassword as component };
