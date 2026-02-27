import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";

const content = {
  fr: {
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour : février 2026",
    sections: [
      {
        title: "1. Données collectées",
        text: "Nous collectons les données suivantes : nom, adresse email, numéro de téléphone (lors de l'inscription ou de l'envoi d'un formulaire de contact), ainsi que des données de navigation anonymes via Google Analytics (pages visitées, durée de session, appareil utilisé).",
      },
      {
        title: "2. Finalités du traitement",
        text: "Vos données sont utilisées pour : permettre la mise en relation entre utilisateurs et prestataires, gérer les comptes prestataires, envoyer des notifications liées à votre activité sur la plateforme, améliorer nos services grâce à l'analyse anonyme du trafic.",
      },
      {
        title: "3. Base légale",
        text: "Le traitement de vos données repose sur votre consentement (inscription, envoi de formulaire) et sur notre intérêt légitime (amélioration du service, sécurité de la plateforme).",
      },
      {
        title: "4. Destinataires des données",
        text: "Vos données ne sont partagées qu'avec les prestataires que vous contactez via la plateforme. Elles ne sont ni vendues ni transmises à des tiers à des fins commerciales. Nos sous-traitants techniques (Supabase pour l'hébergement, Resend pour les emails, Google Analytics pour les statistiques) ont accès aux données dans le cadre strict de leurs services.",
      },
      {
        title: "5. Durée de conservation",
        text: "Vos données sont conservées tant que votre compte est actif. Les données de contact sont conservées pendant 2 ans après le dernier échange. Vous pouvez demander la suppression de vos données à tout moment.",
      },
      {
        title: "6. Vos droits",
        text: "Conformément à la loi 09-08 relative à la protection des données à caractère personnel au Maroc, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : contact@balihany.com",
      },
      {
        title: "7. Cookies",
        text: "Le Site utilise des cookies techniques nécessaires au bon fonctionnement (authentification, préférence de langue) et des cookies d'analyse (Google Analytics) pour mesurer l'audience. Vous pouvez configurer votre navigateur pour refuser les cookies.",
      },
      {
        title: "8. Sécurité",
        text: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération ou destruction. L'accès aux données est limité aux personnes habilitées.",
      },
      {
        title: "9. Contact",
        text: "Pour toute question relative à la protection de vos données, contactez-nous à : contact@balihany.com",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: February 2026",
    sections: [
      {
        title: "1. Data collected",
        text: "We collect the following data: name, email address, phone number (during registration or contact form submission), as well as anonymous browsing data via Google Analytics (pages visited, session duration, device used).",
      },
      {
        title: "2. Purpose of processing",
        text: "Your data is used to: connect users with service providers, manage provider accounts, send notifications related to your activity on the platform, and improve our services through anonymous traffic analysis.",
      },
      {
        title: "3. Legal basis",
        text: "The processing of your data is based on your consent (registration, form submission) and our legitimate interest (service improvement, platform security).",
      },
      {
        title: "4. Data recipients",
        text: "Your data is only shared with providers you contact through the platform. It is never sold or shared with third parties for commercial purposes. Our technical partners (Supabase for hosting, Resend for emails, Google Analytics for statistics) access data strictly within the scope of their services.",
      },
      {
        title: "5. Data retention",
        text: "Your data is retained as long as your account is active. Contact data is kept for 2 years after the last interaction. You may request deletion of your data at any time.",
      },
      {
        title: "6. Your rights",
        text: "In accordance with Moroccan data protection law (Law 09-08), you have the right to access, correct, and delete your personal data. To exercise these rights, contact us at: contact@balihany.com",
      },
      {
        title: "7. Cookies",
        text: "The Site uses essential cookies for proper functioning (authentication, language preference) and analytics cookies (Google Analytics) to measure audience. You can configure your browser to refuse cookies.",
      },
      {
        title: "8. Security",
        text: "We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction. Data access is limited to authorized personnel only.",
      },
      {
        title: "9. Contact",
        text: "For any questions regarding data protection, contact us at: contact@balihany.com",
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: فبراير 2026",
    sections: [
      {
        title: "1. البيانات المجمعة",
        text: "نجمع البيانات التالية: الاسم، البريد الإلكتروني، رقم الهاتف (عند التسجيل أو إرسال نموذج الاتصال)، بالإضافة إلى بيانات تصفح مجهولة عبر Google Analytics.",
      },
      {
        title: "2. أغراض المعالجة",
        text: "تُستخدم بياناتك لـ: ربط المستخدمين بمقدمي الخدمات، إدارة حسابات مقدمي الخدمات، إرسال إشعارات متعلقة بنشاطك على المنصة، وتحسين خدماتنا.",
      },
      {
        title: "3. الأساس القانوني",
        text: "تستند معالجة بياناتك إلى موافقتك (التسجيل، إرسال النموذج) ومصلحتنا المشروعة (تحسين الخدمة، أمان المنصة).",
      },
      {
        title: "4. مستلمو البيانات",
        text: "تتم مشاركة بياناتك فقط مع مقدمي الخدمات الذين تتواصل معهم عبر المنصة. لا تُباع ولا تُنقل إلى أطراف ثالثة لأغراض تجارية.",
      },
      {
        title: "5. مدة الاحتفاظ",
        text: "يتم الاحتفاظ ببياناتك طالما حسابك نشط. يتم الاحتفاظ ببيانات الاتصال لمدة سنتين بعد آخر تفاعل. يمكنك طلب حذف بياناتك في أي وقت.",
      },
      {
        title: "6. حقوقك",
        text: "وفقاً لقانون حماية البيانات المغربي (القانون 09-08)، لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. لممارسة هذه الحقوق، تواصل معنا على: contact@balihany.com",
      },
      {
        title: "7. ملفات تعريف الارتباط",
        text: "يستخدم الموقع ملفات تعريف ارتباط تقنية ضرورية (المصادقة، تفضيل اللغة) وملفات تحليلية (Google Analytics). يمكنك تكوين متصفحك لرفض ملفات تعريف الارتباط.",
      },
      {
        title: "8. الأمان",
        text: "ننفذ تدابير تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو التدمير.",
      },
      {
        title: "9. الاتصال",
        text: "لأي استفسار بخصوص حماية البيانات، تواصل معنا على: contact@balihany.com",
      },
    ],
  },
};

const Privacy = () => {
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

export default Privacy;
