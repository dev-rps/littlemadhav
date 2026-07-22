"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore, useCartTotal, useShippingFee } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
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
  paymentMethod: "cod" | "mock_online";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, specialInstructions } = useCartStore();
  const total = useCartTotal();
  const shippingFee = useShippingFee();
  const [submitting, setSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
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

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.customerEmail.includes("@")) e.customerEmail = "Valid email required";
    if (form.customerPhone.length < 10) e.customerPhone = "Valid phone required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.pincode.length !== 6) e.pincode = "6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleMockPayment = async () => {
    setSubmitting(true);
    toast.loading("Processing payment...", { id: "payment" });
    await new Promise((r) => setTimeout(r, 2000));
    toast.success("Payment successful! 🎉", { id: "payment" });
    await placeOrder("mock_online");
  };

  const placeOrder = async (method: "cod" | "mock_online") => {
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
        clearCart();
        router.push(`/order-confirmation?order=${data.order.orderNumber}`);
      } else {
        toast.error("Order failed. Please try again.");
        setSubmitting(false);
      }
    } catch {
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }

    if (form.paymentMethod === "mock_online") {
      setPaymentStep(true);
    } else {
      setSubmitting(true);
      await placeOrder("cod");
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", backgroundColor: "#FFF8F0" }}>
        <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "1rem" }}>Your cart is empty.</p>
        <a href="/collections/all" style={{ color: "#8B1E3F", fontFamily: "var(--font-body)", fontWeight: 600 }}>Continue Shopping →</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FFF8F0", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "2rem", color: "#8B1E3F", marginBottom: "0.25rem" }}>
          Checkout
        </h1>
        <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "0.875rem", marginBottom: "2rem" }}>
          🔒 Secure checkout — your details are safe with us
        </p>

        {/* Mock Payment Modal */}
        {paymentStep && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", padding: "2rem", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💳</div>
              <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Mock Payment Gateway</h2>
              <p style={{ fontFamily: "var(--font-body)", color: "#555", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                Amount: <strong style={{ color: "#8B1E3F" }}>{formatPrice(total + shippingFee)}</strong>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["UPI / PhonePe / GPay", "Credit / Debit Card", "Net Banking"].map((method) => (
                  <button
                    key={method}
                    onClick={handleMockPayment}
                    disabled={submitting}
                    style={{ padding: "0.75rem", border: "1.5px solid #F0E0C0", borderRadius: "0.5rem", backgroundColor: "#FFF8F0", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#1a1a1a", cursor: submitting ? "not-allowed" : "pointer" }}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPaymentStep(false)}
                style={{ marginTop: "1rem", backgroundColor: "transparent", border: "none", color: "#aaa", fontFamily: "var(--font-body)", fontSize: "0.8rem", cursor: "pointer" }}
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", padding: "1.5rem", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem", marginBottom: "1.25rem" }}>Delivery Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {[
                  { id: "customerName", label: "Full Name *", type: "text", placeholder: "Priya Sharma", colSpan: 2 },
                  { id: "customerEmail", label: "Email *", type: "email", placeholder: "priya@example.com" },
                  { id: "customerPhone", label: "Phone *", type: "tel", placeholder: "9876543210" },
                  { id: "address", label: "Full Address *", type: "text", placeholder: "House no, Street, Area", colSpan: 2 },
                  { id: "city", label: "City *", type: "text", placeholder: "Delhi" },
                  { id: "pincode", label: "Pincode *", type: "text", placeholder: "110001" },
                ].map(({ id, label, type, placeholder, colSpan }) => (
                  <div key={id} style={{ gridColumn: colSpan === 2 ? "1 / -1" : "auto" }}>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>
                      {label}
                    </label>
                    <input
                      id={`checkout-${id}`}
                      type={type}
                      placeholder={placeholder}
                      value={form[id as keyof FormData]}
                      onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        border: errors[id as keyof FormData] ? "1.5px solid #E76F51" : "1.5px solid #F0E0C0",
                        borderRadius: "0.5rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        backgroundColor: "#FFF8F0",
                        color: "#1a1a1a",
                        outline: "none",
                      }}
                    />
                    {errors[id as keyof FormData] && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#E76F51", marginTop: "0.2rem" }}>
                        {errors[id as keyof FormData]}
                      </p>
                    )}
                  </div>
                ))}

                {/* State */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>State *</label>
                  <select
                    id="checkout-state"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #F0E0C0", borderRadius: "0.5rem", fontFamily: "var(--font-body)", fontSize: "0.875rem", backgroundColor: "#FFF8F0", color: "#1a1a1a", outline: "none" }}
                  >
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", padding: "1.5rem", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem", marginBottom: "1.25rem" }}>Payment Method</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { value: "cod" as const, label: "Cash on Delivery (COD)", desc: "Pay when your order arrives", icon: "💵" },
                  { value: "mock_online" as const, label: "Pay Online (UPI / Card / Net Banking)", desc: "Test mode — no real money", icon: "💳" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    id={`payment-${opt.value}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      padding: "0.875rem",
                      border: form.paymentMethod === opt.value ? "2px solid #D4A017" : "1.5px solid #F0E0C0",
                      borderRadius: "0.625rem",
                      backgroundColor: form.paymentMethod === opt.value ? "#FEF9EC" : "#FFF8F0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: opt.value }))}
                      style={{ accentColor: "#8B1E3F" }}
                    />
                    <span style={{ fontSize: "1.5rem" }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", margin: 0 }}>{opt.label}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#888", margin: 0 }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              id="checkout-submit"
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: submitting ? "#aaa" : "#8B1E3F",
                color: "#FFF8F0",
                border: "none",
                borderRadius: "0.625rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {submitting ? "Processing..." : form.paymentMethod === "cod" ? "Place Order (COD) →" : "Proceed to Pay →"}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{ position: "sticky", top: "5rem" }}>
            <div style={{ backgroundColor: "#FFFBF5", borderRadius: "1rem", border: "1px solid #F0E0C0", padding: "1.25rem" }}>
              <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem", marginBottom: "1rem" }}>
                Order Summary ({items.length} items)
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem", maxHeight: 280, overflowY: "auto" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "0.375rem", overflow: "hidden", flexShrink: 0, backgroundColor: "#F5EDE0", position: "relative" }}>
                      <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} sizes="48px" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      {item.variant && (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#888", margin: 0 }}>{item.variant}</p>
                      )}
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#555", margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "#8B1E3F", flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #F0E0C0", paddingTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#555" }}>
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#555" }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingFee === 0 ? "#2D6A4F" : "#555" }}>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.1rem", color: "#8B1E3F", marginTop: "0.25rem", paddingTop: "0.4rem", borderTop: "1px solid #F0E0C0" }}>
                  <span>Total</span><span>{formatPrice(total + shippingFee)}</span>
                </div>
              </div>
              {/* Delivery estimate */}
              <div style={{ marginTop: "0.875rem", padding: "0.625rem 0.75rem", backgroundColor: "#E8F5EE", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Truck size={16} style={{ color: "#2D6A4F", flexShrink: 0 }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#2D6A4F", margin: 0 }}>
                  Estimated delivery: <strong>3–5 business days</strong>
                </p>
              </div>
            </div>

            {/* Trust */}
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.75rem", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ShieldCheck size={14} style={{ color: "#D4A017" }} /> Secure
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <RefreshCcw size={14} style={{ color: "#D4A017" }} /> Easy Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
