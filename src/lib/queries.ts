import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isComboStatusActive, isComboVisibleOnDate } from "@/lib/combo-status";
import {
  canAddLargeOilProduct,
  canAddRiceProduct,
  getCartRestrictionMessage,
  isLargeOilVariantByClassification,
  isRiceProductByClassification,
  validateLargeOilRule,
  validateRiceRule,
} from "@/lib/cart-rules";
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
  const comboId = item?.combo_id ?? item?.comboId ?? null;
  const variantId = item?.variant_id ?? item?.variantId ?? null;
  const quantity = Number(item?.quantity ?? 0);
  const normalized = {
    ...item,
    id: item?.id ?? `${comboId ?? productId ?? "guest"}:${variantId ?? "default"}`,
    product_id: productId,
    combo_id: comboId,
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
      .filter((item) => item && (item.product_id || item.combo_id) && Number(item.quantity ?? 0) > 0);
  } catch (error) {
    console.warn("Failed to read guest cart:", error);
    return [];
  }
}

export function writeGuestCartItems(items: any[]) {
  if (typeof window === "undefined") return;
  const normalized = (items ?? [])
    .map((item) => normalizeGuestCartItem(item))
    .filter((item) => item && (item.product_id || item.combo_id) && Number(item.quantity ?? 0) > 0);
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(normalized));
}

export async function mergeGuestCartIntoUserCart(userId: string) {
  const guestItems = getGuestCartItems();
  if (!guestItems.length) return 0;

  const existingUserCartRows = await supabase
    .from("cart_items")
    .select("*, products(*, categories(name, slug), subcategories(name, slug))")
    .eq("user_id", userId);

  if (existingUserCartRows.error) throw existingUserCartRows.error;
  const currentUserCartItems = existingUserCartRows.data ?? [];
  const combinedItems = [...currentUserCartItems, ...guestItems];
  const riceCheck = validateRiceRule(combinedItems);
  const oilCheck = validateLargeOilRule(combinedItems);
  if (!riceCheck.allowed) {
    throw new Error(riceCheck.message || "ఒక్క కార్ట్‌కు ఒక రైస్ బ్యాగ్ మాత్రమే అనుమతించబడుతుంది.");
  }
  if (!oilCheck.allowed) {
    throw new Error(oilCheck.message || "ఒక్క కార్ట్‌కు ఒక 15L / 15Kg ఆయిల్ మాత్రమే అనుమతించబడుతుంది.");
  }

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
        .eq("user_id", userId)
        .order("id", { ascending: true });
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
        const comboSnapshot = item.combo_snapshot ?? null;
        const isMissingVariant = Boolean(item.variant_id) && !variant && !variantFetchError;

        if (isMissingVariant) {
          console.warn("Cart item references a missing variant record:", { cartItemId: item.id, productId: item.product_id, variantId: item.variant_id, requestedIds: variantIds });
        }

        return {
          ...item,
          products: product,
          combo_snapshot: comboSnapshot,
          variant,
          variant_fetch_error: variantFetchError,
          variant_missing: isMissingVariant,
          variant_price: item.variant_price ?? variant?.selling_price ?? product?.price ?? comboSnapshot?.offer_price ?? comboSnapshot?.price ?? null,
          variant_image_url: item.variant_image_url ?? variant?.image_url ?? product?.image_url ?? comboSnapshot?.image_url ?? null,
          variant_unit: item.variant_unit ?? variant?.unit ?? product?.unit ?? product?.weight ?? (item.combo_id ? "combo" : null),
          variant_max_qty: item.variant_max_qty ?? variant?.max_qty ?? product?.max_qty ?? null,
          variant_stock: item.variant_stock ?? variant?.stock ?? product?.stock ?? null,
          variant_name: item.variant_name ?? variant?.name ?? (item.combo_id ? "Combo" : null),
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

      const { data: targetProduct } = await supabase
        .from("products")
        .select("*, categories(name, slug), subcategories(name, slug)")
        .eq("id", productId)
        .maybeSingle();

      if (targetProduct) {
        const { data: existingRows } = await supabase
          .from("cart_items")
          .select("id, product_id, quantity, variant_id, products(*, categories(name, slug), subcategories(name, slug))")
          .eq("user_id", authUser.id);
        const nextCart = [...(existingRows ?? [])];
        const restrictionMessage = getCartRestrictionMessage({ product: targetProduct, variant, cartItems: nextCart, quantity });
        if (restrictionMessage) {
          throw new Error(restrictionMessage);
        }
        const riceCheck = canAddRiceProduct(nextCart, targetProduct, quantity);
        if (!riceCheck.allowed) {
          throw new Error(riceCheck.message || "ఒక్క కార్ట్‌కు ఒక రైస్ బ్యాగ్ మాత్రమే అనుమతించబడుతుంది.");
        }
        const oilCheck = canAddLargeOilProduct(nextCart, targetProduct, variant ?? null, quantity);
        if (!oilCheck.allowed) {
          throw new Error(oilCheck.message || "ఒక్క కార్ట్‌కు ఒక 15L / 15Kg ఆయిల్ మాత్రమే అనుమతించబడుతుంది.");
        }
      }

      // Fetch any existing cart rows for this product for the user,
      // then match variant in JS. This avoids DB null/string mismatches
      // where `variant_id` might be stored as null/empty string and prevents
      // creating duplicate rows when adding from wishlist or other places.
      const { data: existingRows, error: selectError } = await supabase
        .from("cart_items")
        .select("id, quantity, variant_id")
        .eq("user_id", authUser.id)
        .eq("product_id", productId);
      if (selectError) {
        if (isMissingTableError(selectError)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw selectError;
      }
      // Find matching existing row by variant (robust to null/empty)
      let existing: any = null;
      if (selectError) {
        if (isMissingTableError(selectError)) {
          throw new Error("Cart is unavailable because the cart_items table is missing. Run database migrations.");
        }
        throw selectError;
      }

      if (existingRows && existingRows.length > 0) {
        if (variant?.id) {
          existing = existingRows.find((r: any) => String(r.variant_id) === String(variant.id));
        } else {
          existing = existingRows.find((r: any) => r.variant_id === null || r.variant_id === "" || typeof r.variant_id === "undefined");
        }
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
        const item = guestItems.find((it) => it.id === id);
        const restrictedItem = item && item.product_id ? item : null;
        if (restrictedItem) {
          const nextItems = guestItems
            .map((entry) => (entry.id === id ? { ...entry, quantity: Math.max(0, Number(quantity)) } : entry))
            .filter((entry) => Number(entry.quantity ?? 0) > 0);
          const restrictionMessage = getCartRestrictionMessage({
            product: restrictedItem.products ?? restrictedItem,
            variant: restrictedItem.variant ?? null,
            cartItems: nextItems,
            quantity: Number(quantity ?? 0),
          });
          if (restrictionMessage) {
            throw new Error(restrictionMessage);
          }
        }
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

      const { data: cartRows } = await supabase
        .from("cart_items")
        .select("*, products(*, categories(name, slug), subcategories(name, slug))")
        .eq("user_id", authUser.id);
      const targetRow = (cartRows ?? []).find((row: any) => row.id === id);
      const nextRows = (cartRows ?? [])
        .map((row: any) => row.id === id ? { ...row, quantity: Math.max(0, Number(quantity)) } : row)
        .filter((row: any) => Number(row.quantity ?? 0) > 0);
      const restrictionMessage = targetRow && targetRow.product_id ? getCartRestrictionMessage({
        product: targetRow.products ?? null,
        variant: targetRow.variant ?? null,
        cartItems: nextRows,
        quantity: Math.max(0, Number(quantity)),
      }) : null;
      if (restrictionMessage) {
        throw new Error(restrictionMessage);
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
        .select("*")
        .eq("user_id", userId!);
      if (error) throw error;

      const rows = data ?? [];
      const productIds = [...new Set(rows.map((row: any) => row.product_id).filter(Boolean))];

      if (productIds.length === 0) {
        return [];
      }

      const { data: productRows, error: productError } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .in("id", productIds);
      if (productError) throw productError;

      const products = productRows ?? [];
      const productMap = new Map(products.map((product: any) => [product.id, product]));

      return rows
        .filter((row: any) => row.product_id)
        .map((row: any) => ({
          ...row,
          products: productMap.get(row.product_id) ?? null,
        }));
    },
  });

export function useToggleWishlist(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: string | { productId?: string }) => {
      if (!userId) {
        throw new Error("Sign in to save your favorite products.");
      }

      const resolved = typeof input === "string"
        ? { productId: input }
        : input ?? {};

      const { productId } = resolved;

      if (!productId) {
        throw new Error("Select a product to save.");
      }

      const { data: existing } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("wishlist_items").delete().eq("id", existing.id).eq("user_id", userId);
        if (error) throw error;
        return "removed";
      }

      const { error } = await supabase.from("wishlist_items").insert({ user_id: userId, product_id: productId });
      if (error) throw error;
      return "added";
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["wishlist", userId] });
      toast.success(res === "added" ? "Added to wishlist" : "Removed from wishlist");
    },
    onError: (e: Error) => {
      const message = e?.message || "Unable to update wishlist.";
      toast.error(message.includes("Sign in") ? "Sign in to save your favorite products." : message);
    },
  });
}

/* Combo helpers */
export async function getActiveCombo() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "missing";

  console.log("[Combo DEBUG] getActiveCombo START");
  console.log("[Combo DEBUG] Supabase project URL:", SUPABASE_URL);

  const { data: sessionData } = await supabase.auth.getSession();
  console.log("[Combo DEBUG] auth:", {
    authenticated: !!sessionData?.session,
  });

  const directQuery = await supabase.from("combos").select("*");
  console.log("[Combo DEBUG] flat query:", {
    data: directQuery.data,
    error: directQuery.error,
  });

  const nestedQuery = await supabase.from("combos").select("*, combo_items(*)");
  console.log("[Combo DEBUG] nested query:", {
    data: nestedQuery.data,
    error: nestedQuery.error,
  });

  const directActiveQuery = await supabase.from("combos").select("*").eq("status", "active");
  console.log("[Combo DEBUG] direct active query:", {
    data: directActiveQuery.data,
    error: directActiveQuery.error,
  });

  const { data, error } = await supabase
    .from("combos")
    .select("*, combo_items(*)")
    .order("date_valid_from", { ascending: false })
    .limit(20);

  console.log("[Combo DEBUG] raw data:", data);
  console.log("[Combo DEBUG] raw error:", error);
  console.log("[Combo DEBUG] raw row count:", (data || []).length);

  if (error) {
    console.error("[Combo DEBUG] getActiveCombo Supabase error", { table: "combos", error });
  }

  const rows = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    date_valid_from: row.date_valid_from,
    date_valid_to: row.date_valid_to,
    combo_items_count: Array.isArray(row.combo_items) ? row.combo_items.length : 0,
  }));

  console.log("[Combo DEBUG] raw rows:", rows);

  const eligible = (data || []).filter((c: any) => {
    const isActive = isComboStatusActive(c.status);
    const isVisible = isComboVisibleOnDate(c);
    const final = isActive && isVisible;
    if (!final) {
      console.log("[Combo DEBUG] filtered out row:", {
        id: c.id,
        name: c.name,
        status: c.status,
        date_valid_from: c.date_valid_from,
        date_valid_to: c.date_valid_to,
        isActive,
        isVisible,
      });
    }
    return final;
  });

  if (eligible.length > 1) {
    console.warn("[Combo DEBUG] multiple active date-valid combos found for storefront; using the latest valid range only.", eligible.map((row: any) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      date_valid_from: row.date_valid_from,
      date_valid_to: row.date_valid_to,
    })));
  }

  console.log("[Combo DEBUG] status/date eligible rows:", eligible.map((row: any) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    date_valid_from: row.date_valid_from,
    date_valid_to: row.date_valid_to,
    combo_items_count: Array.isArray(row.combo_items) ? row.combo_items.length : 0,
  })));

  let combo = eligible.sort((a: any, b: any) => {
    const aDate = a?.date_valid_from || a?.date_valid_to || "";
    const bDate = b?.date_valid_from || b?.date_valid_to || "";
    return String(bDate).localeCompare(String(aDate));
  })[0] || null;
  if (!combo && directQuery.data && directQuery.data.length > 0) {
    const fallbackRows = directQuery.data as any[];
    const fallbackEligible = fallbackRows.filter((c: any) => isComboStatusActive(c.status) && isComboVisibleOnDate(c));
    if (fallbackEligible[0]) {
      combo = fallbackEligible[0] as any;
      const { data: comboItems } = await supabase.from("combo_items").select("*").eq("combo_id", combo.id);
      combo.combo_items = comboItems || [];
      console.log("[Combo DEBUG] final combo from fallback:", {
        id: combo.id,
        name: combo.name,
        status: combo.status,
        date_valid_from: combo.date_valid_from,
        date_valid_to: combo.date_valid_to,
        combo_items_count: combo.combo_items.length,
      });
    }
  }

  if (combo) {
    console.log("[Combo DEBUG] final combo:", {
      id: combo.id,
      name: combo.name,
      status: combo.status,
      date_valid_from: combo.date_valid_from,
      date_valid_to: combo.date_valid_to,
      combo_items_count: Array.isArray(combo.combo_items) ? combo.combo_items.length : 0,
    });
  }

  if (!combo) {
    console.log("[Combo DEBUG] final combo: null");
    return null;
  }

  try {
    const items = Array.isArray(combo.combo_items) ? combo.combo_items : [];
    const productIds = items.map((it: any) => it.product_id).filter(Boolean);
    const variantIds = items.map((it: any) => it.variant_id).filter(Boolean);

    let products: any[] = [];
    let variants: any[] = [];

    if (productIds.length > 0) {
      const { data: p } = await supabase.from("products").select("id,name,image_url,unit").in("id", productIds);
      products = p || [];
    }

    if (variantIds.length > 0) {
      const { data: v } = await supabase.from("product_variants").select("*").in("id", variantIds);
      variants = v || [];
    }

    combo.combo_items = items.map((it: any) => ({
      ...it,
      product: products.find((p) => p.id === it.product_id) || null,
      variant: variants.find((v) => v.id === it.variant_id) || null,
    }));
  } catch (e) {
    console.warn("Failed to enrich combo items", e);
  }

  return combo;
}

export async function searchActiveCombos(q?: string) {
  const wantsComboList = typeof q === "string" && q.toLowerCase().includes("combo");
  const qb = supabase.from("combos").select("*, combo_items(*)");

  console.debug("[combo-debug] searchActiveCombos query", {
    table: "combos",
    q,
    wantsComboList,
    query: "select *, combo_items(*) from combos order by date_valid_from desc limit 20",
  });

  // If the user searches for the generic word "combo" (English) or similar,
  // treat it as a request to list active combos regardless of name-language.
  if (q && !wantsComboList) {
    const esc = q.replace(/%/g, '\\%').replace(/_/g, '\\_');
    const orClause = `name.ilike.%${esc}%,slug.ilike.%${esc}%,description.ilike.%${esc}%`;
    qb.or(orClause, { foreignTable: false });
  }

  const { data, error } = await qb.order("date_valid_from", { ascending: false }).limit(20);
  if (error) {
    console.error("[combo-debug] searchActiveCombos Supabase error", { table: "combos", error, q, wantsComboList });
    return [];
  }

  console.debug(
    "[combo-debug] searchActiveCombos raw rows before filtering",
    (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      date_valid_from: row.date_valid_from,
      date_valid_to: row.date_valid_to,
    })),
  );

  const combos = (data || []).filter((c: any) => {
    const isActive = isComboStatusActive(c.status);
    const isVisible = isComboVisibleOnDate(c);
    const final = isActive && isVisible;
    if (!final) {
      console.debug("[combo-debug] searchActiveCombos filtered out row", {
        id: c.id,
        name: c.name,
        status: c.status,
        date_valid_from: c.date_valid_from,
        date_valid_to: c.date_valid_to,
        isActive,
        isVisible,
      });
    }
    return final;
  });

  console.debug(
    "[combo-debug] searchActiveCombos rows after active/date filters",
    combos.map((row: any) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      date_valid_from: row.date_valid_from,
      date_valid_to: row.date_valid_to,
    })),
  );

  return combos;
}

export function useAddComboToCart(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ comboId, quantity = 1 }: { comboId: string; quantity?: number }) => {
      if (!userId) {
        // guest cart: add a special combo item snapshot
        const guestItems = getGuestCartItems();
        // fetch combo
        const { data: combo } = await supabase.from("combos").select("*").eq("id", comboId).maybeSingle();
        if (!combo) throw new Error("Combo not found");
        const snapshot = {
          id: combo.id,
          name: combo.name,
          price: combo.price,
          offer_price: combo.offer_price,
          status: combo.status,
          date_valid_from: combo.date_valid_from,
          date_valid_to: combo.date_valid_to,
          image_url: combo.image_url || "/src/assets/combos/daily_combo_poster.png",
          items: [],
        };
        const nextItems = guestItems.slice();
        const existingIndex = nextItems.findIndex((it) => it.combo_id === comboId);
        if (existingIndex !== -1) {
          nextItems[existingIndex].quantity = Number(nextItems[existingIndex].quantity || 0) + Number(quantity);
        } else {
          nextItems.push({ id: `combo:${comboId}`, combo_id: comboId, combo_snapshot: snapshot, product_id: null, quantity: Number(quantity) });
        }
        writeGuestCartItems(nextItems);
        return;
      }

      const authUser = await getAuthenticatedCartUser();
      const resolvedUserId = userId ?? authUser.id;
      if (!resolvedUserId || resolvedUserId !== authUser.id) throw new Error("Please sign in");

      // fetch combo
      const { data: combo } = await supabase.from("combos").select("*").eq("id", comboId).maybeSingle();
      if (!combo) throw new Error("Combo not found");

      // check existing cart row with this combo
      const { data: existingRows } = await supabase.from("cart_items").select("id, quantity").eq("user_id", authUser.id).eq("combo_id", comboId);
      if (existingRows && existingRows.length > 0) {
        const existing = existingRows[0];
        const { error } = await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id).eq("user_id", authUser.id);
        if (error) throw error;
      } else {
        const snapshot = {
          id: combo.id,
          name: combo.name,
          price: combo.price,
          offer_price: combo.offer_price,
          status: combo.status,
          date_valid_from: combo.date_valid_from,
          date_valid_to: combo.date_valid_to,
          image_url: combo.image_url || "/src/assets/combos/daily_combo_poster.png",
        };
        const insertPayload: any = { user_id: authUser.id, combo_id: combo.id, combo_snapshot: snapshot, quantity };
        const { error } = await supabase.from("cart_items").insert(insertPayload);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId ?? "guest"] }),
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
      if (error) {
        console.error("ORDER_ITEMS FETCH ERROR", {
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
        });
        throw error;
      }
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
