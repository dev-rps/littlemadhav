export default function TrustStrip() {
  const items = [
    { icon: "🤲", title: "Handmade", subtitle: "& Quality Checked" },
    { icon: "🚚", title: "Pan-India", subtitle: "Delivery" },
    { icon: "💵", title: "COD", subtitle: "Available" },
    { icon: "🔄", title: "Easy", subtitle: "Returns" },
    { icon: "💛", title: "10,000+", subtitle: "Happy Customers" },
    { icon: "🔒", title: "Secure", subtitle: "Payments" },
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--color-cream-alt)",
        borderBottom: "1px solid rgba(186,172,157,0.3)",
        borderTop: "1px solid rgba(186,172,157,0.3)",
        padding: "1.25rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
          className="sm:grid-cols-6"
        >
          {items.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 900,
                    fontSize: "0.8rem",
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
                    fontSize: "0.7rem",
                    color: "var(--color-taupe)",
                    margin: 0,
                    lineHeight: 1.2,
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
