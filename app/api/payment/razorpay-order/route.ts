import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

async function calculateProductPrice(productId: string, variantStr?: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });
  if (!product) return 0;

  let price = product.price;
  if (variantStr && product.variants.length > 0) {
    const parts = variantStr.split(",").map((p) => p.trim());
    for (const part of parts) {
      const colonIndex = part.indexOf(":");
      if (colonIndex !== -1) {
        const name = part.substring(0, colonIndex).trim();
        const value = part.substring(colonIndex + 1).trim();
        const matchingVariant = product.variants.find(
          (v) => v.name.toLowerCase() === name.toLowerCase() && v.value.toLowerCase() === value.toLowerCase()
        );
        if (matchingVariant) {
          price += matchingVariant.priceAdj;
        }
      }
    }
  }
  return price;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Empty or invalid cart items" }, { status: 400 });
    }

    // Securely calculate total on the server
    let subtotal = 0;
    for (const item of items) {
      const price = await calculateProductPrice(item.productId, item.variant);
      if (price === 0) {
        return NextResponse.json({ error: `Product not found or invalid: ${item.name}` }, { status: 400 });
      }
      subtotal += price * item.quantity;
    }

    const shippingFee = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shippingFee;

    // Create Razorpay Order
    // Amount must be in the smallest currency unit (paisa for INR)
    const options = {
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      success: true,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
