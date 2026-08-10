"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Phone } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  createdAt: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}

function OrderConfirmationLoading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F0" }}>
      <p style={{ fontFamily: "var(--font-body)", color: "#888" }}>Loading your order...</p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return; }
    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return <OrderConfirmationLoading />;
  }

  const WHATSAPP_NUMBER = "919876543210";
  const whatsappMsg = orderNumber
    ? encodeURIComponent(`Hi! I just placed order #${orderNumber}. Could you please confirm it?`)
    : encodeURIComponent("Hi! I just placed an order. Could you please confirm it?");

  return (
    <div style={{ backgroundColor: "#FFF8F0", minHeight: "100vh", padding: "3rem 0" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", width: 80, height: 80, borderRadius: "50%", backgroundColor: "#E8F5EE", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <CheckCircle size={48} style={{ color: "#2D6A4F" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "2rem", color: "#8B1E3F", marginBottom: "0.5rem" }}>
            Order Placed! 🎉
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "#555", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Thank you{order ? `, ${order.customerName.split(" ")[0]}` : ""}! Your handcrafted treasures are being packed with love.
          </p>
        </div>

        {/* Order Card */}
        {order ? (
          <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", overflow: "hidden", marginBottom: "1.5rem" }}>
            {/* Order header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F0E0C0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#888", margin: 0 }}>Order Number</p>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: "#8B1E3F", margin: 0 }}>#{order.orderNumber}</p>
              </div>
              <span style={{ padding: "0.3rem 0.875rem", backgroundColor: order.paymentMethod === "razorpay" ? "#E8F5EE" : "#FEF9EC", color: order.paymentMethod === "razorpay" ? "#2D6A4F" : "#B8890F", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem" }}>
                ✓ {order.paymentMethod === "razorpay" ? "Paid Online via Razorpay" : "Cash on Delivery (COD)"}
              </span>
            </div>

            {/* Items */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F0E0C0" }}>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "#555", marginBottom: "0.75rem" }}>Items Ordered</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                    <span style={{ color: "#1a1a1a" }}>{item.name} × {item.quantity}</span>
                    <span style={{ color: "#8B1E3F", fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#555" }}>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal ?? order.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#555" }}>
                <span>Delivery / Shipping</span>
                <span style={{ color: order.shippingFee === 0 ? "#2D6A4F" : "#555" }}>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
              </div>
              <div style={{ borderTop: "1px solid #F0E0C0", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem" }}>Total Amount Paid</span>
                <span style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.25rem" }}>{formatPrice(order.total)}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#2D6A4F", margin: 0, fontWeight: 600, textAlign: "right" }}>
                ✓ Inclusive of all taxes (GST)
              </p>
              {order.razorpayPaymentId && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#888", margin: "0.25rem 0 0 0", textAlign: "right" }}>
                  Payment ID: <code style={{ backgroundColor: "#F5EDE0", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>{order.razorpayPaymentId}</code>
                </p>
              )}
            </div>
          </div>
        ) : (
          orderNumber && (
            <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", color: "#555" }}>Order #{orderNumber} has been placed successfully.</p>
            </div>
          )
        )}

        {/* What's next */}
        <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem", marginBottom: "1rem" }}>What happens next?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { icon: <Package size={20} />, title: "Order Confirmed", desc: "We're preparing your handcrafted items with love." },
              { icon: <Phone size={20} />, title: "Packed & Shipped", desc: "You'll receive a tracking link via SMS/WhatsApp." },
              { icon: <CheckCircle size={20} />, title: "Delivered", desc: "Your order arrives safely in 3–5 business days." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#FDF0F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#8B1E3F" }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#1a1a1a", margin: 0 }}>{title}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#888", margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            id="order-whatsapp-confirm"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.875rem",
              backgroundColor: "#25D366",
              color: "#fff",
              borderRadius: "0.625rem",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            💬 Confirm Order on WhatsApp
          </a>
          <Link
            href="/collections/all"
            id="order-continue-shopping"
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.875rem",
              border: "2px solid #8B1E3F",
              color: "#8B1E3F",
              borderRadius: "0.625rem",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Continue Shopping →
          </Link>
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#aaa", marginTop: "1.5rem" }}>
          Questions? Email us at hello@littlemadhav.com or WhatsApp +91 98765 43210
        </p>
      </div>
    </div>
  );
}
