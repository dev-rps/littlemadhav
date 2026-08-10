import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { z } from "zod";
import crypto from "crypto";

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6),
  paymentMethod: z.enum(["cod", "razorpay"]),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      variant: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ).min(1),
  specialInstructions: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpaySignature: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "razorpay") {
    return !!data.razorpayPaymentId && !!data.razorpayOrderId && !!data.razorpaySignature;
  }
  return true;
}, {
  message: "Razorpay payment details are required for online payment",
  path: ["razorpaySignature"],
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
    const data = orderSchema.parse(body);

    // Verify Razorpay signature if online payment
    if (data.paymentMethod === "razorpay") {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json({ error: "Server error: Razorpay key secret is not configured" }, { status: 500 });
      }
      const sign = data.razorpayOrderId + "|" + data.razorpayPaymentId;
      const expectedSign = crypto
        .createHmac("sha256", secret)
        .update(sign)
        .digest("hex");

      if (expectedSign !== data.razorpaySignature) {
        return NextResponse.json({ error: "Invalid payment signature. Verification failed." }, { status: 400 });
      }
    }

    // Securely recalculate totals on server
    let subtotal = 0;
    for (const item of data.items) {
      const price = await calculateProductPrice(item.productId, item.variant);
      if (price === 0) {
        return NextResponse.json({ error: `Product not found or invalid: ${item.name}` }, { status: 400 });
      }
      subtotal += price * item.quantity;
    }

    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
    const total = subtotal + shippingFee;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "cod" ? "pending" : "paid",
        status: "placed",
        notes: data.notes ?? data.specialInstructions,
        subtotal,
        shippingFee,
        total,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order, success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json(order);
    }

    const orders = await prisma.order.findMany({
      include: { items: { select: { name: true, quantity: true, price: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
