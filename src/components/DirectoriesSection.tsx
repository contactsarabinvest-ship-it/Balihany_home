import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2, Paintbrush, Calculator, ArrowRight } from "lucide-react";

const DirectoriesSection = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Building2,
      title: t("directories.concierge.title") as string,
      desc: t("directories.concierge.desc") as string,
      cta: t("directories.concierge.cta") as string,
      to: "/concierge",
      color: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: Paintbrush,
      title: t("directories.designers.title") as string,
      desc: t("directories.designers.desc") as string,
      cta: t("directories.designers.cta") as string,
      to: "/designers",
      color: "bg-terracotta-light",
      iconColor: "text-terracotta",
    },
    {
      icon: Calculator,
      title: t("directories.calculator.title") as string,
      desc: t("directories.calculator.desc") as string,
      cta: t("directories.calculator.cta") as string,
      to: "/calculator",
      color: "bg-accent/10",
      iconColor: "text-accent",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
          {t("directories.title") as string}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}>
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                <p className="mb-6 flex-1 text-sm text-muted-foreground">{card.desc}</p>
                <Button asChild variant="outline" className="w-full gap-2 rounded-full">
                  <Link to={card.to}>
                    {card.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DirectoriesSection;
