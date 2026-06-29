/**
 * Application-wide constants — single source of truth.
 */

// ─── Brand Info ───────────────────────────────────────────────
export const BRAND_NAME = "Royal Sweet";
export const BRAND_TAGLINE = "Tradition Crafted Into Every Bite";
export const BRAND_SINCE = "1985";
export const BRAND_LOCATION = "Dharavi, Mumbai";

// ─── Contact ──────────────────────────────────────────────────
export const PHONE_NUMBER = "8591053565";
export const PHONE_DISPLAY = "+91 85910 53565";
export const WHATSAPP_NUMBER = "918591053565";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const ADDRESS_LINES = [
  "Rohitdas Chawl,",
  "Sion-Bandra Link Road,",
  "Near Saheel Restaurant,",
  "Dharavi, Mumbai, Maharashtra 400017",
];

export const STORE_HOURS = "Open daily · 7:00 AM – 10:00 PM";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Royal+Sweet+Rohitdas+Chawl+Dharavi+Mumbai+400017";

export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Rohitdas+Chawl,+Sion-Bandra+Link+Road,+Near+Saheel+Restaurant,+Dharavi,+Mumbai+400017";

// ─── Box Sizes ────────────────────────────────────────────────
export const BOX_MAX_PIECES: Record<string, number> = {
  "250g": 6,
  "500g": 12,
  "1kg": 24,
};

// ─── Packaging Options ────────────────────────────────────────
export const PACKAGING_OPTIONS = [
  { id: "Eco Carton",  label: "Standard Eco Carton",   price: 0,   desc: "Recyclable kraft paper box" },
  { id: "Silk Box",   label: "Silk Royal Box",          price: 150, desc: "Aromatic velvet lining & gold borders" },
  { id: "Golden Tin", label: "Golden Heritage Tin",     price: 200, desc: "Reusable embossed luxury metal container" },
] as const;

export const PREMIUM_WRAPPING_COST = 50;

// ─── Nav Links ────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Collection", id: "collection" },
  { label: "Boutique",   id: "boutique-catalog" },
  { label: "Custom Box", id: "box-builder" },
  { label: "Heritage",   id: "heritage" },
  { label: "Location",   id: "location" },
] as const;

// ─── Container Widths ─────────────────────────────────────────
export const CONTAINER_WIDTHS = {
  narrow:  "860px",
  default: "1320px",
  wide:    "1560px",
} as const;
