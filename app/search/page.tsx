"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

function SearchLoading() {
  return (
    <div style={{ minHeight: "60vh", backgroundColor: "#FFF8F0", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-body)", color: "#888" }}>Searching our craft collection...</div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<ProductCardData[]>([]);

  const fetchResults = useCallback(async () => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=4&featured=true");
      const data = await res.json();
      setRecommendations(data.products ?? []);
    } catch {
      setRecommendations([]);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    fetchRecommendations();
  }, [fetchResults, fetchRecommendations]);

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#FFF8F0", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#FFFBF5", borderBottom: "1px solid #F0E0C0", padding: "1.5rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.75rem", color: "#8B1E3F", margin: 0 }}>
            Search Results
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#888", margin: "0.25rem 0 0" }}>
            Showing results for &ldquo;<strong style={{ color: "#D4A017" }}>{query}</strong>&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: "1rem", backgroundColor: "#F5EDE0", aspectRatio: "3/4", animation: "pulse-soft 2s ease-in-out infinite" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)', serif", fontSize: "1.5rem", color: "#8B1E3F", margin: 0 }}>
              No matches found
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
              We couldn&apos;t find anything matching your search term. Check spelling or try something else.
            </p>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ textAlign: "left", marginTop: "4rem" }}>
                <h3 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>
                  Popular Picks for You
                </h3>
                <hr className="divider-gold" style={{ marginBottom: "2rem" }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
                  {recommendations.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>
              Found {products.length} matching item{products.length > 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
