"use client";
const testimonials = [
  { name: "Priya Sharma", city: "Delhi", rating: 5, text: "The Bandarwar toran is breathtaking! The intricate gota patti and brass bell work make our entrance look so divine for Diwali. Packaging was 10/10.", emoji: "🏮" },
  { name: "Meera Patel", city: "Mumbai", rating: 5, text: "Ordered the velvet Table Runner and Karwa Chauth thali set. Pristine finishing, vibrant colors, and arrived 2 days earlier than promised!", emoji: "✨" },
  { name: "Ananya Gupta", city: "Bangalore", rating: 5, text: "The multi-angle preview images on the website matched the delivered product 100%. Authentic handcrafted Indian artistry. Our guests were mesmerized!", emoji: "🌸" },
  { name: "Sunita Verma", city: "Jaipur", rating: 5, text: "The Karva Chauth thali set with matching chalni and lota was so regal! My family and friends showered compliments on the quality and velvet embroidery ❤️", emoji: "🌙" },
  { name: "Kavitha R", city: "Chennai", rating: 5, text: "Ordered 3 door torans for our housewarming and upcoming festivities. Everyone asked where we got them from. Superb artisanal craftsmanship!", emoji: "🪔" },
];

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= count ? "var(--color-gold)" : "rgba(255,255,255,0.2)", fontSize: "0.9rem" }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        padding: "4.5rem 0",
        background: "linear-gradient(135deg, var(--color-maroon) 0%, var(--color-maroon-dark) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mandala bg */}
      <div className="bg-mandala" style={{ position: "absolute", inset: 0, opacity: 0.04 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.5rem" }}>
            Real Reviews
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#FFF8F0", margin: 0 }}>
            10,000+ Happy Customers
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,248,240,0.6)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
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
                border: "1px solid rgba(205,151,3,0.25)",
                borderRadius: "18px",
                padding: "1.5rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,248,240,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,151,3,0.5)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,248,240,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,151,3,0.25)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #CD9703 0%, #660D19 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      flexShrink: 0,
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "#FFF8F0", fontSize: "0.875rem", margin: 0 }}>
                      {t.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(255,248,240,0.4)", margin: 0 }}>
                      {t.city}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--color-green)", backgroundColor: "rgba(53,124,73,0.15)", padding: "0.2rem 0.5rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  ✓ Verified
                </span>
              </div>
              <StarRow count={t.rating} />
              <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,248,240,0.8)", fontSize: "0.875rem", lineHeight: 1.6, marginTop: "0.75rem" }}>
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
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-gold)", margin: 0 }}>
                {value}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,248,240,0.6)", margin: 0 }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
