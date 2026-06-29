"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  onReveal?: () => void;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: "saffron" | "pistachio" | "crumb" | "dust";
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  gravity: number;
  isAmbient?: boolean;
  oscillateSpeed?: number;
  oscillateRange?: number;
  phase?: number;
}



export default function UnifiedIntro({ onReveal, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSheetRef = useRef<HTMLDivElement>(null);
  const rightSheetRef = useRef<HTMLDivElement>(null);
  const ladooContainerRef = useRef<HTMLDivElement>(null);
  const ladooWrapperRef = useRef<HTMLDivElement>(null);
  const wholeLadooRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const leftLadooRef = useRef<HTMLDivElement>(null);
  const rightLadooRef = useRef<HTMLDivElement>(null);
  const crackPathRef = useRef<SVGPathElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const spawnAmbientParticles = (canvasWidth: number, canvasHeight: number) => {
    const colors = {
      saffron: ["#FF7700", "#FF9933", "#E06010"],
      pistachio: ["#86A96B", "#6D8F53", "#98BD7C"],
      crumb: ["#E59E30", "#D4A843", "#F0C265"],
      dust: ["#FFD700", "#FFDF77", "#FFEAA0"]
    };

    const arr: Particle[] = [];
    // 35 elegant floating particles
    for (let i = 0; i < 35; i++) {
      const rand = Math.random();
      let type: "saffron" | "pistachio" | "crumb" | "dust" = "dust";
      let color = "";
      let size = 0;

      if (rand < 0.2) {
        type = "saffron";
        color = colors.saffron[Math.floor(Math.random() * colors.saffron.length)];
        size = Math.random() * 1.5 + 0.8;
      } else if (rand < 0.4) {
        type = "pistachio";
        color = colors.pistachio[Math.floor(Math.random() * colors.pistachio.length)];
        size = Math.random() * 2.5 + 1.2;
      } else if (rand < 0.6) {
        type = "crumb";
        color = colors.crumb[Math.floor(Math.random() * colors.crumb.length)];
        size = Math.random() * 3 + 1.2;
      } else {
        type = "dust";
        color = colors.dust[Math.floor(Math.random() * colors.dust.length)];
        size = Math.random() * 2 + 0.5;
      }

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180 + 40;

      arr.push({
        x: canvasWidth / 2 + Math.cos(angle) * radius,
        y: canvasHeight * 0.6 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size,
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        alpha: Math.random() * 0.6 + 0.2,
        gravity: 0,
        isAmbient: true,
        oscillateSpeed: Math.random() * 0.02 + 0.005,
        oscillateRange: Math.random() * 15 + 5,
        phase: Math.random() * Math.PI * 2
      });
    }
    particles.current = arr;
  };

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particles.current.length === 0) {
        spawnAmbientParticles(canvas.width, canvas.height);
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeParticles = particles.current;

      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];

        if (p.isAmbient) {
          // Ambient particles: drift slowly and loop screen bounds
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.phase! += p.oscillateSpeed!;

          // boundary wrap around Ladoo region
          const dx = p.x - canvas.width / 2;
          const dy = p.y - canvas.height * 0.6;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 300) {
            // steer back
            p.vx -= dx * 0.0005;
            p.vy -= dy * 0.0005;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0.1, Math.min(0.8, p.alpha + Math.sin(p.phase!) * 0.15));
          ctx.fillStyle = p.color;
        } else {
          // Burst particles: fly outwards with gravity and fade
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.rotationSpeed;
          p.alpha -= 0.015;

          if (p.alpha <= 0) {
            activeParticles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
        }

        if (p.type === "saffron") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(-6, -1);
          ctx.quadraticCurveTo(0, 3, 6, -1);
          ctx.stroke();
        } else if (p.type === "pistachio") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "dust") {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const explodeParticles = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.6;

    const colors = {
      saffron: ["#FF7700", "#FF9933", "#E06010"],
      pistachio: ["#86A96B", "#6D8F53", "#98BD7C"],
      crumb: ["#E59E30", "#D4A843", "#F0C265"],
      dust: ["#FFD700", "#FFDF77", "#FFEAA0"]
    };

    // Fade out ambient particles so the focus is entirely on the explosion
    particles.current = particles.current.map(p => {
      if (p.isAmbient) {
        return { ...p, isAmbient: false, alpha: 0.5, vx: p.vx * 3, vy: p.vy * 3 - 1, gravity: 0.1 };
      }
      return p;
    });

    // Create 120+ new explosion particles
    for (let i = 0; i < 125; i++) {
      const rand = Math.random();
      let type: "saffron" | "pistachio" | "crumb" | "dust" = "crumb";
      let color = "";
      let size = 0;

      if (rand < 0.2) {
        type = "saffron";
        color = colors.saffron[Math.floor(Math.random() * colors.saffron.length)];
        size = Math.random() * 2 + 1;
      } else if (rand < 0.4) {
        type = "pistachio";
        color = colors.pistachio[Math.floor(Math.random() * colors.pistachio.length)];
        size = Math.random() * 4 + 2;
      } else if (rand < 0.7) {
        type = "crumb";
        color = colors.crumb[Math.floor(Math.random() * colors.crumb.length)];
        size = Math.random() * 5 + 1.5;
      } else {
        type = "dust";
        color = colors.dust[Math.floor(Math.random() * colors.dust.length)];
        size = Math.random() * 3 + 1;
      }

      // Strong left/right outward angles based on the split
      const isLeft = Math.random() < 0.5;
      const angle = isLeft
        ? Math.PI + (Math.random() - 0.5) * 1.0
        : (Math.random() - 0.5) * 1.0;

      const speed = Math.random() * 9 + 4;

      particles.current.push({
        x: centerX + (Math.random() - 0.5) * 10,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed * 1.4,
        vy: Math.sin(angle) * speed - 1.5,
        size,
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1.0,
        gravity: 0.16
      });
    }
  };

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      const crackPath = crackPathRef.current;
      const crackLength = crackPath ? crackPath.getTotalLength() : 300;

      if (crackPath) {
        crackPath.style.strokeDasharray = `${crackLength}`;
        crackPath.style.strokeDashoffset = `${crackLength}`;
      }

      // Set initial styles
      gsap.set(ladooContainerRef.current, { xPercent: -50, yPercent: -50, scale: isMobile ? 0.6 : 0.8, opacity: 0 });
      gsap.set(wholeLadooRef.current, { opacity: 1, display: "block" });
      gsap.set(leftLadooRef.current, { x: 0, y: 0, rotate: 0, filter: "blur(0px)", opacity: 0 });
      gsap.set(rightLadooRef.current, { x: 0, y: 0, rotate: 0, filter: "blur(0px)", opacity: 0 });
      gsap.set(shadowRef.current, { scale: isMobile ? 0.6 : 0.8, opacity: 0 });
      gsap.set(leftSheetRef.current, { x: 0 });
      gsap.set(rightSheetRef.current, { x: 0 });

      const tl = gsap.timeline();

      // 1. Initial fade-in & cinematic zoom (0.0s - 0.7s)
      tl.to(ladooContainerRef.current, {
        opacity: 1,
        scale: isMobile ? 0.75 : 1.0,
        duration: 0.7,
        ease: "power2.out"
      });

      tl.to(shadowRef.current, {
        opacity: 0.8,
        scale: isMobile ? 0.75 : 1.0,
        duration: 0.7,
        ease: "power2.out"
      }, "<");

      const floatTween = gsap.timeline({ repeat: -1, yoyo: true });
      floatTween.to(ladooWrapperRef.current, {
        y: -15,
        duration: 1.4,
        ease: "sine.inOut"
      }, 0);
      floatTween.to(shadowRef.current, {
        scale: isMobile ? 0.65 : 0.85,
        opacity: 0.5,
        duration: 1.4,
        ease: "sine.inOut"
      }, 0);

      // 2. Crack drawing phase (0.7s - 1.2s)
      tl.addLabel("startCrack", "+=0.1");
      tl.to(crackPath, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power1.inOut"
      }, "startCrack");

      // 3. Split Reveal phase (1.2s - 2.2s)
      tl.addLabel("splitLadoo", "startCrack+=0.5");

      tl.add(() => {
        floatTween.kill();
      }, "splitLadoo");

      // SWAP whole Ladoo with halves instantly!
      tl.add(() => {
        if (wholeLadooRef.current) wholeLadooRef.current.style.display = "none";
        if (leftLadooRef.current) leftLadooRef.current.style.opacity = "1";
        if (rightLadooRef.current) rightLadooRef.current.style.opacity = "1";
      }, "splitLadoo");

      tl.to(crackPath, {
        opacity: 0,
        duration: 0.15
      }, "splitLadoo");

      tl.to(leftLadooRef.current, {
        x: "-45vw",
        y: "5vh",
        rotate: -20,
        scale: 0.9,
        filter: "blur(6px)",
        opacity: 0,
        duration: 1.1,
        ease: "power3.inOut"
      }, "splitLadoo");

      tl.to(rightLadooRef.current, {
        x: "45vw",
        y: "5vh",
        rotate: 20,
        scale: 0.9,
        filter: "blur(6px)",
        opacity: 0,
        duration: 1.1,
        ease: "power3.inOut"
      }, "splitLadoo");

      tl.to(leftSheetRef.current, {
        x: "-50vw",
        duration: 1.3,
        ease: "power4.inOut"
      }, "splitLadoo");

      tl.to(rightSheetRef.current, {
        x: "50vw",
        duration: 1.3,
        ease: "power4.inOut"
      }, "splitLadoo");

      tl.to(shadowRef.current, {
        opacity: 0,
        scale: 0.2,
        duration: 0.5,
        ease: "power2.out"
      }, "splitLadoo");

      tl.add(() => {
        if (onReveal) onReveal();
      }, "splitLadoo+=0.15");

      tl.add(() => {
        explodeParticles();
      }, "splitLadoo");

      // 4. Complete overlay transition
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        }
      }, "splitLadoo+=1.0");

    }, containerRef);

    return () => ctx.revert();
  }, [onReveal, onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99000,
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        ref={leftSheetRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50.1vw",
          height: "100vh",
          background: "#F8F4EC",
          zIndex: 5,
          willChange: "transform",
          overflow: "hidden",
        }}
      />

      <div
        ref={rightSheetRef}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50.1vw",
          height: "100vh",
          background: "#F8F4EC",
          zIndex: 5,
          willChange: "transform",
          overflow: "hidden",
        }}
      />

      <canvas
        ref={particleCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <div
        ref={ladooContainerRef}
        id="ladoo-container"
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          zIndex: 15,
          pointerEvents: "none",
        }}
      >
        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            bottom: -30,
            left: "10%",
            width: "80%",
            height: 25,
            background: "radial-gradient(ellipse, rgba(78, 64, 53, 0.15) 0%, rgba(78, 64, 53, 0.03) 50%, transparent 70%)",
            borderRadius: "50%",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        />

        <div
          ref={ladooWrapperRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            willChange: "transform",
          }}
        >
          <div
            ref={wholeLadooRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url('/images/sweets/motichoor_ladoo_transparent.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              willChange: "opacity",
            }}
          />

          <div
            ref={leftLadooRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 160,
              height: 320,
              overflow: "hidden",
              willChange: "transform, opacity, filter",
            }}
          >
            <div
              style={{
                width: 320,
                height: 320,
                backgroundImage: "url('/images/sweets/motichoor_ladoo_transparent.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
              }}
            />
          </div>

          <div
            ref={rightLadooRef}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 160,
              height: 320,
              overflow: "hidden",
              willChange: "transform, opacity, filter",
            }}
          >
            <div
              style={{
                width: 320,
                height: 320,
                position: "absolute",
                left: -160,
                top: 0,
                backgroundImage: "url('/images/sweets/motichoor_ladoo_transparent.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
              }}
            />
          </div>
        </div>

        <svg
          viewBox="0 0 320 320"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 18,
            pointerEvents: "none",
          }}
        >
          <path
            ref={crackPathRef}
            d="M 160,20 L 158,65 L 162,110 L 157,165 L 163,215 L 158,260 L 160,300"
            fill="none"
            stroke="#B88E2F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: 0,
            }}
          />
        </svg>
      </div>
    </div>
  );
}
