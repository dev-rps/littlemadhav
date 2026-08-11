import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createShiprocketOrder, getShiprocketToken, getShiprocketAuthStatus, resetShiprocketAuthLockout } from "@/lib/shiprocket";

/**
 * GET /api/shipping/sync-shiprocket
 * Diagnostics endpoint to verify Shiprocket credentials, outbound IP, & connection status.
 * Query params: ?resetLockout=true (to reset backoff timer after IP whitelisting)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("resetLockout") === "true") {
      resetShiprocketAuthLockout();
    }

    const email = (process.env.SHIPROCKET_API_EMAIL || process.env.SHIPROCKET_EMAIL)?.trim();
    const password = (process.env.SHIPROCKET_API_PASSWORD || process.env.SHIPROCKET_PASSWORD)?.trim();
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "warehouse (default)";
    const channelId = process.env.SHIPROCKET_CHANNEL_ID || "Not configured (Adhoc default)";
    const maskedEmail = email
      ? email.replace(/^(.{2})(.*)(@.*)$/, (_, p1, p2, p3) => `${p1}${"*".repeat(Math.min(p2.length, 4))}${p3}`)
      : null;

    // Detect server outbound egress IP
    let outboundIp: string | null = null;
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        outboundIp = ipData.ip;
      }
    } catch {
      // Fallback
    }

    const authStatus = getShiprocketAuthStatus();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "Missing Shiprocket credentials in environment variables (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)",
        envConfig: {
          emailConfigured: !!email,
          emailMasked: maskedEmail,
          passwordConfigured: !!password,
          passwordLength: password ? password.length : 0,
          pickupLocation,
          channelId,
        },
        authGuardStatus: authStatus,
        serverOutboundIp: outboundIp,
      }, { status: 400 });
    }

    if (authStatus.isPaused) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: authStatus.isPausedByEnv
          ? "Shiprocket authentication is manually paused via SHIPROCKET_AUTH_PAUSED=true in environment."
          : `Shiprocket circuit breaker active (locked out for ${Math.ceil(authStatus.lockoutRemainingSeconds / 60)} more minutes to protect account from rate-limiting).`,
        envConfig: {
          emailMasked: maskedEmail,
          passwordConfigured: !!password,
          passwordLength: password ? password.length : 0,
          pickupLocation,
          channelId,
        },
        authGuardStatus: authStatus,
        serverOutboundIp: outboundIp,
        tip: "Whitelist your server outbound IP in Shiprocket Panel (Settings > API > Configure), then add ?resetLockout=true to this URL to attempt login.",
      }, { status: 429 });
    }

    const token = await getShiprocketToken();

    if (!token) {
      const updatedStatus = getShiprocketAuthStatus();
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: updatedStatus.lastAuthErrorMsg || "Failed to authenticate with Shiprocket API. Check email/password or server IP whitelist.",
        envConfig: {
          emailMasked: maskedEmail,
          passwordConfigured: !!password,
          passwordLength: password ? password.length : 0,
          pickupLocation,
          channelId,
        },
        authGuardStatus: updatedStatus,
        serverOutboundIp: outboundIp,
        whitelistingInstructions: "Hostinger outbound IP must be whitelisted in Shiprocket Panel > Settings > API > Configure.",
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      message: "Shiprocket API connection successful!",
      envConfig: {
        emailMasked: maskedEmail,
        passwordConfigured: true,
        pickupLocation,
        channelId,
      },
      authGuardStatus: getShiprocketAuthStatus(),
      serverOutboundIp: outboundIp,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Diagnostic test failed",
    }, { status: 500 });
  }
}

/**
 * POST /api/shipping/sync-shiprocket
 * Manually sync or re-sync an existing order to Shiprocket by orderNumber or orderId.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, orderId } = body;

    if (!orderNumber && !orderId) {
      return NextResponse.json({
        success: false,
        error: "Please provide 'orderNumber' or 'orderId' to sync with Shiprocket.",
      }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          orderNumber ? { orderNumber } : undefined,
          orderId ? { id: orderId } : undefined,
        ].filter(Boolean) as any,
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: `Order not found with provided reference (${orderNumber || orderId}).`,
      }, { status: 404 });
    }

    const result = await createShiprocketOrder({
      orderId: order.orderNumber,
      orderDate: order.createdAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      total: order.total,
      items: order.items.map((it) => ({
        name: it.name,
        sku: `PROD-${it.productId.slice(-6)}`,
        units: it.quantity,
        selling_price: it.price,
      })),
    });

    if (!result || !result.success) {
      return NextResponse.json({
        success: false,
        error: result?.error || "Shiprocket API rejected order sync.",
        rawShiprocketResponse: result?.raw,
      }, { status: 422 });
    }

    // Update order with Shiprocket identifiers
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        shiprocketOrderId: result.shiprocketOrderId ? Number(result.shiprocketOrderId) : null,
        shiprocketShipmentId: result.shiprocketShipmentId ? Number(result.shiprocketShipmentId) : null,
        awbCode: result.awbCode,
        courierName: result.courierName,
      } as any,
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order successfully synced to Shiprocket!",
      order: updatedOrder,
      shiprocketResult: result,
    });
  } catch (err: any) {
    console.error("Manual Shiprocket sync error:", err);
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to sync order to Shiprocket",
    }, { status: 500 });
  }
}
