import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createShiprocketOrder, getShiprocketToken } from "@/lib/shiprocket";

/**
 * GET /api/shipping/sync-shiprocket
 * Diagnostics endpoint to verify Shiprocket credentials & connection status.
 */
export async function GET() {
  try {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "warehouse (default)";
    const channelId = process.env.SHIPROCKET_CHANNEL_ID || "Not configured (Adhoc default)";

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "Missing Shiprocket credentials in environment variables (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)",
        envConfig: {
          emailConfigured: !!email,
          passwordConfigured: !!password,
          pickupLocation,
          channelId,
        },
      }, { status: 400 });
    }

    const token = await getShiprocketToken();

    if (!token) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "Failed to authenticate with Shiprocket API. Check email/password credentials.",
        envConfig: {
          email,
          pickupLocation,
          channelId,
        },
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      message: "Shiprocket API connection successful!",
      envConfig: {
        email,
        pickupLocation,
        channelId,
      },
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
