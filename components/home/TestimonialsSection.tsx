"use client";
const testimonials = [
  { name: "Priya Sharma", city: "Delhi", rating: 5, text: "Absolutely gorgeous! The packaging was so beautiful. The Rakhi quality exceeded my expectations. Will definitely order again!", emoji: "🌸" },
  { name: "Meera Patel", city: "Mumbai", rating: 5, text: "Ordered the Jhumka combo — stunning pieces! Arrived 2 days early and the quality is amazing for the price.", emoji: "💛" },
  { name: "Ananya Gupta", city: "Bangalore", rating: 4, text: "Beautiful designs, fast delivery. The oxidised jhumkas are even better in person. Slightly small but very pretty.", emoji: "✨" },
  { name: "Sunita Verma", city: "Jaipur", rating: 5, text: "Gift hamper was perfect for Rakhi! My bhabhi loved the lumba and I loved the jhumkas that came with it ❤️", emoji: "🎁" },
  { name: "Kavitha R", city: "Chennai", rating: 5, text: "Terracotta earrings are so unique and lightweight! Got so many compliments. Will buy more for gifting.", emoji: "🌺" },
];

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= count ? "#D4A017" : "#E0D0C0", fontSize: "0.9rem" }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        padding: "4rem 0",
        background: "linear-gradient(135deg, #8B1E3F 0%, #6B1630 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mandala bg */}
      <div className="bg-mandala" style={{ position: "absolute", inset: 0, opacity: 0.04 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: "0.5rem" }}>
            Real Reviews
          </p>
          <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#FFF8F0", margin: 0 }}>
            10,000+ Happy Customers
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "#FFF8F099", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Don&apos;t take our word for it — here&apos;s what our family says
          </p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "1rem" }}
          className="sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.name}
              style={{
                backgroundColor: "rgba(255,248,240,0.08)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: "1rem",
                padding: "1.5rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,248,240,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.5)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,248,240,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.25)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#D4A01730", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                    {t.emoji}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "#FFF8F0", fontSize: "0.875rem", margin: 0 }}>
                      {t.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#FFF8F066", margin: 0 }}>
                      {t.city}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#2D6A4F", backgroundColor: "#E8F5EE", padding: "0.2rem 0.5rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  ✓ Verified
                </span>
              </div>
              <StarRow count={t.rating} />
              <p style={{ fontFamily: "var(--font-body)", color: "#FFF8F0cc", fontSize: "0.875rem", lineHeight: 1.6, marginTop: "0.75rem" }}>
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "10,000+", label: "Happy Customers" },
            { value: "98%", label: "Positive Reviews" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "2rem", color: "#D4A017", margin: 0 }}>
                {value}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#FFF8F099", margin: 0 }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
