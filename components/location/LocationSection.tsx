"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/layout/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ADDRESS = {
  name: "Royal Sweet",
  lines: [
    "Rohitdas Chawl,",
    "Sion-Bandra Link Road,",
    "Near Saheel Restaurant,",
    "Dharavi, Mumbai, Maharashtra 400017",
  ],
  hours: "Open daily · 7:00 AM – 10:00 PM",
  phone: "+91 85910 53565",
  // Standard Google Maps directions trigger
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rohitdas+Chawl,+Sion-Bandra+Link+Road,+Near+Saheel+Restaurant,+Dharavi,+Mumbai+400017",
  // Standalone Google Maps search link
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Royal+Sweet+Rohitdas+Chawl+Dharavi+Mumbai+400017",
};

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const addrLinesRef = useRef<HTMLParagraphElement[]>([]);
  const mapBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Map reveals
      tl.fromTo(
        mapBgRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      // Card emerges
      tl.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power4.out",
        },
        "-=0.6"
      );

      // Address lines
      tl.fromTo(
        addrLinesRef.current,
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      style={{
        padding: "clamp(70px, 9vw, 120px) 0",
        background: "var(--bg-deep)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ambient gold aura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(212,168,67,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <Container>
        <div className="section-header-center" style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
          <div className="section-subtitle" style={{ marginBottom: 16, color: "var(--saffron)" }}>Visit Us</div>
          <h2 className="section-title" style={{ color: "var(--text-ivory)" }}>
            Find Royal <span className="gold-gradient-text">Sweet</span>
          </h2>
          <div className="gold-divider" />
        </div>

        <div
          className="flex flex-col md:grid md:grid-cols-2"
          style={{
            gap: "clamp(32px, 5vw, 60px)",
            alignItems: "stretch",
          }}
        >
        {/* Real Google Maps Embed */}
        <div
          ref={mapBgRef}
          style={{
            position: "relative",
            minHeight: 380,
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(134,169,107,0.18)", // soft pistachio border
            boxShadow: "0 10px 30px rgba(45,37,30,0.05)",
            background: "#FFFFFF",
            opacity: 0,
          }}
        >
          <iframe
            src="https://maps.google.com/maps?q=Rohitdas%20Chawl,%20Sion-Bandra%20Link%20Road,%20Near%20Saheel%20Restaurant,%20Dharavi,%20Mumbai%20400017&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, position: "absolute", inset: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Sweet Location Map"
          />
        </div>

        {/* Address card */}
        <div
          ref={cardRef}
          className="glass-card-strong"
          style={{
            padding: "clamp(28px, 4vw, 44px)",
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Store name */}
          <div
            className="shimmer-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {ADDRESS.name}
          </div>

          <div className="gold-divider" style={{ margin: "16px 0", textAlign: "left", width: 60, height: 1, background: "linear-gradient(90deg, var(--saffron), transparent)" }} />

          {/* Address lines */}
          <div style={{ marginBottom: 20 }}>
            {ADDRESS.lines.map((line, i) => (
              <p
                key={i}
                ref={(el) => { if (el) addrLinesRef.current[i] = el; }}
                style={{
                  fontFamily: "var(--font-address)",
                  fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                  color: i < 2 ? "var(--text-cream)" : "var(--text-muted)",
                  lineHeight: 1.6,
                  opacity: 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            style={{
              paddingTop: 20,
              borderTop: "1px solid rgba(45,37,30,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {/* Hours */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ fontFamily: "var(--font-address)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {ADDRESS.hours}
              </span>
            </div>
            {/* Phone */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0H5.18a2 2 0 012 1.72c.13.96.36 1.9.71 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.35a2 2 0 012.11-.45c.91.35 1.85.58 2.81.71A2 2 0 0122 16.92z"/>
              </svg>
              <a
                href={`tel:${ADDRESS.phone}`}
                style={{
                  fontFamily: "var(--font-address)",
                  fontSize: "0.85rem",
                  color: "var(--text-gold)",
                  textDecoration: "none",
                  fontWeight: 500
                }}
              >
                {ADDRESS.phone}
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Directions button */}
            <a
              href={ADDRESS.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                padding: "12px 28px",
                borderRadius: 50,
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(255,120,0,0.18)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              data-cursor-hover
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(255,120,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(255,120,0,0.18)";
              }}
            >
              Get Directions
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            {/* Open Google Maps button */}
            <a
              href={ADDRESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-gold)",
                border: "1px solid rgba(184, 142, 47, 0.4)",
                background: "transparent",
                padding: "12px 28px",
                borderRadius: 50,
                textDecoration: "none",
                fontWeight: 600,
                transition: "transform 0.2s ease, background 0.2s ease, color 0.2s ease",
              }}
              data-cursor-hover
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(184, 142, 47, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Open in Maps
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
