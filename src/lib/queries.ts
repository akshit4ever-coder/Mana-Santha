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

export function normalizeGuestCartItem(item: any) {
  const productId = item?.product_id ?? item?.productId ?? null;
  const variantId = item?.variant_id ?? item?.variantId ?? null;
  const quantity = Number(item?.quantity ?? 0);
  const normalized = {
    ...item,
    id: item?.id ?? `${productId ?? "guest"}:${variantId ?? "default"}`,
    product_id: productId,
    variant_id: variantId,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 0,
    variant_name: item?.variant_name ?? item?.variantName ?? null,
    variant_price: item?.variant_price ?? item?.variantPrice ?? null,
    variant_image_url: item?.variant_image_url ?? item?.variantImageUrl ?? null,
    variant_unit: item?.variant_unit ?? item?.variantUnit ?? null,
    variant_max_qty: item?.variant_max_qty ?? item?.variantMaxQty ?? null,
  };

  return normalized;
}

export function getGuestCartItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeGuestCartItem(item))
      .filter((item) => item && item.product_id && Number(item.quantity ?? 0) > 0);
  } catch (error) {
    console.warn("Failed to read guest cart:", error);
    return [];
  }
}

export function writeGuestCartItems(items: any[]) {
  if (typeof window === "undefined") return;
  const normalized = (items ?? [])
    .map((item) => normalizeGuestCartItem(item))
    .filter((item) => item && item.product_id && Number(item.quantity ?? 0) > 0);
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(normalized));
}

export async function mergeGuestCartIntoUserCart(userId: string) {
  const guestItems = getGuestCartItems();
  if (!guestItems.length) return 0;

  const productIds = [...new Set(guestItems.map((item) => item.product_id).filter(Boolean))];
  const variantIds = [...new Set(guestItems.map((item) => item.variant_id).filter(Boolean))];
  const productMap = new Map<string, any>();
  const variantMap = new Map<string, any>();

  if (productIds.length > 0) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, image_url, brand, price, unit, weight, max_qty, stock")
      .in("id", productIds);

    if (error) throw error;
    for (const product of products ?? []) {
      productMap.set(product.id, product);
    }
  }

  if (variantIds.length > 0) {
    const { data: variants, error } = await supabase
      .from("product_variants")
      .select("id, product_id, name, stock, max_qty, selling_price, mrp, image_url, unit, quantity_value")
      .in("id", variantIds);

    if (error) throw error;
    for (const variant of variants ?? []) {
      variantMap.set(variant.id, variant);
    }
  }

  const { data: existingUserCart, error: existingUserCartError } = await supabase
    .from("cart_items")
    .select("id, product_id, variant_id, quantity")
    .eq("user_id", userId);

  if (existingUserCartError) {
    if (isMissingTableError(existingUserCartError)) {
      throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
    }
    throw existingUserCartError;
  }

  const existingByKey = new Map<string, number>();
  for (const item of existingUserCart ?? []) {
    const key = `${item.product_id}:${item.variant_id ?? "default"}`;
    existingByKey.set(key, Number(item.quantity ?? 0));
  }

  let mergedCount = 0;
  const remainingGuestItems: any[] = [];

  for (const item of guestItems) {
    const productId = item.product_id;
    const variantId = item.variant_id ?? null;
    const quantityToAdd = Number(item.quantity ?? 0);
    const key = `${productId}:${variantId ?? "default"}`;
    if (!productId || quantityToAdd <= 0) continue;

    const baseProduct = productMap.get(productId);
    const baseVariant = variantId ? variantMap.get(variantId) : null;
    const stockLimit = Number(baseVariant?.stock ?? baseProduct?.stock ?? 0);
    const maxPerOrderLimit = Number(baseVariant?.max_qty ?? baseProduct?.max_qty ?? 0);
    const effectiveLimit = Math.max(0, stockLimit > 0 ? Math.min(stockLimit, maxPerOrderLimit || stockLimit) : maxPerOrderLimit || stockLimit || Number.MAX_SAFE_INTEGER);
    const currentUserQty = existingByKey.get(key) ?? 0;
    const availableCapacity = effectiveLimit > 0 ? Math.max(0, effectiveLimit - currentUserQty) : Number.MAX_SAFE_INTEGER;
    const allowedQuantity = Math.min(quantityToAdd, availableCapacity === Number.MAX_SAFE_INTEGER ? quantityToAdd : availableCapacity);

    if (allowedQuantity <= 0) {
      remainingGuestItems.push(item);
      continue;
    }

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

    const mergedQuantity = Number(existing?.quantity ?? 0) + allowedQuantity;
    const insertPayload: any = {
      user_id: userId,
      product_id: productId,
      quantity: allowedQuantity,
      variant_id: variantId ?? null,
      variant_name: item.variant_name ?? null,
      variant_price: item.variant_price ?? baseVariant?.selling_price ?? baseProduct?.price ?? null,
      variant_image_url: item.variant_image_url ?? baseVariant?.image_url ?? baseProduct?.image_url ?? null,
      variant_unit: item.variant_unit ?? baseVariant?.unit ?? baseProduct?.unit ?? baseProduct?.weight ?? null,
      variant_max_qty: item.variant_max_qty ?? baseVariant?.max_qty ?? baseProduct?.max_qty ?? null,
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: mergedQuantity })
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

    if (allowedQuantity < quantityToAdd) {
      remainingGuestItems.push({ ...item, quantity: quantityToAdd - allowedQuantity });
    }
    mergedCount += 1;
  }

  writeGuestCartItems(remainingGuestItems);
  return mergedCount;
}

export const useCart = (userId?: string) =>
  useQuery({
    queryKey: ["cart", userId ?? "guest"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];

      const { data: cartRows, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        if (isMissingTableError(error)) {
          console.warn("Supabase cart_items table missing; returning empty cart.", error.message);
          return [];
        }
        throw error;
      }

      const productIds = [...new Set((cartRows ?? []).map((item) => item.product_id).filter(Boolean))];
      const variantIds = [...new Set((cartRows ?? []).map((item) => item.variant_id).filter((id): id is string => Boolean(id) && typeof id === "string"))];
      const productMap = new Map<string, any>();
      const variantMap = new Map<string, any>();
      let variantFetchError = false;
      let variantFetchDetails: any = null;

      if (productIds.length > 0) {
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("*, product_variants(*)")
          .in("id", productIds);

        if (productsError) throw productsError;
        for (const product of products ?? []) {
          productMap.set(product.id, product);
        }
      }

      if (variantIds.length > 0) {
        console.log("Cart variant fetch ids:", variantIds);
        const { data: variants, error: variantsError } = await supabase
          .from("product_variants")
          .select("*")
          .in("id", variantIds);

        console.log("Cart variant fetch response:", { data: variants, error: variantsError, count: variants?.length ?? 0, variantIds });

        if (variantsError) {
          console.error("Cart variant fetch failed:", {
            variantIds,
            error: variantsError,
            message: variantsError.message,
            details: variantsError.details,
            hint: variantsError.hint,
            code: variantsError.code,
          });
          variantFetchError = true;
          variantFetchDetails = variantsError;
        } else {
          for (const variant of variants ?? []) {
            variantMap.set(variant.id, variant);
          }
        }
      }

      return (cartRows ?? []).map((item: any) => {
        const product = productMap.get(item.product_id) ?? null;
        const variant = item.variant_id ? variantMap.get(item.variant_id) ?? null : null;
        const isMissingVariant = Boolean(item.variant_id) && !variant && !variantFetchError;

        if (isMissingVariant) {
          console.warn("Cart item references a missing variant record:", { cartItemId: item.id, productId: item.product_id, variantId: item.variant_id, requestedIds: variantIds });
        }

        return {
          ...item,
          products: product,
          variant,
          variant_fetch_error: variantFetchError,
          variant_missing: isMissingVariant,
          variant_price: item.variant_price ?? variant?.selling_price ?? product?.price ?? null,
          variant_image_url: item.variant_image_url ?? variant?.image_url ?? product?.image_url ?? null,
          variant_unit: item.variant_unit ?? variant?.unit ?? product?.unit ?? product?.weight ?? null,
          variant_max_qty: item.variant_max_qty ?? variant?.max_qty ?? product?.max_qty ?? null,
          variant_stock: item.variant_stock ?? variant?.stock ?? product?.stock ?? null,
          variant_name: item.variant_name ?? variant?.name ?? null,
          _variantFetchDetails: variantFetchDetails,
        };
      });
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
        if (typeof window !== "undefined") {
          const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}` || "/");
          window.location.assign(`/auth?redirect=${redirect}`);
        }
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
