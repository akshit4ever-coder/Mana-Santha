import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useAuth } from "@/lib/auth";
import {
  requestOTP,
  verifyOTPAndAuth,
  signInWithIdentifierAndPassword,
  registerNewUser,
} from "@/lib/phone-auth";
import { toast } from "sonner";
import { Loader2, Leaf, Phone, ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<"password" | "otp">("password");

  // Sign In states
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form states
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // OTP flow states
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "verify">("phone");
  const [devMessage, setDevMessage] = useState<string | null>(null);

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
    setOtpPhone("");
    setOtpCode("");
    setOtpStep("phone");
    setDevMessage(null);
  };

  // Login Handler (Either Full Name OR Phone Number + Password)
  const handlePasswordSignIn = async (e: React.FormEvent) => {
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

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
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
      } else {
        toast.success("OTP sent to your mobile number!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

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
              {/* Method Switcher */}
              <div className="flex gap-2 p-1 rounded-xl bg-muted/60">
                <Button
                  type="button"
                  variant={method === "password" ? "default" : "ghost"}
                  className="flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9"
                  onClick={() => {
                    setMethod("password");
                    resetForm();
                  }}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Name / Phone + Password
                </Button>
                <Button
                  type="button"
                  variant={method === "otp" ? "default" : "ghost"}
                  className="flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9"
                  onClick={() => {
                    setMethod("otp");
                    resetForm();
                  }}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Phone OTP
                </Button>
              </div>

              {/* Password Login (Name OR Phone + Password) */}
              {method === "password" && (
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

                  <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              )}

              {/* Phone OTP Login */}
              {method === "otp" && (
                <div>
                  {otpStep === "phone" ? (
                    <form onSubmit={handleSendOTP} className="space-y-3">
                      <div>
                        <Label htmlFor="otp-phone" className="text-xs font-semibold text-muted-foreground uppercase">
                          Mobile Number *
                        </Label>
                        <div className="relative mt-1">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold text-muted-foreground border-r pr-2">
                            +91
                          </div>
                          <Input
                            id="otp-phone"
                            type="tel"
                            placeholder="9876543210"
                            required
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            maxLength={10}
                            className="pl-16 text-lg tracking-wider font-medium"
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-3">
                      {devMessage && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-center text-xs font-medium text-amber-800">
                          {devMessage}
                        </div>
                      )}
                      <div>
                        <Label htmlFor="otp-code" className="text-xs font-semibold text-muted-foreground uppercase">
                          Enter 6-Digit OTP *
                        </Label>
                        <Input
                          id="otp-code"
                          type="text"
                          placeholder="000000"
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          maxLength={6}
                          className="mt-1 text-center text-2xl tracking-[0.4em] font-mono py-5"
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Login
                      </Button>
                      <button
                        type="button"
                        onClick={() => setOtpStep("phone")}
                        className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mx-auto pt-1"
                      >
                        <ArrowLeft className="h-3 w-3" /> Change Number
                      </button>
                    </form>
                  )}
                </div>
              )}
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
                    Password (Min 3 characters) *
                  </Label>
                  <Input
                    id="reg-pass"
                    type="password"
                    placeholder="Enter password"
                    required
                    minLength={3}
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
