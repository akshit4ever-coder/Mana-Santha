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

export const shopFreshCategoryPattern = /fruit|veget|milk|dairy|egg|meat|dry fruit|nut/i;

export function getShopFreshCategories(categories: any[] = []) {
  return (categories || []).filter((category: any) => {
    const name = (category?.name ?? "").toLowerCase();
    const slug = (category?.slug ?? "").toLowerCase();
    return shopFreshCategoryPattern.test(name) || shopFreshCategoryPattern.test(slug);
  });
}

export const useProducts = (opts?: { categorySlug?: string; categoryId?: string; categoryIds?: string[]; featured?: boolean; search?: string; limit?: number }) =>
  useQuery({
    queryKey: ["products", opts],
    queryFn: async () => {
      if (opts?.categoryIds && opts.categoryIds.length === 0) return [];

      let q = supabase
        .from("products")
        .select("*, categories(name, slug), subcategories(name, slug), product_variants(*)")
        .eq("is_active", true);
      if (opts?.featured) q = q.eq("is_featured", true);
      if (opts?.search) q = q.ilike("name", `%${opts.search}%`);
      if (opts?.categoryId) q = q.eq("category_id", opts.categoryId);
      if (opts?.categoryIds && opts.categoryIds.length > 0) q = q.in("category_id", opts.categoryIds);
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

export const useShopFreshProducts = () => {
  const { data: categories = [] } = useCategories();
  const shopFreshCategories = getShopFreshCategories(categories);
  const categoryIds = shopFreshCategories
    .map((category: any) => category.id)
    .filter(Boolean);

  return useProducts({
    categoryIds: categoryIds.length > 0 ? categoryIds : [],
    limit: 12,
  });
};

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

export const GUEST_CART_KEY = "mana_santha_guest_cart";

export function getGuestCartItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.product_id) : [];
  } catch (error) {
    console.warn("Failed to read guest cart:", error);
    return [];
  }
}

export function writeGuestCartItems(items: any[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export async function mergeGuestCartIntoUserCart(userId: string) {
  const guestItems = getGuestCartItems();
  if (!guestItems.length) return 0;

  const productIds = [...new Set(guestItems.map((item) => item.product_id).filter(Boolean))];
  let productMap = new Map<string, any>();

  if (productIds.length > 0) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, image_url, brand, price, unit, weight, max_qty")
      .in("id", productIds);

    if (error) throw error;
    for (const product of products ?? []) {
      productMap.set(product.id, product);
    }
  }

  let mergedCount = 0;

  for (const item of guestItems) {
    const productId = item.product_id;
    const variantId = item.variant_id ?? null;
    const quantityToAdd = Number(item.quantity ?? 0);
    if (!productId || quantityToAdd <= 0) continue;

    let existingQuery = supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (variantId) {
      existingQuery = existingQuery.eq("variant_id", variantId);
    } else {
      existingQuery = existingQuery.is("variant_id", null);
    }

    const { data: existing, error: existingError } = await existingQuery.maybeSingle();
    if (existingError) {
      if (isMissingTableError(existingError)) {
        throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
      }
      throw existingError;
    }

    const defaultProduct = productMap.get(productId);
    const insertPayload: any = {
      user_id: userId,
      product_id: productId,
      quantity: quantityToAdd,
      variant_id: variantId ?? null,
      variant_name: item.variant_name ?? null,
      variant_price: item.variant_price ?? defaultProduct?.price ?? null,
      variant_image_url: item.variant_image_url ?? defaultProduct?.image_url ?? null,
      variant_unit: item.variant_unit ?? defaultProduct?.unit ?? defaultProduct?.weight ?? null,
      variant_max_qty: item.variant_max_qty ?? defaultProduct?.max_qty ?? null,
    };

    if (existing) {
      const nextQuantity = Number(existing.quantity ?? 0) + quantityToAdd;
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: nextQuantity })
        .eq("id", existing.id)
        .eq("user_id", userId);
      if (updateError) {
        if (isMissingTableError(updateError)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert(insertPayload);
      if (insertError) {
        if (isMissingTableError(insertError)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw insertError;
      }
    }

    mergedCount += 1;
  }

  writeGuestCartItems([]);
  return mergedCount;
}

export const useCart = (userId?: string) =>
  useQuery({
    queryKey: ["cart", userId ?? "guest"],
    queryFn: async () => {
      if (!userId) {
        const guestItems = getGuestCartItems();
        if (guestItems.length === 0) return [];

        const productIds = [...new Set(guestItems.map((item) => item.product_id).filter(Boolean))];
        let productMap = new Map<string, any>();

        if (productIds.length > 0) {
          const { data, error } = await supabase
            .from("products")
            .select("id, name, slug, image_url, brand, price, unit, weight, max_qty")
            .in("id", productIds);

          if (error) throw error;
          for (const product of data ?? []) {
            productMap.set(product.id, product);
          }
        }

        return guestItems.map((item: any) => {
          const product = productMap.get(item.product_id);
          return {
            ...item,
            quantity: Number(item.quantity ?? 0),
            products: product ?? null,
            variant_price: item.variant_price ?? product?.price ?? null,
            variant_image_url: item.variant_image_url ?? product?.image_url ?? null,
            variant_unit: item.variant_unit ?? product?.unit ?? product?.weight ?? null,
            variant_max_qty: item.variant_max_qty ?? product?.max_qty ?? null,
          };
        });
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", userId);
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

async function getAuthenticatedCartUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("Supabase user:", user);

  if (error) {
    console.error("Supabase getUser error:", error);
    throw new Error("Your Supabase session is invalid or expired. Please sign in again.");
  }

  if (!user?.id) {
    console.error("Supabase user is null. Session was not restored.");
    throw new Error("Please sign in to add items to cart.");
  }

  return user;
}

export function useAddToCart(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity = 1, variant }: { productId: string; quantity?: number; variant?: any }) => {
      if (!userId) {
        const guestItems = getGuestCartItems();
        const itemKey = `${productId}:${variant?.id ?? "default"}`;
        const existingIndex = guestItems.findIndex((item) => item.id === itemKey || (item.product_id === productId && (variant ? item.variant_id === variant.id : item.variant_id == null)));

        const nextItems = [...guestItems];
        if (existingIndex >= 0) {
          nextItems[existingIndex] = {
            ...nextItems[existingIndex],
            quantity: Number(nextItems[existingIndex].quantity ?? 0) + Number(quantity ?? 0),
          };
        } else {
          nextItems.push({
            id: itemKey,
            product_id: productId,
            variant_id: variant?.id ?? null,
            quantity,
            variant_name: variant?.name ?? null,
            variant_price: variant?.price ?? null,
            variant_image_url: variant?.image_url ?? null,
            variant_unit: variant?.unit ?? null,
            variant_max_qty: variant?.max_qty ?? null,
          });
        }

        writeGuestCartItems(nextItems);
        return;
      }

      const authUser = await getAuthenticatedCartUser();
      const resolvedUserId = userId ?? authUser.id;

      if (!resolvedUserId) throw new Error("Please sign in");
      if (resolvedUserId !== authUser.id) {
        console.error("User mismatch in cart write:", { propUserId: userId, authUserId: authUser.id });
        throw new Error("Session mismatch detected. Please sign in again.");
      }

      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", authUser.id)
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
          .eq("id", existing.id)
          .eq("user_id", authUser.id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      } else {
        const insertPayload: any = { user_id: authUser.id, product_id: productId, quantity };
        if (variant) {
          insertPayload.variant_id = variant.id ?? null;
          insertPayload.variant_name = variant.name ?? null;
          insertPayload.variant_price = variant.price ?? null;
          insertPayload.variant_image_url = variant.image_url ?? null;
          insertPayload.variant_unit = variant.unit ?? null;
          insertPayload.variant_max_qty = variant.max_qty ?? null;
        }

        console.log("Insert payload:", insertPayload);

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
      qc.invalidateQueries({ queryKey: ["cart", userId ?? "guest"] });
      toast.success("Added to cart");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCartQty(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (!userId) {
        const guestItems = getGuestCartItems();
        const nextItems = guestItems
          .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, Number(quantity)) } : item))
          .filter((item) => Number(item.quantity ?? 0) > 0);
        writeGuestCartItems(nextItems);
        return;
      }

      const authUser = await getAuthenticatedCartUser();
      const resolvedUserId = userId ?? authUser.id;

      if (!resolvedUserId || resolvedUserId !== authUser.id) {
        throw new Error("Your cart session is invalid. Please sign in again.");
      }

      if (quantity <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", authUser.id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      } else {
        const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id).eq("user_id", authUser.id);
        if (error) {
          if (isMissingTableError(error)) {
            throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
          }
          throw error;
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId ?? "guest"] }),
  });
}

export function useRemoveCartItem(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) {
        const guestItems = getGuestCartItems().filter((item) => item.id !== id);
        writeGuestCartItems(guestItems);
        return;
      }

      const authUser = await getAuthenticatedCartUser();
      const resolvedUserId = userId ?? authUser.id;

      if (!resolvedUserId || resolvedUserId !== authUser.id) {
        throw new Error("Your cart session is invalid. Please sign in again.");
      }

      const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", authUser.id);
      if (error) {
        if (isMissingTableError(error)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId ?? "guest"] }),
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
