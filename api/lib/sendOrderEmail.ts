import nodemailer from 'nodemailer';

export type OrderNotificationPayload = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  quantity: number;
  totalAmount: number | string;
  paymentMethod: string;
  orderTime: string;
};

function formatMoney(amount: number | string) {
  const numeric = Number(amount ?? 0);
  if (Number.isNaN(numeric)) return String(amount ?? '0');
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numeric);
}

export async function sendOrderNotificationEmail(payload: OrderNotificationPayload) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    throw new Error('Missing Gmail configuration. Please set GMAIL_USER, GMAIL_APP_PASSWORD, and ADMIN_EMAIL in Vercel environment variables.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const rowsHtml = payload.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right;">${formatMoney(item.price)}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right;">${formatMoney(item.subtotal)}</td>
        </tr>
      `,
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Order Received</title>
      </head>
      <body style="margin:0; padding:0; background:#f5f7fb; font-family:Arial, Helvetica, sans-serif; color:#111827;">
        <div style="max-width: 700px; margin: 32px auto; background:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: linear-gradient(135deg, #14532d, #166534); padding: 24px 32px; color: #ffffff;">
            <h1 style="margin:0; font-size:28px;">🛒 New Order Received</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Mana Santha</p>
          </div>

          <div style="padding: 28px 32px 16px;">
            <p style="margin:0 0 20px; font-size: 15px; line-height: 1.7; color: #374151;">
              A new customer order has been placed successfully. Please review the details below.
            </p>

            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; font-weight: 700; width: 200px; color:#111827;">Order ID</td>
                <td style="padding: 10px 0; color:#374151;">${payload.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Customer Name</td>
                <td style="padding: 10px 0; color:#374151;">${payload.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Phone</td>
                <td style="padding: 10px 0; color:#374151;">${payload.customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Email</td>
                <td style="padding: 10px 0; color:#374151;">${payload.customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Delivery Address</td>
                <td style="padding: 10px 0; color:#374151;">${payload.deliveryAddress}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Payment Method</td>
                <td style="padding: 10px 0; color:#374151;">${payload.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Order Time</td>
                <td style="padding: 10px 0; color:#374151;">${new Date(payload.orderTime).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color:#111827;">Total</td>
                <td style="padding: 10px 0; color:#374151; font-weight: 700;">${formatMoney(payload.totalAmount)}</td>
              </tr>
            </table>

            <h2 style="margin: 0 0 12px; font-size: 22px; color: #111827;">Products Ordered</h2>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse; background:#f8fafc; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr style="background:#e2e8f0;">
                  <th style="padding: 12px; text-align:left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color:#374151;">Product</th>
                  <th style="padding: 12px; text-align:center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color:#374151;">Qty</th>
                  <th style="padding: 12px; text-align:right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color:#374151;">Price</th>
                  <th style="padding: 12px; text-align:right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color:#374151;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || '<tr><td colspan="4" style="padding: 16px; color:#374151;">No items available</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `Mana Santha <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: '🛒 New Order Received - Mana Santha',
    html,
    text: `
New Order Received

Order ID: ${payload.orderId}
Customer Name: ${payload.customerName}
Phone: ${payload.customerPhone}
Email: ${payload.customerEmail}
Delivery Address: ${payload.deliveryAddress}
Payment Method: ${payload.paymentMethod}
Order Time: ${new Date(payload.orderTime).toLocaleString('en-IN')}
Total: ${formatMoney(payload.totalAmount)}

Products:
${payload.orderItems
  .map((item) => `${item.name} x ${item.quantity} - ${formatMoney(item.subtotal)}`)
  .join('\n')}
    `,
  });
}
