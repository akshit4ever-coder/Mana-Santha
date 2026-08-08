# Dual Authentication System - Mana Santha 🔐

## Overview
Users can now authenticate using **two methods**:
1. **OTP Verification** (6-digit code sent to phone)
2. **Password** (Set during signup, use anytime to login)

---

## Sign Up Flow 📝

### Step 1: Create Account
Go to `/auth` → Click **"Create account"** tab

**Fill in:**
- **Full Name**: Your name (e.g., "Raj Kumar")
- **Phone Number**: 10-digit number (e.g., "9876543210")
- **Password**: At least 6 characters (e.g., "SecurePass123")
- **Confirm Password**: Re-enter the same password

Click **"Create Account"** button

**What happens:**
- Account created with phone + password stored securely
- You'll be directed back to Sign in tab
- You can now login using either OTP or Password

---

## Sign In Options 🔓

### Option 1: Sign in with OTP ⏱️

**Step 1: Enter Phone Number**
- Go to `/auth` → **Sign in** tab → Click **"OTP"** button
- Enter your phone number (10 digits)
- Click **"Get OTP"**

**Step 2: Verify OTP**
- OTP will be displayed on screen in **dev mode** (for testing)
- In production, it would be sent via SMS
- Enter the 6-digit OTP
- Click **"Verify OTP"**

**When to use:**
- Quick login without remembering password
- One-time verification
- Dev/testing phase

---

### Option 2: Sign in with Password 🔑

**Step 1: Enter Credentials**
- Go to `/auth` → **Sign in** tab → Click **"Password"** button
- Enter your phone number (10 digits)
- Enter your password (set during signup)
- Click **"Sign in"**

**When to use:**
- You remember your password
- Prefer password-based authentication
- Regular login

---

## Authentication Methods Comparison

| Feature | OTP | Password |
|---------|-----|----------|
| Setup Time | Instant (no password needed) | Set during signup |
| Login Time | Send OTP → Enter OTP | Enter password directly |
| Security | Single-use codes | Must be strong |
| Easiest For | New users, quick login | Regular users |
| Dev Mode | Shows OTP on screen | Works immediately |

---

## Implementation Details 🛠️

### Backend Functions (`/src/lib/phone-auth.ts`)

```typescript
// Generate OTP
export function generateOTP(): string

// Send OTP to phone
export async function requestOTP(phone: string)

// Verify OTP and auto-signin/signup
export async function verifyOTPAndAuth(phone: string, otp: string, fullName?: string)

// Sign up with password
export async function signUpWithPassword(phone: string, password: string, fullName: string)

// Sign in with password
export async function signInWithPassword(phone: string, password: string)

// Sign out
export async function signOut()
```

### UI Components (`/src/routes/auth.tsx`)

**Sign In Tab:**
- Toggle between OTP and Password methods
- Phone input field (10 digits)
- OTP input field (6 digits) OR Password field
- Action buttons (Get OTP / Sign in)

**Create Account Tab:**
- Name field
- Phone field
- Password field (min 6 chars)
- Confirm password field
- Create Account button

---

## Database Schema

### User Authentication (Supabase Auth)
```sql
-- Supabase automatically manages:
- User ID (UUID)
- Email (phone@phone.local format)
- Password (hashed)
- Auth metadata
```

### OTP Requests Table
```sql
CREATE TABLE otp_requests (
  id UUID PRIMARY KEY,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ (10 minutes),
  is_used BOOLEAN,
  used_at TIMESTAMPTZ
)
```

### User Profiles
```sql
-- Stores user additional info:
- id (links to auth.users)
- phone TEXT
- full_name TEXT
- avatar_url
- created_at
- updated_at
```

---

## Security Features 🔒

✅ **OTP Security:**
- 6-digit random codes (100,000 possibilities)
- Auto-expire after 10 minutes
- Single-use only
- Marked as used after verification

✅ **Password Security:**
- Minimum 6 characters required
- Hashed and salted by Supabase
- Never stored in plain text
- Unique per user

✅ **Phone Verification:**
- 10-digit validation
- Prevents invalid entries
- Prevents duplicate accounts

---

## Testing Credentials 🧪

**Dev Mode - Use any of these:**
```
Phone: 9876543210
Phone: 8765432109
Phone: 7654321098
```

**For Password Testing:**
```
Phone: 9876543210
Password: TestPass123
```

**OTP Display:**
- In dev mode, OTP shows on screen
- Example: "Dev OTP: 654321"
- Enter this 6-digit number to complete login

---

## Production Changes Needed 🚀

Before deploying to production:

1. **Remove OTP Display**
   - Delete the dev OTP display line
   - OTP will be sent via SMS only

2. **Integrate SMS Provider**
   - Twilio (recommended)
   - AWS SNS
   - Firebase Cloud Messaging

3. **Update requestOTP() function:**
   ```typescript
   // Replace console.log with actual SMS send
   await twilioClient.messages.create({
     to: phone,
     from: process.env.TWILIO_PHONE,
     body: `Your Mana Santha OTP is: ${otp}`
   });
   ```

4. **Rate Limiting**
   - Max 3 OTP requests per phone per hour
   - Max 3 failed attempts before cooldown

5. **Password Requirements**
   - Enforce stronger passwords (min 8 chars, special chars)
   - Add password reset functionality

---

## Troubleshooting ❓

### Issue: "OTP table not found"
**Solution:** Run database migrations via Supabase Dashboard
```sql
-- Follow DATABASE_SETUP.md
```

### Issue: "Invalid or expired OTP"
**Solution:** 
- Ensure you enter the exact OTP shown
- OTP expires after 10 minutes
- Request a new OTP

### Issue: "Can't sign in with password"
**Solution:**
- Verify account exists (sign up first)
- Ensure correct phone number
- Check password is correct (case-sensitive)

### Issue: "Password too short"
**Solution:** Password must be at least 6 characters

---

## User Flow Diagram 📊

```
┌─────────────────────┐
│   Visit /auth       │
└──────────┬──────────┘
           │
      ┌────┴────┐
      ▼         ▼
  ┌────────┐ ┌──────────────┐
  │Sign In │ │Create Account│
  └────┬───┘ └──────┬───────┘
       │            │
    ┌──┴──┐      ┌──▼──┐
    ▼     ▼      ▼     ▼
  ┌─┐ ┌───┐   ┌──────────────────┐
  │O│ │PSW│   │1. Enter name     │
  │T│ │   │   │2. Enter phone    │
  │P│ │   │   │3. Set password   │
  └─┴─┴───┘   │4. Click signup   │
    │         └──────┬───────────┘
    │                │
    ▼                ▼
 Get OTP         Account Created
    │                │
    ▼                ▼
Enter OTP        Redirect to signin
    │
    ▼
 Logged In! 🎉
```

---

## API Reference

### Phone Auth Service Functions

```typescript
// Request OTP
const result = await requestOTP("9876543210");
// Returns: { success: true, otp: "654321" } (in dev mode)

// Verify OTP and authenticate
const result = await verifyOTPAndAuth("9876543210", "654321");
// Returns: { success: true, isNewUser: false, phone, userId }

// Sign up with password
const result = await signUpWithPassword("9876543210", "SecurePass123", "John Doe");
// Returns: { success: true, phone, userId }

// Sign in with password
const result = await signInWithPassword("9876543210", "SecurePass123");
// Returns: { success: true, phone, user, session }

// Sign out
await signOut();
```

---

## Next Steps

1. ✅ **Database Setup** - Run migrations via Supabase Dashboard
2. ✅ **Test OTP Flow** - Create account and login with OTP
3. ✅ **Test Password Flow** - Create account and login with password
4. 🔄 **SMS Integration** - Replace dev OTP display with real SMS
5. 🔄 **Rate Limiting** - Implement OTP request limiting
6. 🔄 **Password Recovery** - Add forgot password feature
7. 🔄 **2FA** - Optional: Add email/SMS verification after first login

---

**Status:** ✅ Ready for testing after database migrations
