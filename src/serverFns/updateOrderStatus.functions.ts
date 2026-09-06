import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

export function isValidOrderStatusTransition(currentStatus: string, nextStatus: string): boolean {
  const from = String(currentStatus ?? "").trim().toLowerCase();
  const to = String(nextStatus ?? "").trim().toLowerCase();

  if (!from || !to || from === to) return true;
  return (ORDER_STATUS_TRANSITIONS[from] ?? []).includes(to);
}

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(ORDER_STATUSES),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: currentOrder, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("status")
        .eq("id", data.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!currentOrder) {
        return { success: false, error: "Order not found." };
      }

      const currentStatus = String(currentOrder.status ?? "").trim().toLowerCase();
      const nextStatus = String(data.status ?? "").trim().toLowerCase();

      if (!isValidOrderStatusTransition(currentStatus, nextStatus)) {
        return {
          success: false,
          error: "Invalid order status transition.",
        };
      }

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", data.id);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error: any) {
      const message = error?.message || "Invalid order status transition.";
      if (message.toLowerCase().includes("invalid order status transition")) {
        return { success: false, error: "Invalid order status transition." };
      }
      return { success: false, error: message };
    }
  });
