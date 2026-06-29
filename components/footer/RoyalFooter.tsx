"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/layout/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RoyalFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const doorsContainerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mandalaRef = useRef<HTMLDivElement>(null);

  // Floating saffron/gold petals canvas system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Petal {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; phase: number;
    }

    const petals: Petal[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.4 + Math.random() * canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.15),
      size: 4 + Math.random() * 6,
      opacity: 0.25 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    let running = false;
    let animFrameId: number;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.015;
        const glow = Math.sin(p.phase) * 0.12;

        if (p.y < -30) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        // Draw soft glowing marigold/saffron particles
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, `rgba(255, 153, 51, ${p.opacity + glow})`);
        grad.addColorStop(0.5, `rgba(212, 168, 67, ${(p.opacity + glow) * 0.3})`);
        grad.addColorStop(1, "rgba(212, 168, 67, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(draw);
    };

    // Only run loop when the footer is in view
    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          if (!running) {
            running = true;
            draw();
          }
        } else {
          running = false;
          cancelAnimationFrame(animFrameId);
        }
      }
    });

    return () => {
      running = false;
      cancelAnimationFrame(animFrameId);
      trigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mandala rises up
      gsap.fromTo(
        mandalaRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
          },
        }
      );

      // Tagline reveal
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 85%",
          },
        }
      );

      // Closing doors — triggered near very bottom of page scroll
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 25%",
        onEnter: () => {
          gsap.to(leftDoorRef.current, {
            rotateY: 0,
            duration: 2.8,
            ease: "power3.inOut",
            delay: 0.2,
          });
          gsap.to(rightDoorRef.current, {
            rotateY: 0,
            duration: 2.8,
            ease: "power3.inOut",
            delay: 0.2,
          });
        },
        onLeaveBack: () => {
          gsap.to(leftDoorRef.current, { rotateY: -130, duration: 1 });
          gsap.to(rightDoorRef.current, { rotateY: 130, duration: 1 });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, var(--bg-dark) 0%, var(--warm-beige) 100%)", // Warm Ivory to Beige
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative Mandala rising (Festive Sun Symbol) */}
      <div
        ref={mandalaRef}
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 90,
          zIndex: 2,
          opacity: 0,
        }}
      >
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 4px 10px rgba(255,153,51,0.12))" }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--saffron)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="var(--gold-primary)" strokeWidth="1" strokeDasharray="4,3" />
          <circle cx="50" cy="50" r="10" fill="var(--saffron)" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="50"
              x2={50 + 28 * Math.cos((deg * Math.PI) / 180)}
              y2={50 + 28 * Math.sin((deg * Math.PI) / 180)}
              stroke="var(--gold-primary)"
              strokeWidth="1.2"
            />
          ))}
        </svg>
      </div>

      {/* Ray of light down */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1.5,
          height: "100%",
          background: "linear-gradient(180deg, rgba(255,153,51,0.18), transparent 60%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Canvas for floating saffron glowing particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Palace closing doors overlay (Mughal Jali panels, bright theme) */}
      <div
        ref={doorsContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          perspective: "1400px",
          zIndex: 5,
          pointerEvents: "none",
          opacity: 0.95,
        }}
      >
        {/* Left door */}
        <div
          ref={leftDoorRef}
          style={{
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, #FFFDF5 0%, #FAF6EE 100%)",
            borderRight: "2.5px solid rgba(212, 168, 67, 0.35)",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            transform: "rotateY(-130deg)",
          }}
        >
          {/* Door pattern */}
          <svg viewBox="0 0 400 900" style={{ width: "100%", height: "100%", opacity: 0.25 }}>
            <defs>
              <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A843" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#FF9933" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <rect width="400" height="900" fill="none"/>
            <rect x="20" y="20" width="360" height="860" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
            <path d="M 40,400 Q 200,80 360,400" fill="none" stroke="url(#dg)" strokeWidth="2.5"/>
            <circle cx="200" cy="520" r="90" fill="none" stroke="url(#dg)" strokeWidth="2"/>
            <circle cx="200" cy="520" r="70" fill="none" stroke="url(#dg)" strokeWidth="1"/>
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={a}
                x1={200 + 50 * Math.cos(a*Math.PI/180)}
                y1={520 + 50 * Math.sin(a*Math.PI/180)}
                x2={200 + 90 * Math.cos(a*Math.PI/180)}
                y2={520 + 90 * Math.sin(a*Math.PI/180)}
                stroke="url(#dg)" strokeWidth="1"/>
            ))}
            <rect x="170" y="790" width="60" height="20" rx="10" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Right door */}
        <div
          ref={rightDoorRef}
          style={{
            width: "50%",
            height: "100%",
            background: "linear-gradient(270deg, #FFFDF5 0%, #FAF6EE 100%)",
            borderLeft: "2.5px solid rgba(212, 168, 67, 0.35)",
            transformOrigin: "right center",
            transformStyle: "preserve-3d",
            transform: "rotateY(130deg)",
          }}
        >
          <svg viewBox="0 0 400 900" style={{ width: "100%", height: "100%", opacity: 0.25, transform: "scaleX(-1)" }}>
            <rect width="400" height="900" fill="none"/>
            <rect x="20" y="20" width="360" height="860" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
            <path d="M 40,400 Q 200,80 360,400" fill="none" stroke="url(#dg)" strokeWidth="2.5"/>
            <circle cx="200" cy="520" r="90" fill="none" stroke="url(#dg)" strokeWidth="2"/>
            <circle cx="200" cy="520" r="70" fill="none" stroke="url(#dg)" strokeWidth="1"/>
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={a}
                x1={200 + 50 * Math.cos(a*Math.PI/180)}
                y1={520 + 50 * Math.sin(a*Math.PI/180)}
                x2={200 + 90 * Math.cos(a*Math.PI/180)}
                y2={520 + 90 * Math.sin(a*Math.PI/180)}
                stroke="url(#dg)" strokeWidth="1"/>
            ))}
            <rect x="170" y="790" width="60" height="20" rx="10" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <Container
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          className="shimmer-text"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            marginBottom: 12,
          }}
        >
          Royal Sweet
        </div>

        <div className="gold-divider" style={{ background: "linear-gradient(90deg, transparent, var(--saffron), transparent)" }} />

        {/* Tagline & Links */}
        <div ref={taglineRef} style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              fontStyle: "italic",
              color: "var(--text-cream)",
              letterSpacing: "0.04em",
              marginBottom: 48,
            }}
          >
            Made With Love, Tradition &amp; Sweetness
          </p>

          {/* Footer Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(24px, 4vw, 48px)",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            {[
              { label: "Collection", id: "collection" },
              { label: "Heritage", id: "heritage" },
              { label: "Contact", id: "location" },
              { label: "Reviews", id: "reviews" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() =>
                  document
                    .getElementById(link.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.3s",
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--saffron)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
                data-cursor-hover
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Contact Details */}
          <p
            style={{
              fontFamily: "var(--font-address)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}
          >
            Rohitdas Chawl, Sion-Bandra Link Road, Near Saheel Restaurant
            <br />
            Dharavi, Mumbai 400017
          </p>

          {/* Copyright Section */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: "1px solid rgba(45,37,30,0.08)",
              fontFamily: "var(--font-address)",
              fontSize: "0.7rem",
              color: "rgba(45,37,30,0.45)",
              letterSpacing: "0.1em",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <div>© {new Date().getFullYear()} Royal Sweet, Mumbai. All rights reserved.</div>
            <div
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Developed by{" "}
              <a
                href="https://affan.nexcoreinstitute.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--saffron)",
                  textDecoration: "underline",
                  fontWeight: 700,
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-deep)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--saffron)")}
              >
                Affan Khan
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
