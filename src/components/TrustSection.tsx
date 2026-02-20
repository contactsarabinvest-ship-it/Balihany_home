import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { MapPin, Star, Eye } from "lucide-react";

const TrustSection = () => {
  const { t } = useLanguage();

  const items = [
    { icon: MapPin, text: t("trust.morocco") as string },
    { icon: Star, text: t("trust.curated") as string },
    { icon: Eye, text: t("trust.transparent") as string },
  ];

  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
          {t("trust.title") as string}
        </h2>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 rounded-2xl bg-card p-8 text-center border border-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-light">
                <item.icon className="h-6 w-6 text-terracotta" />
              </div>
              <p className="font-semibold text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
