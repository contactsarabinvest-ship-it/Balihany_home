import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const CalculatorBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="border-y border-black/20 bg-black py-4">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="text-center text-base font-medium text-white">
            {t("banner.investmentReady") as string}
          </p>
          <Button asChild size="sm" className="shrink-0 gap-2 rounded-full bg-white text-black hover:bg-neutral-200">
            <Link to="/calculator">
              <Calculator className="h-4 w-4" />
              {t("banner.calcCta") as string}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorBanner;
