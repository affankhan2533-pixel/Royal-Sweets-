import type { Metadata } from "next";
import "./globals.css";
import "@/styles/design-system.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

export const metadata: Metadata = {
  title: "Royal Sweet — Authentic Indian Sweets | Mumbai",
  description:
    "Royal Sweet — Experience the finest authentic Indian sweets crafted with royal tradition. Motichoor Ladoo, Kaju Katli, Gulab Jamun and more. Located in Dharavi, Mumbai.",
  keywords: "Indian sweets, Mumbai sweets, Motichoor Ladoo, Kaju Katli, Royal Sweet, authentic mithai, Dharavi",
  openGraph: {
    title: "Royal Sweet — Authentic Indian Sweets",
    description: "Tradition Crafted Into Every Bite",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,700&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Manrope:wght@300;400;500;600&family=Montserrat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
