"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, ArrowLeft, Loader2 } from "lucide-react";
import OrderTracker from "@/components/shipping/OrderTracker";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchedQuery(query.trim());
  };

  return (
    <div style={{ backgroundColor: "#FBF3E9", minHeight: "90vh", padding: "2rem 1rem 4rem" }}>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb / Back button */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "#660D19",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {/* Hero Banner Box */}
        <div
          style={{
            backgroundColor: "#660D19",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            color: "#FFFFFF",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(102,13,25,0.18)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <Package size={28} style={{ color: "#CD9703" }} />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 800,
              margin: "0 0 0.5rem",
              letterSpacing: "0.01em",
            }}
          >
            Track Your Shipment
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "#F4E8DB",
              margin: "0 0 1.75rem",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Enter your Order Number (e.g. LM-100234) or AWB Tracking Code to check real-time courier updates.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ maxWidth: "520px", margin: "0 auto", display: "flex", gap: "0.5rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Enter Order # or AWB Code"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.5rem",
                  borderRadius: "12px",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  outline: "none",
                  color: "#000000",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8B7D6B",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "0.85rem 1.5rem",
                borderRadius: "12px",
                backgroundColor: "#CD9703",
                color: "#660D19",
                fontFamily: "var(--font-body)",
                fontWeight: 800,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(205,151,3,0.3)",
              }}
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Results Area */}
        {searchedQuery ? (
          <div>
            <OrderTracker orderNumber={searchedQuery} />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              border: "1.5px dashed #BAAC9D",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "#660D19", fontWeight: 700, margin: "0 0 0.5rem" }}>
              Looking for your order status?
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#666666", margin: 0 }}>
              You can find your Order Number in your order confirmation email or invoice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
