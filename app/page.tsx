import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestsellersSection from "@/components/home/BestsellersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FestiveSpecials from "@/components/home/FestiveSpecials";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mourika — Handcrafted Deity Dresses, Festive Decor & Shringar",
  description:
    "Shop beautiful handcrafted Bal Gopal dresses, festive home decor, and deity shringar accessories. Trusted by thousands. COD available. Free shipping above ₹499.",
};

function ProductsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "4rem 0" }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ aspectRatio: "4/5" }} />
      ))}
    </div>
  );
}

// Festival banner between sections
function FestivalBanner() {
  const festivalCards = [
    {
      thumbnail: "/products/bandarwar-toran/p1-1.jpg",
      title: "Bandarwar & Toran",
      desc: "Handcrafted door hangings to bless your home",
      cta: "Shop Now",
      href: "/collections/bandarwar-toran",
      gradient: "linear-gradient(135deg, #660D19 0%, #8B1E3F 100%)",
    },
    {
      thumbnail: "/products/table-runner/p1-1.jpg",
      title: "Table Runners",
      desc: "Elegant festive runners for every occasion",
      cta: "Shop Now",
      href: "/collections/table-runner",
      gradient: "linear-gradient(135deg, #CD9703 0%, #B8860B 100%)",
    },
    {
      thumbnail: "/products/karva-chauth-thaali/p1-1.jpeg",
      title: "Karva Chauth Thaali",
      desc: "Beautiful puja thali sets for the auspicious vrat",
      cta: "Shop Now",
      href: "/collections/karva-chauth-thaali",
      gradient: "linear-gradient(135deg, #2E6B47 0%, #3D8B5D 100%)",
    },
  ];

  return (
    <section style={{ padding: "3rem 0", backgroundColor: "var(--color-cream-alt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1.25rem",
          }}
          className="sm:grid-cols-3"
        >
          {festivalCards.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.1rem",
                padding: "1.5rem",
                background: item.gradient,
                borderRadius: "20px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 24px rgba(102,13,25,0.12)",
                minHeight: "125px",
              }}
              className="hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  border: "2.5px solid rgba(255, 255, 255, 0.85)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="68px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-display)", color: "#FFFFFF", fontSize: "1.08rem", margin: "0 0 0.25rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", margin: "0 0 0.65rem", lineHeight: 1.4 }}>
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    backgroundColor: "rgba(255,255,255,0.22)",
                    padding: "0.4rem 0.95rem",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    display: "inline-block",
                    transition: "all 0.2s",
                    letterSpacing: "0.03em",
                  }}
                  className="hover:bg-white hover:text-maroon transition-colors"
                >
                  {item.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Category Grid */}
      <CategoryGrid />

      {/* 4. Festival Banner */}
      <FestivalBanner />

      {/* 4.5 Festive Specials */}
      <FestiveSpecials />

      {/* 5. Bestsellers (server component, fetches from DB) */}
      <Suspense fallback={<ProductsSkeleton />}>
        <BestsellersSection />
      </Suspense>

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. Instagram Strip */}
      <section style={{ padding: "3.5rem 0", backgroundColor: "var(--color-cream-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
              @mourika
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-maroon)", margin: "0.25rem 0 0" }}>
              Follow Our Journey on Instagram 📸
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }} className="sm:grid-cols-6">
            {[
              { src: "/products/bandarwar-toran/p1-1.jpg", alt: "Bandarwar Toran Decor" },
              { src: "/products/table-runner/p1-1.jpg", alt: "Festive Table Runner" },
              { src: "/products/karva-chauth-thaali/p1-1.jpeg", alt: "Karva Chauth Thali Set" },
              { src: "/products/bandarwar-toran/p2-1.jpg", alt: "Artisan Door Hanging" },
              { src: "/products/table-runner/p2-1.jpg", alt: "Silk Brocade Runner" },
              { src: "/products/karva-chauth-thaali/p2-1.jpeg", alt: "Bridal Puja Thali" },
            ].map((img, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 4px 12px rgba(102,13,25,0.08)",
                  cursor: "pointer",
                }}
                className="group hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  style={{ objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(102,13,25,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.25s ease",
                  }}
                  className="group-hover:opacity-100"
                >
                  <span style={{ fontSize: "1.25rem", color: "#FFFFFF" }}>📸</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a
              href="https://instagram.com/mourika"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: "inline-block" }}
            >
              Follow @mourika →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
