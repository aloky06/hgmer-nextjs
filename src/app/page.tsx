import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustBadges from "@/components/landing/TrustBadges";
import CategoryCarousel from "@/components/landing/CategoryCarousel";
import ServicesSection from "@/components/landing/ServicesSection";
import StatsBanner from "@/components/landing/StatsBanner";
import AppDownload from "@/components/landing/AppDownload";
import FooterBadges from "@/components/landing/FooterBadges";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] font-sans">
      <Header />
      <Hero />
      <TrustBadges />
      <CategoryCarousel />
      <ServicesSection />
      <StatsBanner />
      <AppDownload />
      <FooterBadges />
    </main>
  );
}
