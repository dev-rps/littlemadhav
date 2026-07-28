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

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={16}
          fill={s <= Math.round(rating) ? "#D4A017" : "none"}
          stroke={s <= Math.round(rating) ? "#D4A017" : "#ccc"}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "care" | "shipping">("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
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
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F0" }}>
        <div style={{ fontFamily: "var(--font-body)", color: "#888" }}>Loading product...</div>
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

  return (
    <div style={{ backgroundColor: "var(--color-cream)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-taupe)", display: "flex", gap: "0.375rem", alignItems: "center" }}>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main 2-col grid */}
        <div
          style={{ display: "grid", gap: "3rem", alignItems: "start" }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* ── LEFT: Gallery ── */}
          <div style={{ position: "sticky", top: "5rem" }}>
            {/* Desktop: thumbnails on left, main image on right */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              {/* Vertical thumbnails (desktop) / horizontal strip (mobile) */}
              {product.images.length > 1 && (
                <div
                  className="flex-col gap-2 hidden sm:flex"
                  style={{ flexShrink: 0, width: 72, display: "flex", flexDirection: "column", gap: "0.5rem" }}
                >
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "0.625rem",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: i === activeImage ? "2px solid var(--color-maroon)" : "1.5px solid rgba(186,172,157,0.4)",
                        cursor: "pointer",
                        backgroundColor: "var(--color-cream-alt)",
                        padding: 0,
                        position: "relative",
                        transition: "border-color 0.2s",
                      }}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image src={img.url} alt={img.alt ?? `Image ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="72px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div style={{ flex: 1, position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "1.125rem",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    background: "linear-gradient(145deg, var(--color-cream-alt) 0%, var(--color-blush) 100%)",
                  }}
                >
                  {product.images[activeImage] && (
                    <Image
                      src={product.images[activeImage].url}
                      alt={product.images[activeImage].alt ?? product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  )}
                  {/* Badge */}
                  {product.isSale && discount > 0 && (
                    <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "var(--color-blush)", color: "var(--color-maroon)", padding: "0.3rem 0.75rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 900, fontSize: "0.82rem" }}>
                      -{discount}% OFF
                    </div>
                  )}
                  {/* Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                        style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(251,243,233,0.85)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(251,243,233,0.85)", border: "1px solid rgba(186,172,157,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile horizontal thumbnail strip */}
                {product.images.length > 1 && (
                  <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginTop: "0.75rem", paddingBottom: "0.25rem" }} className="sm:hidden">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: i === activeImage ? "2px solid var(--color-maroon)" : "1.5px solid rgba(186,172,157,0.3)",
                          cursor: "pointer",
                          backgroundColor: "var(--color-cream-alt)",
                          padding: 0,
                          position: "relative",
                        }}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image src={img.url} alt={img.alt ?? `Image ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="60px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div>
            {/* Category label */}
            {product.category && (
              <Link href={`/collections/${product.category.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-gold-dark)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
                {product.category.name}
              </Link>
            )}

            {/* Product name */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", color: "var(--color-black)", margin: "0.4rem 0 0.75rem", lineHeight: 1.2, fontWeight: 700 }}>
              {product.name}
            </h1>

            {/* Rating inline */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "0.1rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= Math.round(product.avgRating) ? "var(--color-gold-dark)" : "none"} stroke={s <= Math.round(product.avgRating) ? "var(--color-gold-dark)" : "var(--color-taupe)"} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-taupe)" }}>
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
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "var(--color-taupe)", textDecoration: "line-through" }}>
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
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-black)", marginBottom: "0.5rem" }}>
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
                        color: selectedVariants[name] === opt.value ? "var(--color-white)" : "var(--color-black)",
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
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-black)", marginBottom: "0.5rem" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid var(--color-gold-light)", borderRadius: "0.375rem", backgroundColor: "transparent", color: "var(--color-maroon)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700 }}
                >
                  −
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: "1rem", minWidth: 28, textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid var(--color-gold-light)", borderRadius: "0.375rem", backgroundColor: "transparent", color: "var(--color-maroon)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700 }}
                >
                  +
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: product.stock < 10 ? "#E76F51" : "var(--color-green)" }}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : "✓ In Stock"}
                </span>
              </div>
            </div>

            {/* CTA Buttons — fully rounded, side by side */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <button
                id="product-add-to-cart"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  border: "2px solid var(--color-maroon)",
                  borderRadius: "9999px",
                  backgroundColor: "transparent",
                  color: "var(--color-maroon)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  border: "none",
                  borderRadius: "9999px",
                  backgroundColor: "var(--color-maroon)",
                  color: "var(--color-white)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

            {/* Returns & payment trust strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "0.875rem 1rem", backgroundColor: "var(--color-cream-alt)", borderRadius: "0.75rem", border: "1px solid rgba(213,173,54,0.25)", marginBottom: "1.25rem" }}>
              {[
                { icon: <Package size={15} />, text: "COD Available" },
                { icon: <RefreshCcw size={15} />, text: "Easy Returns" },
                { icon: <Shield size={15} />, text: "Secure Payment" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.78rem", color: "var(--color-black)" }}>
                  <span style={{ color: "var(--color-gold-dark)" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Material / Occasion metadata */}
            {(product.material || product.occasion) && (
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {product.material && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-taupe)", margin: 0 }}>
                    <strong style={{ color: "var(--color-black)", fontWeight: 700 }}>Material: </strong>{product.material}
                  </p>
                )}
                {product.occasion && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-taupe)", margin: 0 }}>
                    <strong style={{ color: "var(--color-black)", fontWeight: 700 }}>Occasion: </strong>{product.occasion}
                  </p>
                )}
              </div>
            )}

            {/* Description Tab with gold underline accent */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid var(--color-gold-light)" }}>
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
                      color: activeTab === tab ? "var(--color-maroon)" : "var(--color-taupe)",
                      cursor: "pointer",
                      marginBottom: "-1.5px",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "care" ? "Care" : tab === "shipping" ? "Shipping" : "Description"}
                  </button>
                ))}
              </div>
              <div style={{ padding: "1rem 0", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-black)", lineHeight: 1.7 }}>
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
                    <div key={r.id} style={{ padding: "0.875rem 1rem", backgroundColor: "var(--color-cream-alt)", borderRadius: "0.75rem", border: "1px solid rgba(186,172,157,0.3)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-black)" }}>{r.reviewerName}</span>
                          {r.isVerified && (
                            <span style={{ fontSize: "0.7rem", color: "var(--color-green)", backgroundColor: "rgba(53,124,73,0.1)", padding: "0.15rem 0.4rem", borderRadius: "9999px", fontFamily: "var(--font-body)", fontWeight: 600 }}>✓ Verified</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "0.1rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= r.rating ? "var(--color-gold-dark)" : "none"} stroke={s <= r.rating ? "var(--color-gold-dark)" : "var(--color-taupe)"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-taupe)", margin: 0, lineHeight: 1.6 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like — centered maroon divider */}
        {related.length > 0 && (
          <div style={{ marginTop: "5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-gold-dark)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                Discover More
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.75rem", margin: 0, fontWeight: 700 }}>
                You May Also Like
              </h2>
            </div>
            <hr className="divider-gold" style={{ marginBottom: "2.5rem" }} />
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

