import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PublicLayout from "../components/PublicLayout";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Har Ghar Mandir - 100% शुद्ध पूजा सामग्री एवं पंडित जी बुकिंग",
  description:
    "100% शुद्ध एवं प्रामाणिक पूजा सामग्री, सम्पूर्ण पूजा किट, दैनिक पंचांग, दैनिक राशिफल, पूजा विधि व अनुभवी विद्वान पंडित जी बुकिंग।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#FFFDF9] text-zinc-900`}
      >
        <LanguageProvider>
          <CartProvider>
            <PublicLayout>{children}</PublicLayout>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
