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
  metadataBase: new URL("https://littlemadhav.com"),
  title: {
    default: "Little Madhav — Handcrafted Rakhi, Jhumka & Festive Jewellery",
    template: "%s | Little Madhav",
  },
  description:
    "Shop beautiful handcrafted Rakhi, Jhumka earrings, and festive jewellery. Trusted by 10,000+ customers. COD available. Pan-India delivery. Free shipping above ₹499.",
  keywords: ["Rakhi", "Jhumka", "Indian jewellery", "festive accessories", "handcrafted", "Raksha Bandhan gifts"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://littlemadhav.com",
    siteName: "Little Madhav",
    title: "Little Madhav — Handcrafted Rakhi, Jhumka & Festive Jewellery",
    description: "Shop beautiful handcrafted Rakhi, Jhumka earrings, and festive jewellery. Trusted by 10,000+ customers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Madhav — Handcrafted Rakhi & Jhumka",
    description: "Shop beautiful handcrafted Rakhi, Jhumka earrings, and festive jewellery.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${yesevaOne.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFF8F0", fontFamily: "var(--font-body, Poppins, sans-serif)" }}>
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
