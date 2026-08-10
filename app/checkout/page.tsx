"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, useCartTotal, useShippingFee } from "@/lib/store";
import { useUserStore } from "@/lib/userStore";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, RefreshCcw, ChevronDown, ChevronUp, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Puducherry","Chandigarh",
];

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "cod" | "razorpay";
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, specialInstructions } = useCartStore();
  const { user } = useUserStore();
  const total = useCartTotal();
  const shippingFee = useShippingFee();
  const finalTotal = total + shippingFee;

  const [submitting, setSubmitting] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    state: "Delhi",
    pincode: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
      }));
    }
  }, [user]);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.customerName.trim()) e.customerName = "Full name is required";
    if (!form.customerEmail.includes("@")) e.customerEmail = "Valid email is required";
    if (form.customerPhone.trim().length < 10) e.customerPhone = "10-digit mobile number required";
    if (!form.address.trim()) e.address = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.pincode.trim().length !== 6) e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRazorpayPayment = async () => {
    setSubmitting(true);
    const loadingToast = toast.loading("Initializing secure payment...");
    try {
      const res = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
          })),
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        toast.error(orderData.error || "Failed to initialize payment", { id: loadingToast });
        setSubmitting(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please check connection.", { id: loadingToast });
        setSubmitting(false);
        return;
      }

      toast.dismiss(loadingToast);

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Mourika",
        description: "Handcrafted Devotional Treasures",
        order_id: orderData.id,
        handler: async function (response: any) {
          toast.loading("Verifying payment transaction...", { id: "razorpay-verify" });
          try {
            const verifyRes = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                paymentMethod: "razorpay",
                notes: specialInstructions,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                items: items.map((i) => ({
                  productId: i.productId,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  variant: i.variant,
                  imageUrl: i.imageUrl,
                })),
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment verified! Order placed 🎉", { id: "razorpay-verify" });
              clearCart();
              router.push(`/order-confirmation?order=${verifyData.order.orderNumber}`);
            } else {
              toast.error(verifyData.error || "Payment verification failed", { id: "razorpay-verify" });
              setSubmitting(false);
            }
          } catch {
            toast.error("Verification failed. Please contact support.", { id: "razorpay-verify" });
            setSubmitting(false);
          }
        },
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
          contact: form.customerPhone,
        },
        theme: {
          color: "#660D19",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            toast.error("Payment modal closed");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Connection failed. Please try again.", { id: loadingToast });
      setSubmitting(false);
    }
  };

  const placeOrder = async (method: "cod") => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: method,
          notes: specialInstructions,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
            imageUrl: i.imageUrl,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully! 🎉");
        clearCart();
        router.push(`/order-confirmation?order=${data.order.orderNumber}`);
      } else {
        toast.error(data.error || "Order creation failed.");
        setSubmitting(false);
      }
    } catch {
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (form.paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      setSubmitting(true);
      await placeOrder("cod");
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "var(--color-cream)" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "2.5rem 2rem", borderRadius: "1.25rem", textAlign: "center", maxWidth: 440, boxShadow: "0 4px 20px rgba(102,13,25,0.06)", border: "1px solid rgba(205,151,3,0.2)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#FEF9EC", color: "var(--color-maroon)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto" }}>
            <Lock size={30} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Sign In Required
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: "0.88rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
            Please log in to your Mourika account first to place orders, save your delivery address, and view order tracking.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              id="checkout-login-btn"
              href="/login?redirect=/checkout"
              style={{
                display: "block",
                padding: "0.875rem 1.75rem",
                backgroundColor: "var(--color-maroon)",
                color: "#FFFFFF",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                textAlign: "center",
                boxShadow: "0 4px 14px rgba(102,13,25,0.2)"
              }}
            >
              Sign In to Continue →
            </Link>
            <Link
              id="checkout-signup-btn"
              href="/login?redirect=/checkout"
              style={{
                display: "block",
                padding: "0.875rem 1.75rem",
                backgroundColor: "#FFFFFF",
                color: "var(--color-maroon)",
                border: "2px solid var(--color-maroon)",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "var(--color-cream)" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "2.5rem 2rem", borderRadius: "1.25rem", textAlign: "center", maxWidth: 420, boxShadow: "0 4px 20px rgba(102,13,25,0.06)", border: "1px solid rgba(205,151,3,0.2)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Your Cart is Empty
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Explore our handcrafted dresses, decor & spiritual items for your Little Gopal!
          </p>
          <Link
            href="/collections/all"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.75rem",
              backgroundColor: "var(--color-maroon)",
              color: "#FFFFFF",
              borderRadius: "9999px",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Explore Collections →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-cream)", minHeight: "100vh", paddingBottom: "6rem" }}>
      {/* ── Top Header Navigation ── */}
      <div style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid rgba(205,151,3,0.15)", padding: "0.875rem 0" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/collections/all"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "var(--color-maroon)",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-gold-dark)", fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-body)" }}>
            <Lock size={14} />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 5vw, 2.25rem)", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
            Checkout
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Complete your order with express delivery across India 🚚
          </p>
        </div>

        {/* ── Mobile Collapsible Order Summary Accordion (Visible on Mobile < lg) ── */}
        <div className="block lg:hidden mb-6" style={{ borderRadius: "1rem", border: "1px solid rgba(205,151,3,0.3)", backgroundColor: "#FEF9EC", overflow: "hidden" }}>
          <button
            type="button"
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            style={{
              width: "100%",
              padding: "0.875rem 1.125rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
            aria-expanded={showMobileSummary}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🛍️</span>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.88rem", color: "var(--color-maroon)", margin: 0 }}>
                  {showMobileSummary ? "Hide Order Summary" : "Show Order Summary"} ({items.length} items)
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-muted)", margin: 0 }}>
                  {items.slice(0, 2).map(i => i.name).join(", ")}{items.length > 2 ? "..." : ""}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-maroon)" }}>
                {formatPrice(finalTotal)}
              </span>
              {showMobileSummary ? <ChevronUp size={18} style={{ color: "var(--color-maroon)" }} /> : <ChevronDown size={18} style={{ color: "var(--color-maroon)" }} />}
            </div>
          </button>

          {showMobileSummary && (
            <div style={{ padding: "0 1.125rem 1.125rem 1.125rem", borderTop: "1px solid rgba(205,151,3,0.15)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "0.875rem", maxHeight: 240, overflowY: "auto" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "0.375rem", overflow: "hidden", flexShrink: 0, backgroundColor: "#FFFFFF", position: "relative", border: "1px solid rgba(102,13,25,0.08)" }}>
                      <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} sizes="44px" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.82rem", color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      {item.variant && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--color-muted)", margin: 0 }}>{item.variant}</p>}
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#555", margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "var(--color-maroon)", flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px dashed rgba(205,151,3,0.3)", paddingTop: "0.75rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#555" }}>
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#555" }}>
                  <span>Shipping Fee</span>
                  <span style={{ color: shippingFee === 0 ? "var(--color-green)" : "#555", fontWeight: shippingFee === 0 ? 700 : 400 }}>
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Step Progress Indicator ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", backgroundColor: "var(--color-maroon)", color: "#FFFFFF", padding: "0.3rem 0.75rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-body)" }}>
            <CheckCircle2 size={13} />
            <span>1. Shipping Details</span>
          </div>
          <div style={{ height: 2, flex: 1, backgroundColor: "rgba(205,151,3,0.3)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", backgroundColor: "#FEF9EC", border: "1px solid var(--color-gold-dark)", color: "var(--color-maroon)", padding: "0.3rem 0.75rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-body)" }}>
            <span>2. Payment</span>
          </div>
        </div>

        {/* ── Main Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
          {/* Left Column: Delivery & Payment Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Delivery Details Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "1.125rem",
                border: "1px solid rgba(102,13,25,0.08)",
                padding: "1.5rem",
                boxShadow: "0 2px 12px rgba(102,13,25,0.04)",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>📍</span> Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-customerName" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    Full Name *
                  </label>
                  <input
                    id="checkout-customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Priya Sharma"
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.customerName ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.customerName && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.customerName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="checkout-customerEmail" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    Email Address *
                  </label>
                  <input
                    id="checkout-customerEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="priya@example.com"
                    value={form.customerEmail}
                    onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.customerEmail ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.customerEmail && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.customerEmail}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="checkout-customerPhone" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    Mobile Number *
                  </label>
                  <input
                    id="checkout-customerPhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="9876543210"
                    value={form.customerPhone}
                    onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.customerPhone ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.customerPhone && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.customerPhone}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    Complete House / Street Address *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Flat / House No., Building Name, Street"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.address ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.address && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="checkout-city" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    City / Town *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Delhi / Vrindavan"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.city ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.city && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.city}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label htmlFor="checkout-pincode" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    Pincode *
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="110001"
                    value={form.pincode}
                    onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: errors.pincode ? "1.5px solid #E76F51" : "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                  {errors.pincode && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.25rem" }}>{errors.pincode}</p>}
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-state" style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-body)", display: "block", marginBottom: "0.35rem" }}>
                    State *
                  </label>
                  <select
                    id="checkout-state"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    style={{
                      width: "100%",
                      height: "48px",
                      padding: "0.75rem 1rem",
                      border: "1.5px solid rgba(205,151,3,0.3)",
                      borderRadius: "0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "1.125rem",
                border: "1px solid rgba(102,13,25,0.08)",
                padding: "1.5rem",
                boxShadow: "0 2px 12px rgba(102,13,25,0.04)",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>💳</span> Select Payment Option
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {/* Razorpay Online */}
                <label
                  id="payment-razorpay"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.875rem",
                    padding: "1rem",
                    border: form.paymentMethod === "razorpay" ? "2px solid var(--color-maroon)" : "1.5px solid rgba(205,151,3,0.25)",
                    borderRadius: "0.875rem",
                    backgroundColor: form.paymentMethod === "razorpay" ? "#FEF9EC" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={form.paymentMethod === "razorpay"}
                    onChange={() => setForm((f) => ({ ...f, paymentMethod: "razorpay" }))}
                    style={{ accentColor: "var(--color-maroon)", marginTop: "0.25rem", width: 18, height: 18 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.25rem" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-maroon)" }}>
                        Pay Online (Razorpay)
                      </span>
                      <span style={{ backgroundColor: "var(--color-green)", color: "#FFFFFF", fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                        ⚡ Recommended & Fast
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-muted)", margin: "0.25rem 0 0 0" }}>
                      Instant payment via UPI, Google Pay, PhonePe, Paytm, Credit/Debit Cards & Netbanking.
                    </p>
                    {form.paymentMethod === "razorpay" && (
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.625rem" }}>
                        {["GPay", "PhonePe", "Paytm", "UPI", "Cards", "NetBanking"].map((b) => (
                          <span
                            key={b}
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              padding: "0.2rem 0.5rem",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid var(--color-gold-dark)",
                              borderRadius: "0.375rem",
                              color: "var(--color-maroon)",
                            }}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                {/* COD */}
                <label
                  id="payment-cod"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.875rem",
                    padding: "1rem",
                    border: form.paymentMethod === "cod" ? "2px solid var(--color-maroon)" : "1.5px solid rgba(205,151,3,0.25)",
                    borderRadius: "0.875rem",
                    backgroundColor: form.paymentMethod === "cod" ? "#FEF9EC" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm((f) => ({ ...f, paymentMethod: "cod" }))}
                    style={{ accentColor: "var(--color-maroon)", marginTop: "0.25rem", width: 18, height: 18 }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-maroon)" }}>
                      Cash on Delivery (COD)
                    </span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-muted)", margin: "0.25rem 0 0 0" }}>
                      Pay cash at your doorstep when your package is delivered.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Desktop Action Button */}
            <button
              id="checkout-submit-desktop"
              type="submit"
              disabled={submitting}
              className="hidden lg:flex"
              style={{
                width: "100%",
                padding: "1.125rem",
                backgroundColor: submitting ? "#aaa" : "var(--color-maroon)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "0.875rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1.05rem",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 4px 18px rgba(102,13,25,0.25)",
                transition: "all 0.2s ease",
              }}
            >
              {submitting
                ? "Processing Order..."
                : form.paymentMethod === "cod"
                ? "Place Order (COD) →"
                : `Pay ${formatPrice(finalTotal)} via Razorpay 🔒`}
            </button>
          </form>

          {/* Right Column: Order Summary Sidebar (Desktop Only) */}
          <div style={{ position: "sticky", top: "5.5rem" }} className="hidden lg:block">
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "1.125rem",
                border: "1px solid rgba(102,13,25,0.08)",
                padding: "1.5rem",
                boxShadow: "0 4px 20px rgba(102,13,25,0.06)",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 1.25rem 0" }}>
                Order Summary ({items.length} items)
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem", maxHeight: 300, overflowY: "auto" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "0.5rem", overflow: "hidden", flexShrink: 0, backgroundColor: "#FFF8F0", position: "relative", border: "1px solid rgba(102,13,25,0.08)" }}>
                      <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} sizes="52px" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      {item.variant && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--color-muted)", margin: 0 }}>{item.variant}</p>}
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#555", margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "var(--color-maroon)", flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(205,151,3,0.2)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#555" }}>
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#555" }}>
                  <span>Shipping Fee</span>
                  <span style={{ color: shippingFee === 0 ? "var(--color-green)" : "#555", fontWeight: shippingFee === 0 ? 700 : 400 }}>
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--color-maroon)", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(205,151,3,0.2)", fontWeight: 700 }}>
                  <span>Total Payable</span><span>{formatPrice(finalTotal)}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--color-green)", textAlign: "right", margin: "0.2rem 0 0 0", fontWeight: 600 }}>
                  ✓ Inclusive of all taxes (GST)
                </p>
              </div>

              {/* Delivery Estimate Box */}
              <div style={{ marginTop: "1rem", padding: "0.75rem 0.875rem", backgroundColor: "#E8F5EE", borderRadius: "0.625rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Truck size={18} style={{ color: "var(--color-green)", flexShrink: 0 }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-green)", margin: 0 }}>
                  Estimated Delivery: <strong>3–5 Business Days</strong>
                </p>
              </div>

              {/* Trust Badges */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-gold-dark)" }} /> 100% Genuine
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <RefreshCcw size={16} style={{ color: "var(--color-gold-dark)" }} /> Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed Mobile Bottom Action Bar (Visible on Mobile < lg) ── */}
      <div
        className="block lg:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          borderTop: "2px solid var(--color-gold)",
          padding: "0.75rem 1rem",
          boxShadow: "0 -4px 20px rgba(102,13,25,0.12)",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--color-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Payable
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700, lineHeight: 1.1 }}>
              {formatPrice(finalTotal)}
            </p>
          </div>
          <button
            id="checkout-submit-mobile"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              maxWidth: "240px",
              padding: "0.85rem 1rem",
              backgroundColor: submitting ? "#aaa" : "var(--color-maroon)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: submitting ? "none" : "0 4px 14px rgba(102,13,25,0.25)",
            }}
          >
            {submitting
              ? "Processing..."
              : form.paymentMethod === "cod"
              ? "Place Order →"
              : "Pay Now 🔒"}
          </button>
        </div>
      </div>
    </div>
  );
}
