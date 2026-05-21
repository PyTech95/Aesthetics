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
    "https://customer-assets.emergentagent.com/job_21fa9d9f-67b4-4058-a89a-ebf3ae7dfc46/artifacts/3agixcxs_IG.png",
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
    id: "signature-facial",
    category: "Facials",
    name: "Signature Glow Facial",
    description:
      "A bespoke deep-cleansing facial tailored to restore radiance, hydration, and a healthy glow.",
    duration: "75 min",
    price: "From $145",
  },
  {
    id: "advanced-skin",
    category: "Advanced Skin",
    name: "Microneedling Renewal",
    description:
      "Stimulates collagen for smoother texture, even tone, and visible firmness over time.",
    duration: "60 min",
    price: "From $295",
  },
  {
    id: "body-treatment",
    category: "Body Treatments",
    name: "Body Sculpt & Detox",
    description:
      "Lymphatic-drainage technique combined with warming masques for contoured, toned skin.",
    duration: "90 min",
    price: "From $210",
  },
  {
    id: "massage-deep",
    category: "Massage",
    name: "Holistic Deep Tissue",
    description:
      "A restorative massage that releases tension and rebalances mind and body.",
    duration: "60 min",
    price: "From $135",
  },
  {
    id: "massage-aroma",
    category: "Massage",
    name: "Aromatherapy Ritual",
    description:
      "Hand-blended essential oils and slow flowing strokes for total relaxation.",
    duration: "60 min",
    price: "From $120",
  },
  {
    id: "membership",
    category: "Memberships",
    name: "Monthly Glow Membership",
    description:
      "One signature facial each month, plus member pricing on all treatments and retail.",
    duration: "Monthly",
    price: "From $129/mo",
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
