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
    <div style={{ backgroundColor: "#FFF8F0", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#FFFBF5", borderBottom: "1px solid #F0E0C0", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#888", display: "flex", gap: "0.375rem", alignItems: "center" }}>
            <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/collections/${product.category.slug}`} style={{ color: "#888", textDecoration: "none" }}>{product.category.name}</Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "#8B1E3F", fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="grid-cols-1 lg:grid-cols-2">
          {/* Image Gallery */}
          <div style={{ position: "sticky", top: "5rem" }}>
            {/* Main image */}
            <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", aspectRatio: "1/1", backgroundColor: "#F5EDE0", marginBottom: "0.75rem" }}>
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
                <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "#8B1E3F", color: "#FFF8F0", padding: "0.3rem 0.75rem", borderRadius: "0.375rem", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem" }}>
                  -{discount}% OFF
                </div>
              )}
              {/* Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                    style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "#FFFBF5cc", border: "1px solid #F0E0C0", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", backgroundColor: "#FFFBF5cc", border: "1px solid #F0E0C0", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: i === activeImage ? "2px solid #D4A017" : "2px solid transparent",
                      cursor: "pointer",
                      backgroundColor: "#F5EDE0",
                      padding: 0,
                      position: "relative",
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img.url} alt={img.alt ?? `Image ${i+1}`} fill style={{ objectFit: "cover" }} sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <Link href={`/collections/${product.category.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#D4A017", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "none" }}>
                {product.category.name}
              </Link>
            )}
            <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#1a1a1a", margin: "0.5rem 0 0.75rem", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <StarRating rating={product.avgRating} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#888" }}>
                {product.avgRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.75rem", color: "#8B1E3F" }}>
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "#aaa", textDecoration: "line-through" }}>
                    {formatPrice(product.mrp)}
                  </span>
                  <span style={{ backgroundColor: "#FDF0F4", color: "#8B1E3F", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variant Selectors */}
            {Object.entries(variantGroups).map(([name, options]) => (
              <div key={name} style={{ marginBottom: "1rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#555", marginBottom: "0.5rem" }}>
                  {name}: <span style={{ color: "#8B1E3F" }}>{selectedVariants[name] ?? "—"}</span>
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      id={`variant-${opt.value.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [name]: opt.value }))}
                      style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "0.375rem",
                        border: selectedVariants[name] === opt.value ? "2px solid #8B1E3F" : "1.5px solid #E0D0C0",
                        backgroundColor: selectedVariants[name] === opt.value ? "#FDF0F4" : "#FFFBF5",
                        color: selectedVariants[name] === opt.value ? "#8B1E3F" : "#555",
                        fontFamily: "var(--font-body)",
                        fontWeight: selectedVariants[name] === opt.value ? 700 : 400,
                        fontSize: "0.85rem",
                        cursor: opt.stock === 0 ? "not-allowed" : "pointer",
                        opacity: opt.stock === 0 ? 0.4 : 1,
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

            {/* Quantity */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "#555", marginBottom: "0.5rem" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid #D4A017", borderRadius: "0.375rem", backgroundColor: "transparent", color: "#8B1E3F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}
                >
                  −
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", minWidth: 28, textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ width: 36, height: 36, border: "1.5px solid #D4A017", borderRadius: "0.375rem", backgroundColor: "transparent", color: "#8B1E3F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}
                >
                  +
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: product.stock < 10 ? "#E76F51" : "#2D6A4F" }}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : "In stock"}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
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
                  border: "2px solid #8B1E3F",
                  borderRadius: "0.625rem",
                  backgroundColor: "transparent",
                  color: "#8B1E3F",
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
                  borderRadius: "0.625rem",
                  backgroundColor: "#8B1E3F",
                  color: "#FFF8F0",
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

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "0.875rem", backgroundColor: "#FEF9EC", borderRadius: "0.625rem", border: "1px solid #FCF0C5", marginBottom: "1.25rem" }}>
              {[
                { icon: <Package size={16} />, text: "COD Available" },
                { icon: <RefreshCcw size={16} />, text: "Easy Returns" },
                { icon: <Shield size={16} />, text: "Secure Payment" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#6B5000" }}>
                  <span style={{ color: "#D4A017" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Details quick row */}
            {product.material && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#555", marginBottom: "0.4rem" }}>
                <strong>Material:</strong> {product.material}
              </p>
            )}
            {product.occasion && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#555", marginBottom: "0.4rem" }}>
                <strong>Occasion:</strong> {product.occasion}
              </p>
            )}

            {/* Tabs */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #F0E0C0" }}>
                {(["description", "care", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "0.625rem 1rem",
                      border: "none",
                      borderBottom: activeTab === tab ? "2px solid #8B1E3F" : "2px solid transparent",
                      backgroundColor: "transparent",
                      fontFamily: "var(--font-body)",
                      fontWeight: activeTab === tab ? 700 : 400,
                      fontSize: "0.85rem",
                      color: activeTab === tab ? "#8B1E3F" : "#888",
                      cursor: "pointer",
                      marginBottom: "-2px",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "care" ? "Care" : tab === "shipping" ? "Shipping" : "Description"}
                  </button>
                ))}
              </div>
              <div style={{ padding: "1rem 0", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#555", lineHeight: 1.7 }}>
                {activeTab === "description" && product.description}
                {activeTab === "care" && (product.careInstructions ?? "Keep away from water and perfume. Store in a cool, dry place.")}
                {activeTab === "shipping" && (product.shippingInfo ?? "Ships within 24–48 hours. Delivery in 3–7 business days across India. Free shipping above ₹499.")}
              </div>
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Customer Reviews
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {product.reviews.slice(0, 3).map((r) => (
                    <div key={r.id} style={{ padding: "0.875rem", backgroundColor: "#FFFBF5", borderRadius: "0.625rem", border: "1px solid #F0E0C0" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", color: "#1a1a1a" }}>{r.reviewerName}</span>
                          {r.isVerified && (
                            <span style={{ fontSize: "0.7rem", color: "#2D6A4F", backgroundColor: "#E8F5EE", padding: "0.15rem 0.4rem", borderRadius: "9999px", fontFamily: "var(--font-body)" }}>✓ Verified</span>
                          )}
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.75rem", textAlign: "center", marginBottom: "1rem" }}>
              You May Also Like
            </h2>
            <hr className="divider-gold" style={{ marginBottom: "2.5rem" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
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
