"use client";
import { CTASection } from "@/components/CTASection";
import { DemoSection } from "@/components/DemoSection";
import { FAQSection } from "@/components/FAQSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";


const HomePage = () => {
  return (
    <div className="h-full">
      {/* <LandingNavbar />
      <LandingHero />
      <LandingContent /> */}
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <DemoSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
