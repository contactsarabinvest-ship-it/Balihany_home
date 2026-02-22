import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { motion } from "framer-motion";
import { Target, Users, Sparkles } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Target, title: t("about.mission.title") as string, text: t("about.mission.text") as string },
    { icon: Users, title: t("about.audience.title") as string, text: t("about.audience.text") as string },
    { icon: Sparkles, title: t("about.value.title") as string, text: t("about.value.text") as string },
  ];

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("about.title") as string} description={t("about.mission.text") as string} />
      <div className="container max-w-3xl">
        <h1 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
          {t("about.title") as string}
        </h1>
        <p className="mb-16 text-center text-muted-foreground italic">
          {t("about.tagline") as string}
        </p>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                <section.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-bold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default About;
