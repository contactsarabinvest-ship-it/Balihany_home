import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";

const content = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "Dernière mise à jour : février 2026",
    sections: [
      {
        title: "1. Objet",
        text: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site balihany.com (ci-après « le Site »), édité par Balihany. Le Site est une plateforme de mise en relation entre les hôtes Airbnb et investisseurs immobiliers au Maroc d'une part, et des prestataires de services (conciergeries, designers d'intérieur, services de ménage) d'autre part.",
      },
      {
        title: "2. Acceptation des CGU",
        text: "L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.",
      },
      {
        title: "3. Services proposés",
        text: "Balihany propose un annuaire de prestataires vérifiés, un calculateur de rentabilité locative, ainsi qu'un espace de contact entre utilisateurs et prestataires. Balihany n'est pas partie aux contrats conclus entre les utilisateurs et les prestataires référencés sur la plateforme.",
      },
      {
        title: "4. Inscription des prestataires",
        text: "Les prestataires peuvent créer un compte et soumettre un profil professionnel. Chaque profil est soumis à validation par l'équipe Balihany avant publication. Balihany se réserve le droit de refuser ou retirer tout profil ne répondant pas à ses critères de qualité.",
      },
      {
        title: "5. Responsabilité",
        text: "Balihany agit en tant qu'intermédiaire et ne garantit pas la qualité, la fiabilité ou la disponibilité des prestataires référencés. L'utilisateur est seul responsable de ses choix et de ses relations contractuelles avec les prestataires. Balihany ne saurait être tenu responsable des litiges survenant entre les utilisateurs et les prestataires.",
      },
      {
        title: "6. Propriété intellectuelle",
        text: "L'ensemble des contenus du Site (textes, images, logos, design) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est interdite.",
      },
      {
        title: "7. Avis et commentaires",
        text: "Les avis laissés par les utilisateurs sont soumis à modération avant publication. Balihany se réserve le droit de refuser tout avis jugé inapproprié, diffamatoire ou non conforme aux bonnes pratiques.",
      },
      {
        title: "8. Modification des CGU",
        text: "Balihany se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le Site. L'utilisation continue du Site après modification vaut acceptation des nouvelles conditions.",
      },
      {
        title: "9. Contact",
        text: "Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : contact@balihany.com",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: February 2026",
    sections: [
      {
        title: "1. Purpose",
        text: "These Terms of Service govern access to and use of balihany.com (hereinafter \"the Site\"), published by Balihany. The Site is a platform connecting Airbnb hosts and real estate investors in Morocco with service providers (concierge services, interior designers, cleaning services).",
      },
      {
        title: "2. Acceptance",
        text: "By accessing and using the Site, you fully accept these Terms of Service. If you do not agree with these terms, please do not use the Site.",
      },
      {
        title: "3. Services offered",
        text: "Balihany offers a directory of verified service providers, a rental profitability calculator, and a contact system between users and providers. Balihany is not a party to any contracts concluded between users and the providers listed on the platform.",
      },
      {
        title: "4. Provider registration",
        text: "Service providers can create an account and submit a professional profile. Each profile is subject to validation by the Balihany team before publication. Balihany reserves the right to refuse or remove any profile that does not meet its quality standards.",
      },
      {
        title: "5. Liability",
        text: "Balihany acts as an intermediary and does not guarantee the quality, reliability, or availability of listed service providers. The user is solely responsible for their choices and contractual relationships with providers. Balihany cannot be held liable for disputes arising between users and providers.",
      },
      {
        title: "6. Intellectual property",
        text: "All content on the Site (texts, images, logos, design) is protected by intellectual property law. Any unauthorized reproduction or use is prohibited.",
      },
      {
        title: "7. Reviews",
        text: "Reviews submitted by users are subject to moderation before publication. Balihany reserves the right to reject any review deemed inappropriate, defamatory, or not in line with best practices.",
      },
      {
        title: "8. Changes to Terms",
        text: "Balihany reserves the right to modify these Terms at any time. Changes take effect upon publication on the Site. Continued use of the Site after changes constitutes acceptance of the new terms.",
      },
      {
        title: "9. Contact",
        text: "For any questions regarding these Terms, please contact us at: contact@balihany.com",
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    lastUpdated: "آخر تحديث: فبراير 2026",
    sections: [
      {
        title: "1. الغرض",
        text: "تحكم شروط الاستخدام هذه الوصول إلى موقع balihany.com واستخدامه. الموقع هو منصة تربط مضيفي Airbnb والمستثمرين العقاريين في المغرب بمقدمي الخدمات (خدمات الكونسيرج، مصممي الديكور الداخلي، خدمات التنظيف).",
      },
      {
        title: "2. القبول",
        text: "يعني الوصول إلى الموقع واستخدامه القبول الكامل لشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.",
      },
      {
        title: "3. الخدمات المقدمة",
        text: "يقدم Balihany دليلاً لمقدمي الخدمات المعتمدين وحاسبة ربحية الإيجار ونظام تواصل بين المستخدمين ومقدمي الخدمات. Balihany ليس طرفاً في أي عقود مبرمة بين المستخدمين ومقدمي الخدمات.",
      },
      {
        title: "4. تسجيل مقدمي الخدمات",
        text: "يمكن لمقدمي الخدمات إنشاء حساب وتقديم ملف مهني. يخضع كل ملف للتحقق من قبل فريق Balihany قبل النشر. يحتفظ Balihany بالحق في رفض أو إزالة أي ملف لا يستوفي معاييره.",
      },
      {
        title: "5. المسؤولية",
        text: "يعمل Balihany كوسيط ولا يضمن جودة أو موثوقية أو توفر مقدمي الخدمات المدرجين. المستخدم وحده مسؤول عن اختياراته وعلاقاته التعاقدية مع مقدمي الخدمات.",
      },
      {
        title: "6. الملكية الفكرية",
        text: "جميع محتويات الموقع محمية بقانون الملكية الفكرية. يُحظر أي نسخ أو استخدام غير مصرح به.",
      },
      {
        title: "7. التقييمات",
        text: "تخضع التقييمات المقدمة من المستخدمين للمراجعة قبل النشر. يحتفظ Balihany بالحق في رفض أي تقييم يُعتبر غير لائق أو تشهيري.",
      },
      {
        title: "8. تعديل الشروط",
        text: "يحتفظ Balihany بالحق في تعديل هذه الشروط في أي وقت. تسري التعديلات فور نشرها على الموقع.",
      },
      {
        title: "9. الاتصال",
        text: "لأي استفسار بخصوص هذه الشروط، يرجى التواصل معنا على: contact@balihany.com",
      },
    ],
  },
};

const Terms = () => {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={c.title} description={c.sections[0].text.slice(0, 160)} />
      <div className="container max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">{c.title}</h1>
        <p className="mb-10 text-sm text-muted-foreground">{c.lastUpdated}</p>
        <div className="space-y-8">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="mb-2 text-lg font-bold">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Terms;
