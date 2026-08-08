import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [orders, products, todayOrders] = await Promise.all([
        supabase.from("orders").select("id, total, status, created_at"),
        supabase.from("products").select("id, stock"),
        supabase.from("orders").select("id, total").gte("created_at", new Date(new Date().setHours(0,0,0,0)).toISOString()),
      ]);
      const totalRevenue = orders.data?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
      const todayRev = todayOrders.data?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
      const pending = orders.data?.filter((o) => o.status === "pending").length ?? 0;
      const outOfStock = products.data?.filter((p) => p.stock <= 0).length ?? 0;
      return {
        totalOrders: orders.data?.length ?? 0,
        totalRevenue, todayRev,
        todayOrders: todayOrders.data?.length ?? 0,
        pending, outOfStock,
        products: products.data?.length ?? 0,
      };
    },
  });

  const stats = [
    { label: "Today's Orders", value: data?.todayOrders ?? 0, icon: ShoppingBag },
    { label: "Today's Revenue", value: formatINR(data?.todayRev ?? 0), icon: TrendingUp },
    { label: "Total Orders", value: data?.totalOrders ?? 0, icon: Users },
    { label: "Total Revenue", value: formatINR(data?.totalRevenue ?? 0), icon: TrendingUp },
    { label: "Pending Orders", value: data?.pending ?? 0, icon: ShoppingBag },
    { label: "Out of Stock", value: data?.outOfStock ?? 0, icon: Package },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-2xl font-bold">{s.value}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
