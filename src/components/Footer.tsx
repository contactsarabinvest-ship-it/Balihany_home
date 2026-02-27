import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <img
                src="/balihany-logo.png"
                alt="BaliHany"
                className="h-8 w-8 object-contain"
              />
              <h3 className="text-xl font-bold">Balihany</h3>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              {t("footer.desc") as string}
            </p>
            <p className="mt-3 text-xs opacity-60 italic">
              {t("about.tagline") as string}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold">{t("footer.links") as string}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/concierge" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.concierge") as string}
              </Link>
              <Link to="/designers" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.designers") as string}
              </Link>
              <Link to="/calculator" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.calculator") as string}
              </Link>
              <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.contact") as string}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold">{t("footer.contact") as string}</h4>
            <a href="mailto:contact@balihany.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity block mb-2">
              contact@balihany.com
            </a>
            <a
              href={`https://wa.me/212600000000`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 transition-opacity block mb-4"
            >
              WhatsApp
            </a>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/balihany.ma/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.facebook.com/profile.php?id=61588372109062" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Balihany. {t("footer.rights") as string}</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:opacity-100 transition-opacity">{t("footer.terms") as string}</Link>
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">{t("footer.privacy") as string}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
