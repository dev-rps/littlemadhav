import { HandHeart, Truck, Banknote, RotateCcw, Users, ShieldCheck } from "lucide-react";

const items = [
  { Icon: HandHeart, title: "Handmade", subtitle: "& Quality Checked" },
  { Icon: Truck, title: "Pan-India", subtitle: "Delivery" },
  { Icon: Banknote, title: "COD", subtitle: "Available" },
  { Icon: RotateCcw, title: "Easy", subtitle: "Returns" },
  { Icon: Users, title: "10,000+", subtitle: "Happy Customers" },
  { Icon: ShieldCheck, title: "Secure", subtitle: "Payments" },
];

export default function TrustStrip() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-cream-alt)",
        borderBottom: "1px solid rgba(102,13,25,0.06)",
        borderTop: "1px solid rgba(102,13,25,0.06)",
        padding: "1.5rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
          className="sm:!grid-cols-6"
        >
          {items.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.875rem 0.5rem",
                textAlign: "center",
                backgroundColor: "var(--color-white)",
                borderRadius: "14px",
                border: "1px solid rgba(102,13,25,0.06)",
                transition: "all 0.25s ease",
              }}
            >
              <item.Icon size={20} style={{ color: "var(--color-gold)", strokeWidth: 2 }} />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 900,
                    fontSize: "0.78rem",
                    color: "var(--color-maroon)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.68rem",
                    color: "var(--color-muted)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
