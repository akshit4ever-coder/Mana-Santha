import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Mana Santha" },
      { name: "description", content: "Reset your Mana Santha password securely." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.replace(/\D/g, "").length !== 10) {
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
      const mod = await import("../serverFns/resetPasswordByPhone.functions");
      const result = await mod.resetPasswordByPhone({
        data: {
          phone,
          fullName,
          newPassword,
        },
      });

      if (!result || result.success === false) {
        toast.error(result?.error || "Failed to reset password");
        return;
      }

      toast.success("Password updated successfully. Please sign in with your new password.");
      navigate({ to: "/auth" });
    } catch (error: any) {
      toast.error(error?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-fresh flex flex-col justify-between">
      <Header />

      <main className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-glow">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your registered phone number and full name to update your password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="reset-phone" className="text-xs font-semibold uppercase text-muted-foreground">
                Phone Number *
              </Label>
              <Input
                id="reset-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reset-name" className="text-xs font-semibold uppercase text-muted-foreground">
                Full Name *
              </Label>
              <Input
                id="reset-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reset-newpass" className="text-xs font-semibold uppercase text-muted-foreground">
                New Password *
              </Label>
              <Input
                id="reset-newpass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reset-confpass" className="text-xs font-semibold uppercase text-muted-foreground">
                Confirm Password *
              </Label>
              <Input
                id="reset-confpass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-full py-5 text-base font-semibold">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset Password
            </Button>

            <div className="text-center">
              <Link to="/auth" className="text-sm text-primary underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
