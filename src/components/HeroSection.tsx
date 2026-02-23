import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-secondary py-24 md:py-36">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0V12h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z' opacity='.1'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {t("hero.title") as string}
          </h1>
          <p className="mb-4 text-lg text-muted-foreground md:text-xl leading-relaxed">
            {t("hero.subtitle") as string}
          </p>
          <p className="mb-10 text-sm font-medium text-terracotta">
            {t("hero.social") as string}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-full px-8">
              <Link to="/concierge">
                <Search className="h-4 w-4" />
                {t("hero.cta.concierge") as string}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-full px-8 border-terracotta text-terracotta hover:bg-terracotta-light">
              <Link to="/designers">
                {t("hero.cta.designer") as string}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-full px-8">
              <Link to="/menage">
                <Sparkles className="h-4 w-4" />
                {t("hero.cta.menage") as string}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
