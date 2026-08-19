import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Select categories and their nested subcategories so category pages can show subcategories
      const { data, error } = await supabase
        .from("categories")
        .select("*, subcategories(*)")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useProducts = (opts?: { categorySlug?: string; featured?: boolean; search?: string; limit?: number }) =>
  useQuery({
    queryKey: ["products", opts],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*, categories(name, slug), subcategories(name, slug), product_variants(*)")
        .eq("is_active", true);
      if (opts?.featured) q = q.eq("is_featured", true);
      if (opts?.search) q = q.ilike("name", `%${opts.search}%`);
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      let rows = data ?? [];
      if (opts?.categorySlug) {
        rows = rows.filter((r: any) => r.categories?.slug === opts.categorySlug);
      }
      return rows;
    },
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name, slug), subcategories(name, slug), product_variants(*)")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
          const { data, error } = await supabase
            .from("products")
            .select("*, categories(name, slug), subcategories(name, slug)")
            .eq("slug", slug)
            .maybeSingle();
          if (error) throw error;
          return data;
        }
        throw err;
      }
    },
  });

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const message = (error as any).message;
  return typeof message === "string" && message.includes("Could not find the table");
}

export const useCart = (userId?: string) =>
  useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", userId!);
      if (error) {
        if (isMissingTableError(error)) {
          console.warn("Supabase cart_items table missing; returning empty cart.", error.message);
          return [];
        }
        throw error;
      }
      return data;
    },
  });

export function useAddToCart(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity = 1, variant }: { productId: string; quantity?: number; variant?: any }) => {
      if (!userId) throw new Error("Please sign in");
      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (variant?.id) {
        query = query.eq("variant_id", variant.id);
      } else {
        query = query.is("variant_id", null);
      }

      const { data: existing, error: selectError } = await query.maybeSingle();
      if (selectError) {
        if (isMissingTableError(selectError)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw selectError;
      }
      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      } else {
        const insertPayload: any = { user_id: userId, product_id: productId, quantity };
        if (variant) {
          insertPayload.variant_id = variant.id ?? null;
          insertPayload.variant_name = variant.name ?? null;
          insertPayload.variant_price = variant.price ?? null;
          insertPayload.variant_image_url = variant.image_url ?? null;
          insertPayload.variant_unit = variant.unit ?? null;
          insertPayload.variant_max_qty = variant.max_qty ?? null;
        }
        const { error } = await supabase.from("cart_items").insert(insertPayload);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart", userId] });
      toast.success("Added to cart");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCartQty(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      } else {
        const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
  });
}

export function useRemoveCartItem(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (error) {
        if (isMissingTableError(error)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
  });
}

export const useWishlist = (userId?: string) =>
  useQuery({
    queryKey: ["wishlist", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*, products(*)")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
  });

export function useToggleWishlist(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) throw new Error("Please sign in");
      const { data: existing } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();
      if (existing) {
        await supabase.from("wishlist_items").delete().eq("id", existing.id);
        return "removed";
      }
      await supabase.from("wishlist_items").insert({ user_id: userId, product_id: productId });
      return "added";
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(res === "added" ? "Added to wishlist" : "Removed from wishlist");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export const useOrders = (userId?: string) =>
  useQuery({
    queryKey: ["orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAddresses = (userId?: string) =>
  useQuery({
    queryKey: ["addresses", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId!)
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
