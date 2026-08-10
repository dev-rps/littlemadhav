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
      return NextResponse.json({
        success: true,
        order,
        tracking: {
          success: true,
          status: order.status === "placed" ? "Order Placed - Processing for Pickup" : order.status,
          courierName: order.courierName || "Shiprocket Express",
          activities: [
            {
              date: order.createdAt,
              status: "Order received & submitted for shipment processing",
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
