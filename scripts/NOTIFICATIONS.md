Notification worker

This project includes a small notification worker that listens for new orders and sends email/SMS to admins.

Prerequisites

- Add credentials to `scripts/.env` (copy from `.env.example`).
- Install dependencies in the repo root:

```bash
npm install @supabase/supabase-js @sendgrid/mail twilio
```

Run the worker

```bash
# from project root
cp scripts/.env.example scripts/.env
# edit scripts/.env and fill keys
node --experimental-json-modules scripts/notification-worker.mjs
```

Notes

- The worker uses the Supabase service role key to subscribe to realtime `orders` INSERTs. Keep this key secret and run the worker on a trusted server.
- If you prefer, run this as a background process (systemd, PM2, Docker) on your server.
- The worker sends email via SendGrid and SMS via Twilio; both are optional — if credentials are missing the corresponding channel is skipped.
