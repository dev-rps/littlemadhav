"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, Loader2, RefreshCw } from "lucide-react";

interface Activity {
  date: string;
  status: string;
  location: string;
}

interface TrackingData {
  status: string;
  courierName?: string;
  trackUrl?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  deliveredDate?: string;
  activities?: Activity[];
}

interface OrderTrackerProps {
  orderNumber: string;
  awbCode?: string | null;
}

export default function OrderTracker({ orderNumber, awbCode }: OrderTrackerProps) {
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = awbCode
        ? `/api/shipping/track?awb=${awbCode}&orderNumber=${orderNumber}`
        : `/api/shipping/track?orderNumber=${orderNumber}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.tracking) {
        setTracking(data.tracking);
      } else {
        setError(data.message || "Tracking details unavailable.");
      }
    } catch {
      setError("Failed to fetch order tracking status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber || awbCode) {
      fetchTracking();
    }
  }, [orderNumber, awbCode]);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EED8C4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Loader2 size={28} className="animate-spin" style={{ color: "#660D19" }} />
        <span style={{ fontFamily: "var(--font-body)", color: "#8B7D6B", fontSize: "0.9rem" }}>
          Connecting to Shiprocket tracking network...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1.25rem",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EED8C4",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#BAAC9D", margin: "0 0 0.5rem" }}>
          {error}
        </p>
        <button
          onClick={fetchTracking}
          style={{
            padding: "0.4rem 0.85rem",
            borderRadius: "6px",
            backgroundColor: "#F4E8DB",
            border: "1px solid #BAAC9D",
            color: "#660D19",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <RefreshCw size={14} /> Refresh Status
        </button>
      </div>
    );
  }

  const currentStatus = (tracking?.status || "Placed").toLowerCase();

  // Define tracking steps
  const steps = [
    { title: "Order Placed", key: "placed", icon: Package },
    { title: "Picked Up", key: "pickup", icon: Clock },
    { title: "In Transit", key: "transit", icon: Truck },
    { title: "Out for Delivery", key: "out", icon: MapPin },
    { title: "Delivered", key: "delivered", icon: CheckCircle2 },
  ];

  const getActiveIndex = () => {
    if (currentStatus.includes("deliver")) return 4;
    if (currentStatus.includes("out for delivery")) return 3;
    if (currentStatus.includes("transit") || currentStatus.includes("shipped")) return 2;
    if (currentStatus.includes("pick") || currentStatus.includes("manifest")) return 1;
    return 0; // Placed
  };

  const activeIdx = getActiveIndex();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "1.5rem",
        border: "1.5px solid #EED8C4",
        boxShadow: "0 6px 20px rgba(102,13,25,0.05)",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "1rem",
          borderBottom: "1px solid #F4E8DB",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#BAAC9D", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Shipment Status
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 800, color: "#660D19", textTransform: "capitalize" }}>
            {tracking?.status || "Processing"}
          </div>
        </div>

        {awbCode && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#BAAC9D" }}>
              AWB Tracking No.
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 700, color: "#333333" }}>
              {awbCode}
            </div>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div style={{ position: "relative", padding: "0.5rem 0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.25rem", textAlign: "center", position: "relative", zIndex: 2 }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: isDone ? "#660D19" : "#F4E8DB",
                    color: isDone ? "#FFFFFF" : "#BAAC9D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isCurrent ? "3px solid #CD9703" : "none",
                    boxShadow: isCurrent ? "0 0 12px rgba(205,151,3,0.4)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: isDone ? 700 : 500,
                    color: isDone ? "#660D19" : "#8B7D6B",
                    marginTop: "0.5rem",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier & External Track Link */}
      {(tracking?.courierName || tracking?.trackUrl) && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.85rem 1rem",
            backgroundColor: "#FBF3E9",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#333333" }}>
            Carrier: <strong style={{ color: "#660D19" }}>{tracking.courierName || "Shiprocket Delivery Partner"}</strong>
          </div>
          {tracking.trackUrl && (
            <a
              href={tracking.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#660D19",
                textDecoration: "none",
              }}
            >
              Live Carrier Page <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      {/* Activity Timeline list */}
      {tracking?.activities && tracking.activities.length > 0 && (
        <div style={{ marginTop: "1.25rem", borderTop: "1px solid #F4E8DB", paddingTop: "1rem" }}>
          <h4 style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 700, color: "#333333", margin: "0 0 0.75rem" }}>
            Shipment History
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {tracking.activities.map((act, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-body)" }}>
                <div style={{ color: "#CD9703", fontWeight: 700, minWidth: "120px", fontSize: "0.75rem" }}>
                  {act.date}
                </div>
                <div style={{ flex: 1, color: "#333333" }}>
                  <strong>{act.status}</strong> {act.location && `(${act.location})`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
