"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { SweetProduct } from "@/lib/sweetsData";

interface Props {
  selectedSweets: SweetProduct[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function ComparisonTool({ selectedSweets, onRemove, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Drawer entrance animation when list changes
  useEffect(() => {
    if (selectedSweets.length > 0) {
      gsap.fromTo(
        drawerRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
  }, [selectedSweets.length]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        modalRef.current,
        { y: 50, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }, 50);
  };

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.98,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setIsOpen(false)
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25
    });
  };

  if (selectedSweets.length === 0) return null;

  // Max values to calculate comparison bar percentages
  const maxCalories = Math.max(...selectedSweets.map((s) => s.nutrition.calories), 1);
  const maxSugar = Math.max(...selectedSweets.map((s) => s.nutrition.sugar), 0.1);
  const maxProtein = Math.max(...selectedSweets.map((s) => s.nutrition.protein), 1);
  const maxFat = Math.max(...selectedSweets.map((s) => s.nutrition.fat), 1);
  const maxCholesterol = Math.max(...selectedSweets.map((s) => s.nutrition.cholesterol), 1);

  return (
    <>
      {/* ── Persistent Floating Drawer ────────────────────────── */}
      {!isOpen && (
        <div
          ref={drawerRef}
          className="compare-persistent-drawer"
        >
          <div className="compare-drawer-title">
            Compare Sweets ({selectedSweets.length}/3)
          </div>

          <div className="compare-drawer-images">
            {selectedSweets.map((s) => (
              <div
                key={s.id}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-deep)",
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(45, 37, 30, 0.1)",
                }}
              >
                <Image src={s.image} alt={s.name} fill sizes="32px" style={{ objectFit: "contain" }} unoptimized />
              </div>
            ))}
          </div>

          <button
            onClick={handleOpen}
            style={{
              fontFamily: "var(--font-button)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "linear-gradient(135deg, var(--saffron), #FF7722)",
              border: "none",
              padding: "8px 18px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 3px 8px rgba(255,120,0,0.2)",
            }}
          >
            Compare Now
          </button>

          <button
            onClick={onClear}
            style={{
              fontFamily: "var(--font-button)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Comparison Details Overlay Modal ──────────────────── */}
      {isOpen && (
        <div
          ref={backdropRef}
          data-lenis-prevent
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(45, 37, 30, 0.4)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "grid",
            placeItems: "center",
            overflowY: "auto",
            zIndex: 99999,
            padding: "40px 16px",
          }}
          onClick={handleClose}
        >
          <div
            ref={modalRef}
            className="glass-card-strong"
            style={{
              width: "100%",
              maxWidth: 960,
              backgroundColor: "#FFFFFF",
              border: "1.5px solid var(--gold-primary)",
              borderRadius: 24,
              position: "relative",
              outline: "none",
              boxShadow: "0 20px 50px rgba(45, 37, 30, 0.15)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Decor */}
            <div
              style={{
                height: 6,
                background: "linear-gradient(90deg, var(--saffron), var(--gold-primary), var(--pistachio))"
              }}
            />

            {/* Modal Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "var(--text-muted)",
                cursor: "pointer",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "background-color 0.2s ease, color 0.2s ease",
                zIndex: 10
              }}
            >
              &times;
            </button>

            {/* Content Wrapper */}
            <div data-lenis-prevent style={{ padding: "40px 32px 32px", maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.2rem",
                    color: "var(--text-ivory)",
                    lineHeight: 1.2
                  }}
                >
                  Sweets Comparison Atelier
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1rem",
                    color: "var(--text-gold)",
                    fontStyle: "italic",
                    marginTop: 4
                  }}
                >
                  Side-by-side analysis of taste, calories, sugar, and fitness metrics
                </p>
              </div>

              {/* Responsive Scroll Wrapper for Comparison Table */}
              <div style={{ overflowX: "auto", width: "100%", paddingBottom: 10 }}>
                <div style={{ minWidth: selectedSweets.length > 1 ? 640 : "auto" }}>
                  {/* Grid columns */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${selectedSweets.length + 1}, 1fr)`,
                      gap: 16,
                      borderBottom: "1px solid rgba(45, 37, 30, 0.08)",
                      paddingBottom: 24,
                      alignItems: "end"
                    }}
                  >
                    {/* Labels column */}
                    <div
                      style={{
                        paddingRight: 10,
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#FFFFFF",
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-button)",
                          fontSize: "0.7rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          marginBottom: 10
                        }}
                      >
                        Compare Grid
                      </div>
                    </div>

                    {/* Sweets items headers */}
                    {selectedSweets.map((s) => (
                      <div key={s.id} style={{ textAlign: "center", position: "relative" }}>
                        <button
                          onClick={() => {
                            onRemove(s.id);
                            if (selectedSweets.length <= 1) {
                              handleClose();
                            }
                          }}
                          style={{
                            position: "absolute",
                            top: -10,
                            right: 10,
                            backgroundColor: "rgba(45, 37, 30, 0.05)",
                            border: "none",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                          }}
                        >
                          &times;
                        </button>

                        <div
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            backgroundColor: "var(--bg-deep)",
                            position: "relative",
                            overflow: "hidden",
                            margin: "0 auto 12px",
                            border: "1.5px solid rgba(212, 168, 67, 0.25)"
                          }}
                        >
                          <Image src={s.image} alt={s.name} fill sizes="90px" style={{ objectFit: "contain" }} unoptimized />
                        </div>

                        <h4
                          style={{
                            fontFamily: "var(--font-dm)",
                            fontSize: "1.1rem",
                            color: "var(--text-ivory)",
                            lineHeight: 1.1,
                            marginBottom: 4
                          }}
                        >
                          {s.name}
                        </h4>
                        <span
                          style={{
                            fontFamily: "var(--font-cormorant)",
                            fontSize: "0.75rem",
                            color: "var(--saffron)",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            fontStyle: "italic"
                          }}
                        >
                          {s.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {[
                    {
                      label: "Price per Kg",
                      renderVal: (s: SweetProduct) => `₹${s.pricePerKg}`,
                    },
                    {
                      label: "Weight",
                      renderVal: (s: SweetProduct) => `${s.weightPerPiece}g`,
                    },
                    {
                      label: "Shelf Life",
                      renderVal: (s: SweetProduct) => `${s.freshness.bestBeforeDays} Days`,
                    },
                    {
                      label: "Calories",
                      renderVal: (s: SweetProduct) => `${s.nutrition.calories} kcal`,
                      barVal: (s: SweetProduct) => s.nutrition.calories,
                      barMax: maxCalories,
                      barColor: "var(--gold-deep)"
                    },
                    {
                      label: "Sugar Content",
                      renderVal: (s: SweetProduct) => `${s.nutrition.sugar}g`,
                      barVal: (s: SweetProduct) => s.nutrition.sugar,
                      barMax: maxSugar,
                      barColor: "var(--saffron)"
                    },
                    {
                      label: "Protein",
                      renderVal: (s: SweetProduct) => `${s.nutrition.protein}g`,
                      barVal: (s: SweetProduct) => s.nutrition.protein,
                      barMax: maxProtein,
                      barColor: "var(--pistachio)"
                    },
                    {
                      label: "Total Fat",
                      renderVal: (s: SweetProduct) => `${s.nutrition.fat}g`,
                      barVal: (s: SweetProduct) => s.nutrition.fat,
                      barMax: maxFat,
                      barColor: "#B57C4A"
                    },
                    {
                      label: "Cholesterol",
                      renderVal: (s: SweetProduct) => `${s.nutrition.cholesterol}mg`,
                      barVal: (s: SweetProduct) => s.nutrition.cholesterol,
                      barMax: maxCholesterol,
                      barColor: "var(--rose-pink)"
                    },
                    {
                      label: "Sweetness Level",
                      renderVal: (s: SweetProduct) => `${s.health.sweetness}/10`,
                      barVal: (s: SweetProduct) => s.health.sweetness,
                      barMax: 10,
                      barColor: "var(--saffron)"
                    },
                    {
                      label: "Richness Level",
                      renderVal: (s: SweetProduct) => `${s.health.richness}/10`,
                      barVal: (s: SweetProduct) => s.health.richness,
                      barMax: 10,
                      barColor: "var(--gold-primary)"
                    },
                    {
                      label: "Fitness Score",
                      renderVal: (s: SweetProduct) => `${s.health.fitnessScore}/10`,
                      barVal: (s: SweetProduct) => s.health.fitnessScore,
                      barMax: 10,
                      barColor: "#00A86B"
                    },
                    {
                      label: "Freshness Score",
                      renderVal: (s: SweetProduct) => `${s.freshness.score}%`,
                      barVal: (s: SweetProduct) => s.freshness.score,
                      barMax: 100,
                      barColor: "var(--pistachio)"
                    }
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${selectedSweets.length + 1}, 1fr)`,
                        gap: 16,
                        padding: "16px 0",
                        borderBottom: "1px solid rgba(45, 37, 30, 0.05)",
                        alignItems: "center"
                      }}
                    >
                      {/* Row Label */}
                      <div
                        style={{
                          fontFamily: "var(--font-button)",
                          fontSize: "0.75rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "var(--text-cream)",
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          backgroundColor: "#FFFFFF",
                          zIndex: 2,
                          paddingRight: 12,
                        }}
                      >
                        {row.label}
                      </div>

                      {/* Sweet Row Values */}
                      {selectedSweets.map((s) => (
                        <div key={s.id}>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "var(--text-ivory)",
                              marginBottom: row.barVal ? 4 : 0
                            }}
                          >
                            {row.renderVal(s)}
                          </div>
                          
                          {row.barVal && (
                            <div
                              style={{
                                height: 4,
                                width: "100%",
                                backgroundColor: "rgba(45, 37, 30, 0.05)",
                                borderRadius: 2,
                                overflow: "hidden"
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${(row.barVal(s) / row.barMax!) * 100}%`,
                                  backgroundColor: row.barColor,
                                  transition: "width 0.5s ease"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${selectedSweets.length + 1}, 1fr)`,
                      gap: 16,
                      paddingTop: 24,
                      textAlign: "center"
                    }}
                  >
                    <div style={{ position: "sticky", left: 0, backgroundColor: "#FFFFFF", zIndex: 2 }} /> {/* Label column placeholder */}
                    {selectedSweets.map((s) => (
                      <div key={s.id}>
                        <button
                          onClick={() => {
                            // Triggers box adding in catalog or scroll to box builder
                            const boxButton = document.getElementById(`add-to-box-${s.id}`);
                            if (boxButton) {
                              boxButton.click();
                              handleClose();
                            } else {
                              document.getElementById("box-builder")?.scrollIntoView({ behavior: "smooth" });
                              handleClose();
                            }
                          }}
                          style={{
                            fontFamily: "var(--font-button)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#FFFFFF",
                            background: "var(--text-cream)",
                            border: "none",
                            padding: "10px 14px",
                            borderRadius: 50,
                            cursor: "pointer",
                            fontWeight: 600,
                            width: "100%",
                          }}
                        >
                          Add to Box
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
