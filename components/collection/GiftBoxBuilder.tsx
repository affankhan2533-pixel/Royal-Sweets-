"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { SweetProduct, SWEETS_DATA } from "@/lib/sweetsData";
import Container from "@/components/layout/Container";

interface BoxItem {
  sweet: SweetProduct;
  count: number;
}

interface Props {
  products?: SweetProduct[];
  boxItems: BoxItem[];
  boxSize: "250g" | "500g" | "1kg";
  packaging: "Silk Box" | "Golden Tin" | "Eco Carton";
  premiumWrapping: boolean;
  giftMessage: string;
  onSetBoxSize: (size: "250g" | "500g" | "1kg") => void;
  onSetPackaging: (pkg: "Silk Box" | "Golden Tin" | "Eco Carton") => void;
  onSetPremiumWrapping: (wrap: boolean) => void;
  onSetGiftMessage: (msg: string) => void;
  onAddOne: (sweet: SweetProduct) => void;
  onRemoveOne: (sweet: SweetProduct) => void;
  onClearBox: () => void;
  whatsappNumber?: string;
}

const PACKAGING_OPTS = [
  { id: "Eco Carton", label: "Standard Eco Carton", price: 0, desc: "Recyclable kraft paper box" },
  { id: "Silk Box", label: "Silk Royal Box", price: 150, desc: "Aromatic velvet lining & gold borders" },
  { id: "Golden Tin", label: "Golden Heritage Tin", price: 200, desc: "Reusable embossed luxury metal container" },
] as const;

export default function GiftBoxBuilder({
  products,
  boxItems,
  boxSize,
  packaging,
  premiumWrapping,
  giftMessage,
  onSetBoxSize,
  onSetPackaging,
  onSetPremiumWrapping,
  onSetGiftMessage,
  onAddOne,
  onRemoveOne,
  onClearBox,
  whatsappNumber,
}: Props) {
  // Max capacity based on pieces weight estimate:
  // 250g box holds about 6-8 pieces (let's limit to 6 pieces for simple packaging slot visuals)
  // 500g box holds about 12 pieces
  // 1kg box holds about 24 pieces
  const maxPieces = useMemo(() => {
    if (boxSize === "250g") return 6;
    if (boxSize === "500g") return 12;
    return 24;
  }, [boxSize]);

  // Current totals
  const totalPieces = useMemo(() => {
    return boxItems.reduce((acc, item) => acc + item.count, 0);
  }, [boxItems]);

  const totalWeight = useMemo(() => {
    return boxItems.reduce((acc, item) => acc + (item.sweet.weightPerPiece * item.count), 0);
  }, [boxItems]);

  const sweetsCost = useMemo(() => {
    return boxItems.reduce((acc, item) => acc + (item.sweet.pricePerPiece * item.count), 0);
  }, [boxItems]);

  const packagingCost = useMemo(() => {
    const opt = PACKAGING_OPTS.find((p) => p.id === packaging);
    return opt ? opt.price : 0;
  }, [packaging]);

  const wrappingCost = premiumWrapping ? 50 : 0;
  const grandTotal = sweetsCost + packagingCost + wrappingCost;

  // Generate a pre-filled WhatsApp link text
  const whatsappUrl = useMemo(() => {
    if (totalPieces === 0) return "#";
    const itemsList = boxItems
      .map((item) => `- ${item.sweet.name} x ${item.count} (${item.sweet.weightPerPiece * item.count}g)`)
      .join("%0A");

    const message = `Namaste Royal Sweet! %0AI would like to order a Custom Sweet Box:%0A%0A` +
      `*Box Size:* ${boxSize}%0A` +
      `*Packaging:* ${packaging}%0A` +
      `*Premium Gift Wrapping:* ${premiumWrapping ? "Yes" : "No"}%0A` +
      `*Gift Message:* ${giftMessage ? `"${giftMessage}"` : "None"}%0A%0A` +
      `*Box Contents:*%0A${itemsList}%0A%0A` +
      `*Total Weight:* ${totalWeight}g%0A` +
      `*Grand Total:* ₹${grandTotal}%0A%0A` +
      `Please confirm my custom box fresh order. Dhanyavad!`;

    const cleanedNumber = (whatsappNumber || "+91 98765 43210").replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanedNumber}?text=${message}`;
  }, [boxItems, boxSize, packaging, premiumWrapping, giftMessage, totalWeight, grandTotal, totalPieces, whatsappNumber]);

  // Visual packaging grid representation
  const gridSlots = Array.from({ length: maxPieces }).map((_, idx) => {
    // Flatten items to represent slot contents
    let currentIdx = 0;
    for (const item of boxItems) {
      if (idx >= currentIdx && idx < currentIdx + item.count) {
        return item.sweet;
      }
      currentIdx += item.count;
    }
    return null;
  });

  return (
    <div
      id="box-builder"
      style={{
        backgroundColor: "var(--bg-dark)",
        borderTop: "1px solid rgba(212, 168, 67, 0.12)",
        padding: "clamp(70px, 9vw, 120px) 0",
      }}
    >
      <Container>
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-eyebrow">Bespoke Gifting</span>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Custom Gift Box Builder
          </h2>
          <div className="gold-divider" />
        </div>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-6 lg:gap-12 w-full items-start"
        >
        {/* Left Side: Visual Packaging Box Preview */}
        <div
          className="w-full bg-[var(--bg-deep)] rounded-[24px] p-5 sm:p-8 border-[1.5px] border-[var(--gold-primary)] relative flex flex-col items-center min-w-0"
          style={{
            flex: "1",
            minWidth: 0,
          }}
        >
          {/* Box Cover Label */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              color: "var(--text-gold)",
              textAlign: "center",
              marginBottom: 24,
              borderBottom: "1px solid rgba(212, 168, 67, 0.2)",
              paddingBottom: 12,
              width: "100%"
            }}
          >
            {packaging === "Silk Box" ? "👑 Royal Silk Box" : packaging === "Golden Tin" ? "🏆 Golden Heritage Tin" : "📦 Standard Eco Carton"} ({boxSize})
          </div>

          {/* Visual Sweet slots representation */}
          <div
            className="grid gap-3 sm:gap-4 bg-white border-2 border-[var(--gold-primary)] shadow-[inset_0_4px_20px_rgba(45,37,30,0.08)] p-4 sm:p-6 rounded-[16px] w-full max-w-[420px] mb-6"
            style={{
              gridTemplateColumns: boxSize === "250g" ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
              aspectRatio: boxSize === "250g" ? "3/2" : "1",
            }}
          >
            {gridSlots.map((sweet, idx) => (
              <div
                key={idx}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 12,
                  border: sweet ? "1px solid rgba(212, 168, 67, 0.3)" : "1.5px dashed rgba(45, 37, 30, 0.15)",
                  backgroundColor: sweet ? "rgba(250, 246, 238, 0.8)" : "rgba(45, 37, 30, 0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              >
                {sweet ? (
                  <>
                    <div style={{ position: "relative", width: "85%", height: "85%" }}>
                      <Image src={sweet.image} alt={sweet.name} fill sizes="80px" style={{ objectFit: "contain" }} unoptimized />
                    </div>
                    {/* Hover remove */}
                    <button
                      onClick={() => onRemoveOne(sweet)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(232, 136, 154, 0.9)",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >
                      &minus;
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.5 }}>Empty</span>
                )}
              </div>
            ))}
          </div>

          {/* Box Progress Indicators */}
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-cream)", marginBottom: 6 }}>
              <span>Slots Filled: <strong>{totalPieces} / {maxPieces} pieces</strong></span>
              <span>Total Weight: <strong>{totalWeight}g / {boxSize}</strong></span>
            </div>
            <div style={{ height: 6, width: "100%", backgroundColor: "rgba(45, 37, 30, 0.08)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (totalPieces / maxPieces) * 100)}%`,
                  backgroundColor: totalPieces === maxPieces ? "var(--pistachio)" : "var(--saffron)",
                  transition: "width 0.4s ease"
                }}
              />
            </div>
            {totalPieces === maxPieces && (
              <div style={{ color: "var(--pistachio)", fontSize: "0.75rem", textAlign: "center", fontWeight: 600 }}>
                ✓ Box is perfectly filled! Ready for packaging.
              </div>
            )}
            {totalPieces > maxPieces && (
              <div style={{ color: "#D9534F", fontSize: "0.75rem", textAlign: "center", fontWeight: 600 }}>
                ⚠ Box is overfilled! Please remove {totalPieces - maxPieces} items or choose a larger size.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Box Configurator Panel */}
        <div
          style={{
            flex: "1.2",
            width: "100%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 28
          }}
        >
          {/* Step 1: Select Box Size */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--saffron)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>1</span>
              <h3 style={{ fontFamily: "var(--font-button)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-ivory)", margin: 0 }}>Select Box Size</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(["250g", "500g", "1kg"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    onSetBoxSize(size);
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 12,
                    border: boxSize === size ? "1.5px solid var(--saffron)" : "1px solid rgba(45, 37, 30, 0.1)",
                    backgroundColor: boxSize === size ? "rgba(255, 153, 51, 0.04)" : "#FFFFFF",
                    fontFamily: "var(--font-button)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: boxSize === size ? "var(--saffron)" : "var(--text-cream)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {size === "250g" ? "250g (6 pcs)" : size === "500g" ? "500g (12 pcs)" : "1kg (24 pcs)"}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Custom Contents */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--saffron)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>2</span>
              <h3 style={{ fontFamily: "var(--font-button)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-ivory)", margin: 0 }}>Box Contents</h3>
            </div>

            {/* Quick Add Sweets List */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-button)", fontSize: "0.7rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>
                Select Sweets to Add
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  overflowX: "auto",
                  paddingBottom: 8,
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
                className="no-scrollbar"
              >
                {(products && products.length > 0 ? products : SWEETS_DATA).map((sweet) => {
                  const existing = boxItems.find((item) => item.sweet.id === sweet.id);
                  const count = existing ? existing.count : 0;
                  return (
                    <div
                      key={sweet.id}
                      style={{
                        flex: "0 0 110px",
                        background: "#FFFFFF",
                        border: count > 0 ? "1.5px solid var(--saffron)" : "1px solid rgba(45, 37, 30, 0.08)",
                        borderRadius: 12,
                        padding: 8,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => {
                        if (totalPieces < maxPieces) {
                          onAddOne(sweet);
                        } else {
                          alert(`Your selected ${boxSize} box is full (${maxPieces}/${maxPieces} pieces).`);
                        }
                      }}
                      data-cursor-hover
                    >
                      {/* Image */}
                      <div style={{ position: "relative", width: 44, height: 44, marginBottom: 4 }}>
                        <Image src={sweet.image} alt={sweet.name} fill sizes="44px" style={{ objectFit: "contain" }} unoptimized />
                      </div>
                      
                      {/* Name & Price */}
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-ivory)", lineHeight: 1.1, height: 26, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {sweet.name}
                      </div>
                      <div style={{ fontSize: "0.6rem", color: "var(--text-gold)", fontWeight: 600, marginTop: 2 }}>
                        ₹{sweet.pricePerPiece}/pc
                      </div>

                      {/* Add overlay or counter indicator */}
                      {count > 0 ? (
                        <div
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            backgroundColor: "var(--saffron)",
                            color: "#FFFFFF",
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(255,153,51,0.4)",
                          }}
                        >
                          {count}
                        </div>
                      ) : (
                        <div
                          style={{
                            marginTop: 6,
                            backgroundColor: "rgba(255, 153, 51, 0.08)",
                            color: "var(--saffron)",
                            borderRadius: 20,
                            padding: "2px 8px",
                            fontSize: "0.6rem",
                            fontWeight: 600,
                          }}
                        >
                          + Add
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {boxItems.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: "1px dashed rgba(45, 37, 30, 0.15)",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                }}
              >
                No sweets added yet. Tap on any sweet above to start customizing your custom box!
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxHeight: 240,
                  overflowY: "auto",
                  background: "var(--bg-deep)",
                  padding: 16,
                  borderRadius: 16,
                  border: "1px solid rgba(45, 37, 30, 0.08)"
                }}
              >
                {boxItems.map((item) => (
                  <div
                    key={item.sweet.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 10,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(45, 37, 30, 0.05)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ position: "relative", width: 36, height: 36 }}>
                        <Image src={item.sweet.image} alt={item.sweet.name} fill sizes="36px" style={{ objectFit: "contain" }} unoptimized />
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-ivory)" }}>{item.sweet.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>₹{item.sweet.pricePerPiece} / pc · {item.sweet.weightPerPiece}g</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button
                        onClick={() => onRemoveOne(item.sweet)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: "1px solid rgba(45, 37, 30, 0.15)",
                          background: "#FFFFFF",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        &minus;
                      </button>
                      <span style={{ fontFamily: "var(--font-button)", fontSize: "0.85rem", fontWeight: "bold", width: 20, textAlign: "center" }}>{item.count}</span>
                      <button
                        onClick={() => onAddOne(item.sweet)}
                        disabled={totalPieces >= maxPieces}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: "1px solid rgba(45, 37, 30, 0.15)",
                          background: totalPieces >= maxPieces ? "rgba(45, 37, 30, 0.05)" : "#FFFFFF",
                          cursor: totalPieces >= maxPieces ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color: totalPieces >= maxPieces ? "var(--text-muted)" : "var(--text-ivory)"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Packaging & Presentation */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--saffron)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>3</span>
              <h3 style={{ fontFamily: "var(--font-button)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-ivory)", margin: 0 }}>Select Packaging</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PACKAGING_OPTS.map((opt) => {
                const isSelected = packaging === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => onSetPackaging(opt.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 18px",
                      borderRadius: 12,
                      border: isSelected ? "1.5px solid var(--saffron)" : "1px solid rgba(45, 37, 30, 0.08)",
                      backgroundColor: isSelected ? "rgba(255, 153, 51, 0.02)" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: isSelected ? "var(--saffron)" : "var(--text-cream)" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {opt.desc}
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--font-button)", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-gold)" }}>
                      {opt.price === 0 ? "Free" : `+₹${opt.price}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gift Message & Ribbon */}
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              background: "var(--bg-deep)",
              border: "1px solid rgba(45, 37, 30, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {/* Ribbon option */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={premiumWrapping}
                onChange={(e) => onSetPremiumWrapping(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--saffron)" }}
              />
              <div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-cream)" }}>
                  Add Premium Gift Wrapping (+₹50)
                </span>
                <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                  Includes customized satin ribbon wrap and an embossed tag.
                </span>
              </div>
            </label>

            {/* Gift Message input */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-button)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text-cream)",
                  marginBottom: 6,
                  fontWeight: 600
                }}
              >
                Add a Gift Message (Free)
              </label>
              <input
                type="text"
                placeholder="Wishing you a beautiful and sweet celebration..."
                value={giftMessage}
                onChange={(e) => onSetGiftMessage(e.target.value)}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(45, 37, 30, 0.12)",
                  outline: "none",
                  color: "var(--text-ivory)"
                }}
              />
            </div>
          </div>

          {/* Pricing summary and WhatsApp order trigger */}
          <div
            style={{
              paddingTop: 16,
              borderTop: "1.5px solid rgba(45, 37, 30, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Price</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--saffron)" }}>₹{grandTotal}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  (Sweets: ₹{sweetsCost} + Box: ₹{packagingCost + wrappingCost})
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {totalPieces > 0 && (
                <button
                  onClick={onClearBox}
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Clear Box
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (totalPieces === 0) {
                    e.preventDefault();
                    alert("Please add at least one sweet to your box to order!");
                  } else if (totalPieces > maxPieces) {
                    e.preventDefault();
                    alert(`Your box is overfilled! Please choose the larger box size or remove ${totalPieces - maxPieces} items.`);
                  }
                }}
                className="w-full sm:w-auto flex sm:inline-flex items-center justify-center gap-2"
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #25D366, #128C7E)", // WhatsApp Brand Colors
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: 50,
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                  textDecoration: "none"
                }}
              >
                {/* Simple SVG WhatsApp Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.89C16.645 2.13 14.197 1.117 11.6 1.117c-5.447 0-9.878 4.372-9.882 9.744-.002 1.94.512 3.834 1.488 5.525l-.987 3.6 3.733-.966z" />
                </svg>
                Order Box via WhatsApp
              </a>
            </div>
          </div>
        </div>
        </div>
      </Container>
    </div>
  );
}
