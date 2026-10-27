"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShieldCheck, Sparkles, Moon, Flame } from "lucide-react";
import FestivalCountdown from "@/components/ui/FestivalCountdown";

const slides = [
  {
    id: 1,
    title: "Welcome Lakshmi Home with\nHandcrafted Bandarwar",
    subtitle: "Over 17+ artisan-crafted entrance Torans & door hangings with gota patti and auspicious bells to bless your entryway.",
    cta: "Shop Bandarwar & Toran",
    ctaHref: "/collections/bandarwar-toran",
    ctaSecondary: "Explore All Decor",
    ctaSecondaryHref: "/collections/all",
    badge: "Bestselling Entrance Decor",
    badgeIcon: Sparkles,
    festivalDate: new Date("2026-11-08"),
    festivalName: "Diwali Mahotsav",
    spotlight: {
      title: "Traditional Marigold & Gota Patti Bandarwar",
      category: "Door Hanging",
      price: 349,
      mrp: 499,
      rating: 4.9,
      reviews: 58,
      image: "/products/bandarwar-toran/p1-1.jpg",
      href: "/collections/bandarwar-toran",
      tag: "Top Rated #1",
    },
  },
  {
    id: 2,
    title: "Sacred Karwa Chauth\nHandcrafted Puja Thalis",
    subtitle: "Exquisite velvet, kundan & meenakari thali sets crafted for the auspicious ritual. Each set curated for timeless blessings.",
    cta: "Shop Karwa Chauth Thalis",
    ctaHref: "/collections/karva-chauth-thaali",
    ctaSecondary: "Explore Festive Edits",
    ctaSecondaryHref: "/collections/all",
    badge: "Karwa Chauth Vrat Special",
    badgeIcon: Moon,
    festivalDate: new Date("2026-11-01"),
    festivalName: "Karwa Chauth",
    spotlight: {
      title: "Shringaar Velvet Embroidered Thali Set",
      category: "Puja Thali Set",
      price: 699,
      mrp: 999,
      rating: 5.0,
      reviews: 42,
      image: "/products/karva-chauth-thaali/p1-1.jpeg",
      href: "/collections/karva-chauth-thaali",
      tag: "Vrat Essential",
    },
  },
  {
    id: 3,
    title: "Royal Festive Dining\nLuxury Table Runners",
    subtitle: "Opulent velvet, silk brocade & hand-embroidered table runners tailored to turn festive dining into a grand royal feast.",
    cta: "Shop Table Runners",
    ctaHref: "/collections/table-runner",
    ctaSecondary: "View Collections",
    ctaSecondaryHref: "/collections/all",
    badge: "Festive Living Elegance",
    badgeIcon: Flame,
    festivalDate: new Date("2026-11-08"),
    festivalName: "Diwali Deepawali",
    spotlight: {
      title: "Royal Velvet & Gold Zari Table Runner",
      category: "Festive Centerpiece",
      price: 399,
      mrp: 599,
      rating: 4.8,
      reviews: 35,
      image: "/products/table-runner/p1-1.jpg",
      href: "/collections/table-runner",
      tag: "Trending Decor",
    },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#FDF7F0",
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Divine Atmospheric Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <Image
          src="/hero-festive-bg.jpg"
          alt="Festive Sanctuary"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 38%",
          }}
        />
        {/* Warm creamy gradient overlay: softly fades on the left for maximum readability while showing glowing sanctuary on the right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(253,247,240,0.96) 0%, rgba(253,247,240,0.92) 42%, rgba(253,247,240,0.65) 72%, rgba(253,247,240,0.3) 100%)",
          }}
          className="hidden md:block"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(253,247,240,0.92)",
          }}
          className="md:hidden"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-14 relative z-10">
        <div
          style={{
            display: "grid",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <div className="lg:col-span-7">
            {/* Seasonal Badge with Luxury Icon */}
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  backgroundColor: "rgba(102,13,25,0.08)",
                  border: "1px solid rgba(102,13,25,0.18)",
                  borderRadius: "9999px",
                  padding: "0.35rem 0.95rem",
                  boxShadow: "0 2px 8px rgba(102,13,25,0.04)",
                }}
              >
                <BadgeIcon size={14} style={{ color: "var(--color-gold)" }} />
                <span
                  style={{
                    fontSize: "0.74rem",
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

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4.2vw, 3.25rem)",
                color: "var(--color-maroon)",
                lineHeight: 1.18,
                marginBottom: "1.1rem",
                whiteSpace: "pre-line",
                fontWeight: 700,
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.92rem, 1.8vw, 1.05rem)",
                color: "var(--color-muted)",
                marginBottom: "1.75rem",
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
              <Link
                href={slide.ctaHref}
                id={`hero-cta-${slide.id}`}
                className="btn-primary"
                style={{
                  boxShadow: "0 6px 20px rgba(102,13,25,0.22)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {slide.cta} →
              </Link>
              <Link
                href={slide.ctaSecondaryHref}
                className="btn-secondary"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(186,172,157,0.5)",
                }}
              >
                {slide.ctaSecondary}
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
              {[
                "100% Handcrafted by Artisans",
                "COD Available",
                "Free Shipping Above ₹499",
              ].map((trust) => (
                <span
                  key={trust}
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-body)",
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={15} style={{ color: "var(--color-green)" }} />
                  {trust}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Live Product Spotlight Card + Real Festive Countdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-5">
            {/* Spotlight Card */}
            <Link
              href={slide.spotlight.href}
              style={{
                textDecoration: "none",
                display: "block",
                width: "100%",
                maxWidth: "380px",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "22px",
                  padding: "1rem",
                  boxShadow: "0 14px 40px rgba(102,13,25,0.14)",
                  border: "1.5px solid rgba(205,151,3,0.35)",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Floating Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: "1.6rem",
                    left: "1.6rem",
                    zIndex: 10,
                    backgroundColor: "var(--color-maroon)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(102,13,25,0.3)",
                    textTransform: "uppercase",
                  }}
                >
                  {slide.spotlight.tag}
                </div>

                {/* Product Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "230px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#FBF3E9",
                    marginBottom: "0.85rem",
                  }}
                >
                  <Image
                    src={slide.spotlight.image}
                    alt={slide.spotlight.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>

                {/* Product Info */}
                <div style={{ padding: "0 0.35rem 0.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-gold-dark)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {slide.spotlight.category}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#B8860B", fontSize: "0.75rem", fontWeight: 700 }}>
                      <Star size={13} fill="#CD9703" stroke="none" />
                      <span>{slide.spotlight.rating} ({slide.spotlight.reviews})</span>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.02rem",
                      color: "var(--color-maroon)",
                      fontWeight: 700,
                      margin: "0 0 0.5rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {slide.spotlight.title}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.45rem" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-maroon)" }}>
                        ₹{slide.spotlight.price}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#999", textDecoration: "line-through" }}>
                        ₹{slide.spotlight.mrp}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--color-green)", fontWeight: 700 }}>
                        {Math.round(((slide.spotlight.mrp - slide.spotlight.price) / slide.spotlight.mrp) * 100)}% OFF
                      </span>
                    </div>

                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-maroon)", fontWeight: 700 }}>
                      Quick View →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Countdown to Next Active Festival */}
            <div style={{ width: "100%", maxWidth: "380px" }}>
              <FestivalCountdown targetDate={slide.festivalDate} name={slide.festivalName} />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Dot Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.5rem",
          zIndex: 20,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? 28 : 9,
              height: 9,
              borderRadius: "9999px",
              backgroundColor:
                i === current ? "var(--color-maroon)" : "rgba(102,13,25,0.25)",
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
