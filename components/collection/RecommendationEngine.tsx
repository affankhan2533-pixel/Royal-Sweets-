"use client";
import React, { useState } from "react";
import Image from "next/image";
import { SweetProduct, SWEETS_DATA } from "@/lib/sweetsData";
import Container from "@/components/layout/Container";

interface Props {
  products?: SweetProduct[];
  onAddToBox: (sweet: SweetProduct) => void;
  onOpenDetails: (sweet: SweetProduct) => void;
}

interface Option {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  filterFn: (s: SweetProduct) => boolean;
  whyText: string;
}

const RECOMMENDATION_OPTIONS: Option[] = [
  {
    id: "weight",
    label: "Weight Conscious",
    desc: "Low-calorie, lighter portions",
    emoji: "🥗",
    filterFn: (s) => s.nutrition.calories < 140,
    whyText: "These curated selections contain less than 140 calories per portion and lower overall fats, allowing you to enjoy authentic luxury flavors mindfully."
  },
  {
    id: "diabetic",
    label: "Diabetic Friendly",
    desc: "Naturally sweetened, low glycemic",
    emoji: "🍯",
    filterFn: (s) => s.category === "Sugar-Free" || s.badges.includes("Diabetic Friendly"),
    whyText: "Crafted exclusively with natural stevia and erythritol, these treats have negligible active sugar content, avoiding glycemic index spikes."
  },
  {
    id: "protein",
    label: "High Protein",
    desc: "Almond, cashew and milk nutrients",
    emoji: "💪",
    filterFn: (s) => s.nutrition.protein >= 5 || s.badges.includes("High Protein"),
    whyText: "Packed with premium dry fruits and fresh milk solids, these rich sweets provide 5g+ of protein per serving to complement your dietary goals."
  },
  {
    id: "kids",
    label: "Kids Favourite",
    desc: "Colorful, sweet and beloved by children",
    emoji: "🎉",
    filterFn: (s) => s.badges.includes("Kids Favourite"),
    whyText: "Soft, fun, and delightfully traditional, these classic favorites are the most requested options for children's parties and celebrations."
  },
  {
    id: "senior",
    label: "Senior Citizen Friendly",
    desc: "Soft textures, easy to digest",
    emoji: "👵",
    filterFn: (s) => s.badges.includes("Senior Citizen Friendly"),
    whyText: "Extremely soft, melt-in-mouth textures infused with pure saffron and digestively friendly green cardamom."
  },
  {
    id: "festival",
    label: "Festival Special",
    desc: "Ghee-rich ceremonial sweets",
    emoji: "🪔",
    filterFn: (s) => s.badges.includes("Festival Special"),
    whyText: "Rich and celebratory options fried in pure cow ghee and infused with real saffron strands—designed specifically for auspicious occasions."
  },
  {
    id: "wedding",
    label: "Wedding Collection",
    desc: "Ultra-premium, gold and silver leaf",
    emoji: "💍",
    filterFn: (s) => s.badges.includes("Wedding Collection"),
    whyText: "Stunning craftsmanship incorporating real silver vark and high-end dry fruits, presented elegantly for your grandest milestones."
  },
  {
    id: "corporate",
    label: "Corporate Gifting",
    desc: "Longer shelf life, elegant display",
    emoji: "💼",
    filterFn: (s) => s.badges.includes("Corporate Gifting") && s.freshness.bestBeforeDays >= 10,
    whyText: "Premium dry-fruit based sweets with an extended shelf life (10+ days) and structural integrity, perfect for transit and gifting boxes."
  }
];

export default function RecommendationEngine({ products, onAddToBox, onOpenDetails }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("weight");

  const activeOption = RECOMMENDATION_OPTIONS.find((o) => o.id === selectedOptionId) || RECOMMENDATION_OPTIONS[0];

  const catalogProducts = products && products.length > 0 ? products : SWEETS_DATA;
  const recommendedSweets = catalogProducts.filter(activeOption.filterFn);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid rgba(212, 168, 67, 0.12)",
        padding: "clamp(70px, 9vw, 120px) 0",
      }}
    >
      <Container>
        <div className="section-header-center">
          <span className="section-eyebrow">Tailored Indulgence</span>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Smart Sweet Planner
          </h2>
          <div className="gold-divider" />
        </div>

      <div
        className="flex flex-col lg:flex-row gap-10 items-start"
      >
        {/* Left selector panel */}
        <div
          className="w-full lg:w-[35%] flex-shrink-0"
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              color: "var(--text-ivory)",
              marginBottom: 16,
              lineHeight: 1.3
            }}
          >
             What are you looking for today?
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: 24,
              lineHeight: 1.6
            }}
          >
            Tell us your dietary goals or occasion context, and our culinary matcher will suggest the ideal royal recipes.
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
          >
            {RECOMMENDATION_OPTIONS.map((opt) => {
              const isActive = opt.id === selectedOptionId;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "16px 20px",
                    borderRadius: 16,
                    border: isActive
                      ? "1.5px solid var(--saffron)"
                      : "1px solid rgba(45, 37, 30, 0.08)",
                    backgroundColor: isActive ? "rgba(255, 153, 51, 0.04)" : "#FFFDF7",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = "var(--gold-primary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = "rgba(45, 37, 30, 0.08)";
                  }}
                >
                  <span style={{ fontSize: "1.5rem", marginBottom: 8 }}>{opt.emoji}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-button)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: isActive ? "var(--saffron)" : "var(--text-cream)",
                      lineHeight: 1.2,
                    }}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      marginTop: 4,
                      lineHeight: 1.2
                    }}
                  >
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Recommended Output panel */}
        <div
          style={{
            flex: 1,
            width: "100%",
            background: "var(--bg-deep)",
            borderRadius: 24,
            padding: 32,
            border: "1px solid rgba(212, 168, 67, 0.15)",
          }}
        >
          {/* Explanation header */}
          <div
            style={{
              paddingBottom: 24,
              borderBottom: "1px dashed rgba(45, 37, 30, 0.1)",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--saffron)",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Recommended Selections
            </div>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.1rem",
                color: "var(--text-cream)",
                lineHeight: 1.5,
                fontStyle: "italic"
              }}
            >
              &ldquo;{activeOption.whyText}&rdquo;
            </p>
          </div>

          {/* Cards display */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {recommendedSweets.map((sweet) => (
              <div
                key={sweet.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(45, 37, 30, 0.08)",
                  borderRadius: 20,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(45, 37, 30, 0.02)",
                }}
              >
                <div>
                  <div
                    style={{
                      height: 120,
                      position: "relative",
                      background: "rgba(250, 246, 238, 0.4)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16
                    }}
                  >
                    <div style={{ position: "relative", width: 90, height: 90 }}>
                      <Image src={sweet.image} alt={sweet.name} fill sizes="90px" style={{ objectFit: "contain" }} unoptimized />
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "0.7rem",
                      color: "var(--text-gold)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontStyle: "italic",
                      display: "block",
                      marginBottom: 4
                    }}
                  >
                    {sweet.tagline}
                  </span>
                  <h4
                    style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: "1.2rem",
                      color: "var(--text-ivory)",
                      marginBottom: 6,
                      lineHeight: 1.2
                    }}
                  >
                    {sweet.name}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 14
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        backgroundColor: sweet.category === "Sugar-Free" ? "var(--pistachio)" : "rgba(255, 153, 51, 0.1)",
                        color: sweet.category === "Sugar-Free" ? "#FFFFFF" : "var(--saffron)",
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontWeight: 600
                      }}
                    >
                      {sweet.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        backgroundColor: "rgba(45, 37, 30, 0.05)",
                        color: "var(--text-cream)",
                        padding: "2px 6px",
                        borderRadius: 3
                      }}
                    >
                      {sweet.nutrition.calories} Calories
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(45, 37, 30, 0.06)",
                    paddingTop: 12,
                    marginTop: 8
                  }}
                >
                  <div>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-cream)" }}>₹{sweet.pricePerPiece}</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginLeft: 4 }}>({sweet.weightPerPiece}g)</span>
                  </div>

                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => onOpenDetails(sweet)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "1px solid rgba(45, 37, 30, 0.15)",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                      }}
                      title="Nutrition stats"
                    >
                      🛈
                    </button>
                    <button
                      onClick={() => onAddToBox(sweet)}
                      style={{
                        fontFamily: "var(--font-button)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        backgroundColor: "var(--text-cream)",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "0 10px",
                        borderRadius: 14,
                        height: 28,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}
