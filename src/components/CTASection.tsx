import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl rounded-3xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            {t("cta.title") as string}
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-full px-8">
              <Link to="/concierge">
                {t("cta.concierge") as string}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 rounded-full px-8 bg-white border-white/30 text-foreground hover:bg-white/90">
              <Link to="/concierge-signup">
                {t("cta.list") as string}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
