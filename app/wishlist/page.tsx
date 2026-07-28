"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);

  const handleMoveToBag = (item: any) => {
    addItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      quantity: 1,
      imageUrl: item.imageUrl,
      slug: item.slug,
    });
    toast.success("Moved to your bag! 🛍️");
  };

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#FFF8F0", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-taupe)", display: "flex", gap: "0.375rem", alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--color-taupe)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "var(--color-maroon)", fontWeight: 600 }}>Wishlist</span>
          </nav>
        </div>
      </div>

      <div style={{ padding: "3rem 0", backgroundColor: "var(--color-cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Heart size={24} fill="var(--color-maroon)" stroke="var(--color-maroon)" />
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
                Your Wishlist
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Heart size={48} style={{ color: "var(--color-gold-dark)", opacity: 0.5, marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-taupe)", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
              Explore our handcrafted collections and save your favorites here.
            </p>
            <Link
              href="/collections/all"
              className="inline-block px-8 py-3 bg-maroon hover:bg-maroon-dark text-cream rounded-[9999px] font-bold text-[0.9rem] no-underline transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-festive"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(186,172,157,0.3)",
                  borderRadius: "var(--radius-card, 1.125rem)",
                  backgroundColor: "var(--color-cream-alt)",
                }}
              >
                {/* Remove button */}
                <button
                  id={`remove-wishlist-${item.id}`}
                  onClick={() => {
                    removeWishlistItem(item.id);
                    toast.success("Removed from wishlist");
                  }}
                  style={{
                    position: "absolute",
                    top: "0.625rem",
                    right: "0.625rem",
                    zIndex: 2,
                    backgroundColor: "var(--color-white)",
                    border: "1px solid var(--color-blush)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} style={{ color: "var(--color-taupe)" }} className="hover:text-maroon transition-colors" />
                </button>

                {/* Image */}
                <Link href={`/products/${item.slug}`} style={{ display: "block" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "var(--color-cream)" }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>

                {/* Info */}
                <div style={{ padding: "0.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.88rem",
                        color: "var(--color-black)",
                        margin: 0,
                        lineHeight: 1.35,
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.4rem",
                      }}
                    >
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.1rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 900, fontSize: "0.95rem", color: "var(--color-maroon)" }}>
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-taupe)", textDecoration: "line-through" }}>
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    id={`add-bag-${item.id}`}
                    onClick={() => handleMoveToBag(item)}
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      width: "100%",
                      padding: "0.625rem",
                      backgroundColor: "var(--color-maroon)",
                      color: "var(--color-white)",
                      border: "none",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
