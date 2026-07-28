"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCartCount, useCartStore } from "@/lib/store";
import AnnouncementBar from "./AnnouncementBar";

const megaMenu = [
  {
    label: "Devotees collection",
    slug: "devotees-collection",
    children: [],
  },
  {
    label: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
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
    children: [
      { label: "Torans / Bandhanwal", slug: "torans-bandhanwal" },
      { label: "Decorative Rangoli", slug: "decorative-rangoli" },
      { label: "Shubh Labh", slug: "shubh-labh" },
      { label: "Pooja Thali cover", slug: "pooja-thali-cover" },
    ],
  },
  {
    label: "Festive Products",
    slug: "festive-products",
    children: [
      { label: "Janmashtami", slug: "janmashtami" },
      { label: "Rakhi", slug: "rakhi" },
      { label: "Karwa chauth", slug: "karwa-chauth" },
      { label: "Navratri", slug: "navratri" },
      { label: "Diwali", slug: "diwali" },
    ],
  },
  {
    label: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    children: [
      { label: "Hairs", slug: "hairs" },
      { label: "Earrings", slug: "earrings" },
      { label: "Kangan", slug: "kangan" },
      { label: "Necklace / Haar", slug: "necklace-haar" },
      { label: "Bansuri", slug: "bansuri" },
      { label: "Kamar Band", slug: "kamar-band" },
      { label: "Attar / Ittar", slug: "attar-ittar" },
      { label: "Bathtub", slug: "bathtub" },
      { label: "Pooja Thali cover", slug: "pooja-thali-cover-accessory" },
    ],
  },
  { label: "Upcoming Festival", slug: "upcoming", children: [] },
  { label: "Support", slug: "support", children: [] },
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
          backgroundColor: scrolled ? "rgba(252,251,247,0.97)" : "#FCFBF7",
          borderBottom: "1px solid #EFEAE0",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: scrolled ? "0 2px 16px rgba(102,13,25,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--color-gold-light)" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="var(--color-gold-light)" opacity="0.15" />
                <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.7909 8 12 8Z" stroke="var(--color-gold-light)" strokeWidth="1.5" />
                <path d="M12 3V5M12 19V21" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-display, Lato, sans-serif)",
                  fontSize: "1.25rem",
                  color: "var(--color-maroon)",
                  letterSpacing: "0.18em",
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                Mourika
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center gap-1 flex-grow">
              {megaMenu.map((item) => (
                <div
                  key={item.slug}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={`/collections/${item.slug}`}
                    style={{
                      color: "var(--color-black)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                    className="flex items-center gap-0.5 px-3 py-2 rounded-lg transition-colors hover:bg-maroon-50"
                  >
                    {item.label}
                    {item.children.length > 0 && (
                      <ChevronDown
                        size={14}
                        style={{
                          transition: "transform 0.2s",
                          transform: activeMenu === item.slug ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    )}
                  </Link>

                  {/* Mega Dropdown */}
                  {item.children.length > 0 && activeMenu === item.slug && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#FFFBF5",
                        border: "1px solid #F0E0C0",
                        borderRadius: "0.75rem",
                        boxShadow: "0 8px 32px rgba(140,98,57,0.12)",
                        padding: "0.75rem",
                        minWidth: 180,
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
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.5rem",
                            color: "#1a1a1a",
                            fontFamily: "var(--font-body, Poppins, sans-serif)",
                            fontSize: "0.875rem",
                            transition: "all 0.15s",
                          }}
                          className="hover:bg-maroon-50"
                          onMouseOver={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--color-maroon)";
                            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-cream)";
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "#1a1a1a";
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
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                id="header-search-btn"
                onClick={() => setSearchOpen(true)}
                style={{ color: "#1a1a1a" }}
                className="p-2 rounded-lg hover:bg-maroon-50 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                style={{ color: "#1a1a1a" }}
                className="p-2 rounded-lg hover:bg-maroon-50 transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={openDrawer}
                style={{ color: "#1a1a1a", position: "relative" }}
                className="p-2 rounded-lg hover:bg-maroon-50 transition-colors"
                aria-label="Shopping cart"
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

              {/* Mobile Menu Toggle */}
              <button
                id="header-mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ color: "#1a1a1a" }}
                className="p-2 rounded-lg hover:bg-maroon-50 transition-colors lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              backgroundColor: "#FFFBF5",
              borderTop: "1px solid #F0E0C0",
              padding: "1rem",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            className="lg:hidden"
          >
            {megaMenu.map((item) => (
              <div key={item.slug} className="mb-1">
                <Link
                  href={`/collections/${item.slug}`}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    color: "var(--color-maroon)",
                    fontSize: "0.9rem",
                  }}
                >
                  {item.label}
                </Link>
                {item.children.length > 0 && (
                  <div style={{ paddingLeft: "1rem" }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/collections/${child.slug}`}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.375rem 0.75rem",
                          color: "#555",
                          fontFamily: "var(--font-body, Poppins, sans-serif)",
                          fontSize: "0.85rem",
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
        >
          <div
            style={{
              backgroundColor: "#FFFBF5",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: 560,
              margin: "0 1rem",
              boxShadow: "0 20px 60px rgba(139,30,63,0.2)",
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
                  color: "#888",
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
                  border: "1.5px solid var(--color-gold-light)",
                  borderRadius: "0.625rem",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  backgroundColor: "var(--color-white)",
                  color: "var(--color-black)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["Luxe Dresses", "Shubh Labh", "Diwali Diyas", "Deity Necklace"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(tag)}`;
                  }}
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    border: "1px solid var(--color-gold-light)",
                    backgroundColor: "var(--color-cream-alt)",
                    color: "var(--color-maroon)",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
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
