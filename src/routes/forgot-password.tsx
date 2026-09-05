import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password — Mana Santha" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
      const mod = await import("@/serverFns/resetPasswordByPhone.functions");
      const res = await mod.resetPasswordByPhone({ data: { phone: digits, fullName: fullName.trim(), newPassword } });
      if (!res || res.success === false) {
        toast.error(res?.error || "Failed to reset password");
      } else {
        toast.success("Password updated. Please sign in with your new password.");
        navigate({ to: "/auth" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
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
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Reset your password using your registered mobile number and full name.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fp-phone" className="text-xs font-semibold text-muted-foreground uppercase">Registered Phone Number</Label>
              <Input id="fp-phone" type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="fp-name" className="text-xs font-semibold text-muted-foreground uppercase">Full Name</Label>
              <Input id="fp-name" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="fp-newpass" className="text-xs font-semibold text-muted-foreground uppercase">New Password</Label>
              <Input id="fp-newpass" type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="fp-confpass" className="text-xs font-semibold text-muted-foreground uppercase">Confirm Password</Label>
              <Input id="fp-confpass" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="rounded-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
              <Button type="button" variant="ghost" onClick={() => navigate({ to: "/auth" })}>Back to Login</Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
