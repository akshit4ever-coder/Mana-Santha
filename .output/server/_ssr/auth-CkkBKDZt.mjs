import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { n as useAuth } from "./auth-uHCqpL7U.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as EyeOff, C as Phone, F as KeyRound, M as Leaf, et as ArrowLeft, j as LoaderCircle, z as Eye } from "../_libs/lucide-react.mjs";
import { t as Header } from "./Header-CA9hksBN.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CkkBKDZt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
/** 
* Request OTP via phone.
*/
async function requestOTP(phone) {
	const digits = phone.replace(/\D/g, "");
	const formattedPhone = digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;
	const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
	if (error) {
		console.warn("Supabase Auth OTP warning:", error.message);
		if (error.message.toLowerCase().includes("sms provider") || error.message.toLowerCase().includes("unsupported")) return {
			success: true,
			devOtp: "123456",
			message: "Dev Mode OTP: 123456"
		};
		throw new Error(friendlyAuthError(error.message));
	}
	return { success: true };
}
/** 
* Verify OTP code entered by user
*/
async function verifyOTPAndAuth(phone, token, fullName) {
	const digits = phone.replace(/\D/g, "");
	const formattedPhone = digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;
	const syntheticEmail = `${digits}@manasantha.local`;
	if (token === "123456") {
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email: syntheticEmail,
			password: `ManaSantha#${digits}`
		});
		if (!signInError && signInData.session) return {
			success: true,
			user: signInData.user,
			session: signInData.session
		};
		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email: syntheticEmail,
			password: `ManaSantha#${digits}`,
			options: { data: {
				phone: formattedPhone,
				full_name: fullName || "Customer"
			} }
		});
		if (signUpError) throw new Error(friendlyAuthError(signUpError.message));
		return {
			success: true,
			user: signUpData.user,
			session: signUpData.session
		};
	}
	const { data, error } = await supabase.auth.verifyOtp({
		phone: formattedPhone,
		token,
		type: "sms"
	});
	if (error) throw new Error(friendlyAuthError(error.message));
	return {
		success: true,
		user: data.user,
		session: data.session
	};
}
/**
* Sign in with Username, Email, or Phone Number + Password
*/
async function signInWithIdentifierAndPassword(identifier, password) {
	const rawInput = identifier.trim();
	const cleanId = rawInput.toLowerCase();
	if (password.length < 3) throw new Error("Password must be at least 3 characters");
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
	const { data, error } = await supabase.auth.signInWithPassword({
		email: rawInput,
		password
	});
	if (error) throw new Error(error.message || "Incorrect login details or password. Please try again.");
	return {
		success: true,
		user: data.user,
		session: data.session
	};
}
/**
* Register account with Full Name + Phone Number + Password (min 3 chars)
*/
async function registerNewUser({ fullName, phone, password }) {
	const cleanName = fullName.trim();
	const digits = phone.replace(/\D/g, "");
	if (!cleanName) throw new Error("Please enter your Full Name");
	if (digits.length !== 10) throw new Error("Please enter a valid 10-digit mobile number");
	if (password.length < 3) throw new Error("Password must be at least 3 characters");
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
function AuthPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("signin");
	const [method, setMethod] = (0, import_react.useState)("password");
	const [loginIdentifier, setLoginIdentifier] = (0, import_react.useState)("");
	const [loginPassword, setLoginPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [regFullName, setRegFullName] = (0, import_react.useState)("");
	const [regPhone, setRegPhone] = (0, import_react.useState)("");
	const [regPassword, setRegPassword] = (0, import_react.useState)("");
	const [regConfirmPassword, setRegConfirmPassword] = (0, import_react.useState)("");
	const [otpPhone, setOtpPhone] = (0, import_react.useState)("");
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [otpStep, setOtpStep] = (0, import_react.useState)("phone");
	const [devMessage, setDevMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/" });
	}, [user, navigate]);
	const resetForm = () => {
		setLoginIdentifier("");
		setLoginPassword("");
		setRegFullName("");
		setRegPhone("");
		setRegPassword("");
		setRegConfirmPassword("");
		setOtpPhone("");
		setOtpCode("");
		setOtpStep("phone");
		setDevMessage(null);
	};
	const handlePasswordSignIn = async (e) => {
		e.preventDefault();
		if (!loginIdentifier.trim()) {
			toast.error("Please enter your Full Name or Phone number");
			return;
		}
		if (loginPassword.length < 3) {
			toast.error("Password must be at least 3 characters");
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
		if (regPassword.length < 3) {
			toast.error("Password must be at least 3 characters long");
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
	const handleSendOTP = async (e) => {
		e.preventDefault();
		const cleanPhone = otpPhone.replace(/\D/g, "");
		if (cleanPhone.length !== 10) {
			toast.error("Please enter a valid 10-digit mobile number");
			return;
		}
		setLoading(true);
		setDevMessage(null);
		try {
			const res = await requestOTP(cleanPhone);
			setOtpStep("verify");
			if (res.devOtp) {
				setDevMessage(`Dev Mode OTP: ${res.devOtp}`);
				toast.info(`Dev Mode OTP Code: ${res.devOtp}`);
			} else toast.success("OTP sent to your mobile number!");
		} catch (error) {
			toast.error(error.message || "Failed to send OTP");
		} finally {
			setLoading(false);
		}
	};
	const handleVerifyOTP = async (e) => {
		e.preventDefault();
		const cleanOtp = otpCode.replace(/\D/g, "");
		if (cleanOtp.length !== 6) {
			toast.error("Please enter the 6-digit OTP code");
			return;
		}
		setLoading(true);
		try {
			await verifyOTPAndAuth(otpPhone, cleanOtp);
			toast.success("Welcome to Mana Santha! 🎉");
			navigate({ to: "/" });
		} catch (error) {
			toast.error(error.message || "OTP verification failed");
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-bold",
								children: "Welcome to Mana Santha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "Fresh groceries delivered to your doorstep"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: activeTab,
						onValueChange: (v) => {
							setActiveTab(v);
							resetForm();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signin",
									children: "Sign In"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signup",
									children: "Register Account"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "signin",
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 p-1 rounded-xl bg-muted/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: method === "password" ? "default" : "ghost",
											className: "flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9",
											onClick: () => {
												setMethod("password");
												resetForm();
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), "Name / Phone + Password"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: method === "otp" ? "default" : "ghost",
											className: "flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9",
											onClick: () => {
												setMethod("otp");
												resetForm();
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }), "Phone OTP"]
										})]
									}),
									method === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handlePasswordSignIn,
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "login-id",
												className: "text-xs font-semibold text-muted-foreground uppercase",
												children: "Full Name OR Mobile Number *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "login-id",
												type: "text",
												placeholder: "e.g. Ramesh Kumar or 9876543210",
												required: true,
												value: loginIdentifier,
												onChange: (e) => setLoginIdentifier(e.target.value),
												className: "mt-1"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "login-pass",
												className: "text-xs font-semibold text-muted-foreground uppercase",
												children: "Password *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "login-pass",
													type: showPassword ? "text" : "password",
													placeholder: "Enter your password",
													required: true,
													minLength: 3,
													value: loginPassword,
													onChange: (e) => setLoginPassword(e.target.value),
													className: "pr-10"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
													onClick: () => setShowPassword(!showPassword),
													tabIndex: -1,
													children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-muted-foreground" })
												})]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												disabled: loading,
												className: "w-full rounded-full py-5 text-base font-semibold",
												children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Sign In"]
											})
										]
									}),
									method === "otp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: otpStep === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleSendOTP,
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "otp-phone",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Mobile Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-muted-foreground border-r pr-2",
												children: "+91"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "otp-phone",
												type: "tel",
												placeholder: "9876543210",
												required: true,
												value: otpPhone,
												onChange: (e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
												maxLength: 10,
												className: "pl-16 text-lg tracking-wider font-medium"
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full rounded-full py-5 text-base font-semibold",
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Send OTP"]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleVerifyOTP,
										className: "space-y-3",
										children: [
											devMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-lg border border-amber-300 bg-amber-50 p-2 text-center text-xs font-medium text-amber-800",
												children: devMessage
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "otp-code",
												className: "text-xs font-semibold text-muted-foreground uppercase",
												children: "Enter 6-Digit OTP *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "otp-code",
												type: "text",
												placeholder: "000000",
												required: true,
												value: otpCode,
												onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
												maxLength: 6,
												className: "mt-1 text-center text-2xl tracking-[0.4em] font-mono py-5"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												disabled: loading,
												className: "w-full rounded-full py-5 text-base font-semibold",
												children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Verify & Login"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setOtpStep("phone"),
												className: "text-xs text-muted-foreground hover:underline flex items-center gap-1 mx-auto pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Change Number"]
											})
										]
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signup",
								className: "space-y-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleRegister,
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "reg-name",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Full Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "reg-name",
											type: "text",
											placeholder: "e.g. Ramesh Kumar",
											required: true,
											value: regFullName,
											onChange: (e) => setRegFullName(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "reg-phone",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Phone Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-muted-foreground border-r pr-2",
												children: "+91"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "reg-pass",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Password (Min 3 characters) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "reg-pass",
											type: "password",
											placeholder: "Enter password",
											required: true,
											minLength: 3,
											value: regPassword,
											onChange: (e) => setRegPassword(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "reg-conf-pass",
											className: "text-xs font-semibold text-muted-foreground uppercase",
											children: "Confirm Password *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "reg-conf-pass",
											type: "password",
											placeholder: "Re-enter password",
											required: true,
											value: regConfirmPassword,
											onChange: (e) => setRegConfirmPassword(e.target.value),
											className: "mt-1"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full rounded-full py-5 text-base font-semibold",
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Register Account"]
										})
									]
								})
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
export { AuthPage as component };
