import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Users } from "lucide-react";

const BenefitsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
          {t("benefits.title") as string}
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card p-8 border border-border"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-4 text-xl font-bold">{t("benefits.hosts.title") as string}</h3>
            <ul className="space-y-3">
              {(["benefits.host1", "benefits.host2", "benefits.host3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-accent flex-shrink-0" />
                  <span>{t(key) as string}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card p-8 border border-border"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-light">
              <Shield className="h-6 w-6 text-terracotta" />
            </div>
            <h3 className="mb-4 text-xl font-bold">{t("benefits.pros.title") as string}</h3>
            <ul className="space-y-3">
              {(["benefits.pro1", "benefits.pro2", "benefits.pro3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-terracotta flex-shrink-0" />
                  <span>{t(key) as string}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
