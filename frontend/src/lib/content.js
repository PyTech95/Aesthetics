// Centralized branding constants
export const BRAND = {
  name: "CLA Aesthetics & Wellness",
  short: "CLA",
  founder: "Cinthia Lariviere Alexandre",
  founderTitle: "Founder & CEO",
  phone: "516-620-9158",
  phoneRaw: "+15166209158",
  email: "cinthia@claaesthetics.com",
  address: "1078 Grand Avenue, South Hempstead, NY 11550",
  hours: [
    { d: "Monday – Friday", t: "10:00 — 8:00" },
    { d: "Saturday", t: "9:00 — 6:00" },
    { d: "Sunday", t: "By appointment" },
  ],
  social: {
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/15166209158",
    facebook: "https://facebook.com/",
  },
  bookingExternalUrl: "", // Add Calendly/Square link here when ready
  logoUrl:
    "https://customer-assets.emergentagent.com/job_luxury-spa-preview-1/artifacts/juptw2af_ChatGPT%20Image%20May%2021%2C%202026%2C%2002_09_08%20PM.png",
};

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "testimonials", label: "Testimonials" },
  { id: "offers", label: "Offers" },
  { id: "contact", label: "Contact" },
];

export const SERVICES = [
  {
    id: "botox",
    category: "Injectables",
    name: "Botox",
    description:
      "Smooth fine lines & wrinkles with precision-placed neurotoxin. Results last 3–4 months.",
    duration: "30 min",
    price: "From $12/unit",
  },
  {
    id: "fillers",
    category: "Injectables",
    name: "Dermal Fillers",
    description:
      "Enhance contours and add natural volume to lips, cheeks and jawline.",
    duration: "45 min",
    price: "From $650/syringe",
  },
  {
    id: "pdo",
    category: "Lifts",
    name: "PDO Thread Lift",
    description:
      "Non-surgical lift using absorbable threads for natural contours.",
    duration: "60 min",
    price: "From $800",
  },
  {
    id: "prp-facial",
    category: "Facials",
    name: "PRP Facial",
    description:
      "Collagen-boosting plasma therapy for radiant rejuvenation.",
    duration: "60 min",
    price: "From $450",
  },
  {
    id: "prf",
    category: "Facials",
    name: "PRF Treatment",
    description:
      "Advanced healing with platelet-rich fibrin for a natural glow.",
    duration: "60 min",
    price: "From $500",
  },
  {
    id: "hydrofacial",
    category: "Facials",
    name: "Hydrofacial",
    description:
      "Deep cleansing, hydration boost and instant glow in one ritual.",
    duration: "60 min",
    price: "From $250",
  },
  {
    id: "laser",
    category: "Skin",
    name: "Laser Therapy",
    description: "Target imperfections for smoother, clearer skin.",
    duration: "45 min",
    price: "From $295",
  },
  {
    id: "microneedling-prp",
    category: "Skin",
    name: "Microneedling + PRP",
    description:
      "Skin renewal and even tone using collagen induction with PRP.",
    duration: "75 min",
    price: "From $400/session",
  },
  {
    id: "skin-rejuvenation",
    category: "Skin",
    name: "Skin Rejuvenation",
    description: "A complete transformation for radiant, glass-skin results.",
    duration: "90 min",
    price: "From $350",
  },
  {
    id: "hair-restoration",
    category: "Hair",
    name: "Hair Restoration",
    description: "Stimulate new growth for fuller, thicker hair.",
    duration: "60 min",
    price: "From $500 · 3-pack $1,350",
  },
  {
    id: "iv-nutrition",
    category: "Wellness",
    name: "IV Nutrition Therapy",
    description:
      "Boost immunity, energy and rapid hydration with custom IV blends.",
    duration: "45 min",
    price: "From $185",
  },
  {
    id: "weight-loss",
    category: "Wellness",
    name: "Weight Loss Program",
    description: "Customized plans under medical supervision.",
    duration: "Consultation",
    price: "From $299",
  },
  {
    id: "body-spa",
    category: "Body Spa",
    name: "Body Spa",
    description:
      "A serene full-body spa experience — massage, body rituals and signature finishing touches. Launching soon at CLA.",
    duration: "Coming soon",
    price: "Coming soon",
    comingSoon: true,
  },
];

export const GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    caption: "Treatment ritual",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    caption: "Warm candles & calm",
    span: "",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    caption: "Botanical apothecary",
    span: "",
  },
  {
    url: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80",
    caption: "Hands-on care",
    span: "",
  },
  {
    url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    caption: "Restorative massage",
    span: "lg:col-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=900&q=80",
    caption: "Glow result",
    span: "",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sophia M.",
    rating: 5,
    text:
      "Walking into CLA is like exhaling. My skin has never looked this radiant — Cinthia genuinely listens and customizes everything.",
  },
  {
    name: "Marisa L.",
    rating: 5,
    text:
      "The most thoughtful, calming experience. The signature facial gave me a glow that lasted weeks. I cannot recommend it enough.",
  },
  {
    name: "Eliana R.",
    rating: 5,
    text:
      "Refined, elegant, attentive. Every detail is intentional. This is now my monthly ritual and a true gift to myself.",
  },
  {
    name: "Camille S.",
    rating: 5,
    text:
      "From the moment I sat down to the goodbye at the door — pure luxury. The deep tissue massage melted months of tension.",
  },
];

export const OFFERS = [
  {
    title: "First Visit Ritual",
    badge: "New Client",
    benefits: [
      "30-minute skin consultation",
      "Custom signature facial",
      "Complimentary take-home serum",
    ],
    price: "$120",
    note: "Save $25 — new clients only.",
  },
  {
    title: "Glow Membership",
    badge: "Most Loved",
    benefits: [
      "1 signature facial / month",
      "15% off all treatments & retail",
      "Member-only seasonal events",
    ],
    price: "$129/mo",
    note: "Cancel anytime after 3 months.",
  },
  {
    title: "Couple's Retreat",
    badge: "Limited",
    benefits: [
      "Side-by-side massage (60 min)",
      "Champagne & botanical bites",
      "Private suite with candles",
    ],
    price: "$320",
    note: "Reserve at least 5 days in advance.",
  },
];
