"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
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
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <div style={{ display: "flex" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={11}
            fill={star <= Math.round(rating) ? "#C5A059" : "none"}
            stroke={star <= Math.round(rating) ? "#C5A059" : "#ccc"}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.7rem", color: "#888", fontFamily: "var(--font-body, Jost, sans-serif)" }}>
        ({count})
      </span>
    </div>
  );
}

export default function ProductCard({ product }: Props) {
  const { addItem, openDrawer } = useCartStore();
  const [hovered, setHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants[0]?.value
  );
  const isWishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const primaryImage = product.images[0]?.url ?? "/placeholder.jpg";
  const secondImage = product.images[1]?.url ?? primaryImage;
  const discount = getDiscountPercent(product.mrp, product.price);
  const rating = product.averageRating ?? 4.5;
  const reviewCount = product.reviewCount ?? 12;

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      quantity: 1,
      variant: selectedVariant,
      imageUrl: primaryImage,
      slug: product.slug,
    });
    toast.success(`${product.name.slice(0, 24)}… added to bag!`, {
      icon: "🛍️",
    });
  };

  return (
    <div
      className="card-festive"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(186, 172, 157, 0.3)",
        borderRadius: "var(--radius-card, 1.125rem)",
        backgroundColor: "var(--color-cream-alt)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div
        style={{
          position: "absolute",
          top: "0.625rem",
          left: "0.625rem",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {product.isSale && discount > 0 && (
          <span
            style={{
              backgroundColor: "var(--color-blush)",
              color: "var(--color-maroon)",
              fontSize: "0.68rem",
              fontWeight: 900,
              fontFamily: "var(--font-body, Lato, sans-serif)",
              padding: "0.2rem 0.5rem",
              borderRadius: "0.375rem",
              letterSpacing: "0.05em",
            }}
          >
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span
            style={{
              backgroundColor: "var(--color-gold-dark)",
              color: "var(--color-white)",
              fontSize: "0.68rem",
              fontWeight: 900,
              fontFamily: "var(--font-body, Lato, sans-serif)",
              padding: "0.2rem 0.5rem",
              borderRadius: "0.375rem",
              letterSpacing: "0.05em",
            }}
          >
            NEW
          </span>
        )}
      </div>

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
          top: "0.625rem",
          right: "0.625rem",
          zIndex: 2,
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-blush)",
          borderRadius: "50%",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={14}
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
            aspectRatio: "3 / 4",
            backgroundColor: "var(--color-cream)",
          }}
        >
          <Image
            src={hovered ? secondImage : primaryImage}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease, opacity 0.3s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "0.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {/* Brand Tag */}
        <span style={{ fontSize: "0.62rem", color: "var(--color-taupe)", fontFamily: "var(--font-body, Lato, sans-serif)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
          MOURIKA
        </span>

        {/* Name */}
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontFamily: "var(--font-body, Lato, sans-serif)",
              fontSize: "0.88rem",
              color: "var(--color-black)",
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.4rem",
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
                fill={star <= Math.round(rating) ? "var(--color-gold-dark)" : "none"}
                stroke={star <= Math.round(rating) ? "var(--color-gold-dark)" : "var(--color-taupe)"}
              />
            ))}
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--color-taupe)", fontFamily: "var(--font-body, Lato, sans-serif)" }}>
            ({reviewCount})
          </span>
        </div>

        {/* Prices */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.1rem" }}>
          <span
            style={{
              fontFamily: "var(--font-body, Lato, sans-serif)",
              fontWeight: 900,
              fontSize: "0.95rem",
              color: "var(--color-maroon)",
            }}
          >
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span
              style={{
                fontFamily: "var(--font-body, Lato, sans-serif)",
                fontSize: "0.78rem",
                color: "var(--color-taupe)",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {/* Variant Selector */}
        {firstVariantName && variantGroups[firstVariantName].length > 1 && (
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
            {variantGroups[firstVariantName].slice(0, 4).map((val) => {
              const isSelected = selectedVariant === val;
              const isShort = val.length <= 4;
              return (
                <button
                  key={val}
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(val); }}
                  style={{
                    width: isShort ? "28px" : "auto",
                    height: isShort ? "28px" : "auto",
                    padding: isShort ? "0" : "0.2rem 0.55rem",
                    borderRadius: isShort ? "50%" : "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isSelected ? "1px solid var(--color-maroon)" : "1px solid var(--color-taupe)",
                    backgroundColor: isSelected ? "var(--color-maroon)" : "var(--color-white)",
                    color: isSelected ? "var(--color-white)" : "var(--color-taupe)",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-body, Lato, sans-serif)",
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

      {/* Slide-up Full Width Add to Cart button */}
      <button
        id={`add-to-cart-${product.id}`}
        onClick={handleAddToCart}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          padding: "0.75rem",
          backgroundColor: "var(--color-maroon)",
          color: "var(--color-white)",
          border: "none",
          fontFamily: "var(--font-body, Lato, sans-serif)",
          fontWeight: 700,
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          opacity: hovered ? 1 : 0,
          zIndex: 5,
        }}
      >
        <ShoppingBag size={14} />
        Add to Cart
      </button>
    </div>
  );
}
