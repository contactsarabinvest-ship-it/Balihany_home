// Moroccan cities - main cities for dropdown (extended list)
export const MOROCCAN_CITIES = [
  "Agadir", "Aït Melloul", "Azrou", "Azilal", "Béni Mellal", "Berkane", "Berrechid", "Bouskoura",
  "Casablanca", "Chefchaouen", "Dakhla", "El Jadida", "Errachidia", "Essaouira", "Fès", "Fquih Ben Salah",
  "Guelmim", "Ifrane", "Inezgane", "Kénitra", "Khemis Zemamra", "Khémisset", "Ksar El Kébir",
  "Larache", "Marrakech", "Meknès", "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Oujda",
  "Rabat", "Safi", "Salé", "Sefrou", "Settat", "Tanger", "Taourirt", "Taroudant", "Taza",
  "Témara", "Tétouan", "Tinghir", "Youssoufia", "Zagora",
].sort((a, b) => a.localeCompare(b));

// Concierge services - checkbox options
export const CONCIERGE_SERVICES = [
  { id: "checkin_checkout", fr: "Check-in / Check-out", en: "Check-in / Check-out", ar: "تسجيل الوصول / المغادرة" },
  { id: "listing", fr: "Gestion des listings", en: "Listing management", ar: "إدارة القوائم" },
  { id: "menage", fr: "Ménage", en: "Cleaning", ar: "التنظيف" },
  { id: "pricing", fr: "Optimisation des prix", en: "Price optimization", ar: "تحسين الأسعار" },
  { id: "photographie", fr: "Photographie", en: "Photography", ar: "التصوير الفوتوغرافي" },
  { id: "accueil", fr: "Accueil des voyageurs", en: "Guest welcome", ar: "استقبال المسافرين" },
  { id: "maintenance", fr: "Maintenance", en: "Maintenance", ar: "الصيانة" },
  { id: "cle_24h", fr: "Clé 24/7", en: "24/7 Key handover", ar: "تسليم المفاتيح 24/7" },
  { id: "reservations", fr: "Gestion des réservations", en: "Reservation management", ar: "إدارة الحجوزات" },
  { id: "conseil_deco", fr: "Conseil décoration", en: "Decoration advice", ar: "نصائح الديكور" },
  { id: "linge", fr: "Gestion linge", en: "Linens management", ar: "إدارة المفروشات" },
  { id: "coordination", fr: "Coordination prestataires", en: "Vendor coordination", ar: "تنسيق الموردين" },
];

// Designer styles - checkbox options
export const DESIGNER_STYLES = [
  { id: "moderne", fr: "Moderne", en: "Modern", ar: "حديث" },
  { id: "marocain", fr: "Traditionnel marocain", en: "Traditional Moroccan", ar: "التقليدي المغربي" },
  { id: "boheme", fr: "Bohème", en: "Bohemian", ar: "بوهيمي" },
  { id: "minimaliste", fr: "Minimaliste", en: "Minimalist", ar: "بسيط" },
  { id: "industriel", fr: "Industriel", en: "Industrial", ar: "صناعي" },
  { id: "scandinave", fr: "Scandinave", en: "Scandinavian", ar: "إسكندنافي" },
  { id: "mediterraneen", fr: "Méditerranéen", en: "Mediterranean", ar: "متوسطي" },
  { id: "luxe", fr: "Luxe", en: "Luxury", ar: "فاخر" },
  { id: "mixte", fr: "Mixte", en: "Mixed", ar: "مختلط" },
  { id: "riad", fr: "Riad / Maison traditionnelle", en: "Riad / Traditional house", ar: "رياض / منزل تقليدي" },
];

// Experience ranges
export const EXPERIENCE_RANGES = [
  { id: "less_1", fr: "Moins de 1 an", en: "Less than 1 year", ar: "أقل من سنة" },
  { id: "1_3", fr: "Entre 1 et 3 ans", en: "1-3 years", ar: "بين 1 و 3 سنوات" },
  { id: "3_5", fr: "Entre 3 et 5 ans", en: "3-5 years", ar: "بين 3 و 5 سنوات" },
  { id: "more_5", fr: "Plus de 5 ans", en: "More than 5 years", ar: "أكثر من 5 سنوات" },
];
