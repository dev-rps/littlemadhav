"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/lib/userStore";

export default function WishlistPage() {
  const localItems = useWishlistStore((s) => s.items);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useUserStore();

  // Sync authenticated wishlist on mount if logged in
  useEffect(() => {
    if (user) {
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => {
          if (data.wishlist && Array.isArray(data.wishlist)) {
            data.wishlist.forEach((item: any) => {
              addWishlistItem(item);
            });
          }
        })
        .catch((err) => console.error("Error fetching db wishlist:", err));
    }
  }, [user, addWishlistItem]);

  const handleRemove = (productId: string) => {
    removeWishlistItem(productId);
    if (user) {
      fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" }).catch(console.error);
    }
    toast.success("Removed from wishlist");
  };

  const handleMoveToBag = (item: any) => {
    addItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      mrp: item.mrp || Math.round(item.price * 1.3),
      quantity: 1,
      imageUrl: item.imageUrl,
      slug: item.slug,
    });
    toast.success("Added to your bag! 🛍️");
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: "80vh", backgroundColor: "#FFF8F0", paddingBottom: "4rem" }}>
        {/* Header Breadcrumb */}
        <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "0.75rem 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-taupe)", display: "flex", gap: "0.375rem", alignItems: "center" }}>
              <Link href="/" style={{ color: "var(--color-taupe)", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <span style={{ color: "var(--color-maroon)", fontWeight: 600 }}>Wishlist</span>
            </nav>
          </div>
        </div>

        <div style={{ padding: "2.5rem 0", backgroundColor: "var(--color-cream)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#8B1E3F]">
                  <Heart size={20} fill="#8B1E3F" />
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
                    My Saved Deity Favorites ({localItems.length})
                  </h1>
                  {user ? (
                    <p className="text-xs text-gray-500">Synced with {user.email}</p>
                  ) : (
                    <p className="text-xs text-amber-700">
                      <Link href="/login?redirect=/wishlist" className="underline font-semibold">Sign in</Link> to save favorites permanently across all devices.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {localItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <Heart size={48} style={{ color: "var(--color-gold-dark)", opacity: 0.5, marginBottom: "1rem" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
                Your Wishlist is Empty
              </h2>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--color-taupe)", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
                Explore our handcrafted Laddu Gopal dresses and save your favorites here.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-[#8B1E3F] hover:bg-[#6B1630] text-white rounded-full font-bold text-sm no-underline transition-colors shadow-md"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {localItems.map((item) => (
                <div
                  key={item.id}
                  className="card-festive"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(186,172,157,0.3)",
                    borderRadius: "1.125rem",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {/* Remove button */}
                  <button
                    id={`remove-wishlist-${item.id}`}
                    onClick={() => handleRemove(item.id)}
                    style={{
                      position: "absolute",
                      top: "0.625rem",
                      right: "0.625rem",
                      zIndex: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                    <Trash2 size={14} className="text-gray-500 hover:text-red-600 transition-colors" />
                  </button>

                  {/* Image */}
                  <Link href={`/products/${item.slug}`} style={{ display: "block" }}>
                    <div style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "#FFF8F0" }}>
                      <Image
                        src={item.imageUrl || "/images/placeholder.jpg"}
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
                          fontWeight: 600,
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
                      {item.mrp && item.mrp > item.price && (
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
      <Footer />
    </>
  );
}
