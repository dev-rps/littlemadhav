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
    { label: "My Orders 📦", href: "/my-orders" },
    { label: "My Wishlist ❤️", href: "/wishlist" },
    { label: "Shipping & Delivery", href: "/shipping" },
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
        backgroundColor: "#1a0a0e",
        color: "#FCFBF7",
        borderTop: "3px solid var(--color-gold)",
      }}
    >
      {/* Trust Strip */}
      <div style={{ backgroundColor: "var(--color-maroon)", padding: "0.75rem 0" }}>
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
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  color: "rgba(255,255,255,0.9)",
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
                  background: "linear-gradient(135deg, var(--color-maroon), var(--color-gold))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FCFBF7",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                }}
              >
                M
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  color: "var(--color-gold)",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Mourika
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#ccc", lineHeight: 1.6, fontFamily: "var(--font-body)", marginBottom: "1rem" }}>
              Bringing you the finest handcrafted Deity dresses, home decor, and festive shringar accessories. Made with love by Indian artisans.
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)", marginBottom: "0.25rem" }}>
              GSTIN: 07AABCU9603R1ZX
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)" }}>
              📞 +91 98765 43210
            </p>
            <p style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "var(--font-body)" }}>
              ✉️ hello@mourika.com
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              {[
                { Icon: Share2, href: "https://instagram.com/mourika", label: "Instagram" },
                { Icon: Globe, href: "https://facebook.com/mourika", label: "Facebook" },
                { Icon: Play, href: "https://youtube.com/@mourika", label: "YouTube" },
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
                    border: "1px solid rgba(205,151,3,0.35)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-gold)",
                    transition: "all 0.2s",
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-gold)";
                    (e.currentTarget as HTMLElement).style.color = "#1a0a0e";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-gold)";
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
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  color: "var(--color-gold)",
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
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-gold)"; }}
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
            marginTop: "2.5rem",
            padding: "1.5rem",
            border: "1px solid rgba(205,151,3,0.2)",
            borderRadius: "18px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            background: "linear-gradient(135deg, rgba(102,13,25,0.3) 0%, rgba(205,151,3,0.08) 100%)",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontSize: "1.1rem", fontWeight: 700 }}>
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
                borderRadius: "var(--radius-btn)",
                border: "1px solid rgba(205,151,3,0.3)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#FCFBF7",
                fontSize: "0.85rem",
                fontFamily: "var(--font-body)",
                outline: "none",
                minWidth: 200,
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                backgroundColor: "var(--color-gold)",
                color: "#1a0a0e",
                padding: "0.625rem 1.25rem",
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
            borderTop: "1px solid rgba(205,151,3,0.12)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#666", fontFamily: "var(--font-body)" }}>
             © {new Date().getFullYear()} Mourika. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["UPI", "Cards", "Net Banking", "COD", "Wallets"].map((pm) => (
              <span
                key={pm}
                style={{
                  padding: "0.2rem 0.5rem",
                  border: "1px solid rgba(205,151,3,0.2)",
                  borderRadius: "6px",
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
