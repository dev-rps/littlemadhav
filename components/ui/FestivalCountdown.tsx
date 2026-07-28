"use client";
import { useState, useEffect } from "react";

interface Props {
  targetDate: Date;
  name: string;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function FestivalCountdown({ targetDate, name }: Props) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(targetDate));
    const timer = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.25rem 1.5rem",
        backgroundColor: "rgba(251,243,233,0.85)",
        borderRadius: "1rem",
        border: "1px solid rgba(213,173,54,0.4)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(102,13,25,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.72rem",
          color: "var(--color-maroon)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: "0.75rem",
          fontWeight: 700,
        }}
      >
        {name} in
      </p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
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
                fontSize: "1.75rem",
                color: "var(--color-maroon)",
                lineHeight: 1.1,
                minWidth: 44,
                backgroundColor: "var(--color-white)",
                border: "1px solid rgba(186,172,157,0.3)",
                borderRadius: "0.375rem",
                padding: "0.5rem 0.35rem",
                marginBottom: "0.25rem",
                boxShadow: "0 2px 6px rgba(102, 13, 25, 0.05)",
                fontWeight: 700,
              }}
            >
              {mounted ? String(value).padStart(2, "0") : "00"}
            </div>
            <span
              style={{
                fontSize: "0.62rem",
                color: "#888",
                fontFamily: "var(--font-body, Jost, sans-serif)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
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
