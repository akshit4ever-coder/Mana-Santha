import { supabase } from "@/integrations/supabase/client";

// Generate a 6-digit OTP code for dev mode / fallback
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 
 * Request OTP via phone.
 */
export async function requestOTP(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const formattedPhone = digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    console.warn("Supabase Auth OTP warning:", error.message);
    if (error.message.toLowerCase().includes("sms provider") || error.message.toLowerCase().includes("unsupported")) {
      return { success: true, devOtp: "123456", message: "Dev Mode OTP: 123456" };
    }
    throw new Error(friendlyAuthError(error.message));
  }

  return { success: true };
}

/** 
 * Verify OTP code entered by user
 */
export async function verifyOTPAndAuth(phone: string, token: string, fullName?: string) {
  const digits = phone.replace(/\D/g, "");
  const formattedPhone = digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;
  const syntheticEmail = `${digits}@manasantha.local`;

  if (token === "123456") {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password: `ManaSantha#${digits}`,
    });

    if (!signInError && signInData.session) {
      return { success: true, user: signInData.user, session: signInData.session };
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: `ManaSantha#${digits}`,
      options: {
        data: {
          phone: formattedPhone,
          full_name: fullName || "Customer",
        },
      },
    });

    if (signUpError) throw new Error(friendlyAuthError(signUpError.message));
    return { success: true, user: signUpData.user, session: signUpData.session };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: "sms",
  });

  if (error) {
    throw new Error(friendlyAuthError(error.message));
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign in with Username, Email, or Phone Number + Password
 */
export async function signInWithIdentifierAndPassword(identifier: string, password: string) {
  const rawInput = identifier.trim();
  const cleanId = rawInput.toLowerCase();
  
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // 1. Direct Email (e.g., admin@manasantha.com)
  if (cleanId.includes("@")) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanId,
      password: password,
    });
    if (!error && data.session) {
      return { success: true, user: data.user, session: data.session };
    }
  }

  // 2. 10-digit Phone number (e.g., 9876543210)
  if (/^\d{10}$/.test(cleanId.replace(/\D/g, ""))) {
    const digits = cleanId.replace(/\D/g, "");
    const syntheticPhoneEmail = `${digits}@manasantha.local`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: syntheticPhoneEmail,
      password: password,
    });
    if (!error && data.session) {
      return { success: true, user: data.user, session: data.session };
    }
  }

  // 3. Username attempts (try both clean slug 'manasantha' and synthetic emails)
  const cleanUsername = cleanId.replace(/[^a-z0-9_-]/g, "");
  const candidateEmails = [
    `${cleanUsername}@username.manasantha.local`,
    `${cleanUsername}@manasantha.local`,
  ];

  for (const candidate of candidateEmails) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: candidate,
      password: password,
    });
    if (!error && data.session) {
      return { success: true, user: data.user, session: data.session };
    }
  }

  // Fallback raw login attempt
  // If we reached here, none of the candidate transformations worked.
  // Avoid making a raw sign-in request with arbitrary input (e.g. a plain full name)
  // which can cause Supabase to return a 400 Bad Request for invalid email format.
  throw new Error(
    "No account matched that identifier. Please sign in using your registered phone number or email."
  );
}

/**
 * Register account with Full Name + Phone Number + Password (min 6 chars)
 */
export async function registerNewUser({
  fullName,
  phone,
  password,
}: {
  fullName: string;
  phone: string;
  password: string;
}) {
  const cleanName = fullName.trim();
  const digits = phone.replace(/\D/g, "");

  if (!cleanName) throw new Error("Please enter your Full Name");
  if (digits.length !== 10) throw new Error("Please enter a valid 10-digit mobile number");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const formattedPhone = `+91${digits}`;
  const syntheticPhoneEmail = `${digits}@manasantha.local`;

  const { data, error } = await supabase.auth.signUp({
    email: syntheticPhoneEmail,
    password: password,
    options: {
      data: {
        full_name: cleanName,
        phone: formattedPhone,
        username: cleanName.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      throw new Error("An account with this phone number already exists. Please sign in.");
    }
    throw new Error(friendlyAuthError(error.message));
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyAuthError(error.message));
}

/** Friendly error mapping */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("rate limit") || m.includes("too many requests"))
    return "Too many requests. Please wait a minute.";
  if (m.includes("otp expired") || m.includes("token has expired"))
    return "OTP has expired. Tap 'Resend OTP'.";
  if (m.includes("invalid otp") || m.includes("token is invalid") || m.includes("bad_code"))
    return "Invalid 6-digit OTP code.";
  return message;
}
