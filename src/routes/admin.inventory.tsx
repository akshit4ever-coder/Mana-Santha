import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Badge } from "@/components/UI/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle, Plus, Minus } from "lucide-react";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, brand, sku, stock, price, unit, weight, status, categories(name), product_variants(*)")
          .order("stock", { ascending: true });
        if (error) throw error;
        return data;
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
          const { data, error } = await supabase
            .from("products")
            .select("id, name, brand, sku, stock, price, unit, weight, status, categories(name)")
            .order("stock", { ascending: true });
          if (error) throw error;
          return data;
        }
        throw err;
      }
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ id, newStock, reason }: { id: string; newStock: number; reason: string }) => {
      const { error } = await supabase
        .from("products")
        .update({
          stock: newStock,
          status: newStock <= 0 ? "out_of_stock" : "active",
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Stock updated to ${vars.newStock}`);
      setAdjusting((prev) => {
        const n = { ...prev };
        delete n[vars.id];
        return n;
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (products ?? []).filter((p: any) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "out" && p.stock <= 0) ||
      (filter === "low" && p.stock > 0 && p.stock < 10);
    return matchSearch && matchFilter;
  });

  const totalProducts = products?.length ?? 0;
  const outOfStock = products?.filter((p: any) => p.stock <= 0).length ?? 0;
  const lowStock = products?.filter((p: any) => p.stock > 0 && p.stock < 10).length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Manage stock levels for all products
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "all" ? "border-primary bg-primary/5" : "bg-card hover:bg-secondary"}`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Products
          </div>
          <div className="mt-2 text-2xl font-bold">{totalProducts}</div>
        </button>
        <button
          onClick={() => setFilter("low")}
          className={`rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "low" ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "bg-card hover:bg-secondary"}`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-amber-600">
            Low Stock (&lt;10)
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{lowStock}</div>
        </button>
        <button
          onClick={() => setFilter("out")}
          className={`rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "out" ? "border-destructive bg-destructive/5" : "bg-card hover:bg-secondary"}`}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-destructive">
            Out of Stock
          </div>
          <div className="mt-2 text-2xl font-bold text-destructive">{outOfStock}</div>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, brand, or SKU..."
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
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Adjust Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No products match your filter
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.brand}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(p as any).categories?.name ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.sku || "—"}
                    </TableCell>
                    <TableCell>
                      {p.product_variants && p.product_variants.length > 0 ? (
                        (() => {
                          const active = p.product_variants.filter((v: any) => v.is_active !== false);
                          const starting = Math.min(...active.map((v: any) => Number(v.selling_price ?? v.price ?? 0)));
                          return <div className="font-medium">Starting {formatINR(starting)}</div>;
                        })()
                      ) : (
                        <div className="font-medium">{formatINR(p.price)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.product_variants && p.product_variants.length > 0 ? (
                        <span className="font-medium text-success">{p.product_variants.reduce((s: number, v: any) => s + Number(v.stock || 0), 0)} total</span>
                      ) : (
                        p.stock <= 0 ? (
                          <Badge variant="destructive">0 — Out</Badge>
                        ) : p.stock < 10 ? (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {p.stock}
                          </Badge>
                        ) : (
                          <span className="font-medium text-success">{p.stock}</span>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.status === "active" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {p.status?.replace(/_/g, " ") || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => {
                            const cur = Number(adjusting[p.id] ?? p.stock);
                            setAdjusting((prev) => ({
                              ...prev,
                              [p.id]: String(Math.max(0, cur - 1)),
                            }));
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          className="h-7 w-16 text-center text-sm"
                          value={adjusting[p.id] ?? p.stock}
                          onChange={(e) =>
                            setAdjusting((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => {
                            const cur = Number(adjusting[p.id] ?? p.stock);
                            setAdjusting((prev) => ({
                              ...prev,
                              [p.id]: String(cur + 1),
                            }));
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {adjusting[p.id] !== undefined &&
                          adjusting[p.id] !== String(p.stock) && (
                            <Button
                              size="sm"
                              className="h-7 rounded-full text-xs"
                              onClick={() =>
                                updateStock.mutate({
                                  id: p.id,
                                  newStock: Number(adjusting[p.id]),
                                  reason: "Admin adjustment",
                                })
                              }
                              disabled={updateStock.isPending}
                            >
                              Save
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
