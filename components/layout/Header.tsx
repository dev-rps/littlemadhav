"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Headphones } from "lucide-react";
import { useCartCount, useCartStore } from "@/lib/store";
import AnnouncementBar from "./AnnouncementBar";

const categories = [
  {
    label: "Devotees Collection",
    slug: "devotees-collection",
    icon: "🌸",
    children: [],
  },
  {
    label: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
    icon: "👗",
    children: [
      { label: "Luxe Dresses", slug: "luxe-dresses" },
      { label: "Soft Pastel Dresses", slug: "soft-pastel-dresses" },
      { label: "Summer Collection", slug: "summer-collection" },
      { label: "Woollen Dresses", slug: "woollen-dresses" },
      { label: "Summer Bedding Set", slug: "summer-bedding-set" },
      { label: "Woollen Bedding Set", slug: "woollen-bedding-set" },
    ],
  },
  {
    label: "Festive Home Decor",
    slug: "festive-home-decor",
    icon: "🪔",
    children: [
      { label: "Torans / Bandhanwal", slug: "torans-bandhanwal" },
      { label: "Decorative Rangoli", slug: "decorative-rangoli" },
      { label: "Shubh Labh", slug: "shubh-labh" },
      { label: "Pooja Thali Cover", slug: "pooja-thali-cover" },
    ],
  },
  {
    label: "Festive Products",
    slug: "festive-products",
    icon: "🪅",
    children: [
      { label: "Janmashtami", slug: "janmashtami" },
      { label: "Rakhi", slug: "rakhi" },
      { label: "Karwa Chauth", slug: "karwa-chauth" },
      { label: "Navratri", slug: "navratri" },
      { label: "Diwali", slug: "diwali" },
    ],
  },
  {
    label: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    icon: "👑",
    children: [
      { label: "Hairs", slug: "hairs" },
      { label: "Earrings", slug: "earrings" },
      { label: "Kangan", slug: "kangan" },
      { label: "Necklace / Haar", slug: "necklace-haar" },
      { label: "Bansuri", slug: "bansuri" },
      { label: "Kamar Band", slug: "kamar-band" },
      { label: "Attar / Ittar", slug: "attar-ittar" },
      { label: "Bathtub", slug: "bathtub" },
    ],
  },
  { label: "Upcoming Festival", slug: "upcoming", icon: "🎉", children: [] },
];

export default function Header() {
  const cartCount = useCartCount();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      <AnnouncementBar />

      <header
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.98)" : "#FFFFFF",
          borderBottom: "2px solid var(--color-gold)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: scrolled ? "0 4px 20px rgba(102,13,25,0.08)" : "none",
        }}
      >
        {/* ── Main Navbar Row (Logo & Icons) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 relative">
            {/* Left: Mobile Hamburger Toggle (hidden on Desktop) */}
            <div className="flex items-center lg:hidden z-10">
              <button
                id="header-mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ color: "var(--color-maroon)" }}
                className="p-2 -ml-2 rounded-lg hover:bg-orange-50 transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Logo (Centered on mobile, left-aligned on desktop) */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Mourika Home">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="var(--color-gold)" opacity="0.15" />
                  <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.7909 8 12 8Z" stroke="var(--color-gold)" strokeWidth="1.5" />
                  <path d="M12 3V5M12 19V21" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    color: "var(--color-maroon)",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Mourika
                </span>
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-end z-10">
              {/* Support — desktop only */}
              <Link
                href="/contact"
                style={{ color: "var(--color-maroon)", textDecoration: "none" }}
                className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                aria-label="Customer support"
              >
                <Headphones size={17} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "var(--color-maroon)",
                  }}
                >
                  Support
                </span>
              </Link>

              {/* Search */}
              <button
                id="header-search-btn"
                onClick={() => setSearchOpen(true)}
                style={{ color: "var(--color-maroon)" }}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                style={{ color: "var(--color-maroon)" }}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors hidden sm:flex"
                aria-label="View wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={openDrawer}
                style={{ color: "var(--color-maroon)", position: "relative" }}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
                aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "var(--color-maroon)",
                      color: "var(--color-white)",
                      borderRadius: "9999px",
                      minWidth: 18,
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Category Strip Bar (UNDER Main Navbar & CENTER ALIGNED) ── */}
        <div
          className="hidden lg:block"
          style={{
            backgroundColor: "#FAF3EB",
            borderTop: "1px solid rgba(205,151,3,0.12)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", /* Center aligned */
                height: "40px",
                gap: "0.25rem",
              }}
            >
              {categories.map((item) => (
                <div
                  key={item.slug}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={`/collections/${item.slug}`}
                    style={{
                      color: "var(--color-maroon)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      transition: "all 0.2s",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      padding: "0 0.85rem",
                      height: "40px",
                      whiteSpace: "nowrap",
                      borderBottom: activeMenu === item.slug ? "2px solid var(--color-maroon)" : "2px solid transparent",
                    }}
                  >
                    {item.label}
                    {item.children.length > 0 && (
                      <ChevronDown
                        size={12}
                        style={{
                          transition: "transform 0.2s",
                          transform: activeMenu === item.slug ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children.length > 0 && activeMenu === item.slug && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(102,13,25,0.08)",
                        borderRadius: "0 0 0.75rem 0.75rem",
                        boxShadow: "0 8px 32px rgba(102,13,25,0.12)",
                        padding: "0.5rem 0",
                        minWidth: 210,
                        zIndex: 60,
                        animation: "fade-up 0.2s ease",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.slug}
                          href={`/collections/${child.slug}`}
                          style={{
                            display: "block",
                            padding: "0.45rem 1.1rem",
                            color: "var(--color-body)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.83rem",
                            transition: "all 0.15s",
                            textDecoration: "none",
                          }}
                          onMouseOver={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--color-maroon)";
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-cream)";
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(4px)",
              zIndex: 90,
              display: "flex",
              justifyContent: "flex-start",
              animation: "fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div
              style={{
                width: "85%",
                maxWidth: "340px",
                height: "100%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                boxShadow: "6px 0 30px rgba(102,13,25,0.18)",
                animation: "slide-in-left 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header */}
              <div
                style={{
                  padding: "1.25rem 1rem",
                  borderBottom: "1px solid rgba(205,151,3,0.2)",
                  backgroundColor: "#FAF3EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2 2" />
                    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="var(--color-gold)" opacity="0.15" />
                    <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.7909 8 12 8Z" stroke="var(--color-gold)" strokeWidth="1.5" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      color: "var(--color-maroon)",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Mourika
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "0.35rem",
                    borderRadius: "50%",
                    backgroundColor: "#FFF8F0",
                    border: "1px solid rgba(102,13,25,0.1)",
                    color: "var(--color-maroon)",
                    cursor: "pointer",
                  }}
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Navigation Links List */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {/* Home link */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "#FAF3EB",
                    border: "1px solid rgba(205,151,3,0.3)",
                    color: "var(--color-maroon)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span style={{ fontSize: "1rem" }}>🏠</span>
                    <span>Home</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-gold-dark)", fontWeight: 700 }}>→</span>
                </Link>

                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", margin: "0.75rem 0 0.25rem 0.5rem", fontWeight: 700 }}>
                  Categories
                </p>

                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/collections/${item.slug}`}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(205,151,3,0.25)",
                      backgroundColor: "#FAF3EB",
                      color: "var(--color-maroon)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(102,13,25,0.03)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-gold-dark)", fontWeight: 700 }}>→</span>
                  </Link>
                ))}

                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", margin: "0.75rem 0 0.25rem 0.5rem", fontWeight: 700 }}>
                  Customer Care
                </p>

                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(205,151,3,0.3)",
                    backgroundColor: "#FAF3EB",
                    color: "var(--color-maroon)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Heart size={18} style={{ color: "var(--color-maroon)" }} />
                    <span>My Wishlist</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-gold-dark)", fontWeight: 700 }}>→</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(205,151,3,0.35)",
                    backgroundColor: "#FEF9EC",
                    color: "var(--color-maroon)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Headphones size={18} style={{ color: "var(--color-gold-dark)" }} />
                    <span>Customer Support</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-gold-dark)", fontWeight: 700 }}>→</span>
                </Link>
              </div>

              {/* Drawer Bottom Footer */}
              <div
                style={{
                  padding: "1rem",
                  borderTop: "1px solid rgba(102,13,25,0.08)",
                  backgroundColor: "#FFF8F0",
                  textAlign: "center",
                }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-muted)", margin: 0 }}>
                  🌸 Handcrafted Devotional Treasures
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--color-gold-dark)", margin: "0.25rem 0 0 0", fontWeight: 700 }}>
                  Free Express Shipping Across India
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "5rem",
          }}
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: 560,
              margin: "0 1rem",
              boxShadow: "0 20px 60px rgba(102,13,25,0.2)",
              animation: "scale-in 0.2s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-taupe)",
                }}
              />
              <input
                ref={searchRef}
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Dresses, Decor, Shringar..."
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: "2px solid var(--color-gold)",
                  borderRadius: "var(--radius-btn)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  backgroundColor: "var(--color-white)",
                  color: "var(--color-body)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["Laddu Gopal Dress", "Shubh Labh", "Diwali Diyas", "Rakhi"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(tag)}`;
                  }}
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    border: "1px solid var(--color-gold)",
                    backgroundColor: "var(--color-cream)",
                    color: "var(--color-maroon)",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
