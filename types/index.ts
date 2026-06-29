/**
 * Shared TypeScript types for Royal Sweet application.
 * Single source of truth for all shared interfaces.
 */

// ─── Sweet Product ────────────────────────────────────────────
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
}

export interface SweetProduct {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  image: string;
  pricePerPiece: number;
  pricePerKg: number;
  weightPerPiece: number;   // grams
  category: "Traditional" | "Sugar-Free";
  badges: string[];
  nutrition: NutritionInfo;
  isSignature?: boolean;
  isAvailable?: boolean;
}

// ─── Gift Box ─────────────────────────────────────────────────
export type BoxSize = "250g" | "500g" | "1kg";
export type PackagingType = "Silk Box" | "Golden Tin" | "Eco Carton";

export interface BoxItem {
  sweet: SweetProduct;
  count: number;
}

// ─── Inquiry Form ─────────────────────────────────────────────
export type InquiryType =
  | "Corporate Gifting"
  | "Wedding Order"
  | "Festival Bulk"
  | "Home Delivery"
  | "General";

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  message: string;
}

// ─── Occasion ─────────────────────────────────────────────────
export interface Occasion {
  id: string;
  label: string;
  defaultGramsPerGuest: number;
  tags: string[];
}

// ─── Recommendation ───────────────────────────────────────────
export interface SuggestionResult {
  totalWeightNeeded: number;
  recommendedSweets: { sweet: SweetProduct; quantity: number }[];
  suggestedBoxes: string;
  totalCostEstimate: number;
  packagingSuggestion: string;
}

// ─── Review ───────────────────────────────────────────────────
export interface Review {
  name: string;
  location: string;
  review: string;
  rating: number;
  initial: string;
  accent: string;
}

// ─── Nav Item ─────────────────────────────────────────────────
export interface NavItem {
  label: string;
  id: string;
}

// ─── Layout ───────────────────────────────────────────────────
export type ContainerSize = "default" | "wide" | "narrow" | "full";
export type SectionBackground = "white" | "cream" | "deep" | "dark" | "transparent";
export type SectionPad = "sm" | "md" | "lg";
export type IntroPhase = "preloader" | "intro" | "site";
