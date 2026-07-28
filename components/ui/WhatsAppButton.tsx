"use client";
import Link from "next/link";

const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'm interested in placing an order on Mourika. Can you help me?"
);

export default function WhatsAppButton() {
  return (
    <a
      id="whatsapp-float-btn"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        textDecoration: "none",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.55)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)";
      }}
    >
      {/* WhatsApp SVG Icon */}
      <svg width="28" height="28" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.476.647 4.8 1.78 6.82L2 30l7.392-1.74A13.935 13.935 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.52 19.52c-.308.868-1.54 1.616-2.492 1.828-.66.148-1.528.268-4.428-.948-3.724-1.54-6.132-5.32-6.316-5.568-.176-.248-1.44-1.916-1.44-3.652 0-1.736.908-2.588 1.228-2.94.32-.348.696-.436.928-.436.232 0 .464 0 .668.008.216.008.504-.08.792.604.296.7 1.008 2.452 1.096 2.632.088.176.144.384.028.616-.116.228-.172.372-.34.572-.172.2-.36.444-.512.596-.176.172-.36.36-.156.708.208.348.924 1.524 1.984 2.468 1.36 1.22 2.512 1.596 2.86 1.776.348.18.552.152.756-.092.208-.24.888-1.036 1.124-1.392.236-.352.472-.292.796-.176.324.12 2.056.968 2.408 1.144.352.176.584.268.668.412.088.148.088.852-.22 1.68z"/>
      </svg>
    </a>
  );
}
