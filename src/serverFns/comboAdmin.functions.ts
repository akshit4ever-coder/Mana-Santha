import { createServerFn } from "@tanstack/react-start";
import { normalizeComboStatus, rangesOverlap } from "../lib/combo-status";

export const upsertCombo = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    // Use server-side supabase admin client to bypass RLS for admin operations
    try {
      const { supabaseAdmin } = await import("../integrations/supabase/client.server");

      const payload = data;

      if (!payload.name || String(payload.name).trim().length === 0) throw new Error("Combo must have a name");
      if (!payload.price || Number(payload.price) <= 0) throw new Error("Combo must have a valid price");

      const items = payload.combo_items || [];
      if (!Array.isArray(items) || items.length === 0) throw new Error("Combo must include at least one product");

      const normalizedStatus = normalizeComboStatus(payload.status) || "inactive";
      const safeSlug = String(payload.slug || payload.name || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || null;

      // Allow multiple active combos to overlap in date ranges.
      // Removed previous restriction that prevented overlapping active combos.

      let comboId = payload.id;
      if (comboId) {
        const { error } = await supabaseAdmin.from("combos").update({
          name: String(payload.name).trim(),
          slug: safeSlug,
          description: payload.description || null,
          price: payload.price,
          offer_price: payload.offer_price ?? null,
          image_url: payload.image_url || null,
          status: normalizedStatus,
          stock: payload.stock ?? null,
          metadata: payload.metadata ?? {},
          date_valid_from: payload.date_valid_from ?? null,
          date_valid_to: payload.date_valid_to ?? null,
        }).eq("id", comboId);
        if (error) throw error;
      } else {
        const { data, error } = await supabaseAdmin.from("combos").insert({
          name: String(payload.name).trim(),
          slug: safeSlug,
          description: payload.description || null,
          price: payload.price,
          offer_price: payload.offer_price ?? null,
          image_url: payload.image_url || null,
          status: normalizedStatus,
          stock: payload.stock ?? null,
          metadata: payload.metadata ?? {},
          date_valid_from: payload.date_valid_from ?? null,
          date_valid_to: payload.date_valid_to ?? null,
        }).select().single();
        if (error) throw error;
        comboId = data.id;
      }

      // Replace combo_items
      const { error: delErr } = await supabaseAdmin.from("combo_items").delete().eq("combo_id", comboId);
      if (delErr) throw delErr;
      if (items.length > 0) {
        const insertRows = items.map((it: any, idx: number) => ({
          combo_id: comboId,
          product_id: it.product_id,
          variant_id: it.variant_id || null,
          unit_label: it.unit_label || null,
          quantity: it.quantity ?? 1,
          sort_order: it.sort_order ?? idx,
        }));
        const { error: insErr } = await supabaseAdmin.from("combo_items").insert(insertRows as any[]);
        if (insErr) throw insErr;
      }

      const { data: refreshed, error: fetchErr } = await supabaseAdmin.from("combos").select("*").eq("id", comboId).single();
      if (fetchErr) throw fetchErr;
      return refreshed;
    } catch (err: any) {
      console.error("upsertCombo serverFn error", err);
      throw err;
    }
  });
