"use client";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustBadges from "@/components/landing/TrustBadges";
import CategoryCarousel from "@/components/landing/CategoryCarousel";
import ProductGrid from "@/components/shop/ProductGrid";
import PoojaKitsSection from "@/components/shop/PoojaKitsSection";
import FestivalsSection from "@/components/shop/FestivalsSection";
import PoojaVidhiSection from "@/components/shop/PoojaVidhiSection";
import ServicesSection from "@/components/landing/ServicesSection";
import StatsBanner from "@/components/landing/StatsBanner";
import AppDownload from "@/components/landing/AppDownload";
import FooterBadges from "@/components/landing/FooterBadges";
import CartDrawer from "@/components/shop/CartDrawer";
import QuickViewModal from "@/components/shop/QuickViewModal";
import AuthModal from "@/components/auth/AuthModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Header & Announcement */}
      <Header />

      {/* Hero Showcase Carousel */}
      <Hero />

      {/* Trust Badges Floating Card */}
      <TrustBadges />

      {/* Categories Grid */}
      <CategoryCarousel />

      {/* Core E-Commerce Product Catalog */}
      <ProductGrid />

      {/* All-in-One Complete Pooja Kits & Combos */}
      <PoojaKitsSection />

      {/* Upcoming Hindu Festivals Samagri & Booking */}
      <FestivalsSection />

      {/* Pooja Vidhi & 1-Click Samagri Kits */}
      <PoojaVidhiSection />

      {/* Vedic Pandit Booking & Astrology Services */}
      <ServicesSection />

      {/* Numerical Stats Banner */}
      <StatsBanner />

      {/* Mobile App Download Section */}
      <AppDownload />

      {/* Comprehensive Devotional Footer */}
      <FooterBadges />

      {/* Global Slide-Over Shopping Cart Drawer */}
      <CartDrawer />

      {/* Global Product Quick-View Modal */}
      <QuickViewModal />

      {/* Global Auth Modal for Protected Add-to-Cart & Buy-Now */}
      <AuthModal />
    </main>
  );
}
