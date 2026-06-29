"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";

export default function StoreInquiries() {
  const [productionCount, setProductionCount] = useState(1248);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Corporate Gifting",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Daily fresh production counter increment effect
  useEffect(() => {
    const timer = setInterval(() => {
      setProductionCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in your Name and Contact Number.");
      return;
    }
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBaseUrl}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Inquiry submission failed");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", type: "Corporate Gifting", message: "" });
      }, 4000);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to record inquiry. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-dark)",
        borderTop: "1px solid rgba(212, 168, 67, 0.12)",
        padding: "clamp(70px, 9vw, 120px) 0",
      }}
    >
      <Container>
      <div
        className="flex flex-col lg:flex-row gap-10 items-stretch"
      >
        {/* Left Side: Dynamic Counter & Trust Badges */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 28
          }}
        >
          <div>
            <span className="section-subtitle">Live Kitchen Status</span>
            <h2
              style={{
                fontFamily: "var(--font-dm)",
                fontSize: "2.4rem",
                color: "var(--text-ivory)",
                lineHeight: 1.2,
                marginBottom: 16
              }}
            >
              Fresh Production Counter
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: 28,
                maxWidth: 480
              }}
            >
              Our karigars start handcrafting sweets fresh at 4:30 AM every morning. Watch our live counter roll out fresh pieces prepared in our ISO 22000 certified kitchen.
            </p>

            {/* Live rolling counter */}
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                background: "var(--bg-deep)",
                border: "1.5px solid var(--gold-primary)",
                borderRadius: 20,
                padding: "24px 40px",
                boxShadow: "0 8px 30px rgba(45,37,30,0.06)",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  fontFamily: "'Courier New', Courier, monospace",
                  color: "var(--saffron)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.1
                }}
              >
                {productionCount.toLocaleString()}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-cream)",
                  fontWeight: 600,
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#00A86B",
                    display: "inline-block",
                    animation: "twinkle 1.5s infinite"
                  }}
                />
                Pieces Crafted Today
              </div>
            </div>
          </div>

          {/* Trust Certificates and Ratings */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{
              gap: 20,
              borderTop: "1px solid rgba(45, 37, 30, 0.08)",
              paddingTop: 28
            }}
          >
            <div>
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>🛡️</div>
              <h4 style={{ fontFamily: "var(--font-button)", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-ivory)", marginBottom: 4, fontWeight: "bold" }}>ISO 22000 Hygiene</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                100% strict hygiene audit compliance, stainless steel preparation units, and daily sanitized packaging.
              </p>
            </div>

            <div>
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>⭐</div>
              <h4 style={{ fontFamily: "var(--font-button)", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-ivory)", marginBottom: 4, fontWeight: "bold" }}>Store Rating: 4.8</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                Acknowledged as one of Mumbai&apos;s leading sweet artisans with 1,200+ five-star Google reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div
          style={{
            flex: "1.1",
            width: "100%",
            background: "var(--bg-deep)",
            border: "1px solid rgba(134, 169, 107, 0.15)",
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 6px 20px rgba(45, 37, 30, 0.02)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                color: "var(--text-ivory)",
                marginBottom: 6
              }}
            >
              Artisanal Atelier Inquiries
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginBottom: 20
              }}
            >
              Plan your corporate bulk boxes, wedding distributions, or bespoke catering events with our executive concierge.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "var(--pistachio)",
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.3rem",
                  fontStyle: "italic"
                }}
              >
                Thank you! Your royal inquiry has been recorded. Our concierge team will reach out to you on WhatsApp / Phone within 2 hours.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(45, 37, 30, 0.12)",
                      outline: "none",
                      color: "var(--text-ivory)",
                      backgroundColor: "#FFFFFF"
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="Contact Number *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(45, 37, 30, 0.12)",
                      outline: "none",
                      color: "var(--text-ivory)",
                      backgroundColor: "#FFFFFF"
                    }}
                  />
                </div>

                {/* Select Inquiry Type */}
                <div>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(45, 37, 30, 0.12)",
                      outline: "none",
                      color: "var(--text-cream)",
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Corporate Gifting">Corporate Bulk Gifting</option>
                    <option value="Wedding Catering">Wedding Festivities Catering</option>
                    <option value="Family Celebrations">Auspicious Family Celebrations</option>
                    <option value="Custom Box Order">Special Custom Box Order</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    rows={3}
                    placeholder="Describe your guests count, packaging requirements, budget or sweet choices..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(45, 37, 30, 0.12)",
                      outline: "none",
                      color: "var(--text-ivory)",
                      backgroundColor: "#FFFFFF",
                      resize: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    background: "var(--text-cream)",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 50,
                    cursor: "pointer",
                    fontWeight: 600,
                    boxShadow: "0 3px 8px rgba(45,37,30,0.15)",
                    transition: "all 0.2s ease"
                  }}
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Secure Payment seals */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(45, 37, 30, 0.06)",
              paddingTop: 16,
              marginTop: 16,
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            <span>💳 Safe & Secure UPI Checkout</span>
            <span>🚀 Fast Doorstep Hand-Delivery</span>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}
