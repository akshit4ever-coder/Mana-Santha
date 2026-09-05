import { o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { t as Header } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/forgot-password.tsx?tsr-split=component
function ForgotPassword() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [phone, setPhone] = useState("");
	const [fullName, setFullName] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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
			const res = await (await import("./resetPasswordByPhone.functions-BKs2OJZ5.js")).resetPasswordByPhone({ data: {
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
							children: "Reset your password using your registered mobile number and full name."
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "fp-phone",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Registered Phone Number"
							}), /* @__PURE__ */ jsx(Input, {
								id: "fp-phone",
								type: "tel",
								placeholder: "9876543210",
								value: phone,
								onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "fp-name",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Full Name"
							}), /* @__PURE__ */ jsx(Input, {
								id: "fp-name",
								type: "text",
								placeholder: "Your full name",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "fp-newpass",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "New Password"
							}), /* @__PURE__ */ jsx(Input, {
								id: "fp-newpass",
								type: "password",
								placeholder: "New password (min 6 chars)",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "fp-confpass",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Confirm Password"
							}), /* @__PURE__ */ jsx(Input, {
								id: "fp-confpass",
								type: "password",
								placeholder: "Confirm new password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "submit",
									className: "rounded-full",
									disabled: loading,
									children: loading ? "Resetting..." : "Reset Password"
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
export { ForgotPassword as component };
