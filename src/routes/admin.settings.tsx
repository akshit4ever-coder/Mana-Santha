import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Shield,
  Store,
  Bell,
  Database,
  Key,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { user } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);
    } catch (error: any) {
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
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="mt-1 font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">User ID</Label>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {user?.id}
              </p>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Last Sign In</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString("en-IN")
                : "—"}
            </p>
          </div>

          {!changingPassword ? (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setChangingPassword(true)}
            >
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3 border rounded-xl p-4 bg-muted/30">
              <h4 className="font-medium text-sm">Change Password</h4>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="rounded-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setChangingPassword(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      ),
    },
    {
      icon: Store,
      title: "Store Information",
      description: "Basic store details shown to customers",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Store Name</Label>
              <Input defaultValue="Mana Santha" disabled className="bg-muted" />
            </div>
            <div>
              <Label>Support Phone</Label>
              <Input placeholder="+91 XXXXX XXXXX" disabled className="bg-muted" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Store details are managed via Supabase configuration. Contact your developer to update.
          </p>
        </div>
      ),
    },
    {
      icon: Database,
      title: "Database & Environment",
      description: "Supabase project configuration",
      content: (
        <div className="space-y-3">
          <div className="rounded-lg bg-muted p-4 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SUPABASE_URL</span>
              <span className="text-foreground truncate max-w-[200px]">
                {import.meta.env.VITE_SUPABASE_URL || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PROJECT_ID</span>
              <span className="text-foreground">
                {import.meta.env.VITE_SUPABASE_PROJECT_ID || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API_KEY</span>
              <span className="text-foreground">
                {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
                  ? "••••••••••••••••"
                  : "Not set"}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Environment variables are stored in{" "}
            <code className="rounded bg-muted px-1">.env.local</code>. Never
            expose secret keys in the frontend.
          </p>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Authentication Settings",
      description: "Supabase Auth configuration guidance",
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              {
                label: "Email Confirmations",
                note: "Go to Supabase Dashboard → Auth → Settings → Enable email confirmations (OFF for dev)",
                done: false,
              },
              {
                label: "Phone OTP (SMS)",
                note: "Requires Twilio or MessageBird configured in Supabase Dashboard → Auth → Providers → Phone",
                done: false,
              },
              {
                label: "Email/Password Auth",
                note: "Enabled by default in Supabase",
                done: true,
              },
              {
                label: "Row Level Security",
                note: "Enabled on all tables via migrations",
                done: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-success text-success-foreground" : "bg-amber-100 text-amber-600"}`}
                >
                  {item.done ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-xs font-bold">!</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Admin account and system configuration
        </p>
      </div>

      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <section.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{section.title}</h2>
              <p className="text-xs text-muted-foreground">
                {section.description}
              </p>
            </div>
          </div>
          {section.content}
        </div>
      ))}
    </div>
  );
}
