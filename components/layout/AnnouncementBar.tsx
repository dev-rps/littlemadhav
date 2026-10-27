"use client";
import { useEffect, useState } from "react";
import { Gift, Sparkles, Tag, Heart, ShieldCheck } from "lucide-react";

const announcements = [
  { Icon: Gift, text: "Free shipping above ₹499 — Pan India express delivery!" },
  { Icon: Sparkles, text: "Handcrafted Bandarwar, Table Runners & Karwa Chauth Sets — Order now!" },
  { Icon: Tag, text: "Flat 15% off on your first order — Use code MOURIKA15" },
  { Icon: Heart, text: "100% Handcrafted with devotion by Indian heritage artisans" },
  { Icon: ShieldCheck, text: "COD Available | Easy 7-Day Returns | Secure Payments" },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % announcements.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = announcements[current].Icon;

  return (
    <div
      style={{ backgroundColor: "var(--color-maroon)", color: "var(--color-white)" }}
      className="text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide"
    >
      <p
        style={{
          transition: "opacity 0.3s ease",
          opacity: fade ? 1 : 0,
          fontFamily: "var(--font-body)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.45rem",
          margin: 0,
        }}
      >
        <CurrentIcon size={14} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
        <span>{announcements[current].text}</span>
      </p>
    </div>
  );
}
