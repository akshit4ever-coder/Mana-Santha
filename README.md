# Mana Santha

This project is a Vite + React + TanStack Router e-commerce app with a secure admin email notification flow.

## Admin order email notification

When a customer successfully places an order, the checkout flow sends a POST request to the Vercel serverless API at `/api/notify-order`. The API validates the payload and sends a professional HTML email via Gmail SMTP using Nodemailer.

### Important security behavior

- Gmail credentials are never exposed in the frontend.
- Sensitive credentials are stored in Vercel Environment Variables.
- Email sending failure does not cancel the order.

## Gmail App Password setup

1. Sign in to your Gmail account.
2. Go to Google Account → Security.
3. Turn on 2-Step Verification.
4. Go to App Passwords.
5. Generate an app password for "Mail".
6. Copy the 16-character password and put it in `GMAIL_APP_PASSWORD`.

## Environment variables

Create a `.env` file in the project root with the following values:

```bash
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-character-gmail-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

For Vercel deployment, add the same variables in:
- Vercel Dashboard → Project → Settings → Environment Variables

## Local development

```bash
npm install
cp .env.example .env
# fill the Gmail values
npm run dev
```

The checkout flow calls the API route automatically after a successful order is inserted into Supabase.

## Vercel deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables in Vercel.
4. Deploy.
5. Ensure the app is running and the checkout flow is able to POST to `/api/notify-order`.

## Files added or modified

- `api/lib/sendOrderEmail.ts`: Contains the Nodemailer logic and HTML email template.
- `api/notify-order.ts`: Validates the request and sends the email securely from the backend.
- `src/routes/checkout.tsx`: Calls the notification API after successful order creation.
- `.env.example`: Template for Gmail environment variables.

## Local API behavior

The API only accepts `POST` requests and validates the request body before sending email. If the email fails, it logs the error and returns a success response to the customer so the order is not canceled.

## Built with

- TanStack Start
- TypeScript
- React
- Vite
- Tailwind CSS
- Supabase
- Vercel
- Nodemailer
