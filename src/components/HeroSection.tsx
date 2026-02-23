import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-b from-secondary via-secondary to-background py-20 md:py-28 lg:py-32">
      {/* Soft gradient orbs */}
      <div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-terracotta/5 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2324211f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-8 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-[3.5rem]">
            {t("hero.title") as string}
          </h1>
          <p className="mb-6 max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("hero.subtitle") as string}
          </p>
          <p className="mb-12 inline-flex items-center rounded-full border border-terracotta/30 bg-terracotta/5 px-4 py-2 text-sm font-medium text-terracotta">
            {t("hero.social") as string}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Button
              asChild
              size="lg"
              className="w-full gap-2 rounded-xl bg-accent px-8 py-6 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 sm:w-auto"
            >
              <Link to="/concierge">
                <Search className="h-5 w-5" />
                {t("hero.cta.concierge") as string}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="default"
              className="w-full gap-2 rounded-xl border border-border bg-background/80 px-6 py-5 text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:bg-background hover:text-foreground sm:w-auto"
            >
              <Link to="/designers">
                {t("hero.cta.designer") as string}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="default"
              className="w-full gap-2 rounded-xl border border-border bg-background/80 px-6 py-5 text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:bg-background hover:text-foreground sm:w-auto"
            >
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
