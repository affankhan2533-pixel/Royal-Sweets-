"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SWEETS = [
  {
    id: "motichoor-ladoo",
    name: "Motichoor Ladoo",
    tagline: "A Symphony of Saffron",
    desc: "Delicate chickpea flour droplets, fried golden and bound with aromatic sugar syrup, garnished with pistachios and saffron.",
    price: "₹80 / piece",
    image: "/images/sweets/motichoor_ladoo.webp",
    accent: "#FF9933",
  },
  {
    id: "kaju-katli",
    name: "Kaju Katli",
    tagline: "Silver Leaf Elegance",
    desc: "Premium cashews ground to a silky paste, set with cardamom and adorned with pure silver leaf. The crown jewel of Indian sweets.",
    price: "₹120 / piece",
    image: "/images/sweets/kaju_katli.webp",
    accent: "#D4A843",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    tagline: "Dipped in Rose Syrup",
    desc: "Soft khoya dumplings soaked in rose-cardamom sugar syrup, garnished with dried rose petals and saffron strands.",
    price: "₹60 / piece",
    image: "/images/sweets/gulab_jamun.webp",
    accent: "#E8889A",
  },
  {
    id: "rasgulla",
    name: "Rasgulla",
    tagline: "Bengal's White Pearl",
    desc: "Spongy chhena spheres simmered in light sugar syrup. Delicate, airy, and melt-in-mouth perfection since generations.",
    price: "₹50 / piece",
    image: "/images/sweets/rasgulla.webp",
    accent: "#86A96B",
  },
  {
    id: "milk-cake",
    name: "Milk Cake",
    tagline: "Caramelised Heritage",
    desc: "Slow-cooked milk reduced to golden layers of pure flavour. A Mathura classic, made with full-cream farm milk.",
    price: "₹90 / piece",
    image: "/images/sweets/milk_cake.webp",
    accent: "#E6BF65",
  },
  {
    id: "peda",
    name: "Peda",
    tagline: "Mathura's Finest",
    desc: "Classic khoya peda stamped with our royal seal, flavoured with cardamom and saffron. Handcrafted since 1985.",
    price: "₹70 / piece",
    image: "/images/sweets/peda.webp",
    accent: "#FFBB77",
  },
  {
    id: "barfi",
    name: "Almond Barfi",
    tagline: "Rich Almond Fudge",
    desc: "Premium ground almonds and pure condensed milk, garnished with sliced pistachios and delicate light gold leaf.",
    price: "₹95 / piece",
    image: "/images/sweets/barfi.webp",
    accent: "#E8889A",
  },
  {
    id: "jalebi",
    name: "Shahi Jalebi",
    tagline: "Crispy Golden Spirals",
    desc: "Deep-fried fermented batter spirals soaked in saffron-scented sugar syrup. Crisp on the outside and syrupy inside.",
    price: "₹40 / piece",
    image: "/images/sweets/jalebi.webp",
    accent: "#FF9933",
  }
];

import { SweetProduct } from "@/lib/sweetsData";

interface Props {
  products?: SweetProduct[];
}

export default function SweetsCollection({ products }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  const displaySweets = products && products.length > 0 ? products.map(p => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    desc: p.desc,
    price: `₹${p.pricePerKg} / kg`,
    image: p.image,
    accent: p.accent || "#D4A843"
  })) : SWEETS;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      // Desktop Pinning Scroll Animation
      mm.add("(min-width: 1024px)", () => {
        const totalWidth = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalWidth * 1.1}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });
      });

      // Mobile/Tablet natural touch scroll handling
      mm.add("(max-width: 1023px)", () => {
        // Clear GSAP properties from track so CSS snap scrolling works natively
        gsap.set(track, { clearProps: "all" });
      });

      // Panel entrance fade-in animations (no clipPath)
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return;

        gsap.fromTo(
          panel,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-deep)", // warm ivory background
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "clamp(32px, 5vw, 60px) clamp(24px, 6vw, 120px) 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
      >
        <div>
          <div className="section-subtitle" style={{ marginBottom: 8, color: "var(--saffron)" }}>
            Our Collection
          </div>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--text-ivory)" }}>
            Royal Sweets
          </h2>
        </div>
        <div
          style={{
            fontFamily: "var(--font-address)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            textAlign: "right",
            maxWidth: 200,
            paddingTop: 8,
          }}
        >
          Scroll horizontally →
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{
          display: "flex",
          paddingLeft: "clamp(24px, 6vw, 120px)",
          gap: 24,
          alignItems: "center",
          flex: 1,
          willChange: "transform",
        }}
      >
        {displaySweets.map((sweet, i) => (
          <div
            key={sweet.id}
            id={sweet.id}
            ref={(el) => { if (el) panelsRef.current[i] = el; }}
            style={{
              flexShrink: 0,
              width: "min(480px, 80vw)",
              height: "calc(100vh - 180px)",
              maxHeight: 680,
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              background: "#FFFFFF",
              border: "1px solid rgba(134, 169, 107, 0.15)", // soft pistachio border
              display: "flex",
              flexDirection: "column",
            }}
            className="glass-card collection-card-hover"
          >
            <Link href={`/sweet/${sweet.id}`} className="flex flex-col h-full w-full">
              {/* Color accent blur circle */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: sweet.accent,
                opacity: 0.08,
                filter: "blur(50px)",
                pointerEvents: "none",
              }}
            />

            {/* Sweet image wrapper */}
            <div
              className="sweet-img-wrap"
              style={{
                flex: "0 0 42%", // Reduced from 52% to allow more room for text below
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                padding: "16px",
              }}
            >
              {/* Radial glow background */}
              <div
                style={{
                  position: "absolute",
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${sweet.accent}33 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  maxHeight: 180,
                  maxWidth: 180,
                  aspectRatio: "1/1",
                  animation: "floatSlow 8s ease-in-out infinite",
                }}
              >
                <Image
                  src={sweet.image}
                  alt={sweet.name}
                  fill
                  sizes="180px"
                  unoptimized
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 20px rgba(45,37,30,0.12))",
                  }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text details */}
            <div
              className="sweet-details"
              style={{
                padding: "20px 24px 24px", // Reduced padding to fit perfectly on all screens
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "0.8rem",
                    color: "var(--saffron)",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    marginBottom: 6,
                  }}
                >
                  {sweet.tagline}
                </div>
                <h3
                  className="sweet-title"
                  style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", // Optimized from clamp(1.5rem, 3vw, 2rem)
                    color: "var(--text-ivory)",
                    marginBottom: 10,
                    lineHeight: 1.1,
                  }}
                >
                  {sweet.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {sweet.desc}
                </p>
              </div>

              {/* Price and Action */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 20,
                  borderTop: "1px solid rgba(45, 37, 30, 0.08)",
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--saffron)",
                  }}
                >
                  {sweet.price}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-gold)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Order Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
        ))}

        {/* End spacer */}
        <div style={{ flexShrink: 0, width: "clamp(24px, 6vw, 120px)" }} />
      </div>
    </section>
  );
}
