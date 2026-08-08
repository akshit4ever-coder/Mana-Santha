import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { Loader2, TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const [orders, products, profiles] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total, status, payment_method, created_at")
          .order("created_at", { ascending: true }),
        supabase.from("products").select("id, name, stock, status"),
        supabase.from("profiles").select("id, created_at"),
      ]);

      const allOrders = orders.data ?? [];
      const allProducts = products.data ?? [];
      const allProfiles = profiles.data ?? [];

      // Revenue by day (last 30 days)
      const last30 = new Date();
      last30.setDate(last30.getDate() - 30);
      const recentOrders = allOrders.filter(
        (o) => new Date(o.created_at) >= last30
      );

      const dayMap: Record<string, { date: string; revenue: number; orders: number }> = {};
      recentOrders.forEach((o) => {
        const d = new Date(o.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
        if (!dayMap[d]) dayMap[d] = { date: d, revenue: 0, orders: 0 };
        dayMap[d].revenue += Number(o.total);
        dayMap[d].orders += 1;
      });
      const dailyData = Object.values(dayMap).slice(-14); // last 14 days

      // Order status breakdown
      const statusMap: Record<string, number> = {};
      allOrders.forEach((o) => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
      });
      const statusData = Object.entries(statusMap).map(([status, count]) => ({
        status: status.replace(/_/g, " "),
        count,
      }));

      // Payment method breakdown
      const payMap: Record<string, number> = {};
      allOrders.forEach((o) => {
        payMap[o.payment_method] = (payMap[o.payment_method] || 0) + 1;
      });

      const totalRevenue = allOrders.reduce((s, o) => s + Number(o.total), 0);
      const today = new Date().toDateString();
      const todayRevenue = allOrders
        .filter((o) => new Date(o.created_at).toDateString() === today)
        .reduce((s, o) => s + Number(o.total), 0);
      const pendingOrders = allOrders.filter(
        (o) => o.status === "pending"
      ).length;
      const outOfStock = allProducts.filter((p) => p.stock <= 0).length;

      return {
        totalRevenue,
        todayRevenue,
        totalOrders: allOrders.length,
        totalCustomers: allProfiles.length,
        pendingOrders,
        outOfStock,
        dailyData,
        statusData,
        payMap,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Total Revenue",
      value: formatINR(data?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Today's Revenue",
      value: formatINR(data?.todayRevenue ?? 0),
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-foreground",
    },
    {
      label: "Pending Orders",
      value: data?.pendingOrders ?? 0,
      icon: ShoppingBag,
      color: "text-amber-600",
    },
    {
      label: "Total Customers",
      value: data?.totalCustomers ?? 0,
      icon: Users,
      color: "text-foreground",
    },
    {
      label: "Out of Stock",
      value: data?.outOfStock ?? 0,
      icon: Package,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Sales and performance overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
                <div className={`mt-2 text-2xl font-bold ${s.color}`}>
                  {s.value}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      {(data?.dailyData?.length ?? 0) > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Revenue (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: any) => [formatINR(v), "Revenue"]}
                labelClassName="font-medium"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Order Status Chart */}
      {(data?.statusData?.length ?? 0) > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.statusData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Payment Methods */}
      {data?.payMap && Object.keys(data.payMap).length > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Payment Methods</h2>
          <div className="flex gap-6">
            {Object.entries(data.payMap).map(([method, count]) => (
              <div key={method} className="text-center">
                <div className="text-3xl font-bold">{count}</div>
                <div className="mt-1 text-sm font-medium uppercase text-muted-foreground">
                  {method === "cod" ? "Cash on Delivery" : "Online Payment"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
