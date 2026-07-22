"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore, useCartTotal, useShippingFee, useAmountForFreeShipping, useCartCount } from "@/lib/store";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, specialInstructions, setSpecialInstructions } =
    useCartStore();
  const total = useCartTotal();
  const shippingFee = useShippingFee();
  const amountForFree = useAmountForFreeShipping();
  const cartCount = useCartCount();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 60,
          transition: "opacity 0.3s ease",
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        id="cart-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#FFFDF9",
          zIndex: 70,
          display: "flex",
          flexDirection: "column",
          transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "-8px 0 40px rgba(140,98,57,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #EFEAE0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShoppingBag size={20} style={{ color: "#8C6239" }} />
            <span
              style={{
                fontFamily: "var(--font-display, Cinzel, serif)",
                fontSize: "1.1rem",
                color: "#8C6239",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Your Bag
            </span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: "#8C6239",
                  color: "#FCFBF7",
                  borderRadius: "9999px",
                  padding: "0 6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <button
            id="cart-drawer-close"
            onClick={closeDrawer}
            style={{ color: "#555", padding: "0.25rem", borderRadius: "0.375rem" }}
            className="hover:bg-maroon-50 transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {total < FREE_SHIPPING_THRESHOLD && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              backgroundColor: "#FAF7F2",
              borderBottom: "1px solid #EFEAE0",
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#8C6239", marginBottom: "0.4rem", fontFamily: "var(--font-body, Jost, sans-serif)" }}>
              Add <strong style={{ color: "#8C6239" }}>{formatPrice(amountForFree)}</strong> more for{" "}
              <strong>FREE shipping</strong> 🚚
            </p>
            <div style={{ backgroundColor: "#EFEAE0", borderRadius: "9999px", height: 6 }}>
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#C5A059",
                  height: "100%",
                  borderRadius: "9999px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        )}
        {total >= FREE_SHIPPING_THRESHOLD && (
          <div
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#E8F5EE",
              borderBottom: "1px solid #C3E5D0",
              fontSize: "0.8rem",
              color: "#2D6A4F",
              fontWeight: 600,
              textAlign: "center",
              fontFamily: "var(--font-body, Jost, sans-serif)",
            }}
          >
            🎉 You've unlocked FREE shipping!
          </div>
        )}

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "3rem 0",
              }}
            >
              <ShoppingBag size={48} style={{ color: "#C5A059", opacity: 0.5 }} />
              <p style={{ fontFamily: "var(--font-body, Jost, sans-serif)", color: "#888", textAlign: "center", fontSize: "0.9rem" }}>
                Your bag is empty.<br />Start shopping for beautiful pieces!
              </p>
              <Link
                href="/collections/all"
                onClick={closeDrawer}
                style={{
                  backgroundColor: "#8C6239",
                  color: "#FCFBF7",
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.25rem",
                  fontFamily: "var(--font-body, Jost, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "inline-block",
                }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#FFFDF9",
                  borderRadius: "0.5rem",
                  border: "1px solid #EFEAE0",
                  position: "relative",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "0.375rem",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#F2EFE8",
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={72}
                    height={72}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body, Jost, sans-serif)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "#2c2520",
                      marginBottom: "0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </p>
                  {item.variant && (
                    <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: "var(--font-body, Jost, sans-serif)", marginBottom: "0.3rem" }}>
                      {item.variant}
                    </p>
                  )}
                  <p style={{ fontFamily: "var(--font-body, Jost, sans-serif)", fontWeight: 700, color: "#8C6239", fontSize: "0.9rem" }}>
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: 24,
                        height: 24,
                        border: "1px solid #C5A059",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8C6239",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      style={{
                        fontFamily: "var(--font-body, Jost, sans-serif)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: 24,
                        height: 24,
                        border: "1px solid #C5A059",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8C6239",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#ccc",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.125rem",
                    borderRadius: "0.25rem",
                  }}
                  className="hover:text-maroon"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderTop: "1px solid #EFEAE0",
              backgroundColor: "#FFFDF9",
            }}
          >
            {/* Special Instructions */}
            <textarea
              id="cart-special-instructions"
              placeholder="Add special instructions (e.g. gift message, delivery note)..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #EFEAE0",
                borderRadius: "0.25rem",
                fontSize: "0.8rem",
                fontFamily: "var(--font-body, Jost, sans-serif)",
                backgroundColor: "#FCFBF7",
                color: "#555",
                resize: "none",
                outline: "none",
                marginBottom: "0.75rem",
              }}
            />

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontFamily: "var(--font-body, Jost, sans-serif)", color: "#555" }}>
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontFamily: "var(--font-body, Jost, sans-serif)", color: "#555" }}>
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? "#2D6A4F" : "#2c2520" }}>
                  {shippingFee === 0 ? "FREE 🎉" : formatPrice(shippingFee)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-display, Cinzel, serif)",
                  color: "#8C6239",
                  fontSize: "1rem",
                  paddingTop: "0.4rem",
                  borderTop: "1px solid #EFEAE0",
                  marginTop: "0.2rem",
                  fontWeight: 600,
                }}
              >
                <span>Total</span>
                <span>{formatPrice(total + shippingFee)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              id="cart-checkout-btn"
              href="/checkout"
              onClick={closeDrawer}
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#8C6239",
                color: "#FCFBF7",
                padding: "0.875rem",
                borderRadius: "0.25rem",
                fontFamily: "var(--font-body, Jost, sans-serif)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#734e2c"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8C6239"; }}
            >
              Proceed to Checkout →
            </Link>
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#888", marginTop: "0.5rem", fontFamily: "var(--font-body, Jost, sans-serif)" }}>
              🔒 Secure checkout · COD available
            </p>
          </div>
        )}
      </div>
    </>
  );
}
