import Link from "next/link";
import { Sparkles, Heart, Users, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Our Story | Mourika",
  description: "Learn about Mourika, our founder's journey, and how we collaborate with local Indian artisans to create handcrafted deity dresses and festive accessories.",
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#FFF8F0", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #8B1E3F 0%, #6B1630 100%)",
          color: "#FFF8F0",
          padding: "5rem 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="bg-mandala" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "#D4A017",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Rooted in Tradition
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Yeseva One', serif)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Handcrafted with Love,<br />Celebrating Every Bond
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#FFF8F0cc",
              marginTop: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            At Mourika, we weave color, culture, and craftsmanship into beautiful deity dresses and accessories that bring Indian festivals to life.
          </p>
        </div>
      </section>

      {/* Our Story / Founder Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="grid-cols-1 lg:grid-cols-2">
          {/* Text Content */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "#D4A017",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 600,
              }}
            >
              How We Began
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display, 'Yeseva One', serif)",
                fontSize: "2.25rem",
                color: "#8B1E3F",
                margin: "0.5rem 0 1.5rem",
              }}
            >
              The Story of Mourika
            </h2>
            <div
              style={{
                fontFamily: "var(--font-body)",
                color: "#555",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <p>
                Mourika was born out of a simple desire: to bring back the warm, slow, and personal feel of Indian festivals. In an era of mass-produced plastic gifts, our founder set out to rediscover the magic of handmade goods.
              </p>
              <p>
                She traveled through the heartlands of Rajasthan, Gujarat, and West Bengal, meeting home artisans who had kept ancestral crafting techniques alive. What started as a small passion project has today bloomed into a beloved festive brand trusted by families across India.
              </p>
              <p>
                Every stitch in our Laddu Gopal dresses, every bead in our deity shringar sets, and every handcrafted piece of festive home decor tells a story of heritage, love, and fine craftsmanship.
              </p>
            </div>
          </div>

          {/* Decorative Visual Block */}
          <div
            style={{
              backgroundColor: "#FFFBF5",
              border: "2px solid #F0E0C0",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              boxShadow: "0 10px 30px rgba(139,30,63,0.05)",
              position: "relative",
            }}
          >
            <div
              className="bg-mandala"
              style={{ position: "absolute", inset: 0, opacity: 0.1, borderRadius: "1.5rem" }}
            />
            <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
              <h3
                style={{
                  fontFamily: "var(--font-display, 'Yeseva One', serif)",
                  color: "#8B1E3F",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                Our Promise
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#555",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  margin: "0 auto",
                  maxWidth: 380,
                }}
              >
                &ldquo;We promise to never sell generic, machine-stamped accessories. Every piece from Mourika is touched by human hands, checked with care, and packed in eco-friendly gift drawers to reach you safely.&rdquo;
              </p>
              <div
                style={{
                  display: "inline-block",
                  borderBottom: "2px solid #D4A017",
                  paddingBottom: "0.5rem",
                  marginTop: "1.5rem",
                  color: "#8B1E3F",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                — Meera Sharma, Founder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Strip */}
      <section style={{ backgroundColor: "#FFFBF5", borderTop: "1px solid #F0E0C0", borderBottom: "1px solid #F0E0C0", padding: "5rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>What Guides Us</span>
            <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "2.25rem", color: "#8B1E3F", marginTop: "0.5rem" }}>Our Pillars of Trust</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "2rem" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Sparkles size={28} style={{ color: "#D4A017" }} />,
                title: "100% Handcrafted",
                desc: "No machines, no stamps. Just pure, ancient craftsmanship passing through the hands of expert artisans.",
              },
              {
                icon: <Heart size={28} style={{ color: "#8B1E3F" }} />,
                title: "Made with Love",
                desc: "Every Rakhi is tied with blessings, and every earring is crafted to celebrate your festive sparkle.",
              },
              {
                icon: <Users size={28} style={{ color: "#2D6A4F" }} />,
                title: "Artisan First",
                desc: "We support local home-makers and micro-artisans, paying fair wages and preserving rural Indian arts.",
              },
              {
                icon: <ShieldCheck size={28} style={{ color: "#E76F51" }} />,
                title: "Sustainably Packed",
                desc: "We prioritize cotton pouches, reuseable boxes, and minimize plastic use in our shipping boxes.",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFF8F0",
                  border: "1.5px solid #F0E0C0",
                  borderRadius: "1rem",
                  padding: "1.75rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                className="hover:border-gold hover:shadow-card"
              >
                <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", backgroundColor: "#FFFBF5", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "inset 0 0 10px rgba(212,160,23,0.1)" }}>
                  {pillar.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.1rem", color: "#1a1a1a", margin: "0 0 0.5rem" }}>{pillar.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#666", lineHeight: 1.6, margin: 0 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empowering Artisans Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="grid-cols-1 lg:grid-cols-2">
          {/* Visual Block (Left on large screen) */}
          <div
            style={{
              backgroundColor: "#E8F5EE",
              border: "1.5px solid #C3E5D0",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              textAlign: "center",
              position: "relative",
            }}
            className="order-last lg:order-first"
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🇮🇳</div>
            <h3
              style={{
                fontFamily: "var(--font-display, 'Yeseva One', serif)",
                color: "#2D6A4F",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Supporting 50+ Rural Artisans
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "#3F5E4E",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                margin: "0 auto",
                maxWidth: 380,
              }}
            >
              Our festive accessories are created in collaboration with self-help groups and homemakers in rural towns. This provides them with sustainable, work-from-home income, helping support their kids&apos; education.
            </p>
          </div>

          {/* Text Content */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "#2D6A4F",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 600,
              }}
            >
              Social Impact
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display, 'Yeseva One', serif)",
                fontSize: "2.25rem",
                color: "#8B1E3F",
                margin: "0.5rem 0 1.5rem",
              }}
            >
              Empowering Women, Preserving Heritage
            </h2>
            <div
              style={{
                fontFamily: "var(--font-body)",
                color: "#555",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <p>
                At Mourika, we believe that real beauty lies in empowerment. Over 80% of our craftsmen are actually homemakers in villages who weave these intricate pieces in their free time.
              </p>
              <p>
                By working with Mourika, these talented women earn direct income, giving them financial independence while maintaining their home lives.
              </p>
              <p>
                When you buy a Mourika piece, you aren&apos;t just buying a festive accessory; you are actively funding a dream, supporting a local family, and keeping traditional Indian craftsmanship alive for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section
        style={{
          margin: "0 1rem",
          padding: "4rem 2rem",
          background: "linear-gradient(135deg, #8B1E3F 0%, #6B1630 100%)",
          borderRadius: "1.5rem",
          textAlign: "center",
          color: "#FFF8F0",
          position: "relative",
          overflow: "hidden",
        }}
        className="max-w-5xl mx-auto hover:shadow-card transition-all duration-300"
      >
        <div className="bg-mandala" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div style={{ position: "relative", zIndex: 10 }}>
          <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "2.25rem", color: "#D4A017", margin: "0 0 1rem" }}>Bring Home the Festive Sparkle</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#FFF8F0cc", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Explore our collection of handcrafted Rakhis, Kundan earrings, and festive gift boxes.
          </p>
          <Link
            href="/collections/all"
            className="inline-block px-9 py-3.5 bg-gold hover:bg-gold-light text-[#1a0a0e] rounded-[10px] font-bold text-[0.95rem] no-underline shadow-[0_4px_20px_rgba(212,160,23,0.3)] transition-all duration-200"
          >
            Explore the Shop →
          </Link>
        </div>
      </section>
    </div>
  );
}
