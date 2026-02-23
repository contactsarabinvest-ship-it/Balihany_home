import { PageMeta } from "@/components/PageMeta";
import HeroSection from "@/components/HeroSection";
import CalculatorBanner from "@/components/CalculatorBanner";
import HowItWorks from "@/components/HowItWorks";
import BenefitsSection from "@/components/BenefitsSection";
import DirectoriesSection from "@/components/DirectoriesSection";
import TrustSection from "@/components/TrustSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main>
      <PageMeta title="" description="Balihany est la plateforme centrale qui connecte les hôtes Airbnb au Maroc avec des conciergeries, designers d'intérieur, services de ménage et outils de rentabilité." />
      <HeroSection />
      <CalculatorBanner />
      <HowItWorks />
      <BenefitsSection />
      <DirectoriesSection />
      <TrustSection />
      <CTASection />
    </main>
  );
};

export default Index;
