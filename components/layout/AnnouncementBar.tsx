"use client";
import { useEffect, useState } from "react";

const announcements = [
  "🎁 Free shipping above ₹499 — Pan India delivery!",
  "🎀 Rakhi delivered before Raksha Bandhan — Order now!",
  "✨ Flat 10% off on prepaid orders — Use code RANG10",
  "💛 Handcrafted with love by Indian artisans 🇮🇳",
  "🛡️ COD Available | Easy Returns | Secure Payments",
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

  return (
    <div
      style={{ backgroundColor: "#8C6239", color: "#FCFBF7" }}
      className="text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide"
    >
      <p
        style={{
          transition: "opacity 0.3s ease",
          opacity: fade ? 1 : 0,
          fontFamily: "var(--font-body, Poppins, sans-serif)",
        }}
      >
        {announcements[current]}
      </p>
    </div>
  );
}
