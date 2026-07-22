"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi RangRiwaaz! I have a question about my order or a product."
);

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.message.trim()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    setSubmitting(true);
    toast.loading("Sending your message...", { id: "contact" });

    // Mock form submission
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you within 24 hours. ✨", { id: "contact" });
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div style={{ backgroundColor: "#FFF8F0", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #8B1E3F 0%, #6B1630 100%)",
          color: "#FFF8F0",
          padding: "5rem 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="bg-mandala" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "#D4A017",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Get In Touch
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Yeseva One', serif)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            We&apos;re Here to Help You
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#FFF8F0cc",
              marginTop: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Have a question about shipping, bulk wedding orders, custom sizing, or just want to say hi? Write to us!
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}
          className="grid-cols-1 lg:grid-cols-[400px_1fr]"
        >
          {/* Contact Details Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              style={{
                backgroundColor: "#FFFBF5",
                border: "1px solid #F0E0C0",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(139,30,63,0.04)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Yeseva One', serif)",
                  fontSize: "1.5rem",
                  color: "#8B1E3F",
                  marginBottom: "1.5rem",
                }}
              >
                Contact Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  {
                    icon: <Mail size={20} style={{ color: "#D4A017" }} />,
                    title: "Email Support",
                    content: "hello@rangriwaaz.com",
                    desc: "Quick replies within 24 hours.",
                  },
                  {
                    icon: <Phone size={20} style={{ color: "#8B1E3F" }} />,
                    title: "Phone Support",
                    content: "+91 98765 43210",
                    desc: "Mon to Sat, 10 AM to 6 PM IST.",
                  },
                  {
                    icon: <MapPin size={20} style={{ color: "#2D6A4F" }} />,
                    title: "Studio Warehouse",
                    content: "RangRiwaaz D2C, GK-1, New Delhi, Delhi, 110048",
                    desc: "Artisan center & shipping hub.",
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#FFF8F0",
                        border: "1.5px solid #F0E0C0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", margin: "0 0 0.2rem" }}>
                        {item.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#8B1E3F", fontWeight: 600, margin: "0 0 0.1rem" }}>
                        {item.content}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#777", margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Quick Link Card */}
            <div
              style={{
                backgroundColor: "#E8F5EE",
                border: "1px solid #C3E5D0",
                borderRadius: "1rem",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "#25D366",
                  color: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                }}
              >
                <MessageCircle size={28} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#2D6A4F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                WhatsApp Quick Order
              </h3>
              <p style={{ fontFamily: "var(--font-body)", color: "#3F5E4E", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Prefer ordering or chatting on WhatsApp? Click below to chat directly with our customer happiness champion.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-[8px] font-bold text-[0.875rem] no-underline shadow-[0_4px_15px_rgba(37,211,102,0.25)] transition-all duration-200"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              backgroundColor: "#FFFBF5",
              border: "1px solid #F0E0C0",
              borderRadius: "1rem",
              padding: "2.5rem",
              boxShadow: "0 10px 30px rgba(139,30,63,0.04)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display, 'Yeseva One', serif)",
                fontSize: "1.75rem",
                color: "#8B1E3F",
                marginBottom: "0.5rem",
              }}
            >
              Send Us a Message
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "#777", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Required fields are marked with an asterisk (*)
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="grid-cols-1 sm:grid-cols-2">
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1.5px solid #F0E0C0",
                      borderRadius: "0.5rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Enter your email"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1.5px solid #F0E0C0",
                      borderRadius: "0.5rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      backgroundColor: "#FFF8F0",
                      color: "#1a1a1a",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What is this about? (e.g. Bulk Rakhi, Gift Hamper query)"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #F0E0C0",
                    borderRadius: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFF8F0",
                    color: "#1a1a1a",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#555", display: "block", marginBottom: "0.3rem" }}>
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Write your message details here..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #F0E0C0",
                    borderRadius: "0.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFF8F0",
                    color: "#1a1a1a",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  backgroundColor: submitting ? "#aaa" : "#8B1E3F",
                  color: "#FFF8F0",
                  border: "none",
                  borderRadius: "0.625rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                <Send size={16} />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Styled Location Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          style={{
            fontFamily: "var(--font-display, 'Yeseva One', serif)",
            fontSize: "1.75rem",
            color: "#8B1E3F",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Find Our Studio
        </h2>
        <div
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "1rem",
            overflow: "hidden",
            border: "1.5px solid #F0E0C0",
            position: "relative",
            backgroundColor: "#F5EDE0",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14018.665798993206!2d77.23419085817887!3d28.54972584989678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c415555555%3A0x7d6f51f50ea26876!2sGreater%20Kailash%20I%2C%20New%20Delhi%2C%20Delhi%20110048!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="RangRiwaaz Greater Kailash Studio Location Map"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
