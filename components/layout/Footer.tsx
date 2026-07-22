"use client";
import Link from "next/link";
import { Share2, Globe, Play } from "lucide-react";

const footerLinks = {
  "About Us": [
    { label: "Our Story", href: "/about" },
    { label: "Handcrafted with Love", href: "/about#craft" },
    { label: "Artisan Partners", href: "/about#artisans" },
    { label: "Sustainability", href: "/about#sustainability" },
  ],
  "Shop": [
    { label: "Rakhi Collection", href: "/collections/rakhi" },
    { label: "Jhumka Collection", href: "/collections/jhumka" },
    { label: "Combos & Hampers", href: "/collections/combos" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Sale", href: "/collections/sale" },
  ],
  "Support": [
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Track Your Order", href: "/track-order" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1c1815",
        color: "#FCFBF7",
        borderTop: "3px solid #C5A059",
      }}
    >
      {/* Trust Strip */}
      <div style={{ backgroundColor: "#8C6239", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem 2rem" }}>
            {[
              "🤝 10,000+ Happy Customers",
              "🚚 Pan-India Delivery",
              "💵 COD Available",
              "🔄 Easy Returns",
              "🔒 Secure Payments",
            ].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-body, Poppins, sans-serif)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8C6239, #C5A059)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FCFBF7",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                R
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display, Cinzel, serif)",
                  fontSize: "1.25rem",
                  color: "#C5A059",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                RangRiwaaz
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#ccc", lineHeight: 1.6, fontFamily: "var(--font-body)", marginBottom: "1rem" }}>
              Bringing you the finest handcrafted Rakhi, Jhumka, and festive jewellery. Made with love by Indian artisans.
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)", marginBottom: "0.25rem" }}>
              GSTIN: 07AABCU9603R1ZX
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)" }}>
              📞 +91 98765 43210
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)" }}>
              ✉️ hello@rangriwaaz.com
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              {[
                { Icon: Share2, href: "https://instagram.com/rangriwaaz", label: "Instagram" },
                { Icon: Globe, href: "https://facebook.com/rangriwaaz", label: "Facebook" },
                { Icon: Play, href: "https://youtube.com/@rangriwaaz", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid #C5A05960",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C5A059",
                    transition: "all 0.2s",
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#C5A059";
                    (e.currentTarget as HTMLElement).style.color = "#1c1815";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#C5A059";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                style={{
                  fontFamily: "var(--font-body, Jost, sans-serif)",
                  fontWeight: 700,
                  color: "#C5A059",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.82rem",
                        color: "#aaa",
                        fontFamily: "var(--font-body)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "#C5A059"; }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #C5A05930",
            borderRadius: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-display, Cinzel, serif)", color: "#C5A059", fontSize: "1rem" }}>
              Get festive offers in your inbox 🎁
            </p>
            <p style={{ fontSize: "0.8rem", color: "#aaa", fontFamily: "var(--font-body)", marginTop: "0.25rem" }}>
              Subscribe for exclusive discounts, Rakhi reminders & new arrivals.
            </p>
          </div>
          <form
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="footer-newsletter-email"
              type="email"
              placeholder="your@email.com"
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #C5A05950",
                backgroundColor: "#2a211b",
                color: "#FCFBF7",
                fontSize: "0.85rem",
                fontFamily: "var(--font-body)",
                outline: "none",
                minWidth: 200,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.625rem 1.25rem",
                backgroundColor: "#C5A059",
                color: "#1c1815",
                border: "none",
                borderRadius: "0.5rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Payment Icons + Bottom */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid #C5A05920",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#666", fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} RangRiwaaz. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["UPI", "Cards", "Net Banking", "COD", "Wallets"].map((pm) => (
              <span
                key={pm}
                style={{
                  padding: "0.2rem 0.5rem",
                  border: "1px solid #C5A05930",
                  borderRadius: "0.25rem",
                  fontSize: "0.7rem",
                  color: "#888",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
