"use client";
import { useState, useEffect } from "react";

interface Props {
  targetDate: Date;
  name: string;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

export default function FestivalCountdown({ targetDate, name }: Props) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(targetDate));
    const timer = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "1rem 1.5rem",
          backgroundColor: "rgba(251,243,233,0.85)",
          borderRadius: "1rem",
          border: "1px solid rgba(213,173,54,0.4)",
          minWidth: 260,
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--color-maroon)", fontWeight: 600 }}>Loading Festive Countdown...</span>
      </div>
    );
  }

  // Graceful active state if festival date has arrived or passed
  if (time.isPast) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "1rem 1.4rem",
          backgroundColor: "rgba(251,243,233,0.92)",
          borderRadius: "1rem",
          border: "1.5px solid rgba(213,173,54,0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 20px rgba(102,13,25,0.08)",
          maxWidth: 320,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-maroon)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>✨</span> {name} Season Is Live
        </div>
        <p style={{ margin: "0.35rem 0 0", fontSize: "0.75rem", color: "var(--color-muted)", fontFamily: "var(--font-body)" }}>
          Festive dispatch active • Same-day dispatch on prepaid orders
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.1rem 1.4rem",
        backgroundColor: "rgba(251,243,233,0.92)",
        borderRadius: "1rem",
        border: "1px solid rgba(213,173,54,0.45)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(102,13,25,0.08)",
        maxWidth: 340,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.72rem",
          color: "var(--color-maroon)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: "0.65rem",
          fontWeight: 700,
        }}
      >
        {name} in
      </p>
      <div style={{ display: "flex", gap: "0.45rem", justifyContent: "center" }}>
        {[
          { value: time.days, label: "Days" },
          { value: time.hours, label: "Hrs" },
          { value: time.minutes, label: "Mins" },
          { value: time.seconds, label: "Secs" },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                color: "var(--color-maroon)",
                lineHeight: 1.1,
                minWidth: 42,
                backgroundColor: "var(--color-white)",
                border: "1px solid rgba(186,172,157,0.35)",
                borderRadius: "0.375rem",
                padding: "0.45rem 0.3rem",
                marginBottom: "0.2rem",
                boxShadow: "0 2px 6px rgba(102, 13, 25, 0.05)",
                fontWeight: 700,
              }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <span
              style={{
                fontSize: "0.6rem",
                color: "#777",
                fontFamily: "var(--font-body, Jost, sans-serif)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
