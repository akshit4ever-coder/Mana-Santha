import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import Twilio from 'twilio'
import nodemailer from 'nodemailer'

// Simple notification worker that listens for INSERTs on public.orders
// and sends email (SendGrid) and SMS (Twilio) to configured admins.

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  ADMIN_EMAILS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  ADMIN_PHONE
} = process.env

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
  ? Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null

let smtpTransporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  smtpTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  })
}

function adminEmailsArray() {
  if (!ADMIN_EMAILS) return []
  return ADMIN_EMAILS.split(',').map(s => s.trim()).filter(Boolean)
}

async function handleOrderInsert(payload) {
  try {
    const record = payload.new ?? payload.record ?? payload
    console.log('Notification worker: new order payload:', record)

    const id = record.id ?? record.order_id ?? '<unknown>'
    const total = record.total ?? record.amount ?? ''
    const customer = record.customer_name ?? record.name ?? ''
    const email = record.email ?? record.customer_email ?? ''
    const phone = record.phone ?? record.customer_phone ?? ''

    const subject = `New order #${id}`
    const text = `New order ${id}\nCustomer: ${customer}\nEmail: ${email}\nPhone: ${phone}\nTotal: ${total}`

    // Send email via SendGrid (if configured)
    if (SENDGRID_API_KEY && SENDGRID_FROM_EMAIL && adminEmailsArray().length) {
      const msg = {
        to: adminEmailsArray(),
        from: SENDGRID_FROM_EMAIL,
        subject,
        text,
        html: `<pre>${text}</pre>`
      }
      try {
        await sgMail.send(msg)
        console.log('Notification worker: email sent to', adminEmailsArray())
      } catch (err) {
        console.error('Notification worker: SendGrid error', err?.response?.body || err)
      }
    }

    // Send email via SMTP (nodemailer) if configured and SendGrid not used
    if (!SENDGRID_API_KEY && smtpTransporter && SMTP_FROM && adminEmailsArray().length) {
      try {
        await smtpTransporter.sendMail({
          from: SMTP_FROM,
          to: adminEmailsArray().join(','),
          subject,
          text,
          html: `<pre>${text}</pre>`
        })
        console.log('Notification worker: SMTP email sent to', adminEmailsArray())
      } catch (err) {
        console.error('Notification worker: SMTP error', err)
      }
    }

    // Send SMS via Twilio (if configured)
    if (twilioClient && TWILIO_FROM && ADMIN_PHONE) {
      try {
        const resp = await twilioClient.messages.create({
          body: `${subject} — ${customer} — ${total}`,
          from: TWILIO_FROM,
          to: ADMIN_PHONE
        })
        console.log('Notification worker: SMS sent, sid=', resp.sid)
      } catch (err) {
        console.error('Notification worker: Twilio error', err)
      }
    }

  } catch (err) {
    console.error('Notification worker: handler error', err)
  }
}

async function main() {
  console.log('Notification worker starting — subscribing to orders INSERTs')

  const channel = supabase
    .channel('public:orders-notify')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
      handleOrderInsert(payload)
    })
    .subscribe(status => {
      console.log('Notification worker: subscription status', status)
    })

  process.on('SIGINT', async () => {
    console.log('Notification worker: SIGINT — unsubscribing')
    try {
      await supabase.removeChannel(channel)
    } catch (err) {
      console.warn('Notification worker: error during unsubscribe', err)
    }
    process.exit(0)
  })
}

main().catch(err => {
  console.error('Notification worker crashed', err)
  process.exit(1)
})
