import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Blog = () => {
  const { t } = useLanguage();

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <FileText className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("blog.title") as string}
          </h1>
          <p className="text-muted-foreground">
            {t("blog.subtitle") as string}
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Blog;
