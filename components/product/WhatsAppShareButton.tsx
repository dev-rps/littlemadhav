"use client";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Copy, Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface WhatsAppShareProps {
  product: {
    name: string;
    price: number;
    mrp: number;
    slug: string;
    category?: string;
  };
  variant?: "full" | "compact" | "icon";
  className?: string;
}

export default function WhatsAppShareButton({
  product,
  variant = "full",
  className = "",
}: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false);

  const getProductUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/products/${product.slug}`;
    }
    return `https://mourika.com/products/${product.slug}`;
  };

  const generateWhatsAppMessage = () => {
    const url = getProductUrl();
    const discount =
      product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;
    const savings = discount > 0 ? ` (${discount}% OFF)` : "";
    const mrpStr =
      product.mrp > product.price
        ? ` ~₹${product.mrp.toLocaleString("en-IN")}~`
        : "";

    const lines = [
      `🌸 *${product.name.trim()}* 🌸`,
      product.category ? `🏷️ *Category:* ${product.category}` : null,
      ``,
      `✨ *Special Festive Price:* ₹${product.price.toLocaleString("en-IN")}${mrpStr}${savings}`,
      `🚚 *Free Shipping* across India above ₹499 | COD Available`,
      `🪔 100% Handcrafted Festive Heritage Collection by *Mourika*`,
      ``,
      `👉 *Check it out & order here:*`,
      `${url}`,
    ];

    return lines.filter((line) => line !== null).join("\n");
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    toast.success("Opening WhatsApp to share...", {
      icon: "💬",
      duration: 2500,
    });
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const url = getProductUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Product link copied to clipboard!", {
        icon: "📋",
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy link");
    }
  };

  // Compact / Icon Variant for Product Cards
  if (variant === "icon") {
    return (
      <button
        onClick={handleWhatsAppShare}
        aria-label="Share product on WhatsApp"
        title="Share on WhatsApp"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#25D366",
          color: "#FFFFFF",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,211,102,0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        className={`hover:scale-110 active:scale-95 ${className}`}
      >
        <FaWhatsapp size={17} />
      </button>
    );
  }

  // Compact Inline Pill Variant
  if (variant === "compact") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
        className={className}
      >
        <button
          onClick={handleWhatsAppShare}
          id={`share-whatsapp-${product.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            backgroundColor: "#25D366",
            color: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.8rem",
            padding: "0.45rem 0.95rem",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(37,211,102,0.25)",
            transition: "all 0.2s ease",
          }}
          className="hover:opacity-95 hover:shadow-md active:scale-98"
        >
          <FaWhatsapp size={16} />
          <span>Share on WhatsApp</span>
        </button>

        <button
          onClick={handleCopyLink}
          title="Copy Link"
          aria-label="Copy product link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #BAAC9D",
            color: copied ? "#25D366" : "#660D19",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="hover:bg-cream"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  }

  // Full Professional Card Banner (for Product Details & Quick View)
  return (
    <div
      style={{
        backgroundColor: "#F0FDF4",
        border: "1.5px solid #BBF7D0",
        borderRadius: "14px",
        padding: "0.85rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.85rem",
        flexWrap: "wrap",
        boxShadow: "0 2px 10px rgba(37,211,102,0.08)",
      }}
      className={className}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            backgroundColor: "#25D366",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 3px 10px rgba(37,211,102,0.35)",
          }}
        >
          <FaWhatsapp size={22} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "#14532D",
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Love this piece? Share with family!
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "#166534",
              margin: "0.15rem 0 0 0",
              fontWeight: 500,
            }}
          >
            Send photos, price & instant order link directly on WhatsApp
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={handleWhatsAppShare}
          id={`share-whatsapp-btn-${product.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            backgroundColor: "#25D366",
            color: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.84rem",
            padding: "0.5rem 1.05rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,211,102,0.3)",
            transition: "all 0.2s ease",
          }}
          className="hover:brightness-105 active:scale-98"
        >
          <FaWhatsapp size={16} />
          <span>Share on WhatsApp</span>
        </button>

        <button
          onClick={handleCopyLink}
          title="Copy Link to Clipboard"
          aria-label="Copy product link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.5rem 0.8rem",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #86EFAC",
            color: copied ? "#15803D" : "#166534",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="hover:bg-green-50 active:scale-98"
        >
          {copied ? (
            <>
              <Check size={14} style={{ color: "#16A34A" }} />
              <span style={{ color: "#16A34A" }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
