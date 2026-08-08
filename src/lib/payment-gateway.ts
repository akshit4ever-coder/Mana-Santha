import { supabase } from "@/integrations/supabase/client";

/**
 * Razorpay Payment Integration
 * Handles online payment processing for Mana Santha
 */

// Initialize Razorpay script
export function initRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayOrderOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  description?: string;
  customer_notify?: number;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Create a Razorpay order on the backend
 * Note: This should be called from a server-side API, not directly from client
 */
export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  try {
    // This would be called via your backend API
    // For now, return placeholder
    console.log("Creating Razorpay order:", options);
    return { id: "order_" + Date.now() };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Process Razorpay payment
 */
export async function processRazorpayPayment(
  amount: number,
  orderId: string,
  userEmail: string,
  userName: string,
  userPhone: string,
  description: string
) {
  try {
    const loaded = await initRazorpay();
    if (!loaded) {
      throw new Error("Failed to load Razorpay");
    }

    // Get Razorpay key from environment
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
    if (!key) {
      throw new Error("Razorpay key not configured");
    }

    return new Promise((resolve, reject) => {
      // @ts-ignore - Razorpay is loaded globally
      const options = {
        key,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Mana Santha",
        description,
        order_id: orderId,
        handler(response: RazorpayPaymentResponse) {
          resolve(response);
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "#10b981",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        reject(new Error(response.error.description));
      });
      rzp.open();
    });
  } catch (error) {
    console.error("Razorpay payment error:", error);
    throw error;
  }
}

/**
 * Verify Razorpay payment signature
 * This should be done on backend only!
 */
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
    // Call your backend API to verify
    const response = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}

/**
 * Save payment transaction to database
 */
export async function savePaymentTransaction(
  orderId: string,
  amount: number,
  gatewayTransactionId: string,
  status: "success" | "failed" | "pending" | "refunded",
  errorMessage?: string
) {
  try {
    const { data, error } = await supabase.from("payment_transactions").insert({
      order_id: orderId,
      gateway: "razorpay",
      gateway_transaction_id: gatewayTransactionId,
      amount,
      currency: "INR",
      status,
      error_message: errorMessage,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving payment transaction:", error);
    throw error;
  }
}

/**
 * Process refund for an order
 */
export async function processRefund(orderId: string, amount: number, reason: string) {
  try {
    // Get payment transaction
    const { data: transaction, error: fetchError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError) throw fetchError;
    if (!transaction || transaction.gateway_transaction_id) {
      throw new Error("No payment found for this order");
    }

    // Call backend refund API
    const response = await fetch("/api/refund-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: transaction.gateway_transaction_id,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error("Refund processing failed");
    }

    const result = await response.json();

    // Update transaction status
    const { error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: "refunded",
        refunded_amount: amount,
        refunded_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (updateError) throw updateError;

    return result;
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
}

/**
 * Get available payment methods
 */
export function getAvailablePaymentMethods() {
  return [
    { id: "cod", label: "Cash on Delivery", icon: "💵", enabled: true },
    { id: "razorpay", label: "Debit/Credit Card", icon: "💳", enabled: !!import.meta.env.VITE_RAZORPAY_KEY_ID },
    { id: "upi", label: "UPI", icon: "📱", enabled: !!import.meta.env.VITE_RAZORPAY_KEY_ID },
    { id: "netbanking", label: "Net Banking", icon: "🏦", enabled: !!import.meta.env.VITE_RAZORPAY_KEY_ID },
  ];
}
