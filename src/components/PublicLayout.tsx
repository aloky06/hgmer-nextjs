"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If the route starts with /admin, do not render the public header and footer.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // If we are on the landing page (/), we use the custom premium Header and Footer from page.tsx
  if (pathname === "/") {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {/* Navbar */}
      <header className="bg-saffron text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">Har Ghar Mandir</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:text-gold transition">Home</a>
            <a href="/festivals" className="hover:text-gold transition">Festivals</a>
            <a href="/shop" className="hover:text-gold transition">Shop Samagri</a>
            <a href="/book-pandit" className="hover:text-gold transition font-semibold">Book Pandit Ji</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold mb-2">Babatpur, Varanasi, UP India | +91 6363777534</p>
          <p>&copy; {new Date().getFullYear()} Har Ghar Mandir. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
