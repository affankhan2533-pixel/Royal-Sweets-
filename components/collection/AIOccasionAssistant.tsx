"use client";
import React, { useState } from "react";
import { SweetProduct, SWEETS_DATA } from "@/lib/sweetsData";
import Container from "@/components/layout/Container";

interface SuggestionResult {
  totalWeightNeeded: number; // in grams
  recommendedSweets: { sweet: SweetProduct; quantity: number }[];
  suggestedBoxes: string;
  totalCostEstimate: number;
  packagingSuggestion: string;
}

interface Props {
  products?: SweetProduct[];
  onAutofillBox: (sweets: { sweet: SweetProduct; count: number }[], size: "250g" | "500g" | "1kg") => void;
}

const OCCASIONS = [
  { id: "wedding", label: "Wedding Collection", defaultGramsPerGuest: 60, tags: ["Wedding Collection", "Gluten Free"] },
  { id: "corporate", label: "Corporate Gifting", defaultGramsPerGuest: 50, tags: ["Corporate Gifting"] },
  { id: "festival", label: "Festival Special", defaultGramsPerGuest: 60, tags: ["Festival Special"] },
  { id: "birthday", label: "Birthday Party", defaultGramsPerGuest: 40, tags: ["Kids Favourite"] },
  { id: "family", label: "Family Gathering", defaultGramsPerGuest: 50, tags: ["Senior Citizen Friendly", "Kids Friendly"] },
];

export default function AIOccasionAssistant({ products, onAutofillBox }: Props) {
  const [occasion, setOccasion] = useState("festival");
  const [guestCount, setGuestCount] = useState<number>(30);
  const [budget, setBudget] = useState<number>(3000);
  const [result, setResult] = useState<SuggestionResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (guestCount <= 0 || budget <= 0) {
      alert("Please enter valid positive numbers for guests and budget.");
      return;
    }

    const selectedOcc = OCCASIONS.find((o) => o.id === occasion) || OCCASIONS[2];
    
    // Calculate weight requirements
    // Grams per guest: e.g. 50g
    const gramsPerGuest = selectedOcc.defaultGramsPerGuest;
    const totalWeightNeeded = guestCount * gramsPerGuest; // in grams

    // Gather sweets matching occasion tags or category
    const catalogProducts = products && products.length > 0 ? products : SWEETS_DATA;
    let pool = catalogProducts.filter((s) =>
      s.badges.some((badge) => selectedOcc.tags.includes(badge))
    );

    // Fallback if pool is empty
    if (pool.length === 0) {
      pool = catalogProducts.slice(0, 3);
    }

    // Sort by price per piece to optimize budget
    pool.sort((a, b) => a.pricePerPiece - b.pricePerPiece);

    // simple greedy allocation of sweets to match total weight and stay within budget
    // Average sweet is ~40g, so total pieces = totalWeightNeeded / 40
    const targetPieces = Math.round(totalWeightNeeded / 40);
    const recommendedSweets: { sweet: SweetProduct; quantity: number }[] = [];
    let allocatedPieces = 0;
    let currentCost = 0;

    // Allocate pieces round-robin
    while (allocatedPieces < targetPieces && currentCost < budget) {
      let addedThisRound = false;
      for (const sweet of pool) {
        if (allocatedPieces >= targetPieces) break;
        
        // Check price restriction
        if (currentCost + sweet.pricePerPiece <= budget) {
          const existing = recommendedSweets.find((item) => item.sweet.id === sweet.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            recommendedSweets.push({ sweet, quantity: 1 });
          }
          currentCost += sweet.pricePerPiece;
          allocatedPieces += 1;
          addedThisRound = true;
        }
      }
      if (!addedThisRound) break; // budget constraint hit
    }

    // Suggest Box configurations
    // 250g box holds 6 pieces, 500g box holds 12 pieces, 1kg box holds 24 pieces
    let suggestedBoxes = "";
    let packagingSuggestion = "";
    
    if (allocatedPieces <= 6) {
      suggestedBoxes = "1 Box of 250g";
      packagingSuggestion = "Standard Eco Carton";
    } else if (allocatedPieces <= 12) {
      suggestedBoxes = "1 Box of 500g";
      packagingSuggestion = "Silk Royal Box";
    } else if (allocatedPieces <= 24) {
      suggestedBoxes = "1 Box of 1kg";
      packagingSuggestion = "Golden Heritage Tin";
    } else {
      // Multiple boxes
      const halfKiloBoxesCount = Math.ceil(allocatedPieces / 12);
      suggestedBoxes = `${halfKiloBoxesCount} Boxes of 500g`;
      packagingSuggestion = "Silk Royal Boxes";
    }

    setResult({
      totalWeightNeeded,
      recommendedSweets,
      suggestedBoxes,
      totalCostEstimate: currentCost,
      packagingSuggestion
    });
  };

  const handleApplyToBuilder = () => {
    if (!result || result.recommendedSweets.length === 0) return;

    // Convert result recommendedSweets into box items for a single box
    // Limit to max capacities to avoid overfilling
    let targetBoxSize: "250g" | "500g" | "1kg" = "500g";
    let maxCap = 12;

    const totalAllocated = result.recommendedSweets.reduce((acc, item) => acc + item.quantity, 0);
    if (totalAllocated <= 6) {
      targetBoxSize = "250g";
      maxCap = 6;
    } else if (totalAllocated <= 12) {
      targetBoxSize = "500g";
      maxCap = 12;
    } else {
      targetBoxSize = "1kg";
      maxCap = 24;
    }

    // Build the selection list scaled down to fit one box size
    let currentCount = 0;
    const itemsToFill: { sweet: SweetProduct; count: number }[] = [];

    for (const item of result.recommendedSweets) {
      if (currentCount >= maxCap) break;
      const countToAdd = Math.min(item.quantity, maxCap - currentCount);
      itemsToFill.push({ sweet: item.sweet, count: countToAdd });
      currentCount += countToAdd;
    }

    onAutofillBox(itemsToFill, targetBoxSize);

    // Scroll to box builder
    document.getElementById("box-builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-deep)",
        borderTop: "1px solid rgba(212, 168, 67, 0.12)",
        padding: "clamp(70px, 9vw, 120px) 0",
      }}
    >
      <Container>
        <div className="section-header-center">
          <span className="section-eyebrow">Auspicious Occasion Planner</span>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            AI Occasion Planner
          </h2>
          <div className="gold-divider" />
        </div>

      <div
        className="flex flex-col lg:flex-row gap-10 items-start"
      >
        {/* Left Form Panel */}
        <form
          onSubmit={handleCalculate}
          style={{
            flex: "1",
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid rgba(134, 169, 107, 0.15)",
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 6px 24px rgba(45, 37, 30, 0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 20
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              color: "var(--text-ivory)",
              borderBottom: "1px solid rgba(45, 37, 30, 0.06)",
              paddingBottom: 12,
              marginBottom: 8
            }}
          >
            Catering Sweet Configurator
          </div>

          {/* Occasion select */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--text-cream)",
                marginBottom: 8,
                fontWeight: 600
              }}
            >
              Select Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid rgba(45, 37, 30, 0.15)",
                outline: "none",
                color: "var(--text-cream)",
                backgroundColor: "#FFFFFF",
                cursor: "pointer"
              }}
            >
              {OCCASIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Guests count and Budget in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-button)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text-cream)",
                  marginBottom: 8,
                  fontWeight: 600
                }}
              >
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(45, 37, 30, 0.15)",
                  outline: "none",
                  color: "var(--text-ivory)"
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-button)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text-cream)",
                  marginBottom: 8,
                  fontWeight: 600
                }}
              >
                Budget (₹)
              </label>
              <input
                type="number"
                min="100"
                max="1000000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(45, 37, 30, 0.15)",
                  outline: "none",
                  color: "var(--text-ivory)"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              fontFamily: "var(--font-button)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "linear-gradient(135deg, var(--saffron), #FF7722)",
              border: "none",
              padding: "16px 32px",
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(255,120,0,0.25)",
              marginTop: 10,
              transition: "transform 0.2s ease"
            }}
          >
            Calculate Suggestions
          </button>
        </form>

        {/* Right Output Results Panel */}
        <div
          style={{
            flex: "1.2",
            width: "100%",
            background: "#FFFFFF",
            border: "1.5px solid var(--gold-primary)",
            borderRadius: 24,
            padding: 32,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            justifyContent: result ? "space-between" : "center",
            alignItems: result ? "stretch" : "center",
            boxShadow: "0 6px 24px rgba(45, 37, 30, 0.04)"
          }}
        >
          {!result ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🧮</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--text-cream)", marginBottom: 8 }}>
                Occasion Allocation Solver
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                Enter your guest count and target budget on the left. The engine will instantly calculate the ideal sweet distributions and luxury configurations.
              </p>
            </div>
          ) : (
            <>
              {/* suggestion details */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--saffron)",
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Calculation Results
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Weight Needed</span>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: "1.5rem", color: "var(--text-ivory)" }}>{(result.totalWeightNeeded / 1000).toFixed(1)} kg</div>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>based on portion estimates</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Suggested Distribution</span>
                    <div style={{ fontFamily: "var(--font-dm)", fontSize: "1.5rem", color: "var(--text-ivory)" }}>{result.suggestedBoxes}</div>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>in {result.packagingSuggestion}</span>
                  </div>
                </div>

                {/* Sweet Allocations List */}
                <div style={{ marginBottom: 24 }}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-button)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--text-cream)",
                      marginBottom: 10,
                      fontWeight: 600
                    }}
                  >
                    Recommended Mithai Blend:
                  </span>

                  {result.recommendedSweets.length === 0 ? (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No items fit this budget range. Try raising budget.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.recommendedSweets.map((item) => (
                        <div
                          key={item.sweet.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            borderBottom: "1px solid rgba(45, 37, 30, 0.05)",
                            paddingBottom: 6
                          }}
                        >
                          <span style={{ color: "var(--text-ivory)", fontWeight: 500 }}>
                            {item.sweet.name} <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>({item.sweet.weightPerPiece * item.quantity}g)</span>
                          </span>
                          <span style={{ color: "var(--text-cream)", fontWeight: 600 }}>
                            {item.quantity} pieces
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* pricing checkout trigger */}
              <div
                style={{
                  borderTop: "1.5px solid rgba(212, 168, 67, 0.2)",
                  paddingTop: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16
                }}
              >
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Cost</span>
                  <div style={{ fontFamily: "var(--font-button)", fontSize: "1.6rem", fontWeight: "bold", color: "var(--saffron)", lineHeight: 1 }}>
                    ₹{result.totalCostEstimate}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Fits budget limit of ₹{budget}</span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleApplyToBuilder}
                    disabled={result.recommendedSweets.length === 0}
                    className="w-full sm:w-auto text-center"
                    style={{
                      fontFamily: "var(--font-button)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      backgroundColor: "var(--text-cream)",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 50,
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Assemble Custom Box
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        </div>
      </Container>
    </div>
  );
}
