"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

function SearchLoading() {
  return (
    <div style={{ minHeight: "60vh", backgroundColor: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>Searching our craft collection...</div>
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
    <div style={{ minHeight: "80vh", backgroundColor: "var(--color-cream)", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "1.5rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
            Search Results
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-taupe)", margin: "0.25rem 0 0" }}>
            Showing results for &ldquo;<strong style={{ color: "var(--color-gold-dark)" }}>{query}</strong>&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "4/5" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
              No matches found
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-taupe)", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
              We couldn&apos;t find anything matching your search term. Check spelling or try something else.
            </p>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ textAlign: "left", marginTop: "4rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center", fontWeight: 700 }}>
                  Popular Picks for You
                </h3>
                <hr className="divider-gold" style={{ marginBottom: "2rem" }} />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendations.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-taupe)", marginBottom: "1.5rem" }}>
              Found {products.length} matching item{products.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
