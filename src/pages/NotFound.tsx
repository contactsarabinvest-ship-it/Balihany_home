import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { ArrowLeft } from "lucide-react";

const content = {
  fr: {
    title: "Page introuvable",
    subtitle: "La page que vous cherchez n'existe pas ou a été déplacée.",
    back: "Retour à l'accueil",
  },
  en: {
    title: "Page not found",
    subtitle: "The page you're looking for doesn't exist or has been moved.",
    back: "Back to Home",
  },
  ar: {
    title: "الصفحة غير موجودة",
    subtitle: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    back: "العودة إلى الرئيسية",
  },
};

const NotFound = () => {
  const location = useLocation();
  const { lang } = useLanguage();
  const c = content[lang];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex items-center justify-center py-24 md:py-32">
      <PageMeta title="404" description={c.subtitle} />
      <div className="text-center px-4">
        <p className="mb-2 text-6xl font-extrabold text-accent">404</p>
        <h1 className="mb-3 text-2xl font-bold text-foreground">{c.title}</h1>
        <p className="mb-8 text-muted-foreground">{c.subtitle}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {c.back}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
