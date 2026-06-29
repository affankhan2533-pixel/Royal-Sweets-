"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/layout/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
  {
    year: "1985",
    title: "A Royal Beginning",
    body: "In the heart of Dharavi, Mumbai, a small kitchen began producing sweets unlike any other. Crafted by hand, guided by generations of tradition, Royal Sweet was born from a dream to share the taste of royal Indian heritage with every family.",
    highlight: "Born from tradition",
  },
  {
    year: "1990s",
    title: "Ancient Recipes",
    body: "Our recipes trace back to the royal kitchens of Mughal India. Passed down through oral tradition and careful memory, each sweet carries centuries of perfected technique — the precise sugar thread, the exact cardamom measure, the freshest milk.",
    highlight: "Royal recipes, unchanged",
  },
  {
    year: "The Process",
    title: "Handcrafted with Love",
    body: "Every sweet at Royal Sweet is made by hand. No machines, no shortcuts. Our artisans wake before dawn to prepare fresh khoya, grind cashews, and stir cauldrons of sugar syrup until they achieve the perfect consistency.",
    highlight: "Every piece, by hand",
  },
  {
    year: "Today",
    title: "A Family Legacy",
    body: "40 years later, the same commitment remains. Three generations of family, the same recipes, the same love. Royal Sweet is not just a shop — it is a living piece of Mumbai's sweet heritage, shared with thousands of families every day.",
    highlight: "40 years of tradition",
  },
];

export default function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chaptersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      chaptersRef.current.forEach((chapter, i) => {
        if (!chapter) return;

        const year = chapter.querySelector(".chapter-year");
        const title = chapter.querySelector(".chapter-title");
        const lines = chapter.querySelectorAll(".chapter-line");
        const highlight = chapter.querySelector(".chapter-highlight");
        const bar = chapter.querySelector(".chapter-bar");
        const imgPanel = chapter.querySelector(".chapter-img");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" });
        tl.fromTo(year, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
        tl.fromTo(
          imgPanel,
          { clipPath: "inset(100% 0 0 0)", y: 30 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.1, ease: "power4.out" },
          "-=0.3"
        );
        tl.fromTo(
          title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        );
        tl.fromTo(
          lines,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" },
          "-=0.5"
        );
        tl.fromTo(
          highlight,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.4)" },
          "-=0.3"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="heritage"
      style={{
        background: "var(--bg-dark)", // Cream white background
        padding: "var(--section-pad) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background jali pattern lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(184,142,47,0.04) 0px, rgba(184,142,47,0.04) 1px, transparent 1px, transparent 80px)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <Container>
        <div className="section-header-center" style={{ marginBottom: "clamp(60px, 8vw, 100px)" }}>
          <div className="section-subtitle" style={{ marginBottom: 16, color: "var(--saffron)" }}>Our Story</div>
          <h2 className="section-title" style={{ color: "var(--text-ivory)" }}>
            Our <span className="gold-gradient-text">Heritage</span>
          </h2>
          <div className="gold-divider" />
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontStyle: "italic",
              color: "var(--text-muted)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            A legacy written in sugar, saffron, and love
          </p>
        </div>

        {/* Chapters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(80px, 12vw, 140px)" }}>
          {CHAPTERS.map((chapter, i) => (
            <div
              key={i}
              ref={(el) => { if (el) chaptersRef.current[i] = el; }}
              className="flex flex-col md:grid md:grid-cols-2"
              style={{
                gap: "clamp(40px, 6vw, 80px)",
                alignItems: "center",
                direction: i % 2 === 0 ? "ltr" : "rtl",
              }}
            >
            {/* Text side */}
            <div className="w-full" style={{ direction: "ltr" }}>
              {/* Gold bar */}
              <div
                className="chapter-bar"
                style={{
                  width: 60,
                  height: 2,
                  background: "linear-gradient(90deg, var(--saffron), var(--gold-primary))",
                  marginBottom: 20,
                  transformOrigin: "left",
                  transform: "scaleX(0)",
                }}
              />

              {/* Year */}
              <div
                className="chapter-year"
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.3em",
                  color: "var(--saffron)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  opacity: 0,
                }}
              >
                {chapter.year}
              </div>

              {/* Title */}
              <h3
                className="chapter-title"
                style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                  color: "var(--text-ivory)",
                  lineHeight: 1.1,
                  marginBottom: 24,
                  opacity: 0,
                }}
              >
                {chapter.title}
              </h3>

              {/* Body text split into lines */}
              {chapter.body.split(". ").filter(Boolean).map((sentence, j) => (
                <p
                  key={j}
                  className="chapter-line"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    marginBottom: 8,
                    opacity: 0,
                  }}
                >
                  {sentence}{j < chapter.body.split(". ").filter(Boolean).length - 1 ? "." : ""}
                </p>
              ))}

              {/* Highlight */}
              <div
                className="chapter-highlight"
                style={{
                  marginTop: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "var(--text-gold)",
                  opacity: 0,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 1,
                    background: "var(--saffron)",
                    display: "inline-block",
                  }}
                />
                {chapter.highlight}
              </div>
            </div>

            {/* Visual side with sweet image */}
            <div
              className="chapter-img w-full"
              style={{
                direction: "ltr",
                height: "clamp(280px, 35vw, 420px)",
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                background: "var(--bg-deep)", // warm ivory
                border: "1px solid rgba(134,169,107,0.15)", // soft pistachio border
              }}
            >
              {/* Radial glow background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, rgba(212,168,67,0.1) 0%, transparent 70%)",
                }}
              />
              
              {/* Sweet Image */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "70%",
                  height: "70%",
                }}
              >
                <Image
                  src={
                    i === 0 ? "/images/sweets/motichoor_ladoo.webp" :
                    i === 1 ? "/images/sweets/kaju_katli.webp" :
                    i === 2 ? "/images/sweets/peda.webp" :
                    "/images/sweets/milk_cake.webp"
                  }
                  alt={chapter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 8px 16px rgba(45,37,30,0.1))",
                  }}
                  loading="lazy"
                />
              </div>

              {/* Decorative SVG ornament */}
              <svg
                viewBox="0 0 400 400"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              >
                <circle cx="200" cy="200" r="160" fill="none" stroke="var(--gold-primary)" strokeWidth="1"/>
                <polygon points="200,60 340,200 200,340 60,200" fill="none" stroke="var(--gold-primary)" strokeWidth="0.5"/>
              </svg>

              {/* Chapter number */}
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "20px",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 6vw, 4.5rem)",
                  fontWeight: 800,
                  color: "rgba(184,142,47,0.08)",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
