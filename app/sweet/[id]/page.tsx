"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SweetProduct, SWEETS_DATA } from "@/lib/data/sweetsData";
import Container from "@/components/layout/Container";

// Default WhatsApp Number
const WHATSAPP_NUMBER = "918591053565";

export default function SweetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [products, setProducts] = useState<SweetProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for WhatsApp order details
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [quantityKg, setQuantityKg] = useState(1);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Fetch products to support dynamically added items
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic product in details page, using fallback:", err);
      }
      setProducts(SWEETS_DATA);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Find the specific product
  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [products, id]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return quantityKg * product.pricePerKg;
  }, [product, quantityKg]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold-primary)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-dark)] px-4">
        <h2 className="text-2xl font-serif text-[var(--text-ivory)] mb-4">Sweet Not Found</h2>
        <p className="text-[var(--text-muted)] mb-6 text-center">The product you are looking for does not exist in our royal collection.</p>
        <Link href="/" className="px-6 py-2.5 bg-[var(--gold-primary)] text-white rounded-full font-medium shadow-md hover:bg-[var(--gold-deep)] transition">
          Return to Palace
        </Link>
      </div>
    );
  }

  // Handle WhatsApp buy flow
  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !clientAddress) {
      alert("Please fill in your Name, Contact Number, and Delivery Address to order.");
      return;
    }

    setOrderSubmitting(true);

    const orderPayload = {
      clientName,
      clientEmail,
      clientPhone,
      deliveryAddress: clientAddress,
      items: [
        {
          sweetId: product.id,
          name: product.name,
          count: quantityKg, // Quantity in KG represents order units
          weight: quantityKg * 1000, // Total weight in grams
          pricePerKg: product.pricePerKg,
          totalCost: totalPrice,
        },
      ],
      totalWeight: quantityKg * 1000,
      totalPrice: totalPrice,
      type: "Single Sweet",
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // Log order to database first
      await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.warn("Failed to log order into database, moving forward directly to WhatsApp:", err);
    }

    // Format WhatsApp message text
    const message = `Namaste Royal Sweet! %0AI would like to place an order:%0A%0A` +
      `*Product:* ${product.name}%0A` +
      `*Quantity:* ${quantityKg} kg%0A` +
      `*Price per kg:* ₹${product.pricePerKg}%0A%0A` +
      `*Customer Name:* ${clientName}%0A` +
      `*WhatsApp Phone:* ${clientPhone}%0A` +
      `*Email:* ${clientEmail || "Not provided"}%0A` +
      `*Delivery Address:* ${clientAddress}%0A%0A` +
      `*Total Cost:* ₹${totalPrice}%0A%0A` +
      `Please confirm my fresh order. Dhanyavad!`;

    const cleanedNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    setOrderSubmitting(false);

    // Redirect to WhatsApp
    window.open(`https://wa.me/${cleanedNumber}?text=${message}`, "_blank");
  };

  const renderMeter = (label: string, value: number, color: string) => {
    const barsCount = 10;
    const filledCount = Math.round(value);

    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-cream)", marginBottom: 8 }}>
          <span>{label}</span>
          <span style={{ fontWeight: 600, color }}>{value}/10</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: barsCount }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 10,
                flex: 1,
                borderRadius: 2,
                backgroundColor: i < filledCount ? color : "rgba(45, 37, 30, 0.08)",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] py-12 md:py-20 flex flex-col items-center" data-lenis-prevent>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[rgba(212,168,67,0.15)] pb-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--text-gold)] font-medium hover:text-[var(--gold-deep)] transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Palace
          </Link>
        </div>

        {/* Hero Section: Two Columns (Gallery vs Order Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-28">
          
          {/* Column 1: Image Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full relative aspect-square max-w-[500px] rounded-3xl bg-white border border-[rgba(134,169,107,0.15)] shadow-md flex items-center justify-center p-8 overflow-hidden">
              {/* Blur accent */}
              <div
                style={{
                  position: "absolute",
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${product.accent}25 0%, transparent 70%)`,
                }}
              />
              <div className="relative w-full h-full max-h-[380px] max-w-[380px] float-slow">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(45,37,30,0.12))" }}
                  unoptimized
                  priority
                />
              </div>
            </div>
            
            {/* Shelf life information card */}
            <div className="w-full max-w-[500px] mt-8 p-6 rounded-2xl bg-[rgba(134,169,107,0.08)] border border-[rgba(134,169,107,0.18)] flex items-center justify-between text-sm text-[var(--text-cream)] font-semibold">
              <span>Freshness: <span className="text-[var(--pistachio)] font-bold">{product.freshness.score}%</span></span>
              <span>Shelf Life: <span className="text-[var(--text-muted)]">{product.freshness.bestBeforeDays} Days</span></span>
            </div>
          </div>

          {/* Column 2: Checkout Form & Product Summary */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-sm tracking-[0.2em] uppercase font-bold text-[var(--gold-deep)] block mb-2">
                {product.tagline}
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-ivory)] leading-tight mb-2">
                {product.name}
              </h1>

              {/* Prominent Price Block */}
              <div className="flex items-baseline gap-2.5 my-4">
                <span className="text-3xl font-extrabold text-[var(--saffron)] font-serif">
                  ₹{product.pricePerKg}
                </span>
                <span className="text-sm font-semibold text-[var(--text-muted)] tracking-wider uppercase">
                  per kg (Freshly Prepared)
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2.5 mt-3">
                {product.badges.map((badge, i) => (
                  <span key={i} className="text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.05)] text-[var(--text-gold)]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed border-b border-[rgba(212,168,67,0.1)] pb-6">
              {product.desc}
            </p>

            {/* Premium Ordering Card */}
            <div className="p-8 rounded-3xl bg-[var(--bg-deep)] border border-[rgba(212,168,67,0.25)] shadow-xl">
              <h3 className="font-serif font-bold text-2xl text-[var(--gold-primary)] border-b border-[rgba(212,168,67,0.15)] pb-3 mb-6">
                Delivery Details & Order Form
              </h3>
              
              <form onSubmit={handleBuyNow} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-gold)] mb-2 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.2)] rounded-xl text-sm text-[var(--text-ivory)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--gold-primary)] focus:ring-1 focus:ring-[var(--gold-primary)] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-gold)] mb-2 uppercase tracking-wider">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +91 85910 53565"
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.2)] rounded-xl text-sm text-[var(--text-ivory)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--gold-primary)] focus:ring-1 focus:ring-[var(--gold-primary)] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-gold)] mb-2 uppercase tracking-wider">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Enter email for confirmation"
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.2)] rounded-xl text-sm text-[var(--text-ivory)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--gold-primary)] focus:ring-1 focus:ring-[var(--gold-primary)] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-gold)] mb-2 uppercase tracking-wider">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Enter full address for fresh delivery"
                      className="w-full px-4 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.2)] rounded-xl text-sm text-[var(--text-ivory)] placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--gold-primary)] focus:ring-1 focus:ring-[var(--gold-primary)] transition resize-none"
                    />
                  </div>
                </div>

                {/* Weight Adjustment row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[rgba(212,168,67,0.2)]">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[var(--text-cream)]">Select Weight:</span>
                    <div className="flex items-center bg-[rgba(255,255,255,0.03)] rounded-xl p-1 border border-[rgba(212,168,67,0.25)]">
                      <button
                        type="button"
                        onClick={() => setQuantityKg(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--gold-primary)] hover:bg-[var(--gold-deep)] text-white font-extrabold text-lg flex items-center justify-center focus:outline-none active:scale-95 transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 text-base font-extrabold text-[var(--gold-primary)] select-none min-w-[60px] text-center">
                        {quantityKg} kg
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantityKg(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-[var(--gold-primary)] hover:bg-[var(--gold-deep)] text-white font-extrabold text-lg flex items-center justify-center focus:outline-none active:scale-95 transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[var(--text-muted)] font-bold">Total Cost:</span>
                    <span className="text-3xl font-extrabold text-[var(--saffron)]">₹{totalPrice}</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">(@ ₹{product.pricePerKg}/KG)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="w-full mt-6 py-6 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold tracking-widest text-base sm:text-lg uppercase active:scale-[0.98] transition-all duration-300 shadow-xl shadow-emerald-950/20 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{orderSubmitting ? "Processing Order..." : "Proceed to Buy via WhatsApp"}</span>
                  </div>
                  <div className="bg-emerald-800/40 px-4 py-2 rounded-xl text-sm sm:text-base font-extrabold border border-emerald-500/20">
                    Total: ₹{totalPrice}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Section 1: Health indices & Nutrition Label (Below the fold) */}
        <div className="border-t border-[rgba(212,168,67,0.15)] py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Health Scorecard */}
            <div className="space-y-8">
              <h3 className="font-serif font-bold text-[var(--text-ivory)] text-3xl border-b border-[rgba(212,168,67,0.15)] pb-4 mb-8">
                Health Transparency
              </h3>
              {renderMeter("Sweetness Level", product.health.sweetness, "var(--saffron)")}
              {renderMeter("Richness Level", product.health.richness, "var(--gold-deep)")}
              {renderMeter("Protein Level", product.health.protein, "var(--pistachio)")}
              {renderMeter("Fitness Score", product.health.fitnessScore, "#00A86B")}
            </div>

            {/* Nutrition Facts Label */}
            <div>
              <h3 className="font-serif font-bold text-[var(--text-ivory)] text-3xl border-b border-[rgba(212,168,67,0.15)] pb-4 mb-8">
                Detailed Ingredient Composition
              </h3>
              <div className="max-w-[420px] mx-auto border-2 border-[var(--text-ivory)] p-8 bg-[#FAF9F6] font-mono text-[var(--text-ivory)] text-sm shadow-md">
                <h4 className="font-bold text-center text-3xl border-b-[8px] border-[var(--text-ivory)] pb-2 mb-3">
                  Nutrition Facts
                </h4>
                <div className="border-b border-[var(--text-ivory)] py-2.5 font-bold text-xs">
                  Serving Size: {product.nutrition.servingSize}
                </div>
                <div className="text-base border-b-[6px] border-[var(--text-ivory)] py-2.5 flex justify-between font-bold">
                  <span>Calories {product.nutrition.calories}</span>
                  <span>Energy {product.nutrition.energy} kJ</span>
                </div>
                {[
                  { label: "Total Fat", value: `${product.nutrition.fat}g`, percent: `${Math.round(product.nutrition.fat * 1.5)}%`, bold: true },
                  { label: "Cholesterol", value: `${product.nutrition.cholesterol}mg`, percent: `${Math.round(product.nutrition.cholesterol * 0.3)}%`, bold: true },
                  { label: "Total Carbohydrate", value: `${product.nutrition.carbohydrates}g`, percent: `${Math.round(product.nutrition.carbohydrates * 0.4)}%`, bold: true },
                  { label: "Dietary Fiber", value: `${product.nutrition.fiber}g`, percent: `${Math.round(product.nutrition.fiber * 4)}%`, indent: true },
                  { label: "Sugars", value: `${product.nutrition.sugar}g`, indent: true, highlight: product.category === "Sugar-Free" },
                  { label: "Protein", value: `${product.nutrition.protein}g`, percent: `${Math.round(product.nutrition.protein * 2)}%`, bold: true }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2.5 border-b border-[var(--text-ivory)] text-xs"
                    style={{
                      paddingLeft: item.indent ? 16 : 0,
                      fontWeight: item.bold ? "bold" : "normal",
                      backgroundColor: item.highlight ? "rgba(134, 169, 107, 0.15)" : "transparent"
                    }}
                  >
                    <span>{item.label} {item.value}</span>
                    {item.percent && <span>{item.percent}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Trust Badges Grid */}
        <div className="bg-[rgba(255,255,255,0.005)] border-y border-[rgba(212,168,67,0.15)] py-20 md:py-28 my-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
            <div className="p-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,168,67,0.08)] flex items-center justify-center text-[var(--gold-primary)] text-2xl mb-4 shadow-sm border border-[rgba(212,168,67,0.1)]">🚚</div>
              <h4 className="font-serif font-bold text-[var(--text-ivory)] text-base mb-1.5">Express Delivery</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">Prepared fresh and delivered securely to your doorstep</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,168,67,0.08)] flex items-center justify-center text-[var(--gold-primary)] text-2xl mb-4 shadow-sm border border-[rgba(212,168,67,0.1)]">🌿</div>
              <h4 className="font-serif font-bold text-[var(--text-ivory)] text-base mb-1.5">100% Pure Ghee</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">Made with rich dry fruits, saffron & pure organic cow ghee</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,168,67,0.08)] flex items-center justify-center text-[var(--gold-primary)] text-2xl mb-4 shadow-sm border border-[rgba(212,168,67,0.1)]">📦</div>
              <h4 className="font-serif font-bold text-[var(--text-ivory)] text-base mb-1.5">Hygiene Sealed</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">Hands-free preparation packed with vacuum-seal freshness</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,168,67,0.08)] flex items-center justify-center text-[var(--gold-primary)] text-2xl mb-4 shadow-sm border border-[rgba(212,168,67,0.1)]">🤝</div>
              <h4 className="font-serif font-bold text-[var(--text-ivory)] text-base mb-1.5">Direct Helpdesk</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">24/7 client support on WhatsApp and email inquiries</p>
            </div>
          </div>
        </div>

        {/* Section 3: Customer Reviews */}
        <div className="py-20 md:py-28 my-10">
          <h3 className="font-serif font-bold text-center text-[var(--text-ivory)] text-3xl md:text-4xl mb-12">
            What Our Patrons Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              { name: "Aditya Sharma", rating: 5, date: "2 days ago", comment: "The sweetness level is perfectly balanced! Delivered fresh in Mumbai in beautiful luxury packaging." },
              { name: "Priya Patel", rating: 5, date: "1 week ago", comment: "Incredible richness and aroma of pure ghee. Ordering via WhatsApp was super easy and fast!" },
              { name: "Rohan Kapoor", rating: 5, date: "3 weeks ago", comment: "Hands down the best sweet brand. Saffron and cashew quality is absolute top notch." }
            ].map((rev, i) => (
              <div key={i} className="p-8 md:p-10 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.15)] flex flex-col justify-between hover:border-[rgba(212,168,67,0.3)] transition duration-300">
                <div>
                  <div className="flex items-center gap-1 text-[var(--gold-primary)] mb-3 text-lg">
                    {Array.from({ length: rev.rating }).map((_, rIdx) => (
                      <span key={rIdx}>★</span>
                    ))}
                  </div>
                  <p className="text-base italic text-[var(--text-cream)] mb-6 leading-relaxed">"{rev.comment}"</p>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--text-muted)] border-t border-[rgba(255,255,255,0.05)] pt-4">
                  <span className="font-semibold text-[var(--text-gold)]">{rev.name}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: FAQ Accordion */}
        <div className="py-20 md:py-28 max-w-4xl mx-auto w-full">
          <h3 className="font-serif font-bold text-center text-[var(--text-ivory)] text-3xl md:text-4xl mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {[
              { q: "How fresh are the sweets when delivered?", a: "We prepare all sweets in small fresh batches daily. Your order is prepared and dispatched immediately following placement." },
              { q: "What are the payment methods?", a: "When you click 'Proceed to Buy', our WhatsApp agent will verify delivery and share secure online payment links (UPI, Cards, NetBanking)." },
              { q: "Do you accept corporate or bulk orders?", a: "Yes! We specialize in premium custom packaging for weddings and corporate gatherings. You can query us directly through the Contact Form." }
            ].map((faq, idx) => (
              <details key={idx} className="p-6 md:p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,67,0.15)] cursor-pointer group transition-all duration-300">
                <summary className="font-serif font-bold text-base sm:text-lg text-[var(--text-ivory)] flex justify-between items-center outline-none list-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-[var(--gold-primary)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed pl-1">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Section 5: Extra Sweets / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-20 md:py-28">
            <h3 className="font-serif font-bold text-center text-[var(--text-ivory)] text-3xl md:text-4xl mb-12">
              Patrons Also Relished
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
              {relatedProducts.map((p) => (
                <div key={p.id} className="p-6 rounded-3xl bg-[var(--bg-deep)] border border-[rgba(212,168,67,0.15)] flex flex-col justify-between hover:border-[rgba(212,168,67,0.35)] transition duration-300">
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 relative mb-6 flex items-center justify-center bg-white rounded-2xl overflow-hidden p-2 shadow-inner">
                      <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain" }} unoptimized />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[var(--text-ivory)] text-center mb-1.5">{p.name}</h4>
                    <span className="text-xs uppercase tracking-wider text-[var(--text-gold)] mb-3 text-center">{p.tagline}</span>
                    <span className="text-xl font-bold text-[var(--saffron)] mb-4">₹{p.pricePerKg}/kg</span>
                  </div>
                  <Link href={`/sweet/${p.id}`} className="w-full py-3 bg-[rgba(212,168,67,0.1)] hover:bg-[rgba(212,168,67,0.2)] text-[var(--text-gold)] rounded-xl text-center text-sm font-bold transition">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Elegant Brand Footer */}
        <footer className="border-t border-[rgba(212,168,67,0.15)] pt-16 pb-10 mt-16 text-center space-y-6">
          <div className="font-serif text-[var(--text-ivory)] font-extrabold text-3xl">Royal Sweet</div>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            Crafting premium gourmet traditional Indian sweets and dry fruit delicacies with unmatched hygiene, heritage, and pure cow ghee.
          </p>
          <div className="text-sm text-[var(--text-gold)] font-semibold">
            © 2026 Royal Sweet Palace. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
