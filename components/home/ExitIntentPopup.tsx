"use client";
import { useState, useEffect } from "react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("rr-exit-popup-dismissed");
    if (dismissed) return;

    let triggered = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered) {
        triggered = true;
        setTimeout(() => setShow(true), 200);
      }
    };

    // Mobile: show after 45s on page
    const mobileTimer = setTimeout(() => {
      if (!triggered && window.innerWidth < 768) {
        triggered = true;
        setShow(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("rr-exit-popup-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fade-up 0.3s ease",
      }}
      onClick={dismiss}
    >
      <div
        style={{
          backgroundColor: "#FFFBF5",
          borderRadius: "1.25rem",
          maxWidth: 460,
          width: "100%",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 60px rgba(139,30,63,0.25)",
          border: "2px solid #D4A017",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Festive header */}
        <div
          style={{
            background: "linear-gradient(135deg, #8B1E3F, #6B1630)",
            padding: "1.5rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            id="exit-popup-close"
            onClick={dismiss}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#FFF8F080",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
            aria-label="Close popup"
          >
            ✕
          </button>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎁</div>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Yeseva One', serif)",
              color: "#D4A017",
              fontSize: "1.5rem",
              margin: 0,
            }}
          >
            Wait! Here&apos;s a treat for you
          </h2>
          <p style={{ color: "#FFF8F0aa", fontFamily: "var(--font-body)", fontSize: "0.875rem", marginTop: "0.4rem" }}>
            Get <strong style={{ color: "#D4A017" }}>15% OFF</strong> on your first order
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          {!submitted ? (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-body)",
                  color: "#555",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Enter your email to unlock your exclusive discount code:
              </p>
              <div
                style={{
                  backgroundColor: "#FFF8F0",
                  border: "2px solid #D4A017",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  padding: "0.625rem",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  color: "#8B1E3F",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                }}
              >
                RANG15
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <input
                  id="exit-popup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: "0.625rem 0.875rem",
                    border: "1.5px solid #F0E0C0",
                    borderRadius: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    outline: "none",
                    backgroundColor: "#FFF8F0",
                    color: "#1a1a1a",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#8B1E3F",
                    color: "#FFF8F0",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.625rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Claim Now
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <button
                  onClick={dismiss}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#aaa",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  No thanks, I prefer full price
                </button>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
              <h3
                style={{
                  fontFamily: "var(--font-display, 'Yeseva One', serif)",
                  color: "#8B1E3F",
                  fontSize: "1.25rem",
                  marginBottom: "0.5rem",
                }}
              >
                Code sent to your inbox!
              </h3>
              <p style={{ fontFamily: "var(--font-body)", color: "#555", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Use <strong style={{ color: "#8B1E3F" }}>RANG15</strong> at checkout for 15% off.
              </p>
              <button
                onClick={dismiss}
                style={{
                  backgroundColor: "#8B1E3F",
                  color: "#FFF8F0",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.625rem 1.5rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Shop Now 🛍️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
