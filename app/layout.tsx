import type { Metadata } from "next";
import { Yeseva_One, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ExitIntentPopup from "@/components/home/ExitIntentPopup";

const yesevaOne = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
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
    <html lang="en">
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
              color: "#1a1a1a",
              border: "1px solid #D4A017",
              fontFamily: "var(--font-body, Poppins, sans-serif)",
            },
            success: { iconTheme: { primary: "#2D6A4F", secondary: "#FFFBF5" } },
          }}
        />
      </body>
    </html>
  );
}
