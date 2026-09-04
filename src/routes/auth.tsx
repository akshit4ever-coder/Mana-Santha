import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signInWithIdentifierAndPassword, registerNewUser } from "@/lib/phone-auth";
import { toast } from "sonner";
import { Loader2, Leaf, KeyRound, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Mana Santha" },
      { name: "description", content: "Sign in or create your Mana Santha account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  // login method fixed to password-only

  // Sign In states
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form states
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // OTP removed — password-only login

  useEffect(() => {
    if (user) {
      // Immediate navigate to home page on authentication success
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  const resetForm = () => {
    setLoginIdentifier("");
    setLoginPassword("");
    setRegFullName("");
    setRegPhone("");
    setRegPassword("");
    setRegConfirmPassword("");
    // OTP fields cleared (OTP removed)
  };

  // Login Handler (Either Full Name OR Phone Number + Password)
  const handlePasswordSignIn = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  // Register Handler (Full Name + Phone Number + Password)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
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
        password: regPassword,
      });
      toast.success("Account created successfully! Welcome 🎉");
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP handlers removed

  return (
    <div className="min-h-screen bg-gradient-fresh flex flex-col justify-between">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-glow">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to Mana Santha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fresh groceries delivered to your doorstep
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as any);
              resetForm();
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Register Account</TabsTrigger>
            </TabsList>

            {/* ================= SIGN IN TAB ================= */}
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handlePasswordSignIn} className="space-y-3">
                <div>
                  <Label htmlFor="login-id" className="text-xs font-semibold text-muted-foreground uppercase">
                    Full Name OR Mobile Number *
                  </Label>
                  <Input
                    id="login-id"
                    type="text"
                    placeholder="e.g. Ramesh Kumar or 9876543210"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="login-pass" className="text-xs font-semibold text-muted-foreground uppercase">
                    Password *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="login-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      minLength={3}
                      minLength={6}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <button type="button" className="text-sm text-primary underline" onClick={() => setShowReset((s) => !s)}>
                    Forgot password?
                  </button>
                </div>

                {showReset && (
                  <div className="mt-4 rounded-md border p-4 bg-background/50">
                    <div className="text-sm text-muted-foreground mb-2">Enter your email to receive a password reset link.</div>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={resetLoading}
                        onClick={async () => {
                          if (!resetEmail || !resetEmail.includes("@")) {
                            toast.error("Please enter a valid email address");
                            return;
                          }
                          setResetLoading(true);
                          try {
                            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
                            if (error) throw error;
                            toast.success("Password reset link sent. Check your email.");
                            setShowReset(false);
                            setResetEmail("");
                          } catch (err: any) {
                            toast.error(err.message || "Failed to send reset link");
                          } finally {
                            setResetLoading(false);
                          }
                        }}
                        className="rounded-full"
                      >
                        {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send reset link"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => { setShowReset(false); setResetEmail(""); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            {/* ================= REGISTER TAB (Full Name + Phone + Password) ================= */}
            <TabsContent value="signup" className="space-y-3">
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <Label htmlFor="reg-name" className="text-xs font-semibold text-muted-foreground uppercase">
                    Full Name *
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reg-phone" className="text-xs font-semibold text-muted-foreground uppercase">
                    Phone Number *
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-muted-foreground border-r pr-2">
                      +91
                    </div>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="9876543210"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                      className="pl-16 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-pass" className="text-xs font-semibold text-muted-foreground uppercase">
                    Password (Min 6 characters) *
                  </Label>
                  <Input
                    id="reg-pass"
                    type="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reg-conf-pass" className="text-xs font-semibold text-muted-foreground uppercase">
                    Confirm Password *
                  </Label>
                  <Input
                    id="reg-conf-pass"
                    type="password"
                    placeholder="Re-enter password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
