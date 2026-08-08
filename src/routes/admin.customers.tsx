import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Badge } from "@/components/UI/badge";
import { Input } from "@/components/UI/input";
import { useState } from "react";
import { Loader2, Search, Users } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const [search, setSearch] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      // Get profiles with their order counts
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, created_at, avatar_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orderCounts } = useQuery({
    queryKey: ["admin-customer-order-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("user_id, total");
      if (error) return {};
      const counts: Record<string, { count: number; total: number }> = {};
      data?.forEach((o) => {
        if (!counts[o.user_id]) counts[o.user_id] = { count: 0, total: 0 };
        counts[o.user_id].count += 1;
        counts[o.user_id].total += Number(o.total);
      });
      return counts;
    },
  });

  const filtered = (customers ?? []).filter(
    (c: any) =>
      !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Customers</h1>
        <p className="text-sm text-muted-foreground">
          {customers?.length ?? 0} registered customers
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Customers",
            value: customers?.length ?? 0,
            icon: Users,
          },
          {
            label: "With Orders",
            value: Object.keys(orderCounts ?? {}).length,
            icon: Users,
          },
          {
            label: "No Orders Yet",
            value:
              (customers?.length ?? 0) -
              Object.keys(orderCounts ?? {}).length,
            icon: Users,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c: any) => {
                  const stats = orderCounts?.[c.id];
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {c.full_name
                              ? c.full_name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {c.full_name || "—"}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground">
                              {c.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.phone || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {stats?.count ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {stats
                          ? `₹${stats.total.toLocaleString("en-IN")}`
                          : "₹0"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {stats?.count ? (
                          <Badge className="bg-success text-success-foreground">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">New</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
