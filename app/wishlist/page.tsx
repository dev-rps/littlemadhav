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
      <div style={{ backgroundColor: "#FFFBF5", borderBottom: "1px solid #F0E0C0", padding: "1.5rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#888", display: "flex", gap: "0.375rem", alignItems: "center", marginBottom: "0.5rem" }}>
            <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#8B1E3F", fontWeight: 600 }}>Wishlist</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Heart size={24} fill="#8B1E3F" stroke="#8B1E3F" />
            <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.75rem", color: "#8B1E3F", margin: 0 }}>
              Your Wishlist
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Heart size={48} style={{ color: "#D4A017", opacity: 0.5, marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.5rem", color: "#8B1E3F", margin: 0 }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
              Explore our handcrafted collections and save your favorites here.
            </p>
            <Link
              href="/collections/all"
              className="inline-block px-8 py-3 bg-maroon hover:bg-maroon-dark text-cream rounded-[8px] font-bold text-[0.9rem] no-underline transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-festive"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
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
                    backgroundColor: "#FFFBF5",
                    border: "1px solid #F0E0C0",
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
                  <Trash2 size={14} style={{ color: "#aaa" }} className="hover:text-maroon transition-colors" />
                </button>

                {/* Image */}
                <Link href={`/products/${item.slug}`} style={{ display: "block" }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", backgroundColor: "#F5EDE0" }}>
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
                <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display, 'Yeseva One', serif)",
                        fontSize: "0.9rem",
                        color: "#1a1a1a",
                        margin: 0,
                        lineHeight: 1.3,
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
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.95rem", color: "#8B1E3F" }}>
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#aaa", textDecoration: "line-through" }}>
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
                      backgroundColor: "#8B1E3F",
                      color: "#FFF8F0",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
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
