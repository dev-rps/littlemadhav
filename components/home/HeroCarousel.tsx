"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FestivalCountdown from "@/components/ui/FestivalCountdown";

const slides = [
  {
    id: 1,
    title: "This Festive Season,\nSend Divine Love",
    subtitle: "Exquisitely handcrafted with pure thread, kundan & premium beads",
    cta: "Shop Rakhi Collection",
    ctaHref: "/collections/rakhi",
    ctaSecondary: "View Combos",
    ctaSecondaryHref: "/collections/combos",
    badge: "Special Teej & Rakhi Collection",
    gradient: "linear-gradient(135deg, #FFFDF9 0%, #FAF7F2 60%, #F2EAE0 100%)",
    accent: "#8C6239",
    emoji: "🎀",
    festivalDate: new Date("2026-08-28"),
    festivalName: "Raksha Bandhan",
  },
  {
    id: 2,
    title: "Jhumkas That\nSpeak Your Soul",
    subtitle: "Oxidised · Kundan · Pearl · Terracotta — styled to make celebrations divine",
    cta: "Explore Jhumkas",
    ctaHref: "/collections/jhumka",
    ctaSecondary: "Under ₹299",
    ctaSecondaryHref: "/collections/jhumka?filter=budget",
    badge: "Premium Handcrafted Quality",
    gradient: "linear-gradient(135deg, #FCFBF7 0%, #F7F2E6 60%, #FFFDF9 100%)",
    accent: "#8C6239",
    emoji: "✨",
    festivalDate: new Date("2026-10-12"),
    festivalName: "Navratri",
  },
  {
    id: 3,
    title: "Festival Hampers\nCurated with Care",
    subtitle: "Heritage gift boxes starting at ₹499 — perfect for your loved ones",
    cta: "Shop Gift Hampers",
    ctaHref: "/collections/gifting",
    ctaSecondary: "View Combos",
    ctaSecondaryHref: "/collections/combos",
    badge: "🎁 Free Premium Gift Wrapping",
    gradient: "linear-gradient(135deg, #FFFDF9 0%, #F2EFE8 60%, #FAF7F2 100%)",
    accent: "#C5A059",
    emoji: "🪔",
    festivalDate: new Date("2026-11-08"),
    festivalName: "Diwali",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [current]);

  const slide = slides[current];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: slide.gradient,
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        transition: "background 0.6s ease",
        borderBottom: "1px solid #EFEAE0",
      }}
    >
      {/* Mandala bg */}
      <div
        className="bg-mandala"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
        }}
      />

      {/* Gold decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          border: "1.5px solid rgba(197,160,89,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-8%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          border: "1.5px solid rgba(140,98,57,0.1)",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full"
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            alignItems: "center",
          }}
          className="md:grid-cols-2"
        >
          {/* Left: Text */}
          <div style={{ padding: "3rem 0", zIndex: 5 }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(197,160,89,0.1)",
                border: "1px solid rgba(197,160,89,0.25)",
                borderRadius: "9999px",
                padding: "0.3rem 0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <span style={{ fontSize: "0.72rem", color: "#8C6239", fontFamily: "var(--font-body, Jost, sans-serif)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {slide.badge}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-display, Cinzel, serif)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                color: "#8C6239",
                lineHeight: 1.2,
                marginBottom: "1rem",
                whiteSpace: "pre-line",
                fontWeight: 500,
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-body, Jost, sans-serif)",
                fontSize: "clamp(0.85rem, 1.8vw, 0.98rem)",
                color: "#555",
                marginBottom: "2rem",
                maxWidth: 460,
                lineHeight: 1.5,
              }}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href={slide.ctaHref}
                id={`hero-cta-${slide.id}`}
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.75rem",
                  backgroundColor: "#8C6239",
                  color: "#FCFBF7",
                  borderRadius: "0.25rem",
                  fontFamily: "var(--font-body, Jost, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 14px rgba(140,98,57,0.18)",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#734e2c";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#8C6239";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {slide.cta} →
              </Link>
              <Link
                href={slide.ctaSecondaryHref}
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "#8C6239",
                  border: "1.5px solid #8C6239",
                  borderRadius: "0.25rem",
                  fontFamily: "var(--font-body, Jost, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: "all 0.25s ease",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(140,98,57,0.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {slide.ctaSecondary}
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "2rem" }}>
              {["COD Available", "Easy Exchange Only", "Premium Quality"].map((trust) => (
                <span
                  key={trust}
                  style={{
                    fontSize: "0.72rem",
                    color: "#888",
                    fontFamily: "var(--font-body, Jost, sans-serif)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontWeight: 500,
                  }}
                >
                  ✓ {trust}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Countdown + Emoji */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "2rem 0",
              zIndex: 5,
            }}
            className="hidden md:flex"
          >
            <div style={{ fontSize: "7rem", lineHeight: 1, userSelect: "none", filter: "drop-shadow(0 10px 20px rgba(140,98,57,0.15))" }}>
              {slide.emoji}
            </div>
            <FestivalCountdown targetDate={slide.festivalDate} name={slide.festivalName} />
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {[
        { onClick: prev, side: "left", icon: <ChevronLeft size={18} />, id: "hero-prev" },
        { onClick: next, side: "right", icon: <ChevronRight size={18} />, id: "hero-next" },
      ].map(({ onClick, side, icon, id }) => (
        <button
          key={side}
          id={id}
          onClick={onClick}
          aria-label={`${side === "left" ? "Previous" : "Next"} slide`}
          style={{
            position: "absolute",
            top: "50%",
            [side]: "1.25rem",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,253,249,0.75)",
            border: "1px solid rgba(140,98,57,0.25)",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8C6239",
            cursor: "pointer",
            transition: "all 0.25s",
            boxShadow: "0 2px 10px rgba(140,98,57,0.06)",
            zIndex: 10,
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2";
            (e.currentTarget as HTMLElement).style.borderColor = "#8C6239";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,253,249,0.75)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,98,57,0.25)";
          }}
        >
          {icon}
        </button>
      ))}

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.4rem",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? 18 : 6,
              height: 6,
              borderRadius: "9999px",
              backgroundColor: i === current ? "#8C6239" : "rgba(140,98,57,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
