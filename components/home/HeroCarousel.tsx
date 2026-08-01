"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import FestivalCountdown from "@/components/ui/FestivalCountdown";

const slides = [
  {
    id: 1,
    title: "This Festive Season,\nSend Divine Love",
    subtitle: "Exquisitely handcrafted rakhis with pure thread, kundan & premium beads",
    cta: "Shop Rakhi Collection",
    ctaHref: "/collections/rakhi",
    ctaSecondary: "View Combos",
    ctaSecondaryHref: "/collections/festive-products",
    badge: "Special Teej & Rakhi Collection",
    festivalDate: new Date("2026-08-28"),
    festivalName: "Raksha Bandhan",
  },
  {
    id: 2,
    title: "Dress Your Deity\nwith Divine Love",
    subtitle: "Luxe fabrics, pastel hues & woollen warmth — handcrafted for Laddu Gopal",
    cta: "Shop Laddu Gopal Dresses",
    ctaHref: "/collections/laddu-gopal-dresses",
    ctaSecondary: "View Woollen Sets",
    ctaSecondaryHref: "/collections/woollen-dresses",
    badge: "Premium Handcrafted Quality",
    festivalDate: new Date("2026-09-02"),
    festivalName: "Janmashtami",
  },
  {
    id: 3,
    title: "Festival Hampers\nCurated with Care",
    subtitle: "Heritage gift boxes starting at ₹499 — perfect for your loved ones",
    cta: "Shop Gift Hampers",
    ctaHref: "/collections/festive-products",
    ctaSecondary: "View Home Decor",
    ctaSecondaryHref: "/collections/festive-home-decor",
    badge: "🎁 Free Premium Gift Wrapping",
    festivalDate: new Date("2026-11-08"),
    festivalName: "Diwali",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(idx);
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #FBF3E9 0%, #F4E8DB 40%, #FBF3E9 100%)",
        minHeight: "72vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Hero background image — fills right half on desktop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "55%",
          zIndex: 1,
        }}
        className="hidden md:block"
      >
        <Image
          src="/hero-banner.png"
          alt="Festive devotional accessories"
          fill
          sizes="55vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
        {/* Gradient fade from left to merge with text area */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #FBF3E9 0%, rgba(251,243,233,0.65) 35%, transparent 75%)",
          }}
        />
      </div>

      {/* Mobile background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.12,
        }}
        className="md:hidden"
      >
        <Image
          src="/hero-banner.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Mandala bg */}
      <div
        className="bg-mandala"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          zIndex: 2,
        }}
      />

      {/* Gold decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          border: "1.5px solid rgba(205,151,3,0.12)",
          pointerEvents: "none",
          zIndex: 2,
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
          border: "1.5px solid rgba(205,151,3,0.08)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── Carousel Sliding Track ── */}
      <div style={{ position: "relative", zIndex: 5, width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(current * 100) / slides.length}%)`,
            transition: "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              style={{
                width: `${100 / slides.length}%`,
                flexShrink: 0,
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-16">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "2rem",
                    alignItems: "center",
                  }}
                  className="md:grid-cols-2"
                >
                  {/* Left Text Block — Fixed min-height to prevent jumping */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "360px",
                    }}
                  >
                    {/* Badge */}
                    <div style={{ minHeight: "32px", marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: "rgba(102,13,25,0.08)",
                          border: "1px solid rgba(102,13,25,0.15)",
                          borderRadius: "9999px",
                          padding: "0.35rem 0.85rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--color-maroon)",
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          {slide.badge}
                        </span>
                      </div>
                    </div>

                    {/* Title — Fixed line-height and height allocation */}
                    <h1
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2rem, 4vw, 3.15rem)",
                        color: "var(--color-maroon)",
                        lineHeight: 1.18,
                        marginBottom: "1rem",
                        whiteSpace: "pre-line",
                        fontWeight: 700,
                        minHeight: "7rem",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                        color: "var(--color-muted)",
                        marginBottom: "1.75rem",
                        maxWidth: 460,
                        lineHeight: 1.6,
                        minHeight: "3.2rem",
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                      <Link
                        href={slide.ctaHref}
                        id={`hero-cta-${slide.id}`}
                        className="btn-primary ripple"
                      >
                        {slide.cta} →
                      </Link>
                      <Link
                        href={slide.ctaSecondaryHref}
                        className="btn-secondary"
                      >
                        {slide.ctaSecondary}
                      </Link>
                    </div>

                    {/* Trust Badges */}
                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                      {["COD Available", "Easy Exchange", "Handcrafted Quality"].map((trust) => (
                        <span
                          key={trust}
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-muted)",
                            fontFamily: "var(--font-body)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ color: "var(--color-green)" }}>✓</span> {trust}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Countdown — Locked vertical position on desktop */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "360px",
                    }}
                    className="hidden md:flex"
                  >
                    <FestivalCountdown targetDate={slide.festivalDate} name={slide.festivalName} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.45rem",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? 26 : 8,
              height: 8,
              borderRadius: "9999px",
              backgroundColor:
                i === current ? "var(--color-maroon)" : "rgba(102,13,25,0.22)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.35s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
