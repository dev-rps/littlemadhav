"use client";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice, getDiscountPercent, getSizeAdjustment } from "@/lib/utils";
import toast from "react-hot-toast";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  isSale: boolean;
  isNewArrival: boolean;
  images: { url: string; alt: string | null }[];
  variants: { name: string; value: string; priceAdj: number }[];
  averageRating?: number;
  reviewCount?: number;
  category?: { name: string };
}

interface Props {
  product: ProductCardData;
  onQuickView?: (product: ProductCardData) => void;
}

/* ── Branded Fallback (cream bg + gold logo mark) ── */
function BrandedFallback({ name }: { name: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg, #FBF3E9 0%, #F4E8DB 60%, #FBD5CD 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#CD9703" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="6" fill="#CD9703" opacity="0.12" />
        <circle cx="12" cy="12" r="4" stroke="#CD9703" strokeWidth="1.5" fill="none" />
      </svg>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", color: "#BAAC9D", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        MOURIKA
      </span>
    </div>
  );
}

export default function ProductCard({ product, onQuickView }: Props) {
  const { addItem } = useCartStore();
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [primaryError, setPrimaryError] = useState(false);
  const [secondError, setSecondError] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants[0]?.value
  );
  const isWishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const primaryImage = product.images[0]?.url ?? "";
  const secondImage = product.images[1]?.url ?? primaryImage;
  const showSecondImage = hasHover && hovered && secondImage !== primaryImage && !secondError;
  const currentSrc = showSecondImage ? secondImage : primaryImage;
  const isSizeVariant = product.variants.some(v => v.value === selectedVariant && v.name.toLowerCase() === 'size');
  const sizeAdjustment = isSizeVariant ? getSizeAdjustment(selectedVariant) : 0;
  const adjustedPrice = product.price + sizeAdjustment;
  const adjustedMrp = product.mrp + sizeAdjustment;
  const discount = getDiscountPercent(adjustedMrp, adjustedPrice);
  const rating = product.averageRating ?? 4.5;
  const reviewCount = product.reviewCount ?? 12;
  const savings = adjustedMrp - adjustedPrice;

  // Format variant string as "Name: Value"
  const matchingVarObj = product.variants.find(v => v.value === selectedVariant);
  const formattedVariant = matchingVarObj ? `${matchingVarObj.name}: ${selectedVariant}` : selectedVariant;

  // Get unique variant names for grouping
  const variantGroups = product.variants.reduce<Record<string, string[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      if (!acc[v.name].includes(v.value)) acc[v.name].push(v.value);
      return acc;
    },
    {}
  );
  const firstVariantName = Object.keys(variantGroups)[0];

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: adjustedPrice,
      mrp: adjustedMrp,
      quantity: 1,
      variant: formattedVariant,
      imageUrl: primaryImage,
      slug: product.slug,
    });
    toast.success(`${product.name.slice(0, 24)}… added to bag!`, {
      icon: "🛍️",
    });
  }, [addItem, product, formattedVariant, primaryImage, adjustedPrice, adjustedMrp]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }, [onQuickView, product]);

  return (
    <div
      className="card-festive"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        backgroundColor: "var(--color-cream-card)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "0.5rem",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        {product.isSale && discount > 0 && (
          <span className="badge-discount">-{discount}%</span>
        )}
        {product.isNewArrival && (
          <span className="badge-new">NEW</span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        id={`wishlist-${product.id}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isWishlisted) {
            removeWishlistItem(product.id);
            toast.success("Removed from wishlist");
          } else {
            addWishlistItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              mrp: product.mrp,
              imageUrl: primaryImage,
            });
            toast.success("Added to wishlist ❤️");
          }
        }}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          zIndex: 2,
          backgroundColor: "var(--color-white)",
          border: "none",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 2px 8px rgba(102,13,25,0.1)",
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={15}
          fill={isWishlisted ? "var(--color-maroon)" : "none"}
          stroke={isWishlisted ? "var(--color-maroon)" : "var(--color-taupe)"}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ display: "block", textDecoration: "none" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "1 / 1",
            backgroundColor: "var(--color-cream)",
          }}
        >
          {/* Skeleton shimmer while loading */}
          {!imgLoaded && !primaryError && (
            <div className="skeleton" style={{ position: "absolute", inset: 0 }} />
          )}

          {/* Branded fallback on error */}
          {primaryError ? (
            <BrandedFallback name={product.name} />
          ) : (
            <Image
              src={currentSrc}
              alt={product.images[0]?.alt ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.4s ease, opacity 0.3s ease",
                transform: showSecondImage ? "scale(1.05)" : "scale(1)",
                opacity: imgLoaded ? 1 : 0,
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                if (showSecondImage) {
                  setSecondError(true);
                } else {
                  setPrimaryError(true);
                }
              }}
            />
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "0.6rem 0.65rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {/* Name */}
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--color-black)",
              margin: 0,
              fontWeight: 600,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.2rem",
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <div style={{ display: "flex" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                fill={star <= Math.round(rating) ? "var(--color-gold)" : "none"}
                stroke={star <= Math.round(rating) ? "var(--color-gold)" : "var(--color-taupe)"}
              />
            ))}
          </div>
          <span style={{ fontSize: "0.68rem", color: "var(--color-muted)", fontFamily: "var(--font-body)" }}>
            ({reviewCount})
          </span>
        </div>

        {/* Prices + Savings */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.15rem" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 900,
              fontSize: "0.95rem",
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
                  fontSize: "0.75rem",
                  color: "var(--color-muted)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(adjustedMrp)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  color: "var(--color-green)",
                  fontWeight: 700,
                }}
              >
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* Variant Selector */}
        {firstVariantName && variantGroups[firstVariantName].length > 1 && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.15rem" }}>
            {variantGroups[firstVariantName].slice(0, 4).map((val) => {
              const isSelected = selectedVariant === val;
              const isShort = val.length <= 4;
              return (
                <button
                  key={val}
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(val); }}
                  style={{
                    width: isShort ? "26px" : "auto",
                    height: isShort ? "26px" : "auto",
                    padding: isShort ? "0" : "0.15rem 0.5rem",
                    borderRadius: isShort ? "50%" : "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isSelected ? "1.5px solid var(--color-maroon)" : "1px solid var(--color-taupe)",
                    backgroundColor: isSelected ? "var(--color-maroon)" : "var(--color-white)",
                    color: isSelected ? "var(--color-white)" : "var(--color-muted)",
                    fontSize: "0.62rem",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    fontWeight: isSelected ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {val}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Quick Action Button (always accessible on touch devices) */}
      <div className="block sm:hidden" style={{ padding: "0 0.65rem 0.65rem" }}>
        <button
          id={`mobile-add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
            padding: "0.45rem",
            backgroundColor: "var(--color-maroon)",
            color: "var(--color-white)",
            border: "none",
            borderRadius: "6px",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={12} />
          Add to Cart
        </button>
      </div>

      {/* Desktop Hover overlay buttons */}
      <div
        className="hidden sm:flex"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          gap: 0,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          opacity: hovered ? 1 : 0,
          zIndex: 5,
        }}
      >
        {onQuickView && (
          <button
            onClick={handleQuickView}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              padding: "0.65rem",
              backgroundColor: "var(--color-gold)",
              color: "var(--color-white)",
              border: "none",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              cursor: "pointer",
            }}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={13} />
            Quick View
          </button>
        )}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          style={{
            flex: onQuickView ? 1 : undefined,
            width: onQuickView ? undefined : "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            padding: "0.65rem",
            backgroundColor: "var(--color-maroon)",
            color: "var(--color-white)",
            border: "none",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
