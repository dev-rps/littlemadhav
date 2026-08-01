import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ExitIntentPopup from "@/components/home/ExitIntentPopup";

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mourika.com"),
  title: {
    default: "Mourika — Handcrafted Deity Dresses, Festive Decor & Shringar",
    template: "%s | Mourika",
  },
  description:
    "Shop beautiful handcrafted Bal Gopal dresses, festive home decor, and deity shringar accessories. Trusted by thousands. COD available. Free shipping above ₹499.",
  keywords: ["Laddu Gopal Dresses", "Festive Decor", "Torans", "Deity Shringar", "Pooja Accessories", "Mourika"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mourika.com",
    siteName: "Mourika",
    title: "Mourika — Handcrafted Deity Dresses, Festive Decor & Shringar",
    description: "Shop beautiful handcrafted Bal Gopal dresses, festive home decor, and deity shringar accessories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mourika — Handcrafted Deity Dresses & Shringar",
    description: "Shop beautiful handcrafted Bal Gopal dresses, festive home decor, and deity shringar accessories.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <ExitIntentPopup />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#FFFBF5",
              color: "#333333",
              border: "1px solid var(--color-gold)",
              fontFamily: "var(--font-body)",
              borderRadius: "14px",
            },
            success: { iconTheme: { primary: "#357C49", secondary: "#FFFBF5" } },
          }}
        />
      </body>
    </html>
  );
}
