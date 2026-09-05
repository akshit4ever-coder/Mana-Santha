import { t as cn } from "./utils-C_uf36nf.js";
import { t as supabase } from "./client-Dxm-ZOZR.js";
import { a as useAuth, o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { t as Header } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import * as React$1 from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
//#region src/components/UI/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/lib/phone-auth.ts
/**
* Sign in with Username, Email, or Phone Number + Password
*/
async function signInWithIdentifierAndPassword(identifier, password) {
	const cleanId = identifier.trim().toLowerCase();
	if (password.length < 6) throw new Error("Password must be at least 6 characters");
	if (cleanId.includes("@")) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: cleanId,
			password
		});
		if (!error && data.session) return {
			success: true,
			user: data.user,
			session: data.session
		};
	}
	if (/^\d{10}$/.test(cleanId.replace(/\D/g, ""))) {
		const syntheticPhoneEmail = `${cleanId.replace(/\D/g, "")}@manasantha.local`;
		const { data, error } = await supabase.auth.signInWithPassword({
			email: syntheticPhoneEmail,
			password
		});
		if (!error && data.session) return {
			success: true,
			user: data.user,
			session: data.session
		};
	}
	const cleanUsername = cleanId.replace(/[^a-z0-9_-]/g, "");
	const candidateEmails = [`${cleanUsername}@username.manasantha.local`, `${cleanUsername}@manasantha.local`];
	for (const candidate of candidateEmails) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: candidate,
			password
		});
		if (!error && data.session) return {
			success: true,
			user: data.user,
			session: data.session
		};
	}
	throw new Error("No account matched that identifier. Please sign in using your registered phone number or email.");
}
/**
* Register account with Full Name + Phone Number + Password (min 6 chars)
*/
async function registerNewUser({ fullName, phone, password }) {
	const cleanName = fullName.trim();
	const digits = phone.replace(/\D/g, "");
	if (!cleanName) throw new Error("Please enter your Full Name");
	if (digits.length !== 10) throw new Error("Please enter a valid 10-digit mobile number");
	if (password.length < 6) throw new Error("Password must be at least 6 characters");
	const formattedPhone = `+91${digits}`;
	const syntheticPhoneEmail = `${digits}@manasantha.local`;
	const { data, error } = await supabase.auth.signUp({
		email: syntheticPhoneEmail,
		password,
		options: { data: {
			full_name: cleanName,
			phone: formattedPhone,
			username: cleanName.toLowerCase().replace(/[^a-z0-9_-]/g, "")
		} }
	});
	if (error) {
		if (error.message.includes("already registered")) throw new Error("An account with this phone number already exists. Please sign in.");
		throw new Error(friendlyAuthError(error.message));
	}
	return {
		success: true,
		user: data.user,
		session: data.session
	};
}
/** Friendly error mapping */
function friendlyAuthError(message) {
	const m = message.toLowerCase();
	if (m.includes("rate limit") || m.includes("too many requests")) return "Too many requests. Please wait a minute.";
	if (m.includes("otp expired") || m.includes("token has expired")) return "OTP has expired. Tap 'Resend OTP'.";
	if (m.includes("invalid otp") || m.includes("token is invalid") || m.includes("bad_code")) return "Invalid 6-digit OTP code.";
	return message;
}
//#endregion
//#region src/routes/auth.tsx?tsr-split=component
function AuthPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("signin");
	const [loginIdentifier, setLoginIdentifier] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [regFullName, setRegFullName] = useState("");
	const [regPhone, setRegPhone] = useState("");
	const [regPassword, setRegPassword] = useState("");
	const [regConfirmPassword, setRegConfirmPassword] = useState("");
	useEffect(() => {
		if (user) navigate({ to: "/" });
	}, [user, navigate]);
	const resetForm = () => {
		setLoginIdentifier("");
		setLoginPassword("");
		setRegFullName("");
		setRegPhone("");
		setRegPassword("");
		setRegConfirmPassword("");
	};
	const handlePasswordSignIn = async (e) => {
		e.preventDefault();
		if (!loginIdentifier.trim()) {
			toast.error("Please enter your Full Name or Phone number");
			return;
		}
		if (loginPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setLoading(true);
		try {
			await signInWithIdentifierAndPassword(loginIdentifier, loginPassword);
			toast.success("Welcome back! 🎉");
			navigate({ to: "/" });
		} catch (error) {
			toast.error(error.message || "Invalid login credentials");
		} finally {
			setLoading(false);
		}
	};
	const handleRegister = async (e) => {
		e.preventDefault();
		if (!regFullName.trim()) {
			toast.error("Please enter your Full Name");
			return;
		}
		if (regPhone.replace(/\D/g, "").length !== 10) {
			toast.error("Please enter a valid 10-digit Phone Number");
			return;
		}
		if (regPassword.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}
		if (regPassword !== regConfirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		setLoading(true);
		try {
			await registerNewUser({
				fullName: regFullName,
				phone: regPhone,
				password: regPassword
			});
			toast.success("Account created successfully! Welcome 🎉");
			navigate({ to: "/" });
		} catch (error) {
			toast.error(error.message || "Registration failed");
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
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow",
								children: /* @__PURE__ */ jsx(Leaf, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl font-bold",
								children: "Welcome to Mana Santha"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "Fresh groceries delivered to your doorstep"
							})
						]
					}), /* @__PURE__ */ jsxs(Tabs, {
						value: activeTab,
						onValueChange: (v) => {
							setActiveTab(v);
							resetForm();
						},
						children: [
							/* @__PURE__ */ jsxs(TabsList, {
								className: "grid w-full grid-cols-2 mb-4",
								children: [/* @__PURE__ */ jsx(TabsTrigger, {
									value: "signin",
									children: "Sign In"
								}), /* @__PURE__ */ jsx(TabsTrigger, {
									value: "signup",
									children: "Register Account"
								})]
							}),
							/* @__PURE__ */ jsx(TabsContent, {
								value: "signin",
								className: "space-y-4",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: handlePasswordSignIn,
									className: "space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "login-id",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Full Name OR Mobile Number *"
										}), /* @__PURE__ */ jsx(Input, {
											id: "login-id",
											type: "text",
											placeholder: "e.g. Ramesh Kumar or 9876543210",
											required: true,
											value: loginIdentifier,
											onChange: (e) => setLoginIdentifier(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "login-pass",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Password *"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative mt-1",
											children: [/* @__PURE__ */ jsx(Input, {
												id: "login-pass",
												type: showPassword ? "text" : "password",
												placeholder: "Enter your password",
												required: true,
												minLength: 6,
												value: loginPassword,
												onChange: (e) => setLoginPassword(e.target.value),
												className: "pr-10"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
												onClick: () => setShowPassword(!showPassword),
												tabIndex: -1,
												children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-muted-foreground" })
											})]
										})] }),
										/* @__PURE__ */ jsx("div", {
											className: "flex items-center justify-between mt-2",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												className: "text-sm text-primary underline",
												onClick: () => navigate({ to: "/forgot-password" }),
												children: "Forgot password?"
											})
										}),
										/* @__PURE__ */ jsxs(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full rounded-full py-5 text-base font-semibold",
											children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Sign In"]
										})
									]
								})
							}),
							/* @__PURE__ */ jsx(TabsContent, {
								value: "signup",
								className: "space-y-3",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: handleRegister,
									className: "space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "reg-name",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Full Name *"
										}), /* @__PURE__ */ jsx(Input, {
											id: "reg-name",
											type: "text",
											placeholder: "e.g. Ramesh Kumar",
											required: true,
											value: regFullName,
											onChange: (e) => setRegFullName(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "reg-phone",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Phone Number *"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative mt-1",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-muted-foreground border-r pr-2",
												children: "+91"
											}), /* @__PURE__ */ jsx(Input, {
												id: "reg-phone",
												type: "tel",
												placeholder: "9876543210",
												required: true,
												value: regPhone,
												onChange: (e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
												maxLength: 10,
												className: "pl-16 font-medium"
											})]
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "reg-pass",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Password (Min 6 characters) *"
										}), /* @__PURE__ */ jsx(Input, {
											id: "reg-pass",
											type: "password",
											placeholder: "Enter password",
											required: true,
											minLength: 6,
											value: regPassword,
											onChange: (e) => setRegPassword(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "reg-conf-pass",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Confirm Password *"
										}), /* @__PURE__ */ jsx(Input, {
											id: "reg-conf-pass",
											type: "password",
											placeholder: "Re-enter password",
											required: true,
											value: regConfirmPassword,
											onChange: (e) => setRegConfirmPassword(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ jsxs(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full rounded-full py-5 text-base font-semibold",
											children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Register Account"]
										})
									]
								})
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
export { AuthPage as component };
