import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackShipmentByAwb } from "@/lib/shiprocket";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    let awb = searchParams.get("awb");

    let order = null;

    if (orderNumber) {
      order = await prisma.order.findUnique({
        where: { orderNumber },
      });

      if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
      }

      if (!awb && order.awbCode) {
        awb = order.awbCode;
      }
    }

    if (awb) {
      const trackingInfo = await trackShipmentByAwb(awb);
      return NextResponse.json({
        success: true,
        order,
        tracking: trackingInfo,
      });
    }

    // Fallback response if order exists in DB but AWB hasn't been assigned by courier yet
    if (order) {
      const isSynced = !!order.shiprocketOrderId;
      return NextResponse.json({
        success: true,
        order,
        tracking: {
          success: true,
          status: isSynced
            ? (order.status === "placed" ? "Order Confirmed - AWB Assignment Pending" : order.status)
            : "Order Placed - Pending Courier Sync",
          courierName: order.courierName || "Shiprocket Express",
          activities: [
            {
              date: order.createdAt,
              status: isSynced
                ? "Order received & pushed to Shiprocket logistics network"
                : "Order received in database (logistics sync pending/unverified)",
              location: "Warehouse",
            },
          ],
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Please provide an order number or AWB code to track." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching tracking details" },
      { status: 500 }
    );
  }
}
