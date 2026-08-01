"use client";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Zap, Package, RefreshCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

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
        if (data.error) { setProduct(null); } else { setProduct(data); }
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
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-cream)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
          <div style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>Loading product...</div>
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
    <div style={{ backgroundColor: "var(--color-cream)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-taupe)", display: "flex", gap: "0.375rem", alignItems: "center" }} aria-label="Breadcrumb">
            <Link href="/" style={{ color: "var(--color-taupe)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/collections/${product.category.slug}`} style={{ color: "var(--color-taupe)", textDecoration: "none" }}>{product.category.name}</Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "var(--color-maroon)", fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main 2-col grid */}
        <div
          style={{ display: "grid", gap: "2rem", alignItems: "start" }}
          className="grid-cols-1 lg:grid-cols-2 lg:gap-10"
        >
          {/* ── LEFT: Gallery with 4 Vertical Left Thumbnails + Compact Square Main Box ── */}
          <div className="lg:sticky lg:top-20">
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              {/* 4 Vertical Left Thumbnails (Amazon/Flipkart Style) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
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
                        width: 58,
                        height: 58,
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: isActive && !isNull
                          ? "2px solid var(--color-maroon)"
                          : "1.5px solid rgba(186,172,157,0.4)",
                        cursor: isNull ? "default" : "pointer",
                        backgroundColor: "#F4E8DB",
                        padding: 0,
                        position: "relative",
                        transition: "all 0.2s",
                        opacity: isNull ? 0.45 : 1,
                      }}
                      aria-label={img ? `View angle ${i + 1}` : "No image"}
                      onMouseOver={(e) => {
                        if (!isNull && !isActive) (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gold)";
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = "rgba(186,172,157,0.4)";
                      }}
                    >
                      {isNull || hasThumbError ? (
                        /* Placeholder angle box */
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
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
                          sizes="58px"
                          style={{ objectFit: "cover" }}
                          onError={() => setThumbErrors((prev) => ({ ...prev, [i]: true }))}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Compact Square Main Box (Fits on screen without being vertically long) */}
              <div style={{ flex: 1, maxWidth: "440px", position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    aspectRatio: "1 / 1", /* Clean Square Box */
                    maxHeight: "440px",
                    background: "linear-gradient(145deg, var(--color-cream-alt) 0%, var(--color-blush) 100%)",
                  }}
                >
                  {imgError ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="12" cy="12" r="6" fill="var(--color-gold)" opacity="0.12" />
                      </svg>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-taupe)" }}>Image unavailable</span>
                    </div>
                  ) : product.images[activeImage] && (
                    <Image
                      src={product.images[activeImage].url}
                      alt={product.images[activeImage].alt ?? product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 440px"
                      style={{ objectFit: "cover" }}
                      priority
                      onError={() => setImgError(true)}
                    />
                  )}
                  {/* Badge */}
                  {product.isSale && discount > 0 && (
                    <div className="badge-discount" style={{ position: "absolute", top: 12, left: 12, padding: "0.3rem 0.75rem", fontSize: "0.82rem" }}>
                      -{discount}% OFF
                    </div>
                  )}
                  {/* Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => { setActiveImage((activeImage - 1 + product.images.length) % product.images.length); setImgError(false); }}
                        style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => { setActiveImage((activeImage + 1) % product.images.length); setImgError(false); }}
                        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Next image"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div>
            {/* Category label */}
            {product.category && (
              <Link href={`/collections/${product.category.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
                {product.category.name}
              </Link>
            )}

            {/* Product name */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", color: "var(--color-maroon)", margin: "0.4rem 0 0.75rem", lineHeight: 1.2, fontWeight: 700 }}>
              {product.name}
            </h1>

            {/* Rating inline */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "0.1rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= Math.round(product.avgRating) ? "var(--color-gold)" : "none"} stroke={s <= Math.round(product.avgRating) ? "var(--color-gold)" : "var(--color-taupe)"} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-muted)" }}>
                {product.avgRating.toFixed(1)} · {product.reviews.length} reviews
              </span>
            </div>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-maroon)" }}>
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "var(--color-muted)", textDecoration: "line-through" }}>
                    {formatPrice(product.mrp)}
                  </span>
                  <span style={{ backgroundColor: "var(--color-blush)", color: "var(--color-maroon)", fontFamily: "var(--font-body)", fontWeight: 900, fontSize: "0.82rem", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variant Selectors */}
            {Object.entries(variantGroups).map(([name, options]) => (
              <div key={name} style={{ marginBottom: "1rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-body)", marginBottom: "0.5rem" }}>
                  {name}: <span style={{ color: "var(--color-maroon)", fontWeight: 400 }}>{selectedVariants[name] ?? "—"}</span>
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      id={`variant-${opt.value.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [name]: opt.value }))}
                      style={{
                        padding: "0.45rem 1.1rem",
                        borderRadius: "9999px",
                        border: selectedVariants[name] === opt.value ? "2px solid var(--color-maroon)" : "1.5px solid var(--color-taupe)",
                        backgroundColor: selectedVariants[name] === opt.value ? "var(--color-maroon)" : "var(--color-white)",
                        color: selectedVariants[name] === opt.value ? "var(--color-white)" : "var(--color-body)",
                        fontFamily: "var(--font-body)",
                        fontWeight: selectedVariants[name] === opt.value ? 700 : 400,
                        fontSize: "0.85rem",
                        cursor: opt.stock === 0 ? "not-allowed" : "pointer",
                        opacity: opt.stock === 0 ? 0.4 : 1,
                        transition: "all 0.2s",
                      }}
                      disabled={opt.stock === 0}
                    >
                      {opt.value}
                      {opt.priceAdj !== 0 && (
                        <span style={{ fontSize: "0.7rem", marginLeft: "0.25rem" }}>
                          (+{formatPrice(opt.priceAdj)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity stepper */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-body)", marginBottom: "0.5rem" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid var(--color-gold-light)", borderRadius: "0.375rem", backgroundColor: "transparent", color: "var(--color-maroon)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700 }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: "1rem", minWidth: 28, textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid var(--color-gold-light)", borderRadius: "0.375rem", backgroundColor: "transparent", color: "var(--color-maroon)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700 }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: product.stock < 10 ? "#E76F51" : "var(--color-green)" }}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : "✓ In Stock"}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <button
                id="product-add-to-cart"
                onClick={handleAddToCart}
                className="btn-secondary ripple"
                style={{
                  flex: "1 1 140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.95rem",
                }}
              >
                <ShoppingBag size={18} />
                Add to Bag
              </button>
              <button
                id="product-buy-now"
                onClick={handleBuyNow}
                className="btn-primary ripple"
                style={{
                  flex: "1 1 140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.95rem",
                }}
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

            {/* Returns & payment trust strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "0.875rem 1rem", backgroundColor: "var(--color-cream-alt)", borderRadius: "14px", border: "1px solid rgba(205,151,3,0.2)", marginBottom: "1.25rem" }}>
              {[
                { icon: <Package size={15} />, text: "COD Available" },
                { icon: <RefreshCcw size={15} />, text: "Easy Returns" },
                { icon: <Shield size={15} />, text: "Secure Payment" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.78rem", color: "var(--color-body)" }}>
                  <span style={{ color: "var(--color-gold)" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Material / Occasion metadata */}
            {(product.material || product.occasion) && (
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {product.material && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-muted)", margin: 0 }}>
                    <strong style={{ color: "var(--color-body)", fontWeight: 700 }}>Material: </strong>{product.material}
                  </p>
                )}
                {product.occasion && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-muted)", margin: 0 }}>
                    <strong style={{ color: "var(--color-body)", fontWeight: 700 }}>Occasion: </strong>{product.occasion}
                  </p>
                )}
              </div>
            )}

            {/* Description Tab */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid var(--color-gold-light)", overflowX: "auto" }}>
                {(["description", "care", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "0.625rem 1rem",
                      border: "none",
                      borderBottom: activeTab === tab ? "2.5px solid var(--color-maroon)" : "2.5px solid transparent",
                      backgroundColor: "transparent",
                      fontFamily: "var(--font-body)",
                      fontWeight: activeTab === tab ? 700 : 400,
                      fontSize: "0.85rem",
                      color: activeTab === tab ? "var(--color-maroon)" : "var(--color-muted)",
                      cursor: "pointer",
                      marginBottom: "-1.5px",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab === "care" ? "Care" : tab === "shipping" ? "Shipping" : "Description"}
                  </button>
                ))}
              </div>
              <div style={{ padding: "1rem 0", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-body)", lineHeight: 1.7 }}>
                {activeTab === "description" && product.description}
                {activeTab === "care" && (product.careInstructions ?? "Keep away from water and perfume. Store in a cool, dry place.")}
                {activeTab === "shipping" && (product.shippingInfo ?? "Ships within 24–48 hours. Delivery in 3–7 business days across India. Free shipping above ₹499.")}
              </div>
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 700 }}>
                  Customer Reviews
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {product.reviews.slice(0, 3).map((r) => (
                    <div key={r.id} style={{ padding: "0.875rem 1rem", backgroundColor: "var(--color-cream-alt)", borderRadius: "14px", border: "1px solid rgba(186,172,157,0.3)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-body)" }}>{r.reviewerName}</span>
                          {r.isVerified && (
                            <span style={{ fontSize: "0.7rem", color: "var(--color-green)", backgroundColor: "rgba(53,124,73,0.1)", padding: "0.15rem 0.4rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600 }}>✓ Verified</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "0.1rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= r.rating ? "var(--color-gold)" : "none"} stroke={s <= r.rating ? "var(--color-gold)" : "var(--color-taupe)"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-muted)", margin: 0, lineHeight: 1.6 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                Discover More
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.75rem", margin: 0, fontWeight: 700 }}>
                You May Also Like
              </h2>
            </div>
            <hr className="divider-gold" style={{ marginBottom: "2rem" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
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
