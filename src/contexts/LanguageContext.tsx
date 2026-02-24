import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Language, translations, TranslationKey } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "balihany-lang";

function getStoredLang(): Language | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en" || stored === "ar") return stored;
  return null;
}

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string | string[];
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => getStoredLang() ?? "fr");
  const [showLangModal, setShowLangModal] = useState(() => !getStoredLang());

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (_) {}
    setShowLangModal(false);
  }, []);

  const isRTL = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const t = useCallback(
    (key: TranslationKey) => {
      const entry = translations[key];
      if (!entry) return key;
      return (entry as Record<Language, string | string[]>)[lang];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
      <Dialog open={showLangModal} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              {(translations["langModal.title"] as Record<Language, string>)[lang]}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-lg"
              onClick={() => setLang("fr")}
            >
              {(translations["langModal.french"] as Record<Language, string>)[lang]}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-lg"
              onClick={() => setLang("en")}
            >
              {(translations["langModal.english"] as Record<Language, string>)[lang]}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-lg"
              onClick={() => setLang("ar")}
            >
              {(translations["langModal.arabic"] as Record<Language, string>)[lang]}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
