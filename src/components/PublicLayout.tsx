"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "./landing/Header";
import FooterBadges from "./landing/FooterBadges";
import CartDrawer from "./shop/CartDrawer";
import QuickViewModal from "./shop/QuickViewModal";
import AuthModal from "./auth/AuthModal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If the route starts with /admin, do not render public header/footer
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // If we are on home page ("/"), page.tsx already renders its own full structure
  if (pathname === "/") {
    return (
      <main className="flex-grow">
        {children}
        <AuthModal />
      </main>
    );
  }

  // For all other public sub-pages (/shop, /panchang, /horoscope, /orders, /account, /pooja-vidhi, etc.)
  return (
    <>
      <Header />
      <main className="flex-grow pt-28 md:pt-32 min-h-screen bg-[#FFFDF9]">
        {children}
      </main>
      <FooterBadges />
      <CartDrawer />
      <QuickViewModal />
      <AuthModal />
    </>
  );
}
