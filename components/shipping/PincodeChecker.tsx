"use client";

import { useState } from "react";
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PincodeCheckerProps {
  compact?: boolean;
}

export default function PincodeChecker({ compact = false }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    serviceable?: boolean;
    estimatedDays?: string;
    message?: string;
    couriersCount?: number;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setResult({
        success: false,
        message: "Please enter a valid 6-digit Pincode",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/shipping/serviceability?pincode=${pincode}`);
      const data = await res.json();
      if (data.success && data.serviceable) {
        setResult({
          success: true,
          serviceable: true,
          estimatedDays: data.estimatedDays,
          couriersCount: data.availableCouriersCount,
        });
      } else {
        setResult({
          success: false,
          serviceable: false,
          message: data.message || "Delivery currently unavailable for this pincode",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Unable to verify pincode. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        padding: compact ? "0.85rem 1rem" : "1.15rem 1.25rem",
        border: "1.5px solid #EED8C4",
        boxShadow: "0 4px 14px rgba(102,13,25,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <MapPin size={18} style={{ color: "#660D19" }} />
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.92rem", color: "#333333" }}>
          Check Delivery & COD Availability
        </span>
      </div>

      <form onSubmit={handleCheck} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          style={{
            flex: 1,
            padding: "0.55rem 0.85rem",
            borderRadius: "8px",
            border: "1.5px solid #BAAC9D",
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            outline: "none",
            color: "#000000",
            backgroundColor: "#FBF3E9",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.55rem 1.25rem",
            borderRadius: "8px",
            backgroundColor: "#660D19",
            color: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.85rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Check"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "0.75rem" }}>
          {result.serviceable ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                padding: "0.65rem 0.85rem",
                backgroundColor: "rgba(53,124,73,0.08)",
                borderRadius: "8px",
                border: "1px solid rgba(53,124,73,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#357C49", fontWeight: 700, fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
                <CheckCircle2 size={16} />
                <span>Express Delivery Available!</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#444444", fontSize: "0.8rem", fontFamily: "var(--font-body)" }}>
                <Truck size={14} style={{ color: "#660D19" }} />
                <span>Estimated delivery: <strong>{result.estimatedDays}</strong></span>
              </div>
              <span style={{ fontSize: "0.76rem", color: "#666666", fontFamily: "var(--font-body)" }}>
                ✓ Cash on Delivery (COD) eligible at {pincode}
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.65rem 0.85rem",
                backgroundColor: "rgba(231,111,81,0.08)",
                borderRadius: "8px",
                border: "1px solid rgba(231,111,81,0.25)",
                color: "#E76F51",
                fontFamily: "var(--font-body)",
                fontSize: "0.83rem",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} />
              <span>{result.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
