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
          backgroundColor: "var(--color-cream)",
          borderRadius: "1.125rem",
          maxWidth: 460,
          width: "100%",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 20px 60px rgba(102,13,25,0.2)",
          border: "2px solid var(--color-gold-dark)",
          animation: "scale-in 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Festive header */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))",
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
              top: 10,
              right: 10,
              color: "rgba(255,255,255,0.7)",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              fontSize: "1.25rem",
              lineHeight: 1,
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            aria-label="Close discount popup"
          >
            ✕
          </button>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎁</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold-light)",
              fontSize: "1.5rem",
              margin: 0,
              fontWeight: 700,
            }}
          >
            Wait! Here&apos;s a treat for you
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body)", fontSize: "0.875rem", marginTop: "0.4rem" }}>
            Get <strong style={{ color: "var(--color-gold-light)" }}>15% OFF</strong> on your first order
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
                  color: "var(--color-black)",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Enter your email to unlock your exclusive discount code:
              </p>
              <div
                style={{
                  backgroundColor: "var(--color-cream-alt)",
                  border: "2px solid var(--color-gold-dark)",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  padding: "0.625rem",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 900,
                  color: "var(--color-maroon)",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                }}
              >
                MOURIKA15
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
              >
                <input
                  id="exit-popup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: "1 1 200px",
                    minWidth: 0,
                    padding: "0.625rem 0.875rem",
                    border: "1.5px solid var(--color-taupe)",
                    borderRadius: "9999px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    outline: "none",
                    backgroundColor: "var(--color-white)",
                    color: "var(--color-black)",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--color-maroon)",
                    color: "var(--color-white)",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "0.625rem 1.25rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
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
                    color: "var(--color-taupe)",
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
                  fontFamily: "var(--font-display)",
                  color: "var(--color-maroon)",
                  fontSize: "1.25rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                Code sent to your inbox!
              </h3>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--color-black)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Use <strong style={{ color: "var(--color-maroon)" }}>MOURIKA15</strong> at checkout for 15% off.
              </p>
              <button
                onClick={dismiss}
                style={{
                  backgroundColor: "var(--color-maroon)",
                  color: "var(--color-white)",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.625rem 1.5rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
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
