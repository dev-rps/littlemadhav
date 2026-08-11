const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;
let authLockoutUntil: number | null = null;
let lastAuthErrorMsg: string | null = null;

function cleanEnvVal(val?: string): string | undefined {
  if (!val) return undefined;
  let str = val.trim().replace(/[\r\n\t]/g, "");
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.substring(1, str.length - 1).trim().replace(/[\r\n\t]/g, "");
  }
  // Try decodeURIComponent if Hostinger URL-encoded symbols like % -> %25
  try {
    if (str.includes("%")) {
      str = decodeURIComponent(str);
    }
  } catch {}
  // Unescape backslash-escaped characters (e.g. \$ -> $, \& -> &, \# -> #, \% -> %)
  str = str.replace(/\\([$&%#])/g, "$1");
  // Unescape HTML entities if Hostinger hPanel encoded special characters like & -> &amp;
  str = str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return str.trim();
}

/**
 * Returns current Shiprocket auth status including circuit breaker / lockout gate.
 */
export function getShiprocketAuthStatus() {
  const isPausedEnv = process.env.SHIPROCKET_AUTH_PAUSED === "true";
  const isLockedOut = authLockoutUntil !== null && Date.now() < authLockoutUntil;
  const lockoutRemainingSeconds = isLockedOut ? Math.ceil((authLockoutUntil! - Date.now()) / 1000) : 0;

  return {
    isPaused: isPausedEnv || isLockedOut,
    isPausedByEnv: isPausedEnv,
    isLockedOut,
    lockoutRemainingSeconds,
    lastAuthErrorMsg,
    tokenCached: !!cachedToken && !!tokenExpiresAt && Date.now() < tokenExpiresAt,
  };
}

/**
 * Reset lockout state to manually attempt authentication after IP whitelisting.
 */
export function resetShiprocketAuthLockout() {
  authLockoutUntil = null;
  lastAuthErrorMsg = null;
  cachedToken = null;
  tokenExpiresAt = null;
}

/**
 * Obtain JWT token from Shiprocket API.
 * Sends POST request to https://apiv2.shiprocket.in/v1/external/auth/login
 * Caches token in memory for up to 9 days (Shiprocket tokens are valid for 10 days).
 * Features circuit-breaker lockout gate to prevent auth ban loops.
 * Pass forceFresh=true to bypass cache and force a brand new HTTP POST login request.
 */
export async function getShiprocketToken(forceFresh: boolean = false): Promise<string | null> {
  const rawEmail = process.env.SHIPROCKET_EMAIL || process.env.SHIPROCKET_API_EMAIL;
  const rawPassword = process.env.SHIPROCKET_PASSWORD || process.env.SHIPROCKET_API_PASSWORD;
  const email = cleanEnvVal(rawEmail);
  const password = cleanEnvVal(rawPassword);

  // Server-side masked email log helper
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, p1, p2, p3) => `${p1}${"*".repeat(Math.min(p2.length, 4))}${p3}`)
    : undefined;

  console.log(`[Shiprocket Auth Check] Email configured: ${!!email} (${maskedEmail || "MISSING"}), Password configured: ${!!password} (length: ${password?.length || 0})`);

  if (!email || !password) {
    console.warn("[Shiprocket Auth] Credentials missing in environment variables (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)");
    return null;
  }

  // 1. Check manual pause switch (SHIPROCKET_AUTH_PAUSED=true)
  if (process.env.SHIPROCKET_AUTH_PAUSED === "true") {
    console.warn("[Shiprocket Guard] Auth requests explicitly paused via SHIPROCKET_AUTH_PAUSED=true in environment.");
    return null;
  }

  // 2. Lockout Gate / Circuit Breaker backoff
  if (authLockoutUntil && Date.now() < authLockoutUntil) {
    const remainingMins = Math.ceil((authLockoutUntil - Date.now()) / (60 * 1000));
    console.warn(`[Shiprocket Guard] Auth calls temporarily locked out to prevent IP rate-limiting. Backoff active for another ${remainingMins} minutes. Error: ${lastAuthErrorMsg}`);
    return null;
  }

  // 3. Use cached token if valid (unless forceFresh is true)
  if (!forceFresh && cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    console.log("[Shiprocket Auth] Reusing valid cached JWT token.");
    return cachedToken;
  }

  try {
    console.log("[Shiprocket Auth] Initiating login request to Shiprocket API...");
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      lastAuthErrorMsg = `HTTP ${res.status}: ${errText}`;
      console.error("[Shiprocket Auth Failed]", res.status, errText);

      // Lockout / Rate Limit Circuit Breaker: Pause auth for 1 hour on failures
      authLockoutUntil = Date.now() + 60 * 60 * 1000;
      console.warn("[Shiprocket Circuit Breaker] Activated 1-hour backoff to protect Shiprocket account from repeated lockout.");
      return null;
    }

    const data = await res.json();
    if (data && data.token) {
      cachedToken = data.token;
      // Reset lockout counter on clean auth success
      authLockoutUntil = null;
      lastAuthErrorMsg = null;
      // Expire cache 1 day before token expiration (9 days)
      tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
      console.log("[Shiprocket Auth Success] JWT token received and cached for 9 days.");
      return cachedToken;
    }

    lastAuthErrorMsg = "Response missing JWT token field";
    authLockoutUntil = Date.now() + 30 * 60 * 1000; // 30 mins
    return null;
  } catch (err: any) {
    lastAuthErrorMsg = err.message || "Network exception during auth request";
    console.error("[Shiprocket Auth Network Error]", err);
    authLockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins
    return null;
  }
}

export interface ShiprocketItemInput {
  name: string;
  sku?: string;
  units: number;
  selling_price: number;
}

export interface ShiprocketOrderInput {
  orderId: string;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "cod" | "razorpay" | string;
  subtotal: number;
  total: number;
  items: ShiprocketItemInput[];
  pickupLocation?: string;
}

/**
 * Creates an adhoc custom order in Shiprocket.
 */
export async function createShiprocketOrder(input: ShiprocketOrderInput) {
  const token = await getShiprocketToken();
  if (!token) {
    console.warn("Skipping Shiprocket order creation: Auth token unavailable.");
    return { success: false, error: "Shiprocket authentication token unavailable. Check SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD." };
  }

  // Format date to "YYYY-MM-DD HH:mm"
  const formattedDate = input.orderDate
    .toISOString()
    .replace("T", " ")
    .substring(0, 16);

  // Split name into first and last name for Shiprocket requirements
  const nameParts = input.customerName.trim().split(" ");
  const firstName = nameParts[0] || input.customerName;
  const lastName = nameParts.slice(1).join(" ") || ".";

  // Sanitize phone number to 10 digits
  const sanitizedPhone = input.customerPhone.replace(/\D/g, "").slice(-10);

  const payload: Record<string, any> = {
    order_id: input.orderId,
    order_date: formattedDate,
    pickup_location: input.pickupLocation || process.env.SHIPROCKET_PICKUP_LOCATION || "warehouse",
    comment: "Website order",
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: input.address,
    billing_address_2: "",
    billing_city: input.city,
    billing_pincode: input.pincode,
    billing_state: input.state,
    billing_country: "India",
    billing_email: input.customerEmail,
    billing_phone: sanitizedPhone,
    shipping_is_billing: true,
    order_items: input.items.map((item, idx) => ({
      name: item.name,
      sku: item.sku || `ITEM-${idx + 1}`,
      units: item.units,
      selling_price: item.selling_price,
      discount: 0,
      tax: 0,
    })),
    payment_method: input.paymentMethod.toLowerCase() === "cod" ? "COD" : "Prepaid",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: input.subtotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  // Only include channel_id if explicitly defined in environment variables (do NOT pass arbitrary channel ID)
  if (process.env.SHIPROCKET_CHANNEL_ID && process.env.SHIPROCKET_CHANNEL_ID.trim().length > 0) {
    payload.channel_id = process.env.SHIPROCKET_CHANNEL_ID.trim();
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.status_code === 400 || data.status_code === 422) {
      const errorMsg =
        data.message ||
        (data.errors ? (typeof data.errors === "string" ? data.errors : JSON.stringify(data.errors)) : "Shiprocket order creation failed");
      console.error("Shiprocket create order API error:", res.status, data);
      return { success: false, error: errorMsg, raw: data };
    }

    return {
      success: true,
      shiprocketOrderId: data.order_id,
      shiprocketShipmentId: data.shipment_id,
      awbCode: data.awb_code || null,
      courierName: data.courier_name || null,
      raw: data,
    };
  } catch (err: any) {
    console.error("Failed to create order in Shiprocket:", err);
    return { success: false, error: err.message || "Network error connecting to Shiprocket" };
  }
}

/**
 * Check pincode serviceability for a delivery pincode
 */
export async function checkPincodeServiceability(
  deliveryPincode: string,
  weightKg: number = 0.5,
  isCod: boolean = false
) {
  const token = await getShiprocketToken();
  if (!token) {
    return { success: false, message: "Logistics token unavailable" };
  }

  const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "110001";
  const codFlag = isCod ? 1 : 0;

  const url = `${SHIPROCKET_API_BASE}/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weightKg}&cod=${codFlag}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      return {
        success: false,
        serviceable: false,
        message: data.message || "Pincode non-serviceable",
      };
    }

    const availableCouriers = data.data?.available_courier_companies || [];
    const isServiceable = availableCouriers.length > 0;

    let minDays = 3;
    let maxDays = 7;
    if (isServiceable) {
      const etas = availableCouriers
        .map((c: any) => parseInt(c.etd || "4", 10))
        .filter((d: number) => !isNaN(d) && d > 0);
      if (etas.length > 0) {
        minDays = Math.min(...etas);
        maxDays = Math.max(...etas);
      }
    }

    return {
      success: true,
      serviceable: isServiceable,
      availableCouriersCount: availableCouriers.length,
      estimatedDays: `${minDays}-${maxDays} business days`,
      couriers: availableCouriers.map((c: any) => ({
        id: c.courier_company_id,
        name: c.courier_name,
        rate: c.rate,
        etd: c.etd,
        cod: c.cod === 1,
      })),
    };
  } catch (err) {
    console.error("Pincode serviceability check failed:", err);
    return { success: false, serviceable: false, message: "Failed to check serviceability" };
  }
}

/**
 * Fetch real-time shipment tracking by AWB code or Shipment ID
 */
export async function trackShipmentByAwb(awbCode: string) {
  const token = await getShiprocketToken();
  if (!token) {
    return { success: false, message: "Logistics token unavailable" };
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/courier/track/awb/${awbCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.tracking_data) {
      return { success: false, message: data.message || "Tracking info unavailable" };
    }

    const track = data.tracking_data;
    const trackData = track.shipment_track?.[0] || {};
    const activities = track.shipment_track_activities || [];

    return {
      success: true,
      status: trackData.current_status || "In Transit",
      origin: trackData.origin || "",
      destination: trackData.destination || "",
      pickupDate: trackData.pickup_date || "",
      deliveredDate: trackData.delivered_date || "",
      courierName: trackData.courier_name || "",
      trackUrl: track.track_url || "",
      activities: activities.map((act: any) => ({
        date: act.date,
        status: act.activity,
        location: act.location,
      })),
    };
  } catch (err) {
    console.error("Tracking API error:", err);
    return { success: false, message: "Failed to retrieve tracking details" };
  }
}
