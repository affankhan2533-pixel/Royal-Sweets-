"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/ui/Preloader";
import HeroSection from "@/components/hero/HeroSection";
import SweetsCollection from "@/components/collection/SweetsCollection";
import HeritageSection from "@/components/heritage/HeritageSection";
import LocationSection from "@/components/location/LocationSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import RoyalFooter from "@/components/footer/RoyalFooter";
import { gsap } from "gsap";
import Container from "@/components/layout/Container";

// Dynamic import for Unified Intro component
const UnifiedIntro = dynamic(() => import("@/components/intro/UnifiedIntro"), { ssr: false });

// New Luxury Upgrade Imports
import { SweetProduct } from "@/lib/sweetsData";
import SweetsCatalog from "@/components/collection/SweetsCatalog";
import RecommendationEngine from "@/components/collection/RecommendationEngine";
import GiftBoxBuilder from "@/components/collection/GiftBoxBuilder";
import AIOccasionAssistant from "@/components/collection/AIOccasionAssistant";
import ComparisonTool from "@/components/collection/ComparisonTool";
import StoreInquiries from "@/components/ui/StoreInquiries";
import NutritionDetailModal from "@/components/collection/NutritionDetailModal";

type IntroPhase = "preloader" | "intro" | "site";

export default function Home() {
  const [phase, setPhase] = useState<IntroPhase>("preloader");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic Products State from CMS
  const [products, setProducts] = useState<SweetProduct[]>([]);

  // Store settings from CMS (WhatsApp, banner text/status, etc.)
  const [settings, setSettings] = useState({
    whatsappNumber: "+91 98765 43210",
    bannerText: "✨ Royal Diwali Special: Order 1kg or more and receive a complimentary 250g assortment tin. Code: DIWALI26 ✨",
    bannerActive: false,
    storeHours: "9:00 AM - 10:00 PM",
    kitchenOpen: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic sweet catalog, fallback to static:", err);
      }
    };

    const loadSettings = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (err) {
        console.warn("Failed to load store settings, fallback to static:", err);
      }
    };

    loadProducts();
    loadSettings();
  }, []);

  // Custom Box Builder States
  const [boxItems, setBoxItems] = useState<{ sweet: SweetProduct; count: number }[]>([]);
  const [boxSize, setBoxSize] = useState<"250g" | "500g" | "1kg">("500g");
  const [packaging, setPackaging] = useState<"Silk Box" | "Golden Tin" | "Eco Carton">("Eco Carton");
  const [premiumWrapping, setPremiumWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  // Compare List State
  const [compareList, setCompareList] = useState<SweetProduct[]>([]);

  // Selected Nutrition Modal
  const [selectedNutritionSweet, setSelectedNutritionSweet] = useState<SweetProduct | null>(null);

  // Skip intro in development with ?skip param
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("skip")) {
      setPhase("site");
    }
  }, []);

  // GSAP animation for mobile navigation drawer
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (mobileMenuOpen) {
      gsap.killTweensOf(menu);
      gsap.killTweensOf(menu.querySelectorAll(".mobile-nav-link"));
      
      gsap.timeline()
        .fromTo(menu,
          { y: "-100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out", display: "flex" }
        )
        .fromTo(menu.querySelectorAll(".mobile-nav-link"),
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power3.out" },
          "-=0.2"
        );
    } else {
      gsap.killTweensOf(menu);
      gsap.to(menu, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        }
      });
    }
  }, [mobileMenuOpen]);

  // Refresh ScrollTrigger when site becomes active to recalculate positions correctly
  useEffect(() => {
    if (phase === "site") {
      const handleLoad = () => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      };
      
      const timer = setTimeout(handleLoad, 1600); // 1.5s transition + 100ms buffer
      
      window.addEventListener("load", handleLoad);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [phase]);

  // Handlers for interactive states
  const handleAddToBox = (sweet: SweetProduct) => {
    const maxPieces = boxSize === "250g" ? 6 : boxSize === "500g" ? 12 : 24;
    const totalCurrent = boxItems.reduce((acc, item) => acc + item.count, 0);
    
    if (totalCurrent >= maxPieces) {
      alert(`Your selected ${boxSize} box is full (${maxPieces}/${maxPieces} pieces). Please increase your box size in the Custom Gift Box Builder section below or remove items.`);
      return;
    }

    setBoxItems((prev) => {
      const existing = prev.find((item) => item.sweet.id === sweet.id);
      if (existing) {
        return prev.map((item) =>
          item.sweet.id === sweet.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { sweet, count: 1 }];
    });
  };

  const handleRemoveFromBox = (sweet: SweetProduct) => {
    setBoxItems((prev) => {
      const existing = prev.find((item) => item.sweet.id === sweet.id);
      if (existing) {
        if (existing.count === 1) {
          return prev.filter((item) => item.sweet.id !== sweet.id);
        }
        return prev.map((item) =>
          item.sweet.id === sweet.id ? { ...item, count: item.count - 1 } : item
        );
      }
      return prev;
    });
  };

  const handleAddToCompare = (sweet: SweetProduct) => {
    setCompareList((prev) => {
      if (prev.some((item) => item.id === sweet.id)) {
        return prev.filter((item) => item.id !== sweet.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 sweets side-by-side.");
        return prev;
      }
      return [...prev, sweet];
    });
  };

  const handleAutofillBox = (sweets: { sweet: SweetProduct; count: number }[], size: "250g" | "500g" | "1kg") => {
    setBoxSize(size);
    setBoxItems(sweets);
  };

  return (
    <main>
      {/* ── Phase 1: Preloader ─────────────────────────── */}
      {phase === "preloader" && (
        <Preloader onComplete={() => setPhase("intro")} />
      )}

      {/* ── Phase 2: Palace Gate & Ladoo (Unified) ─────── */}
      {phase === "intro" && (
        <UnifiedIntro
          onReveal={() => {
            const wrapper = document.getElementById("main-site-wrapper");
            if (wrapper) {
              wrapper.style.opacity = "1";
              wrapper.style.transform = "none";
            }
          }}
          onComplete={() => {
            setPhase("site");
            const wrapper = document.getElementById("main-site-wrapper");
            if (wrapper) {
              wrapper.style.transform = "none";
              wrapper.style.willChange = "auto";
            }
          }}
        />
      )}

      {/* ── Fixed Overlays (Navbar, Banner, Drawer) outside main-site-wrapper to prevent layout transform bugs ── */}
      {(phase === "site" || phase === "intro") && (
        <>
          {/* Announcement Banner */}
          {settings.bannerActive && (
            <>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                  0% { transform: translate3d(0, 0, 0); }
                  100% { transform: translate3d(-33.33%, 0, 0); }
                }
              `}} />
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 40,
                  background: "linear-gradient(135deg, var(--gold-deep), var(--gold-primary))",
                  color: "#FFFDF7",
                  zIndex: 1200,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "opacity 0.5s ease",
                  opacity: phase === "site" ? 1 : 0,
                  pointerEvents: phase === "site" ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    animation: "marquee 30s linear infinite",
                    paddingLeft: "10px",
                  }}
                >
                  <span>{settings.bannerText}</span>
                  <span style={{ margin: "0 40px" }}>•</span>
                  <span>{settings.bannerText}</span>
                  <span style={{ margin: "0 40px" }}>•</span>
                  <span>{settings.bannerText}</span>
                  <span style={{ margin: "0 40px" }}>•</span>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <nav
            id="nav"
            style={{
              position: "fixed",
              top: settings.bannerActive ? 40 : 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              background: "rgba(255, 253, 247, 0.97)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(212, 168, 67, 0.12)",
              boxShadow: "0 2px 20px rgba(45, 37, 30, 0.06)",
              height: "var(--nav-h)",
              transition: "top 0.3s ease, opacity 0.5s ease",
              opacity: phase === "site" ? 1 : 0,
              pointerEvents: phase === "site" ? "auto" : "none",
            }}
          >
            <Container
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              {/* Logo */}
              <div
                className="shimmer-text"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: "default",
                }}
              >
                Royal Sweet
              </div>

              {/* Nav links (desktop) */}
              <div
                className="hidden md:flex"
                style={{
                  gap: "clamp(20px, 3vw, 40px)",
                  alignItems: "center",
                }}
              >
                {[
                  { label: "Collection", id: "collection" },
                  { label: "Boutique", id: "boutique-catalog" },
                  { label: "Custom Box", id: "box-builder" },
                  { label: "Heritage", id: "heritage" },
                  { label: "Contact", id: "location" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    style={{
                      fontFamily: "var(--font-button)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--text-cream)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease",
                      padding: "4px 0",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--saffron)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-cream)";
                    }}
                    data-cursor-hover
                  >
                    {item.label}
                  </button>
                ))}

                {/* CTA */}
                <button
                  onClick={() =>
                    document
                      .getElementById("location")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    fontFamily: "var(--font-button)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    background:
                      "linear-gradient(135deg, var(--saffron), #FF7722)",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 50,
                    cursor: "pointer",
                    fontWeight: 600,
                    boxShadow: "0 4px 10px rgba(255,120,0,0.2)",
                  }}
                  data-cursor-hover
                >
                  Visit Store
                </button>
              </div>

              {/* Hamburger button (mobile) */}
              <button
                className="flex md:hidden flex-col justify-center items-center z-[1100] w-10 h-10 bg-transparent border-none cursor-pointer relative"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between relative">
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: 2,
                      backgroundColor: "var(--text-cream)",
                      transition: "transform 0.3s ease",
                      transform: mobileMenuOpen ? "rotate(45deg) translateY(6px) translateX(6px)" : "none",
                      transformOrigin: "left top",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: 2,
                      backgroundColor: "var(--text-cream)",
                      transition: "opacity 0.3s ease",
                      opacity: mobileMenuOpen ? 0 : 1,
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: 2,
                      backgroundColor: "var(--text-cream)",
                      transition: "transform 0.3s ease",
                      transform: mobileMenuOpen ? "rotate(-45deg) translateY(-6px) translateX(6px)" : "none",
                      transformOrigin: "left bottom",
                    }}
                  />
                </div>
              </button>
            </Container>
          </nav>

          {/* Mobile Full-Screen Navigation Overlay Drawer */}
          <div
            ref={mobileMenuRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: "100vh",
              width: "100vw",
              backgroundColor: "rgba(255, 253, 247, 0.98)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 1050,
              display: "none",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "60px 24px 24px",
            }}
          >
            {[
              { label: "Collection", id: "collection" },
              { label: "Boutique", id: "boutique-catalog" },
              { label: "Custom Box", id: "box-builder" },
              { label: "Heritage", id: "heritage" },
              { label: "Contact", id: "location" },
            ].map((item) => (
              <button
                key={item.id}
                className="mobile-nav-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-cream)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  padding: "8px 0",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--saffron)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-cream)")}
              >
                {item.label}
              </button>
            ))}

            <button
              className="mobile-nav-link"
              onClick={() => {
                setMobileMenuOpen(false);
                document
                  .getElementById("location")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                border: "none",
                padding: "12px 32px",
                borderRadius: 50,
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(255,120,0,0.25)",
                marginTop: 12,
              }}
            >
              Visit Store
            </button>
          </div>
        </>
      )}

      {/* ── Phase 3: Main Website Content Wrapper ── */}
      {(phase === "site" || phase === "intro") && (
        <div
          id="main-site-wrapper"
          style={{
            opacity: phase === "site" ? 1 : 0,
            transform: phase === "site" ? "none" : "scale(0.95) translateY(20px)",
            transition: "opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)",
            transformOrigin: "center top",
            willChange: phase === "site" ? "auto" : "transform, opacity",
            paddingTop: settings.bannerActive ? "40px" : "0px",
            overflowX: "hidden",
          }}
        >

          {/* Curated Showcase Sections */}
          <HeroSection />
          <SweetsCollection products={products} />

          {/* ── Luxury Mithai Atelier & Custom Shop ─────────── */}
          <div id="boutique-catalog">
            <SweetsCatalog
              products={products}
              onAddToBox={handleAddToBox}
              onAddToCompare={handleAddToCompare}
              onOpenDetails={setSelectedNutritionSweet}
              compareList={compareList}
            />
          </div>

          <RecommendationEngine
            products={products}
            onAddToBox={handleAddToBox}
            onOpenDetails={setSelectedNutritionSweet}
          />

          <GiftBoxBuilder
            products={products}
            boxItems={boxItems}
            boxSize={boxSize}
            packaging={packaging}
            premiumWrapping={premiumWrapping}
            giftMessage={giftMessage}
            onSetBoxSize={setBoxSize}
            onSetPackaging={setPackaging}
            onSetPremiumWrapping={setPremiumWrapping}
            onSetGiftMessage={setGiftMessage}
            onAddOne={handleAddToBox}
            onRemoveOne={handleRemoveFromBox}
            onClearBox={() => setBoxItems([])}
            whatsappNumber={settings.whatsappNumber}
          />

          <AIOccasionAssistant
            products={products}
            onAutofillBox={handleAutofillBox}
          />

          <StoreInquiries />

          {/* Standard Page Content */}
          <HeritageSection />
          <LocationSection />
          <ReviewsSection />
          <RoyalFooter />

          {/* Side-by-Side Comparison Overlay Drawer */}
          <ComparisonTool
            selectedSweets={compareList}
            onRemove={(id) => setCompareList((prev) => prev.filter((s) => s.id !== id))}
            onClear={() => setCompareList([])}
          />

          {/* Nutritional Fact & Health Transparency Details Modal */}
          <NutritionDetailModal
            sweet={selectedNutritionSweet}
            onClose={() => setSelectedNutritionSweet(null)}
          />
        </div>
      )}
    </main>
  );
}

