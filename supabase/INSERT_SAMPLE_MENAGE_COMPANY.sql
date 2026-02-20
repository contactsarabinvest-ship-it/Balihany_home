-- Script optionnel : insérer une entreprise de ménage de test
-- Exécutez ce script dans l'éditeur SQL Supabase si vous voulez tester la page menage

-- D'abord, exécutez la migration 20260220220000_create_menage_companies.sql
-- Ensuite vous pouvez insérer une entreprise exemple :

INSERT INTO public.menage_companies (
  name,
  city_fr,
  city_en,
  city_ar,
  description_fr,
  description_en,
  description_ar,
  services_fr,
  services_en,
  services_ar,
  cities_covered_fr,
  cities_covered_en,
  cities_covered_ar,
  status,
  is_premium
) VALUES (
  'Pro Ménage Maroc',
  'Casablanca',
  'Casablanca',
  'الدار البيضاء',
  'Service de ménage professionnel pour locations courte durée et Airbnb. Nettoyage profond, linge, accueil des voyageurs. Équipe formée et fiable.',
  'Professional cleaning service for short-term rentals and Airbnb. Deep cleaning, laundry, guest welcome. Trained and reliable team.',
  'خدمة تنظيف احترافية للإيجارات القصيرة و Airbnb. تنظيف عميق وغسيل واستقبال المسافرين. فريق مدرب وموثوق.',
  ARRAY['Ménage de départ', 'Ménage régulier', 'Nettoyage profond', 'Linge', 'Accueil voyageurs'],
  ARRAY['Checkout cleaning', 'Regular cleaning', 'Deep cleaning', 'Laundry', 'Guest welcome'],
  ARRAY['تنظيف المغادرة', 'تنظيف منتظم', 'تنظيف عميق', 'غسيل', 'استقبال المسافرين'],
  ARRAY['Casablanca', 'Rabat', 'Marrakech', 'Tanger'],
  ARRAY['Casablanca', 'Rabat', 'Marrakech', 'Tangier'],
  ARRAY['الدار البيضاء', 'الرباط', 'مراكش', 'طنجة'],
  'approved',
  false
);
