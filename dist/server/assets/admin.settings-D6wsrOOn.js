import { t as supabase } from "./client-Dxm-ZOZR.js";
import { a as useAuth, o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bell, CheckCircle, Database, Key, Loader2, Shield, Store } from "lucide-react";
//#region src/routes/admin.settings.tsx?tsr-split=component
function AdminSettings() {
	const { user } = useAuth();
	const [changingPassword, setChangingPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const handleChangePassword = async (e) => {
		e.preventDefault();
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
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) throw error;
			toast.success("Password updated successfully");
			setNewPassword("");
			setConfirmPassword("");
			setChangingPassword(false);
		} catch (error) {
			toast.error(error.message || "Failed to update password");
		} finally {
			setLoading(false);
		}
	};
	const sections = [
		{
			icon: Shield,
			title: "Admin Account",
			description: "Your admin account details and security settings",
			content: /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							className: "text-xs text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 font-medium",
							children: user?.email
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
							className: "text-xs text-muted-foreground",
							children: "User ID"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 font-mono text-xs text-muted-foreground",
							children: user?.id
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
						className: "text-xs text-muted-foreground",
						children: "Last Sign In"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("en-IN") : "—"
					})] }),
					!changingPassword ? /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						className: "rounded-full",
						onClick: () => setChangingPassword(true),
						children: [/* @__PURE__ */ jsx(Key, { className: "mr-2 h-4 w-4" }), "Change Password"]
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleChangePassword,
						className: "space-y-3 border rounded-xl p-4 bg-muted/30",
						children: [
							/* @__PURE__ */ jsx("h4", {
								className: "font-medium text-sm",
								children: "Change Password"
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "New Password" }), /* @__PURE__ */ jsx(Input, {
								type: "password",
								placeholder: "Min 6 characters",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								minLength: 6,
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Confirm New Password" }), /* @__PURE__ */ jsx(Input, {
								type: "password",
								placeholder: "Re-enter new password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsxs(Button, {
									type: "submit",
									disabled: loading,
									className: "rounded-full",
									children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Update Password"]
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "outline",
									className: "rounded-full",
									onClick: () => {
										setChangingPassword(false);
										setNewPassword("");
										setConfirmPassword("");
									},
									children: "Cancel"
								})]
							})
						]
					})
				]
			})
		},
		{
			icon: Store,
			title: "Store Information",
			description: "Basic store details shown to customers",
			content: /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Store Name" }), /* @__PURE__ */ jsx(Input, {
						defaultValue: "Mana Santha",
						disabled: true,
						className: "bg-muted"
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Support Phone" }), /* @__PURE__ */ jsx(Input, {
						placeholder: "+91 XXXXX XXXXX",
						disabled: true,
						className: "bg-muted"
					})] })]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: "Store details are managed via Supabase configuration. Contact your developer to update."
				})]
			})
		},
		{
			icon: Database,
			title: "Database & Environment",
			description: "Supabase project configuration",
			content: /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg bg-muted p-4 font-mono text-xs space-y-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "SUPABASE_URL"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-foreground truncate max-w-[200px]",
								children: "https://jbdfcqycvmekkuaedtug.supabase.co"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "PROJECT_ID"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-foreground",
								children: "jbdfcqycvmekkuaedtug"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "API_KEY"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-foreground",
								children: "••••••••••••••••"
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Environment variables are stored in",
						" ",
						/* @__PURE__ */ jsx("code", {
							className: "rounded bg-muted px-1",
							children: ".env.local"
						}),
						". Never expose secret keys in the frontend."
					]
				})]
			})
		},
		{
			icon: Bell,
			title: "Authentication Settings",
			description: "Supabase Auth configuration guidance",
			content: /* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: [
						{
							label: "Email Confirmations",
							note: "Go to Supabase Dashboard → Auth → Settings → Enable email confirmations (OFF for dev)",
							done: false
						},
						{
							label: "Phone OTP (SMS)",
							note: "Requires Twilio or MessageBird configured in Supabase Dashboard → Auth → Providers → Phone",
							done: false
						},
						{
							label: "Email/Password Auth",
							note: "Enabled by default in Supabase",
							done: true
						},
						{
							label: "Row Level Security",
							note: "Enabled on all tables via migrations",
							done: true
						}
					].map((item) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3 rounded-lg border p-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-success text-success-foreground" : "bg-amber-100 text-amber-600"}`,
							children: item.done ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold",
								children: "!"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-sm font-medium",
							children: item.label
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: item.note
						})] })]
					}, item.label))
				})
			})
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Settings"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Admin account and system configuration"
		})] }), sections.map((section) => /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border bg-card p-6 shadow-card",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-start gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10",
					children: /* @__PURE__ */ jsx(section.icon, { className: "h-5 w-5 text-primary" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-semibold",
					children: section.title
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: section.description
				})] })]
			}), section.content]
		}, section.title))]
	});
}
//#endregion
export { AdminSettings as component };
