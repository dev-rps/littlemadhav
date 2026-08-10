"use client";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Zap, RefreshCcw, ShieldCheck, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import PincodeChecker from "@/components/shipping/PincodeChecker";

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  isSale: boolean;
  isNewArrival: boolean;
  material?: string;
  occasion?: string;
  careInstructions?: string;
  shippingInfo?: string;
  avgRating: number;
  images: { url: string; alt: string | null; isPrimary: boolean }[];
  variants: { id: string; name: string; value: string; priceAdj: number; stock: number }[];
  category: { name: string; slug: string } | null;
  reviews: { id: string; reviewerName: string; rating: number; comment: string; isVerified: boolean }[];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "care" | "shipping">("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [imgError, setImgError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setProduct(null);
        } else {
          setProduct(data);
          // Pre-select first option for each variant category
          if (data.variants && data.variants.length > 0) {
            const defaults: Record<string, string> = {};
            data.variants.forEach((v: any) => {
              if (!defaults[v.name]) {
                defaults[v.name] = v.value;
              }
            });
            setSelectedVariants(defaults);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const [related, setRelated] = useState<ProductCardData[]>([]);

  useEffect(() => {
    if (!product || !product.category) return;
    fetch(`/api/products?limit=5&category=${product.category.slug}`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data.products ?? []).filter((p: any) => p.id !== product.id);
        setRelated(filtered.slice(0, 4));
      })
      .catch(() => {});
  }, [product]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FBF3E9" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          <div style={{ fontFamily: "var(--font-body)", color: "#BAAC9D" }}>Loading product...</div>
        </div>
      </div>
    );
  }
  if (!product) return notFound();

  const discount = getDiscountPercent(product.mrp, product.price);

  // Group variants by name
  const variantGroups = product.variants.reduce<Record<string, { value: string; stock: number; priceAdj: number }[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      if (!acc[v.name].find((x) => x.value === v.value)) {
        acc[v.name].push({ value: v.value, stock: v.stock, priceAdj: v.priceAdj });
      }
      return acc;
    },
    {}
  );

  const variantSuffix = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      quantity,
      variant: variantSuffix || undefined,
      imageUrl: product.images[0]?.url ?? "",
      slug: product.slug,
    });
    toast.success("Added to your bag! 🛍️");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  // Build 4 thumbnail slots (padded with nulls for missing angle images)
  const MAX_THUMBS = 4;
  const thumbImages = [
    ...product.images.slice(0, MAX_THUMBS),
    ...Array(Math.max(0, MAX_THUMBS - product.images.length)).fill(null),
  ];

  return (
    <div style={{ backgroundColor: "#FBF3E9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#F4E8DB", borderBottom: "1px solid rgba(186,172,157,0.25)", padding: "0.85rem 0" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#BAAC9D", display: "flex", gap: "0.4rem", alignItems: "center" }} aria-label="Breadcrumb">
            <Link href="/" style={{ color: "#8B7D6B", textDecoration: "none", fontWeight: 500 }}>Home</Link>
            <span style={{ color: "#BAAC9D" }}>/</span>
            {product.category && (
              <>
                <Link href={`/collections/${product.category.slug}`} style={{ color: "#8B7D6B", textDecoration: "none", fontWeight: 500 }}>{product.category.name}</Link>
                <span style={{ color: "#BAAC9D" }}>/</span>
              </>
            )}
            <span style={{ color: "#660D19", fontWeight: 700 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Main 2-column layout matching reference proportions */}
        <div
          style={{ display: "grid", gap: "2.5rem", alignItems: "start" }}
          className="grid-cols-1 lg:grid-cols-2 lg:gap-14"
        >
          {/* ── LEFT COLUMN: Gallery with 4 Vertical Left Thumbnails + Square Main Box ── */}
          <div className="lg:sticky lg:top-24">
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              {/* 4 Vertical Left Thumbnails */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  flexShrink: 0,
                }}
              >
                {thumbImages.map((img, i) => {
                  const isActive = i === activeImage;
                  const isNull = img === null;
                  const hasThumbError = thumbErrors[i];

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!isNull && !hasThumbError) {
                          setActiveImage(i);
                          setImgError(false);
                        }
                      }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: isActive && !isNull
                          ? "2px solid #660D19"
                          : "1.5px solid rgba(186,172,157,0.35)",
                        cursor: isNull ? "default" : "pointer",
                        backgroundColor: "#F4E8DB",
                        padding: 0,
                        position: "relative",
                        transition: "all 0.2s ease",
                        opacity: isNull ? 0.45 : 1,
                        boxShadow: isActive ? "0 4px 12px rgba(102,13,25,0.12)" : "none",
                      }}
                      aria-label={img ? `View product angle ${i + 1}` : "No image"}
                      onMouseOver={(e) => {
                        if (!isNull && !isActive) (e.currentTarget as HTMLElement).style.borderColor = "#CD9703";
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = "rgba(186,172,157,0.35)";
                      }}
                    >
                      {isNull || hasThumbError ? (
                        /* Elegant angle placeholder icon box */
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(145deg, #F4E8DB, #EED8C4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#CD9703" strokeWidth="1.5" strokeDasharray="2 2" />
                            <circle cx="12" cy="11" r="3" stroke="#CD9703" strokeWidth="1.5" />
                            <path d="M3 18l4-4 3 3 4-5 7 6" stroke="#CD9703" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={img.url}
                          alt={img.alt ?? `Angle ${i + 1}`}
                          fill
                          sizes="64px"
                          style={{ objectFit: "cover" }}
                          onError={() => setThumbErrors((prev) => ({ ...prev, [i]: true }))}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Square Main Image Box */}
              <div style={{ flex: 1, maxWidth: "460px", position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "18px",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    maxHeight: "460px",
                    background: "linear-gradient(145deg, #FBF3E9 0%, #F4E8DB 100%)",
                    boxShadow: "0 10px 30px rgba(102,13,25,0.05)",
                  }}
                >
                  {imgError ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#CD9703" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="12" cy="12" r="6" fill="#CD9703" opacity="0.12" />
                      </svg>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#BAAC9D" }}>Image unavailable</span>
                    </div>
                  ) : product.images[activeImage] && (
                    <Image
                      src={product.images[activeImage].url}
                      alt={product.images[activeImage].alt ?? product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 460px"
                      style={{ objectFit: "cover" }}
                      priority
                      onError={() => setImgError(true)}
                    />
                  )}
                  {/* Discount Badge */}
                  {product.isSale && discount > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        backgroundColor: "#660D19",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-body)",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "9999px",
                        letterSpacing: "0.04em",
                        boxShadow: "0 4px 12px rgba(102,13,25,0.2)",
                      }}
                    >
                      -{discount}% OFF
                    </div>
                  )}
                  {/* Image Navigation Chevrons */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => { setActiveImage((activeImage - 1 + product.images.length) % product.images.length); setImgError(false); }}
                        style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} style={{ color: "#660D19" }} />
                      </button>
                      <button
                        onClick={() => { setActiveImage((activeImage + 1) % product.images.length); setImgError(false); }}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} style={{ color: "#660D19" }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Product Information (Matching Reference Hierarchy) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* Category Sub-heading (e.g. Rakhi) */}
            {product.category && (
              <div style={{ margin: 0 }}>
                <Link
                  href={`/collections/${product.category.slug}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.15rem",
                    color: "#660D19",
                    fontWeight: 700,
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                  }}
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            {/* Main Product Title */}
            <h1
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)",
                color: "#000000",
                margin: 0,
                lineHeight: 1.25,
                fontWeight: 700,
              }}
            >
              {product.name}
            </h1>

            {/* Rating Row (5 Gold Stars + 4.5 Score) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <div style={{ display: "flex", gap: "0.15rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.avgRating) ? "#CD9703" : "none"}
                    stroke={s <= Math.round(product.avgRating) ? "#CD9703" : "#BAAC9D"}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#333333", fontWeight: 600 }}>
                {product.avgRating.toFixed(1)} <span style={{ color: "#777777", fontWeight: 400 }}>({product.reviews.length} reviews)</span>
              </span>
            </div>

            {/* Price Row (Main Price + Strikethrough MRP + Save XX% Blush Badge) */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#660D19",
                  lineHeight: 1,
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.05rem",
                      color: "#BAAC9D",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.mrp)}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#FBD5CD",
                      color: "#660D19",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                    }}
                  >
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variant Selectors (Color :- Value format matching reference) */}
            {Object.entries(variantGroups).map(([name, options]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.92rem", color: "#000000", margin: 0 }}>
                  {name} :- <span style={{ color: "#660D19", fontWeight: 600 }}>{selectedVariants[name] ?? options[0]?.value ?? "—"}</span>
                </p>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {options.map((opt) => {
                    const isSelected = (selectedVariants[name] ?? options[0]?.value) === opt.value;
                    return (
                      <button
                        key={opt.value}
                        id={`variant-${opt.value.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [name]: opt.value }))}
                        style={{
                          padding: "0.45rem 1.15rem",
                          borderRadius: "8px",
                          border: isSelected ? "1.5px solid #660D19" : "1.5px solid #BAAC9D",
                          backgroundColor: isSelected ? "#660D19" : "#FFFFFF",
                          color: isSelected ? "#FFFFFF" : "#000000",
                          fontFamily: "var(--font-body)",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.85rem",
                          cursor: opt.stock === 0 ? "not-allowed" : "pointer",
                          opacity: opt.stock === 0 ? 0.4 : 1,
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 2px 8px rgba(102,13,25,0.15)" : "none",
                        }}
                        disabled={opt.stock === 0}
                      >
                        {opt.value}
                        {opt.priceAdj !== 0 && (
                          <span style={{ fontSize: "0.72rem", marginLeft: "0.25rem", opacity: 0.85 }}>
                            (+{formatPrice(opt.priceAdj)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Stepper + In stock badge */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.92rem", color: "#000000", margin: 0 }}>
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                {/* Stepper Control Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid #BAAC9D",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    height: 38,
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: 34, height: "100%", border: "none", backgroundColor: "transparent", color: "#660D19", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700 }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.95rem", minWidth: 32, textAlign: "center", color: "#000000" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ width: 34, height: "100%", border: "none", backgroundColor: "transparent", color: "#660D19", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700 }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Stock Indicator */}
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: product.stock < 10 ? "#E76F51" : "#357C49", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : "✓ In stock"}
                </span>
              </div>
            </div>

            {/* Dual CTA Action Bar (Add to Bag & Buy Now side-by-side) */}
            <div style={{ display: "flex", gap: "0.85rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
              <button
                id="product-add-to-cart"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: "140px",
                  height: 48,
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #660D19",
                  borderRadius: "10px",
                  color: "#660D19",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF3EB";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                }}
              >
                <ShoppingBag size={18} />
                Add to Bag
              </button>

              <button
                id="product-buy-now"
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  minWidth: "140px",
                  height: 48,
                  backgroundColor: "#660D19",
                  border: "none",
                  borderRadius: "10px",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(102,13,25,0.22)",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#520A14";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#660D19";
                }}
              >
                <Zap size={18} />
                Buy now
              </button>
            </div>

            {/* Shiprocket Pincode & Delivery Checker */}
            <div style={{ marginTop: "0.35rem" }}>
              <PincodeChecker compact />
            </div>

            {/* Trust Badges Strip (Warm beige container with vertical stroke dividers) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                padding: "0.75rem 1.25rem",
                backgroundColor: "#F4E8DB",
                borderRadius: "12px",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                color: "#333333",
                fontWeight: 600,
                flexWrap: "wrap",
                marginTop: "0.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <RefreshCcw size={15} style={{ color: "#660D19" }} />
                <span>Easy returns</span>
              </div>
              <span style={{ color: "#BAAC9D" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldCheck size={15} style={{ color: "#660D19" }} />
                <span>Secure payment</span>
              </div>
              <span style={{ color: "#BAAC9D" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Truck size={15} style={{ color: "#660D19" }} />
                <span>COD available</span>
              </div>
            </div>

            {/* Product Details Metadata (Material:- & Occasion:-) */}
            {(product.material || product.occasion) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.25rem" }}>
                {product.material && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#333333", margin: 0 }}>
                    <strong style={{ color: "#660D19", fontWeight: 700 }}>Material :- </strong>
                    <span>{product.material}</span>
                  </p>
                )}
                {product.occasion && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#333333", margin: 0 }}>
                    <strong style={{ color: "#660D19", fontWeight: 700 }}>Occasion :- </strong>
                    <span>{product.occasion}</span>
                  </p>
                )}
              </div>
            )}

            {/* Description Section with Maroon Accent Underline */}
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1.5px solid #CD9703", overflowX: "auto" }}>
                {(["description", "care", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "0.5rem 0",
                      border: "none",
                      borderBottom: activeTab === tab ? "2.5px solid #660D19" : "2.5px solid transparent",
                      backgroundColor: "transparent",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: activeTab === tab ? "#660D19" : "#777777",
                      cursor: "pointer",
                      marginBottom: "-1.5px",
                      transition: "all 0.2s ease",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab === "care" ? "Care Instructions" : tab === "shipping" ? "Shipping Policy" : "Description"}
                  </button>
                ))}
              </div>
              <div style={{ padding: "0.85rem 0 0", fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#333333", lineHeight: 1.65 }}>
                {activeTab === "description" && product.description}
                {activeTab === "care" && (product.careInstructions ?? "Keep away from water and direct perfume. Store in a cool, dry place inside a soft pouch.")}
                {activeTab === "shipping" && (product.shippingInfo ?? "Ships within 24–48 hours. Delivered safely across India in 3–7 business days. Free shipping above ₹499.")}
              </div>
            </div>

            {/* Customer Reviews Section */}
            {product.reviews.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ fontFamily: "var(--font-body)", color: "#660D19", fontSize: "1.05rem", marginBottom: "0.75rem", fontWeight: 700 }}>
                  Customer Reviews
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {product.reviews.slice(0, 3).map((r) => (
                    <div key={r.id} style={{ padding: "0.85rem 1rem", backgroundColor: "#F4E8DB", borderRadius: "12px", border: "1px solid rgba(186,172,157,0.25)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem", flexWrap: "wrap", gap: "0.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "#000000" }}>{r.reviewerName}</span>
                          {r.isVerified && (
                            <span style={{ fontSize: "0.68rem", color: "#357C49", backgroundColor: "rgba(53,124,73,0.12)", padding: "0.15rem 0.45rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 700 }}>✓ Verified</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "0.1rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={13} fill={s <= r.rating ? "#CD9703" : "none"} stroke={s <= r.rating ? "#CD9703" : "#BAAC9D"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", color: "#444444", margin: 0, lineHeight: 1.55 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── YOU MAY ALSO LIKE (Matching Reference Header & Motif Divider) ── */}
        {related.length > 0 && (
          <div style={{ marginTop: "4.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#660D19",
                  fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
                  margin: "0 0 0.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                }}
              >
                You May Also Like
              </h2>
              {/* Delicate Gold Motif Flourish Underline (Matching Reference) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <div style={{ height: "1px", width: "80px", backgroundColor: "#CD9703", opacity: 0.5 }} />
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0L14.5 4.5L19 5L15.5 8.5L16.5 13L12 10.5L7.5 13L8.5 8.5L5 5L9.5 4.5L12 0Z" fill="#CD9703" opacity="0.75" />
                </svg>
                <div style={{ height: "1px", width: "80px", backgroundColor: "#CD9703", opacity: 0.5 }} />
              </div>
            </div>

            {/* Related Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
