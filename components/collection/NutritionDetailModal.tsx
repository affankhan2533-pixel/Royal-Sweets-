"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SweetProduct } from "@/lib/sweetsData";

interface Props {
  sweet: SweetProduct | null;
  onClose: () => void;
}

export default function NutritionDetailModal({ sweet, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sweet) {
      // Entrance animation
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [sweet]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in"
    });
  };

  if (!sweet) return null;

  const renderMeter = (label: string, value: number, color: string) => {
    const barsCount = 10;
    const filledCount = Math.round(value);

    return (
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-button)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-cream)",
            marginBottom: 6,
          }}
        >
          <span>{label}</span>
          <span style={{ fontWeight: 600, color }}>{value}/10</span>
        </div>
        {/* Render bar sequence like ████████░░ */}
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center"
          }}
        >
          {Array.from({ length: barsCount }).map((_, i) => {
            const isFilled = i < filledCount;
            return (
              <div
                key={i}
                style={{
                  height: 8,
                  flex: 1,
                  borderRadius: 2,
                  backgroundColor: isFilled ? color : "rgba(45, 37, 30, 0.08)",
                  transition: "background-color 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={backdropRef}
      data-lenis-prevent
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(45, 37, 30, 0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
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
          maxWidth: 620,
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
            top: 14,
            right: 14,
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(45, 37, 30, 0.05)";
            e.currentTarget.style.color = "var(--text-ivory)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          &times;
        </button>

        {/* Content */}
        <div style={{ padding: "clamp(24px, 4vw, 40px) clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)" }}>
          {/* Sweet title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.85rem",
                color: "var(--saffron)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              {sweet.tagline}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                color: "var(--text-ivory)",
                lineHeight: 1.2
              }}
            >
              {sweet.name}
            </h3>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginTop: 4,
                fontFamily: "var(--font-body)"
              }}
            >
              Serving Size: {sweet.nutrition.servingSize}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 32,
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Health Indices Scorecard */}
            <div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--text-ivory)",
                  marginBottom: 20,
                  borderBottom: "1px solid rgba(45, 37, 30, 0.08)",
                  paddingBottom: 8,
                }}
              >
                Health Transparency
              </h4>
              {renderMeter("Sweetness Level", sweet.health.sweetness, "var(--saffron)")}
              {renderMeter("Richness Level", sweet.health.richness, "var(--gold-deep)")}
              {renderMeter("Protein Level", sweet.health.protein, "var(--pistachio)")}
              {renderMeter("Fitness Score", sweet.health.fitnessScore, "#00A86B")}
            </div>

            {/* Nutrition facts label */}
            <div
              style={{
                border: "1.5px solid var(--text-ivory)",
                padding: 16,
                fontFamily: "'Courier New', Courier, monospace",
                color: "var(--text-ivory)",
                backgroundColor: "#FAF9F6"
              }}
            >
              <h4
                style={{
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  borderBottom: "6px solid var(--text-ivory)",
                  paddingBottom: 4,
                  margin: 0,
                  textAlign: "center"
                }}
              >
                Nutrition Facts
              </h4>
              <div
                style={{
                  fontSize: "0.85rem",
                  borderBottom: "1px solid var(--text-ivory)",
                  padding: "4px 0",
                  fontWeight: "bold"
                }}
              >
                Amount Per Serving
              </div>

              <div
                style={{
                  fontSize: "1.1rem",
                  borderBottom: "4px solid var(--text-ivory)",
                  padding: "6px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold"
                }}
              >
                <span>Calories {sweet.nutrition.calories}</span>
                <span>Energy {sweet.nutrition.energy} kJ</span>
              </div>

              {[
                { label: "Total Fat", value: `${sweet.nutrition.fat}g`, percent: `${Math.round(sweet.nutrition.fat * 1.5)}%`, bold: true },
                { label: "Cholesterol", value: `${sweet.nutrition.cholesterol}mg`, percent: `${Math.round(sweet.nutrition.cholesterol * 0.3)}%`, bold: true },
                { label: "Total Carbohydrate", value: `${sweet.nutrition.carbohydrates}g`, percent: `${Math.round(sweet.nutrition.carbohydrates * 0.4)}%`, bold: true },
                { label: "Dietary Fiber", value: `${sweet.nutrition.fiber}g`, percent: `${Math.round(sweet.nutrition.fiber * 4)}%`, indent: true },
                { label: "Sugars", value: `${sweet.nutrition.sugar}g`, indent: true, highlight: sweet.category === "Sugar-Free" },
                { label: "Protein", value: `${sweet.nutrition.protein}g`, percent: `${Math.round(sweet.nutrition.protein * 2)}%`, bold: true }
              ].map((n, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.85rem",
                    borderBottom: "1px solid var(--text-ivory)",
                    padding: "4px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: n.indent ? 12 : 0,
                    fontWeight: n.bold ? "bold" : "normal",
                    backgroundColor: n.highlight ? "rgba(134, 169, 107, 0.15)" : "transparent"
                  }}
                >
                  <span>
                    {n.label} {n.value}
                  </span>
                  {n.percent && <span>{n.percent}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Freshness banner */}
          <div
            style={{
              marginTop: 28,
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(134, 169, 107, 0.08)",
              border: "1px solid rgba(134, 169, 107, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              fontFamily: "var(--font-body)"
            }}
          >
            <div>
              <span style={{ color: "var(--pistachio)", fontWeight: 600 }}>✓ Made Today at {sweet.freshness.madeTime}</span>
              <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>| Best Before {sweet.freshness.bestBeforeDays} days</span>
            </div>
            <div style={{ color: "var(--pistachio)", fontWeight: 600 }}>
              Freshness: {sweet.freshness.score}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
