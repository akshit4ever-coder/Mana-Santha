import { createServerFn } from "@tanstack/react-start";
import type { OrderNotificationPayload } from "../../api/lib/sendOrderEmail";

export const notifyOrder = createServerFn({
  method: "POST",
})
  .validator((data: OrderNotificationPayload) => data)
  .handler(async ({ data }) => {
    console.log("🔔 serverFn notifyOrder called");

    try {
      console.log("📧 importing sendOrderEmail");

      const { sendOrderNotificationEmail } = await import(
        "../../api/lib/sendOrderEmail"
      );

      await sendOrderNotificationEmail(data);

      console.log("✅ email sent");

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });