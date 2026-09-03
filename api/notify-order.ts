import { sendOrderNotificationEmail, type OrderNotificationPayload } from './lib/sendOrderEmail';

const requiredFields = [
  'orderId',
  'customerName',
  'customerPhone',
  'customerEmail',
  'deliveryAddress',
  'orderItems',
  'quantity',
  'totalAmount',
  'paymentMethod',
  'orderTime',
] as const;

function isValidString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalisePayload(body: unknown): OrderNotificationPayload {
  const data = body as Record<string, unknown>;

  if (!data || typeof data !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const missingFields = requiredFields.filter((field) => {
    if (field === 'orderItems') {
      return !Array.isArray(data[field]) || data[field].length === 0;
    }
    return !isValidString(data[field]);
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing or invalid required fields: ${missingFields.join(', ')}`);
  }

  const orderItems = (Array.isArray(data.orderItems) ? data.orderItems : []).map((item) => {
    const product = item as Record<string, unknown>;
    return {
      name: isValidString(product.name) ? String(product.name) : 'Unknown item',
      quantity: Number(product.quantity ?? 1),
      price: Number(product.price ?? 0),
      subtotal: Number(product.subtotal ?? Number(product.price ?? 0) * Number(product.quantity ?? 1)),
    };
  });

  return {
    orderId: String(data.orderId),
    customerName: String(data.customerName).trim(),
    customerPhone: String(data.customerPhone).trim(),
    customerEmail: String(data.customerEmail).trim(),
    deliveryAddress: String(data.deliveryAddress).trim(),
    orderItems,
    quantity: Number(data.quantity ?? orderItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)),
    totalAmount: Number(data.totalAmount ?? 0),
    paymentMethod: String(data.paymentMethod).trim(),
    orderTime: String(data.orderTime),
  };
}

export default async function handler(request: Request) {
  // Only allow a POST request to protect this endpoint from abuse.
  if (request.method !== 'POST') {
    return Response.json(
      { success: false, message: 'Method not allowed. Use POST.' },
      { status: 405 },
    );
  }

  try {
    const body = await request.json();
    const payload = normalisePayload(body);

    // Log every request for quick debugging in production.
    console.log('Order notification request received:', JSON.stringify(payload));

    // Send the email after the order is already saved to Supabase.
    await sendOrderNotificationEmail(payload);

    return Response.json(
      { success: true, message: 'Admin notification sent successfully.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Order notification failed:', error);

    // Important: do not fail the checkout or cancel the order if this email step fails.
    // We still return success to the customer while logging the issue for investigation.
    return Response.json(
      {
        success: true,
        message: 'Order was created successfully. Admin notification delivery failed, but the order remains saved.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 },
    );
  }
}
