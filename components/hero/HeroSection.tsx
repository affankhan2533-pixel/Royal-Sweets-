"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import Container from "@/components/layout/Container";

const CAROUSEL_ITEMS = [
  {
    id: "motichoor-ladoo",
    name: "Motichoor Ladoo",
    description: "A Symphony of Saffron & Pistachio",
    image: "/images/sweets/motichoor_ladoo.webp",
    bgColor: "rgba(255, 153, 51, 0.08)",
    accentColor: "#FF9933"
  },
  {
    id: "kaju-katli",
    name: "Kaju Katli",
    description: "Diamond Cut Silver Leaf Cashew Fudge",
    image: "/images/sweets/kaju_katli.webp",
    bgColor: "rgba(212, 168, 67, 0.08)",
    accentColor: "#D4A843"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Soft Milk Dumplings Soaked in Rose Syrup",
    image: "/images/sweets/gulab_jamun.webp",
    bgColor: "rgba(232, 136, 154, 0.08)",
    accentColor: "#E8889A"
  },
  {
    id: "rasgulla",
    name: "Rasgulla",
    description: "Spongy Bengali Chhena Spheres in Sweet Syrup",
    image: "/images/sweets/rasgulla.webp",
    bgColor: "rgba(134, 169, 107, 0.08)",
    accentColor: "#86A96B"
  },
  {
    id: "aflatoon",
    name: "Aflatoon",
    description: "The Royal Mumbai Mawa Classic",
    image: "/images/sweets/aflatoon.png",
    bgColor: "rgba(139, 69, 19, 0.08)",
    accentColor: "#8B4513"
  }
];

// Inline SVGs for floating ingredients (low weight, high performance)
const PistachioSvg = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" style={{ filter: "drop-shadow(0 2px 4px rgba(45,37,30,0.06))" }}>
    <ellipse cx="11" cy="7" rx="11" ry="7" fill="#86A96B" />
    <ellipse cx="11" cy="7" rx="8" ry="4" fill="#6D8F53" />
    <ellipse cx="11" cy="7" rx="4" ry="2" fill="#98BD7C" opacity="0.6" />
  </svg>
);

const AlmondSvg = () => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill="none" style={{ filter: "drop-shadow(0 2px 4px rgba(45,37,30,0.06))" }}>
    <ellipse cx="13" cy="9" rx="13" ry="9" fill="#E8D2B4" />
    <ellipse cx="13" cy="9" rx="10" ry="6" fill="#C4A883" />
  </svg>
);

const SaffronSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3,21 Q9,11 13,13 T21,3" stroke="#FF7700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const RosePetalSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 4px rgba(232,136,154,0.15))" }}>
    <path d="M12,2 Q20,4 20,12 T12,22 Q4,20 4,12 T12,2" fill="#E8889A" opacity="0.95" />
    <path d="M12,4 Q18,6 18,12" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" fill="none" />
  </svg>
);

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Ref elements for GSAP transition
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Entrance animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(tagsRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      tl.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
        "-=0.5"
      );

      tl.fromTo(textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      tl.fromTo(btnsRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.5"
      );

      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 0.8, rotate: -15 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );

      tl.fromTo(indicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Slide transition animation
  const handleSlideChange = (newIndex: number) => {
    if (newIndex === activeIndex) return;

    const direction = newIndex > activeIndex ? 1 : -1;

    // Animate image out and in
    gsap.timeline()
      .to(imageRef.current, {
        opacity: 0,
        scale: 0.85,
        rotate: 15 * direction,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(newIndex);
          gsap.fromTo(imageRef.current,
            { opacity: 0, scale: 0.85, rotate: -15 * direction },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "power3.out" }
          );
        }
      });

    // Animate glow changes
    gsap.fromTo(glowRef.current,
      { scale: 0.9, opacity: 0.2 },
      { scale: 1.1, opacity: 0.6, duration: 0.8, ease: "power2.out" }
    );
  };

  useEffect(() => {
    // Auto-play carousel every 5.5s
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % CAROUSEL_ITEMS.length;
      handleSlideChange(nextIndex);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeItem = CAROUSEL_ITEMS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        background: "radial-gradient(circle at 75% 50%, #FAF6EE 0%, #FFFDF7 70%)",
      }}
      className="relative flex flex-col justify-start md:justify-center items-center overflow-hidden w-full h-auto min-h-screen px-0 pt-[75px] pb-10 md:py-0 md:h-screen md:min-h-[700px]"
    >
      {/* Absolute floating ingredients wrapper */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        {/* Ingredient 1 (Pistachio) */}
        <div className="float-anim floating-ingredient" style={{ position: "absolute", top: "15%", left: "55%", animationDelay: "0s" }}>
          <PistachioSvg />
        </div>
        {/* Ingredient 2 (Almond) */}
        <div className="float-slow floating-ingredient" style={{ position: "absolute", top: "72%", left: "50%", animationDelay: "1s" }}>
          <AlmondSvg />
        </div>
        {/* Ingredient 3 (Saffron) */}
        <div className="float-anim floating-ingredient" style={{ position: "absolute", top: "25%", left: "90%", transform: "rotate(25deg)", animationDelay: "0.5s" }}>
          <SaffronSvg />
        </div>
        {/* Ingredient 4 (Rose Petal) */}
        <div className="float-slow floating-ingredient" style={{ position: "absolute", top: "78%", left: "85%", transform: "rotate(-10deg)", animationDelay: "2.2s" }}>
          <RosePetalSvg />
        </div>
        {/* Ingredient 5 (Pistachio) */}
        <div className="float-slow floating-ingredient" style={{ position: "absolute", top: "82%", left: "9%", transform: "rotate(45deg)", animationDelay: "1.5s" }}>
          <PistachioSvg />
        </div>
        {/* Ingredient 6 (Saffron) */}
        <div className="float-anim floating-ingredient" style={{ position: "absolute", top: "20%", left: "20%", transform: "rotate(-35deg)", animationDelay: "3s" }}>
          <SaffronSvg />
        </div>
      </div>

      {/* Grid Layout inside Standard Page Container */}
      <Container size="default" className="z-10 w-full flex justify-center items-center">
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          className="hero-mobile-card flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10"
        >
          {/* LEFT COLUMN: BRAND CONTENT */}
          <div className="w-full md:w-1/2 md:max-w-[640px] text-center md:text-left flex flex-col items-center md:items-start flex-none md:flex-1">
            {/* Tag */}
            <div
              ref={tagsRef}
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--saffron)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
              className="mb-4 md:mb-5"
            >
              <span style={{ width: 30, height: 1.5, background: "var(--saffron)", display: "inline-block" }} />
              Since 1985 · Mumbai
              <span style={{ width: 30, height: 1.5, background: "var(--saffron)", display: "inline-block" }} />
            </div>

            {/* Heading */}
            <h1
              ref={titleRef}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 1.05,
                color: "var(--text-ivory)",
              }}
              className="hero-heading mb-2.5 md:mb-4"
            >
              Royal Sweet
            </h1>

            {/* Subheading text */}
            <p
              ref={textRef}
              style={{
                fontFamily: "var(--font-dm)",
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                color: "var(--text-cream)",
                lineHeight: 1.5,
              }}
              className="mb-5 md:mb-11"
            >
              {activeItem.description}
            </p>

          </div>

          {/* RIGHT COLUMN: PREMIUM CAROUSEL */}
          <div
            className="w-full md:w-1/2 flex flex-col items-center justify-center relative mt-10 md:mt-0 flex-none md:flex-1"
          >
            {/* Glowing colorful aura matching active sweet */}
            <div
              ref={glowRef}
              style={{
                position: "absolute",
                width: "clamp(220px, 30vw, 320px)",
                height: "clamp(220px, 30vw, 320px)",
                borderRadius: "50%",
                backgroundColor: activeItem.accentColor,
                opacity: 0.16,
                filter: "blur(70px)",
                zIndex: 1,
                transition: "background-color 0.8s ease",
              }}
            />

            {/* Jali pattern background circle */}
            <div
              style={{
                position: "absolute",
                width: "clamp(220px, 32vw, 420px)",
                height: "clamp(220px, 32vw, 420px)",
                borderRadius: "50%",
                border: "1px dashed rgba(212, 168, 67, 0.4)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* Active Sweet Image Container */}
            <div
              ref={imageRef}
              style={{
                position: "relative",
                width: "clamp(180px, 28vw, 360px)",
                height: "clamp(180px, 28vw, 360px)",
                zIndex: 3,
              }}
            >
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                fill
                sizes="(max-width: 768px) 180px, 360px"
                priority
                unoptimized
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 15px 30px rgba(45,37,30,0.18))",
                }}
              />
            </div>

            {/* Sweet title overlay on carousel */}
            <div
              style={{
                textAlign: "center",
                zIndex: 5,
              }}
              className="mt-5 md:mt-7"
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
                  fontWeight: 600,
                  color: "var(--text-gold)",
                  fontStyle: "italic",
                }}
              >
                {activeItem.name}
              </div>
            </div>

            {/* Carousel Dots Navigation */}
            <div
              style={{
                display: "flex",
                gap: 12,
                zIndex: 10,
              }}
              className="mt-4 md:mt-5"
            >
              {CAROUSEL_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSlideChange(index)}
                  style={{
                    width: activeIndex === index ? 32 : 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: activeIndex === index ? "var(--saffron)" : "rgba(184, 142, 47, 0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  data-cursor-hover
                />
              ))}
            </div>

            {/* Buttons */}
            <div
              ref={btnsRef}
              className="mt-8 md:mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-[320px] sm:max-w-none mx-auto"
            >
              <MagneticButton
                variant="primary"
                onClick={scrollToCollection}
                id="hero-explore-btn"
                className="w-full sm:w-auto justify-center"
              >
                <span>Explore Collection</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </MagneticButton>

              <MagneticButton
                variant="outline"
                onClick={() => document.getElementById("location")?.scrollIntoView({ behavior: "smooth" })}
                id="hero-store-btn"
                className="w-full sm:w-auto justify-center"
              >
                Visit Store
              </MagneticButton>
            </div>
          </div>
        </div>
      </Container>

      {/* Down Scroll indicator */}
      <div
        ref={indicatorRef}
        style={{
          position: "absolute",
          bottom: 35,
          left: "50%",
          transform: "translateX(-50%)",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          zIndex: 5,
        }}
        className="hidden md:flex"
      >
        <div
          style={{
            fontFamily: "var(--font-button)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </div>
        <div
          style={{
            width: 1.5,
            height: 40,
            background: "linear-gradient(180deg, var(--saffron), transparent)",
            animation: "float 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
