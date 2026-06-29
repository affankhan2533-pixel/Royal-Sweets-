"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.inOut",
            onComplete,
          });
        },
      });

      // Animate logo in
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
      );

      // Animate progress
      let p = { val: 0 };
      tl.to(
        p,
        {
          val: 100,
          duration: 2.0,
          ease: "power1.inOut",
          onUpdate() {
            const v = Math.round(p.val);
            setPercent(v);
            if (progressRef.current)
              progressRef.current.style.width = `${v}%`;
          },
        },
        "-=0.5"
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#F8F4EC",
        zIndex: 100000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
      }}
    >
      {/* Logo */}
      <div ref={logoRef} style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
          className="shimmer-text"
        >
          Royal Sweet
        </div>
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
            fontStyle: "italic",
            color: "var(--text-muted)",
            marginTop: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Tradition Crafted Into Every Bite
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: "min(320px, 70vw)" }}>
        <div
          style={{
            height: 1,
            background: "rgba(255,153,51,0.15)",
            borderRadius: 1,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: "100%",
              width: "0%",
              background:
                "linear-gradient(90deg, var(--saffron), var(--gold-primary), var(--gold-light))",
              borderRadius: 1,
              transition: "none",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-button)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          <span>Loading experience</span>
          <span ref={percentRef}>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
