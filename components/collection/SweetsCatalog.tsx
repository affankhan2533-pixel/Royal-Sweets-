"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SweetProduct, SWEETS_DATA } from "@/lib/sweetsData";
import Container from "@/components/layout/Container";

interface Props {
  products?: SweetProduct[];
  onAddToBox: (sweet: SweetProduct) => void;
  onAddToCompare: (sweet: SweetProduct) => void;
  onOpenDetails: (sweet: SweetProduct) => void;
  compareList: SweetProduct[];
}

const DIETARY_TAGS = [
  "Sugar Free",
  "Low Sugar",
  "No Added Sugar",
  "High Protein",
  "Low Fat",
  "Diabetic Friendly",
  "Kids Friendly",
  "Senior Citizen Friendly",
];

export default function SweetsCatalog({ products, onAddToBox, onAddToCompare, onOpenDetails, compareList }: Props) {
  const [activeTab, setActiveTab] = useState<"All" | "Traditional" | "Sugar-Free">("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "protein-desc">("name");

  // Toggle filters
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const catalogProducts = products && products.length > 0 ? products : SWEETS_DATA;
    return catalogProducts.filter((product) => {
      // 1. Tab filter
      if (activeTab === "Traditional" && product.category !== "Traditional") return false;
      if (activeTab === "Sugar-Free" && product.category !== "Sugar-Free") return false;

      // 2. Tag filters (match all selected tags)
      if (selectedTags.length > 0) {
        const matchesAllTags = selectedTags.every((tag) =>
          product.badges.includes(tag) || (tag === "Sugar Free" && product.category === "Sugar-Free")
        );
        if (!matchesAllTags) return false;
      }

      // 3. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.desc.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTagline) return false;
      }

      return true;
    }).sort((a, b) => {
      // 4. Sort
      if (sortBy === "price-asc") return a.pricePerPiece - b.pricePerPiece;
      if (sortBy === "price-desc") return b.pricePerPiece - a.pricePerPiece;
      if (sortBy === "protein-desc") return b.nutrition.protein - a.nutrition.protein;
      return a.name.localeCompare(b.name);
    });
  }, [activeTab, selectedTags, searchQuery, sortBy]);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-deep)",
        borderTop: "1px solid rgba(212, 168, 67, 0.12)",
        padding: "clamp(70px, 9vw, 120px) 0",
      }}
    >
      <Container>
        {/* Title */}
        <div className="section-header-center">
          <span className="section-eyebrow">The Boutique Collection</span>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Mithai Atelier
          </h2>
          <div className="gold-divider" />
        </div>

      {/* Catalog Control Panel */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(134, 169, 107, 0.15)",
          borderRadius: 24,
          padding: 24,
          marginBottom: 40,
          boxShadow: "0 4px 20px rgba(45, 37, 30, 0.03)",
        }}
      >
        {/* Tab selector + Search + Sort */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(45, 37, 30, 0.08)",
            paddingBottom: 20,
            marginBottom: 20,
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["All", "Traditional", "Sugar-Free"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "8px 20px",
                  borderRadius: 50,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  backgroundColor: activeTab === tab ? "var(--saffron)" : "rgba(45, 37, 30, 0.04)",
                  color: activeTab === tab ? "#FFFFFF" : "var(--text-cream)",
                  transition: "all 0.3s ease",
                }}
              >
                {tab === "Sugar-Free" ? "Sugar Free Collection" : tab}
              </button>
            ))}
          </div>

          {/* Search Input & Sort dropdown */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: "1", justifyContent: "flex-end", maxWidth: 600 }}>
            <input
              type="text"
              placeholder="Search sweets (e.g. Ladoo, cashew)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                padding: "8px 16px",
                borderRadius: 50,
                border: "1px solid rgba(45, 37, 30, 0.15)",
                width: "100%",
                maxWidth: 300,
                outline: "none",
                color: "var(--text-ivory)",
              }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                padding: "8px 16px",
                borderRadius: 50,
                border: "1px solid rgba(45, 37, 30, 0.15)",
                outline: "none",
                color: "var(--text-cream)",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <option value="name">Sort A-Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="protein-desc">Highest Protein</option>
            </select>
          </div>
        </div>

        {/* Dietary Tag filters */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-button)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Filter by health focus:
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    padding: "6px 14px",
                    borderRadius: 50,
                    cursor: "pointer",
                    border: isSelected
                      ? "1px solid var(--pistachio)"
                      : "1px solid rgba(45, 37, 30, 0.1)",
                    backgroundColor: isSelected ? "rgba(134, 169, 107, 0.15)" : "#FFFFFF",
                    color: isSelected ? "var(--pistachio)" : "var(--text-muted)",
                    fontWeight: isSelected ? 600 : "normal",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tag}
                </button>
              );
            })}

            {(selectedTags.length > 0 || searchQuery !== "") && (
              <button
                onClick={handleClearFilters}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  padding: "6px 14px",
                  borderRadius: 50,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--saffron)",
                  textDecoration: "underline",
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sweets Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", fontStyle: "italic" }}>
            No exquisite sweets match your criteria. Try adjusting your health filters.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-[30px]"
        >
          {filteredProducts.map((product) => {
            const isSelectedForCompare = compareList.some((item) => item.id === product.id);
            const isSugarFree = product.category === "Sugar-Free" || product.badges.includes("Sugar Free");

            // Deduplicate badges to prevent duplicate Sugar Free labels
            const uniqueBadges = (() => {
              const badges: { text: string; isSugarFree: boolean; isDiabetic: boolean }[] = [];
              if (isSugarFree) {
                badges.push({ text: "✓ Sugar Free", isSugarFree: true, isDiabetic: false });
              }
              product.badges.forEach((b) => {
                if (b.toLowerCase() === "sugar free") return;
                badges.push({
                  text: b,
                  isSugarFree: false,
                  isDiabetic: b === "Diabetic Friendly",
                });
              });
              return badges;
            })();

            return (
              <div
                key={product.id}
                className="glass-card boutique-card-hover rounded-[16px] sm:rounded-[24px] active:scale-[0.98] transition-all duration-300"
                style={{
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  border: "1px solid rgba(212, 168, 67, 0.15)",
                  position: "relative"
                }}
              >
                <Link href={`/sweet/${product.id}`} className="flex flex-col flex-1">
                  {/* Image and Badges Header */}
                  <div
                    className="h-[130px] sm:h-[220px] relative bg-[rgba(250,246,238,0.6)] flex items-center justify-center p-3 sm:p-5"
                  >
                  {/* Stock Availability status */}
                  <span
                    className="absolute top-2 right-2 sm:top-[14px] sm:right-[14px] text-[7px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border z-[5] shadow-xs"
                    style={{
                      backgroundColor:
                        product.availability === "In Stock"
                          ? "#E2F7EE"
                          : product.availability === "Limited Stock"
                          ? "#FFF4E6"
                          : "#F5F2EF",
                      color:
                        product.availability === "In Stock"
                          ? "#00875A"
                          : product.availability === "Limited Stock"
                          ? "#FF9933"
                          : "#7E6D60",
                      borderColor:
                        product.availability === "In Stock"
                          ? "#B3EED6"
                          : product.availability === "Limited Stock"
                          ? "#FFE0B3"
                          : "#E3DCD5",
                    }}
                  >
                    {product.availability}
                  </span>

                  {/* Image */}
                  <div
                    className="w-[80px] h-[80px] sm:w-[160px] sm:h-[160px] relative"
                    style={{
                      animation: "floatSlow 10s ease-in-out infinite",
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 80px, 160px"
                      unoptimized
                      style={{
                        objectFit: "contain",
                        filter: "drop-shadow(0 8px 16px rgba(45,37,30,0.1))"
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>                {/* Sweet Card Details */}
                <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF" }}>
                  <div>
                    {/* Tagline */}
                    <div
                      className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-semibold mb-1.5"
                      style={{
                        fontFamily: "var(--font-button)",
                        color: "#B88E2F",
                        opacity: 0.9,
                      }}
                    >
                      {product.tagline}
                    </div>

                    {/* Dietary Badges Row */}
                    {uniqueBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-2">
                        {uniqueBadges.slice(0, 2).map((b, idx) => (
                          <span
                            key={idx}
                            className={`text-[8px] sm:text-[9px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${idx >= 1 ? "hidden sm:inline-block" : ""}`}
                            style={{
                              backgroundColor: b.isSugarFree 
                                ? "rgba(134, 169, 107, 0.08)" 
                                : b.isDiabetic 
                                ? "rgba(0, 135, 90, 0.06)" 
                                : "rgba(212, 168, 67, 0.08)",
                              color: b.isSugarFree 
                                ? "#557A3E" 
                                : b.isDiabetic 
                                ? "#00875A" 
                                : "#A6802B",
                              borderColor: b.isSugarFree 
                                ? "rgba(134, 169, 107, 0.18)" 
                                : b.isDiabetic 
                                ? "rgba(0, 135, 90, 0.15)" 
                                : "rgba(212, 168, 67, 0.18)",
                            }}
                          >
                            {b.text}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      className="text-[15px] sm:text-[1.3rem] font-semibold mb-1.5 line-clamp-1"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        color: "var(--text-ivory)",
                        lineHeight: 1.2,
                        letterSpacing: "0.01em"
                      }}
                    >
                      {product.name}
                    </h3>                    {/* Description */}
                    <p
                      className="hidden sm:block text-[12px] leading-snug mb-3 line-clamp-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--text-muted)",
                        opacity: 0.85,
                        fontWeight: 300,
                        height: "36px",
                      }}
                    >
                      {product.desc}
                    </p>
                  </div>

                  {/* Freshness & Metrics Block */}
                  <div className="hidden sm:block border-t border-[rgba(45,37,30,0.06)] pt-2.5 mb-3">
                    <div className="flex justify-between items-center text-[10.5px] text-[var(--text-muted)]">
                      <span className="font-sans tracking-wide">Shelf Life: <span className="font-medium text-[var(--text-cream)]">{product.freshness.bestBeforeDays} Days</span></span>
                      <span className="flex items-center gap-1 font-sans tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86A96B] animate-pulse"></span>
                        Fresh: <span className="font-semibold text-[#86A96B]">{product.freshness.score}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

                {/* Pricing and Options */}
                  <div className="border-t border-[rgba(45,37,30,0.08)] pt-3 mt-auto flex flex-col gap-2.5">
                    {/* Row 1: Price and Action Icons */}
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[18px] sm:text-[20px] font-bold text-[var(--text-gold)]">₹{product.pricePerKg}</span>
                        <span className="text-[11px] text-[var(--text-muted)] font-sans">/ kg</span>
                      </div>

                      {/* Compare & Nutrition circular buttons */}
                      <div style={{ display: "flex", gap: 6 }}>
                        {/* Compare */}
                        <button
                          onClick={() => onAddToCompare(product)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: isSelectedForCompare
                              ? "1.5px solid var(--gold-primary)"
                              : "1px solid rgba(212, 168, 67, 0.25)",
                            backgroundColor: isSelectedForCompare ? "rgba(212, 168, 67, 0.08)" : "rgba(250, 246, 238, 0.6)",
                            color: isSelectedForCompare ? "var(--gold-deep)" : "var(--text-cream)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(45,37,30,0.02)"
                          }}
                          className="active:scale-90 hover:border-var(--gold-primary) hover:bg-[rgba(212,168,67,0.05)]"
                          title="Compare"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 16V4M7 4L3 8M7 4l4 4" />
                            <path d="M17 8v12M17 20l-4-4m4 4l4-4" />
                          </svg>
                        </button>

                        {/* Nutrition Facts Icon */}
                        <button
                          onClick={() => onOpenDetails(product)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: "1px solid rgba(212, 168, 67, 0.25)",
                            backgroundColor: "rgba(250, 246, 238, 0.6)",
                            color: "var(--text-cream)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(45,37,30,0.02)"
                          }}
                          className="active:scale-90 hover:border-var(--gold-primary) hover:bg-[rgba(212,168,67,0.05)]"
                          title="Nutrition Info"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Add to Box Button */}
                    <button
                      id={`add-to-box-${product.id}`}
                      onClick={() => onAddToBox(product)}
                      disabled={product.availability === "Fresh Batch Preparing"}
                      style={{
                        fontFamily: "var(--font-button)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background:
                          product.availability === "Fresh Batch Preparing"
                            ? "#F4EFE6"
                            : "linear-gradient(135deg, #E6BF65 0%, #D4A843 50%, #B88E2F 100%)",
                        color: product.availability === "Fresh Batch Preparing" ? "var(--text-muted)" : "#FFFFFF",
                        border: product.availability === "Fresh Batch Preparing" ? "1px solid #E3DCD5" : "none",
                        padding: "10px 0",
                        borderRadius: 20,
                        width: "100%",
                        cursor: product.availability === "Fresh Batch Preparing" ? "not-allowed" : "pointer",
                        fontWeight: 700,
                        transition: "all 0.25s ease",
                        boxShadow: product.availability === "Fresh Batch Preparing" ? "none" : "0 4px 12px rgba(212, 168, 67, 0.2)",
                      }}
                      className={product.availability === "Fresh Batch Preparing" ? "" : "active:scale-95 hover:brightness-105"}
                    >
                      {product.availability === "Fresh Batch Preparing" ? "Preparing Batch" : "+ Add to Box"}
                    </button>
                  </div>
              </div>
            );
          })}
        </div>
      )}
      </Container>
    </div>
  );
}
