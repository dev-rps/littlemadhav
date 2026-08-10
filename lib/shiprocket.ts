const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

/**
 * Obtain JWT token from Shiprocket API.
 * Caches token in memory for up to 9 days (Shiprocket tokens are valid for 10 days).
 */
export async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL?.trim();
  const password = process.env.SHIPROCKET_PASSWORD?.trim();

  if (!email || !password) {
    console.warn("Shiprocket credentials (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD) missing in .env");
    return null;
  }

  // Use cached token if valid
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Shiprocket Auth Failed:", res.status, errText);
      return null;
    }

    const data = await res.json();
    if (data && data.token) {
      cachedToken = data.token;
      // Expire cache 1 day before token expiration (9 days)
      tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
      return cachedToken;
    }
    return null;
  } catch (err) {
    console.error("Error fetching Shiprocket auth token:", err);
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
