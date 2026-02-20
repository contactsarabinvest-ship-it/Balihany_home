

# BALIHANI — MVP Plan

## Overview
A bilingual (French + English) premium website for Moroccan property owners to launch short-term rentals. The site generates leads for furniture packages, connects owners with concierge companies, and builds a waiting list for furniture leasing.

---

## 1. Design & Theme
- Clean, modern, premium aesthetic
- Color palette: white, warm beige, light gray, soft gold accents
- Mobile-first responsive design
- Professional typography with clear hierarchy
- Language switcher (FR/EN) in the header

## 2. Pages

### Homepage
- **Hero** with headline "Launch Your Airbnb in Morocco — Without the Stress" (localized in FR), two CTAs: "Get Started" and "Explore Concierge Services"
- **How It Works** — 3-step visual guide (choose package → select concierge → launch STR)
- **Furniture Packages Preview** — 3 cards (Studio/1BR/2BR) with prices in MAD and "Request a Quote" CTA
- **Concierge Directory Preview** — Featured concierge cards with city, description, and "View Profile" link
- **Leasing Interest Form** — Name, email, phone, city, property type, number of rooms → success toast on submit
- **Footer** — About, Contact, Terms, social icons

### Furniture Packages Page
- Detailed view of 3 packages with included items lists, price ranges, and descriptions
- "Request a Quote" form: name, email, phone, city, property size, budget range

### Concierge Directory Page
- Grid of ~10 concierge company cards pulled from a database
- Each card: logo placeholder, city, short description, "Contact Concierge" CTA
- Contact form: client info, property location, services needed

### Concierge Profile Page (dynamic template)
- Individual profile with logo, description, cities covered, services offered
- Contact form specific to that concierge
- "Premium Badge" placeholder for future paid listings

### About Page
- Mission statement, target audience, value proposition

## 3. Backend (Lovable Cloud)
- **Concierge companies table** — name, logo URL, city, description, services, cities covered, premium status
- Seed ~10 sample concierge entries
- No authentication needed for MVP
- Forms are static (show success message, no data storage) — backend lead capture can be added later

## 4. Bilingual Support
- Language context with FR/EN toggle
- All UI text and form labels translated
- Concierge data stored in both languages (fr/en fields)

## 5. Key UX Details
- All forms include client-side validation (Zod)
- Success toasts on form submission
- SEO-friendly page titles and meta structure
- Smooth scroll and clear navigation between sections
- Sticky header with nav links and language switcher

