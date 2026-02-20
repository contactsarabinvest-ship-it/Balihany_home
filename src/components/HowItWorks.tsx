import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText, Users, Calculator } from "lucide-react";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: FileText, title: t("how.step1.title") as string, desc: t("how.step1.desc") as string, num: "01" },
    { icon: Users, title: t("how.step2.title") as string, desc: t("how.step2.desc") as string, num: "02" },
    { icon: Calculator, title: t("how.step3.title") as string, desc: t("how.step3.desc") as string, num: "03" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
          {t("how.title") as string}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-border bg-card p-8 text-center"
            >
              <span className="mb-4 inline-block text-5xl font-extrabold text-green-light">{step.num}</span>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
