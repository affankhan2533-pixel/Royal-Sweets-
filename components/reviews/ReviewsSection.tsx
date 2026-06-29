"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/layout/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Bandra, Mumbai",
    review:
      "The Kaju Katli here is unlike anything I've had before. It melts on the tongue. I ordered 2kg for Diwali and everyone asked where I got it from.",
    rating: 5,
    initial: "P",
    accent: "#D4A843",
  },
  {
    name: "Rajesh Mehta",
    location: "Sion, Mumbai",
    review:
      "Royal Sweet is a hidden gem of Dharavi. The Motichoor Ladoo is made fresh daily. You can taste the tradition in every bite.",
    rating: 5,
    initial: "R",
    accent: "#FF9933",
  },
  {
    name: "Ananya Iyer",
    location: "Dadar, Mumbai",
    review:
      "I grew up eating sweets from here. 20 years later, the taste is exactly the same. That's what makes it truly royal.",
    rating: 5,
    initial: "A",
    accent: "#E8889A",
  },
  {
    name: "Suresh Patel",
    location: "Dharavi, Mumbai",
    review:
      "My whole family gets our festival sweets from Royal Sweet. Their Gulab Jamun is soft as clouds. Never disappointed, ever.",
    rating: 5,
    initial: "S",
    accent: "#86A96B",
  },
  {
    name: "Meera Kapoor",
    location: "Chembur, Mumbai",
    review:
      "Ordered for a wedding. The presentation was beautiful and the sweets disappeared in minutes. Highly recommend the Milk Cake.",
    rating: 5,
    initial: "M",
    accent: "#D4A843",
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--saffron)">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title
      gsap.fromTo(
        ".reviews-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Cards with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.94, rotateZ: (i % 2 === 0 ? -1.5 : 1.5) },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateZ: i % 2 === 0 ? -0.8 : 0.8,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.06,
          }
        );

        // Particle burst on enter
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          onEnter: () => burstParticles(card),
        });
      });

      // Mouse parallax (subtle, only calculated when mouse is inside this section)
      const section = sectionRef.current;
      const onMouseMove = (e: MouseEvent) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const depth = 0.4 + (i % 3) * 0.2;
          gsap.to(card, {
            x: mx * 8 * depth,
            y: my * 5 * depth,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };
      if (section) {
        section.addEventListener("mousemove", onMouseMove);
      }
      return () => {
        if (section) {
          section.removeEventListener("mousemove", onMouseMove);
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const burstParticles = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `
        position: fixed;
        width: ${3 + Math.random() * 3}px;
        height: ${3 + Math.random() * 3}px;
        border-radius: 50%;
        background: var(--saffron);
        pointer-events: none;
        z-index: 9998;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
      `;
      document.body.appendChild(dot);
      gsap.to(dot, {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 60,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="reviews"
      style={{
        padding: "clamp(70px, 9vw, 120px) 0",
        background: "var(--bg-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "40vh",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(212,168,67,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container>
        {/* Header */}
        <div className="reviews-title section-header-center" style={{ opacity: 0 }}>
          <div className="section-subtitle" style={{ marginBottom: 16, color: "var(--saffron)" }}>Testimonials</div>
          <h2 className="section-title" style={{ color: "var(--text-ivory)" }}>
            Royal <span className="gold-gradient-text">Words</span>
          </h2>
          <div className="gold-divider" />
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
              fontStyle: "italic",
              color: "var(--text-muted)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            What our royal customers say
          </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
          gap: "clamp(20px, 3vw, 32px)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {REVIEWS.map((review, i) => (
          <div
            key={i}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className="glass-card"
            style={{
              padding: "clamp(24px, 3vw, 36px)",
              opacity: 0,
              transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
              willChange: "transform",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              cursor: "default",
              background: "#FFFFFF",
              border: "1px solid rgba(134, 169, 107, 0.15)", // soft pistachio border
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { scale: 1.015, rotateZ: 0, duration: 0.3, ease: "power2.out" });
              (e.currentTarget as HTMLElement).style.boxShadow = `0 15px 30px rgba(45,37,30,0.06), 0 0 25px ${review.accent}15`;
              (e.currentTarget as HTMLElement).style.borderColor = `${review.accent}44`;
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                rotateZ: i % 2 === 0 ? -0.8 : 0.8,
                duration: 0.5,
                ease: "elastic.out(1, 0.6)",
              });
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.borderColor = "";
            }}
          >
            {/* Stars */}
            <div style={{ marginBottom: 16 }}>
              <StarRating count={review.rating} />
            </div>

            {/* Quote mark */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                color: review.accent,
                opacity: 0.15,
                lineHeight: 0.8,
                marginBottom: 8,
              }}
            >
              "
            </div>

            {/* Review text */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.85rem, 1.4vw, 0.95rem)",
                color: "var(--text-cream)",
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              {review.review}
            </p>

            {/* Author info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingTop: 20,
                borderTop: "1px solid rgba(45,37,30,0.08)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${review.accent}22, ${review.accent}11)`,
                  border: `1.5px solid ${review.accent}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  color: review.accent,
                  fontWeight: 600,
                }}
              >
                {review.initial}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-ivory)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {review.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-address)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {review.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </Container>
    </section>
  );
}
