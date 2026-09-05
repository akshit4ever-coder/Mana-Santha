import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — Mana Santha" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase should handle the recovery token automatically and create a session.
    // We keep this hook to allow future handling if needed.
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass } as any);
      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password updated successfully. Please sign in.");
        navigate({ to: "/auth" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter a new password to finish resetting your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rp-pass" className="text-xs font-semibold text-muted-foreground uppercase">New Password</Label>
              <Input id="rp-pass" type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="rp-conf" className="text-xs font-semibold text-muted-foreground uppercase">Confirm Password</Label>
              <Input id="rp-conf" type="password" placeholder="Confirm password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="mt-1" />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="rounded-full" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
              <Button type="button" variant="ghost" onClick={() => navigate({ to: "/auth" })}>Back to Login</Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
