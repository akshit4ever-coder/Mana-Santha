import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Image,
  Ticket,
  Users,
  Boxes,
  Bike,
  BarChart2,
  Settings,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Mana Santha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/subcategories", label: "Subcategories", icon: Boxes },
  { to: "/admin/banners", label: "Banners", icon: Image },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/delivery", label: "Delivery", icon: Bike },
  { to: "/admin/reports", label: "Reports", icon: BarChart2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

/* ── Admin Login Form ── */
function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Please enter your admin email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await adminSupabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.error("Admin login error:", error.message);
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error("Login failed — no session created.");
      }

      // Verify the user's role
      const { data: roleData, error: roleError } = await adminSupabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        // User does not have the admin role
        await supabase.auth.signOut();
        throw new Error("You are not authorized to access the Admin Panel.");
      }

      toast.success("Welcome, Admin! 🛡️");
      // AuthProvider's onAuthStateChange will pick up the session
    } catch (err: any) {
      toast.error(err.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-xl p-8 shadow-2xl">
            {/* Icon & Title */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 shadow-lg">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-sm text-slate-400 mt-1">
                Authorized personnel only
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Admin Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@manasantha.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-5 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-black"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Sign in to Admin Panel
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <Link
                to="/"
                className="flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminIsAdmin, setAdminIsAdmin] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Track adminSupabase session separately so admin can be logged in concurrently
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await adminSupabase.auth.getSession();
        if (!mounted) return;
        setAdminUser(data.session?.user ?? null);
        setAdminLoading(false);
        if (data.session?.user) {
          try {
            const res = await adminSupabase
              .from("user_roles")
              .select("role")
              .eq("user_id", data.session.user.id)
              .eq("role", "admin")
              .maybeSingle();
            if (!mounted) return;
            setAdminIsAdmin(!!res.data);
          } catch (e) {
            if (!mounted) return;
            setAdminIsAdmin(false);
          }
        }
      } catch (e) {
        if (!mounted) return;
        setAdminLoading(false);
      }
    })();

    const { data: sub } = adminSupabase.auth.onAuthStateChange((_, s) => {
      setAdminUser(s?.user ?? null);
      if (s?.user) {
        (async () => {
          try {
            const res = await adminSupabase
              .from("user_roles")
              .select("role")
              .eq("user_id", s.user.id)
              .eq("role", "admin")
              .maybeSingle();
            setAdminIsAdmin(!!res.data);
          } catch {
            setAdminIsAdmin(false);
          }
        })();
      } else {
        setAdminIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      try {
        if (sub && (sub as any).subscription && typeof (sub as any).subscription.unsubscribe === 'function') {
          (sub as any).subscription.unsubscribe();
        }
      } catch (e) {
        console.warn('Failed to unsubscribe admin auth listener', e);
      }
    };
  }, []);
  // Determine if admin is authenticated either via user session or admin client
  const effectiveIsAdmin = isAdmin || adminIsAdmin;

  // Subscribe to new orders for real-time admin notifications
  useEffect(() => {
    if (!effectiveIsAdmin) return;
    console.debug('Admin realtime: subscribing to orders channel — effectiveIsAdmin=', effectiveIsAdmin);
    const channel = adminSupabase.channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        try {
          console.debug('Admin realtime: received payload for orders INSERT', payload);
          const order = (payload.new as any) ?? payload.record ?? payload;
          const short = `Order #${order.id} — ${order.total ? `₹${order.total}` : ''}`;
          toast.success(`New order received: ${short}`);
          // Browser Notification API
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('New Order', { body: short });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then((perm) => {
                if (perm === 'granted') new Notification('New Order', { body: short });
              });
            }
          }
        } catch (e) {
          console.warn('Failed to process order notification', e);
        }
      })
      .subscribe();

    console.debug('Admin realtime: subscribe() returned', channel);

    return () => {
      try {
        if (channel && typeof (channel as any).unsubscribe === 'function') (channel as any).unsubscribe();
      } catch (e) {
        console.warn('Failed to unsubscribe admin realtime channel', e);
      }
    };
  }, [effectiveIsAdmin]);

  if (loading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in as either admin user or admin client -> show admin login form
  if (!user && !adminUser) {
    return <AdminLoginForm />;
  }

  // Logged in as non-admin (no admin session) -> show 403 Access Denied
  if (!effectiveIsAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">403 Access Denied</h1>
              <p className="text-muted-foreground">
                You are not authorized to access the Admin Panel. This area is restricted to administrators only.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button 
                onClick={async () => {
                  await signOut();
                }} 
                className="w-full sm:w-auto"
              >
                Sign Out / Switch Account
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="sticky top-24 flex flex-col gap-1 rounded-xl border bg-card p-3 shadow-card">
            <div className="mb-2 px-3 py-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Admin Panel
              </p>
            </div>
            {NAV_ITEMS.map((n) => {
              const active = n.exact
                ? path === n.to
                : path.startsWith(n.to) && n.to !== "/admin";
              const exactActive = n.exact && path === "/admin";
              const isActive = n.exact ? exactActive : active;

              return (
                <Link
                  key={n.to}
                  to={n.to as any}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                </Link>
              );
            })}
            <div className="mt-3 border-t pt-3">
              <p className="px-3 text-xs text-muted-foreground">
                Logged in as <span className="font-medium text-foreground">{(adminUser && adminUser.email) ?? user?.email}</span>
              </p>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
