"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Star } from "lucide-react";
import { ProductCardData } from "./ProductCard";
import { useCartStore } from "@/lib/store";
import { formatPrice, getDiscountPercent, getSizeAdjustment } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: ProductCardData | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { addItem } = useCartStore();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [imgError, setImgError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});

  if (!product) return null;

  const effectiveVariant = selectedVariant ?? product.variants[0]?.value;
  const isSizeVariant = product.variants.some(v => v.value === effectiveVariant && v.name.toLowerCase() === 'size');
  const sizeAdjustment = isSizeVariant ? getSizeAdjustment(effectiveVariant) : 0;
  const adjustedPrice = product.price + sizeAdjustment;
  const adjustedMrp = product.mrp + sizeAdjustment;
  const discount = getDiscountPercent(adjustedMrp, adjustedPrice);
  const rating = product.averageRating ?? 4.5;
  const reviewCount = product.reviewCount ?? 12;

  // Format variant string as "Name: Value"
  const matchingVarObj = product.variants.find(v => v.value === effectiveVariant);
  const formattedVariant = matchingVarObj ? `${matchingVarObj.name}: ${effectiveVariant}` : effectiveVariant;

  // Build up to 4 thumbnails; pad with nulls if fewer images
  const MAX_THUMBS = 4;
  const thumbImages = [
    ...product.images.slice(0, MAX_THUMBS),
    ...Array(Math.max(0, MAX_THUMBS - product.images.length)).fill(null),
  ];

  const variantGroups = product.variants.reduce<Record<string, string[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      if (!acc[v.name].includes(v.value)) acc[v.name].push(v.value);
      return acc;
    },
    {}
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: adjustedPrice,
      mrp: adjustedMrp,
      quantity: 1,
      variant: formattedVariant,
      imageUrl: product.images[0]?.url ?? "",
      slug: product.slug,
    });
    toast.success(`${product.name.slice(0, 24)}… added to bag!`, { icon: "🛍️" });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fade-in 0.2s ease",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div
        style={{
          backgroundColor: "var(--color-white)",
          borderRadius: "16px",
          maxWidth: 860,
          width: "100%",
          maxHeight: "92vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 20px 60px rgba(102,13,25,0.2)",
          animation: "scale-in 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            backgroundColor: "var(--color-white)",
            border: "1px solid rgba(102,13,25,0.1)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          aria-label="Close quick view"
        >
          <X size={18} style={{ color: "var(--color-maroon)" }} />
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
          className="sm:grid-cols-2"
        >
          {/* ── Left: Image Preview Section (Thumbnails on Left + 4:3 Main Box) ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.6rem",
              padding: "1rem",
              backgroundColor: "var(--color-cream)",
              borderRadius: "16px 16px 0 0",
              alignItems: "flex-start",
            }}
            className="sm:rounded-l-[16px] sm:rounded-tr-none"
          >
            {/* ── 4 Small Vertical Left Thumbnail Boxes (Amazon/Flipkart Style) ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                flexShrink: 0,
              }}
            >
              {thumbImages.map((img, idx) => {
                const isActive = idx === activeImage;
                const isNull = img === null;
                const hasThumbError = thumbErrors[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isNull && !hasThumbError) setActiveImage(idx);
                    }}
                    aria-label={img ? `View angle ${idx + 1}` : "No image"}
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: isActive && !isNull
                        ? "2px solid var(--color-maroon)"
                        : "1.5px solid rgba(186,172,157,0.4)",
                      backgroundColor: "#F4E8DB",
                      cursor: isNull ? "default" : "pointer",
                      position: "relative",
                      outline: "none",
                      transition: "all 0.15s ease",
                      padding: 0,
                      opacity: isNull ? 0.45 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isNull && !isActive)
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gold)";
                    }}
                    onMouseOut={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(186,172,157,0.4)";
                    }}
                  >
                    {isNull || hasThumbError ? (
                      /* Placeholder box for angle */
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#CD9703" strokeWidth="1.5" strokeDasharray="2 2" />
                          <circle cx="12" cy="11" r="3" stroke="#CD9703" strokeWidth="1.5" />
                          <path d="M3 18l4-4 3 3 4-5 7 6" stroke="#CD9703" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src={(img as { url: string; alt: string | null }).url}
                        alt={(img as { url: string; alt: string | null }).alt ?? `Product angle ${idx + 1}`}
                        fill
                        sizes="54px"
                        style={{ objectFit: "cover" }}
                        onError={() => setThumbErrors((prev) => ({ ...prev, [idx]: true }))}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Main Preview Image (Compact 4:3 Box) ── */}
            <div
              style={{
                position: "relative",
                flex: 1,
                aspectRatio: "4 / 3", /* 4:3 Box as requested */
                overflow: "hidden",
                borderRadius: "10px",
                backgroundColor: "#F4E8DB",
              }}
            >
              {imgError ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(145deg, #FBF3E9, #F4E8DB)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--color-taupe)",
                      fontSize: "0.85rem",
                    }}
                  >
                    No image available
                  </span>
                </div>
              ) : product.images[activeImage] ? (
                <Image
                  src={product.images[activeImage].url}
                  alt={product.images[activeImage].alt ?? product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              ) : null}

              {/* Discount badge */}
              {product.isSale && discount > 0 && (
                <span className="badge-discount" style={{ position: "absolute", top: 10, left: 10 }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* ── Right: Product Details ── */}
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {product.category && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {product.category.name}
              </span>
            )}

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.35rem",
                color: "var(--color-maroon)",
                margin: 0,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ display: "flex" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= Math.round(rating) ? "var(--color-gold)" : "none"}
                    stroke={star <= Math.round(rating) ? "var(--color-gold)" : "var(--color-taupe)"}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-muted)" }}>
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "var(--color-maroon)",
                }}
              >
                {formatPrice(adjustedPrice)}
              </span>
              {adjustedMrp > adjustedPrice && (
                <>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      color: "var(--color-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(adjustedMrp)}
                  </span>
                  <span
                    style={{
                      backgroundColor: "var(--color-blush)",
                      color: "var(--color-maroon)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                    }}
                  >
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {Object.entries(variantGroups).map(([name, options]) => (
              <div key={name}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "var(--color-body)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {name}
                </p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {options.map((val) => {
                    const isSelected = (selectedVariant ?? product.variants[0]?.value) === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedVariant(val)}
                        style={{
                          padding: "0.35rem 0.85rem",
                          borderRadius: "9999px",
                          border: isSelected
                            ? "2px solid var(--color-maroon)"
                            : "1.5px solid var(--color-taupe)",
                          backgroundColor: isSelected ? "var(--color-maroon)" : "var(--color-white)",
                          color: isSelected ? "var(--color-white)" : "var(--color-body)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto", paddingTop: "0.75rem" }}>
              <button
                onClick={handleAddToCart}
                className="btn-primary ripple"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                <ShoppingBag size={16} />
                Add to Bag
              </button>
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, padding: "0.75rem", textAlign: "center" }}
              >
                View Details
              </Link>
            </div>

            {/* Trust strip */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                fontSize: "0.72rem",
                color: "var(--color-muted)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                flexWrap: "wrap",
              }}
            >
              <span>✓ COD Available</span>
              <span>✓ Easy Returns</span>
              <span>✓ Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
