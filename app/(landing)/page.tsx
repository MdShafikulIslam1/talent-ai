import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Pricing } from "@/components/home/pricing";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { Tools } from "@/components/home/tools";

const HomePage = () => {
  return (
    <div className="min-h-full bg-white text-ink antialiased">
      <SiteHeader />
      <main>
        <Hero />
        <Tools />
        <HowItWorks />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
