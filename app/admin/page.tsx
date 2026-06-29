"use client";
import React, { useState, useEffect } from "react";
import { SweetProduct } from "@/lib/sweetsData";

interface StoreSettings {
  whatsappNumber: string;
  bannerText: string;
  bannerActive: boolean;
  storeHours: string;
  kitchenOpen: boolean;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "inquiries" | "reviews" | "settings" | "orders">("dashboard");

  // Data States
  const [products, setProducts] = useState<SweetProduct[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: "+91 98765 43210",
    bannerText: "✨ Royal Diwali Special: Order 1kg or more and receive a complimentary 250g assortment tin. Code: DIWALI26 ✨",
    bannerActive: false,
    storeHours: "9:00 AM - 10:00 PM",
    kitchenOpen: true,
  });

  // Loading/Operation States
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SweetProduct | null>(null);

  // Form Field States
  const [formFields, setFormFields] = useState({
    name: "",
    category: "Traditional" as "Traditional" | "Sugar-Free",
    tagline: "",
    desc: "",
    pricePerPiece: 80,
    weightPerPiece: 50,
    image: "/images/sweets/motichoor_ladoo.webp",
    accent: "#FF9933",
    availability: "In Stock" as "In Stock" | "Limited Stock" | "Fresh Batch Preparing",
    stockCount: 100,
    badges: "Festival Special",
    sweetness: 8,
    richness: 8,
    proteinScore: 5,
    fitnessScore: 6,
    calories: 150,
    energy: 627,
    sugar: 15,
    protein: 3,
    fat: 8,
    cholesterol: 10,
    fiber: 1,
    carbohydrates: 20,
    servingSize: "1 piece (50g)",
    madeTime: "6:30 AM today",
    freshnessScore: 98,
    bestBeforeDays: 7,
    prepTime: "25 mins"
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Resize listener to toggle mobile UI formats
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 991); // width threshold for layout shifting
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check auth in localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem("royal_sweets_admin_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Fetch Data function
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const prodRes = await fetch(`${baseUrl}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }

      // Fetch Inquiries
      const inqRes = await fetch(`${baseUrl}/api/inquiries`);
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
      }

      // Fetch Reviews
      const revRes = await fetch(`${baseUrl}/api/reviews`);
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.reviews || []);
      }

      // Fetch Orders
      const orderRes = await fetch(`${baseUrl}/api/orders`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.orders || []);
      }

      // Fetch Settings
      const setRes = await fetch(`${baseUrl}/api/settings`);
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.settings) {
          setSettings(setData.settings);
        }
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch(`${baseUrl}/api/products/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setFormFields((prev) => ({ ...prev, image: data.url }));
          } else {
            alert("Upload failed. No URL returned from server.");
          }
        } else {
          alert("Image upload failed. Please try a smaller image.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error. Check connection.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("royal_sweets_admin_auth", "true");
      fetchData();
    } else {
      setLoginError("Invalid Royal Passcode. Access Denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("royal_sweets_admin_auth");
    setPasscode("");
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormFields({
      name: "",
      category: "Traditional",
      tagline: "",
      desc: "",
      pricePerPiece: 80,
      weightPerPiece: 50,
      image: "/images/sweets/motichoor_ladoo.webp",
      accent: "#FF9933",
      availability: "In Stock",
      stockCount: 100,
      badges: "Festival Special, Handcrafted",
      sweetness: 8,
      richness: 8,
      proteinScore: 5,
      fitnessScore: 6,
      calories: 150,
      energy: 627,
      sugar: 15,
      protein: 3,
      fat: 8,
      cholesterol: 10,
      fiber: 1,
      carbohydrates: 20,
      servingSize: "1 piece (50g)",
      madeTime: "6:30 AM today",
      freshnessScore: 98,
      bestBeforeDays: 7,
      prepTime: "25 mins"
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: SweetProduct) => {
    setEditingProduct(product);
    setFormFields({
      name: product.name,
      category: product.category,
      tagline: product.tagline || "",
      desc: product.desc || "",
      pricePerPiece: product.pricePerPiece,
      weightPerPiece: product.weightPerPiece,
      image: product.image,
      accent: product.accent || "#D4A843",
      availability: product.availability,
      stockCount: product.stockCount || 100,
      badges: (product.badges || []).join(", "),
      sweetness: product.health?.sweetness || 5,
      richness: product.health?.richness || 5,
      proteinScore: product.health?.protein || 5,
      fitnessScore: product.health?.fitnessScore || 5,
      calories: product.nutrition?.calories || 150,
      energy: product.nutrition?.energy || 600,
      sugar: product.nutrition?.sugar || 10,
      protein: product.nutrition?.protein || 3,
      fat: product.nutrition?.fat || 8,
      cholesterol: product.nutrition?.cholesterol || 5,
      fiber: product.nutrition?.fiber || 1,
      carbohydrates: product.nutrition?.carbohydrates || 20,
      servingSize: product.nutrition?.servingSize || `1 piece (${product.weightPerPiece}g)`,
      madeTime: product.freshness?.madeTime || "6:00 AM today",
      freshnessScore: product.freshness?.score || 95,
      bestBeforeDays: product.freshness?.bestBeforeDays || 7,
      prepTime: product.freshness?.prepTime || "20 mins"
    });
    setModalOpen(true);
  };

  // Form Submit Handler (Create/Update Product)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const badgesArray = formFields.badges
      ? formFields.badges.split(",").map((s) => s.trim()).filter((s) => s !== "")
      : [];

    const productPayload: SweetProduct = {
      id: editingProduct ? editingProduct.id : formFields.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      name: formFields.name,
      category: formFields.category,
      tagline: formFields.tagline,
      desc: formFields.desc,
      pricePerPiece: Number(formFields.pricePerPiece),
      pricePerKg: Math.round((Number(formFields.pricePerPiece) / (Number(formFields.weightPerPiece) || 1)) * 1000),
      weightPerPiece: Number(formFields.weightPerPiece),
      image: formFields.image,
      accent: formFields.accent,
      availability: formFields.availability,
      stockCount: Number(formFields.stockCount),
      badges: badgesArray,
      health: {
        sweetness: Number(formFields.sweetness),
        richness: Number(formFields.richness),
        protein: Number(formFields.proteinScore),
        fitnessScore: Number(formFields.fitnessScore),
      },
      nutrition: {
        calories: Number(formFields.calories),
        energy: Number(formFields.energy),
        sugar: Number(formFields.sugar),
        protein: Number(formFields.protein),
        fat: Number(formFields.fat),
        cholesterol: Number(formFields.cholesterol),
        fiber: Number(formFields.fiber),
        carbohydrates: Number(formFields.carbohydrates),
        servingSize: formFields.servingSize,
      },
      freshness: {
        madeTime: formFields.madeTime,
        score: Number(formFields.freshnessScore),
        bestBeforeDays: Number(formFields.bestBeforeDays),
        prepTime: formFields.prepTime,
      }
    };

    try {
      const url = editingProduct 
        ? `${baseUrl}/api/products/${editingProduct.id}`
        : `${baseUrl}/api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        alert("Failed to save sweet. Check inputs.");
      }
    } catch (err) {
      console.error("Error saving sweet:", err);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // Save Store Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        alert("Operational settings updated successfully.");
        fetchData();
      } else {
        alert("Failed to update settings.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this sweet from your royal catalog?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error deleting sweet:", err);
    } finally {
      setLoading(false);
    }
  };

  // Archive Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Archive this customer inquiry?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Remove this customer review from catalog?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete/Complete Order
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete/complete this order?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Error deleting order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculated Metrics
  const lowStockSweets = products.filter(
    (p) => p.stockCount < 50 || p.availability === "Fresh Batch Preparing"
  );
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8";

  // ── Authentication Login Screen ──
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "radial-gradient(circle at center, #1b1612 0%, #0c0a09 100%)",
          fontFamily: "var(--font-body)",
          padding: 24,
          color: "#FFFFFF"
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: 420,
            width: "100%",
            padding: "40px 32px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(212, 168, 67, 0.15)",
            borderRadius: 24,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(212, 168, 67, 0.05)",
            textAlign: "center"
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--gold-primary)", letterSpacing: "0.04em", marginBottom: 8 }}>
            Royal Sweet
          </div>
          <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: 32 }}>
            Concierge Atelier CMS Access
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              placeholder="Enter Gate Passcode"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                padding: "14px 18px",
                borderRadius: 12,
                border: "1.5px solid rgba(212, 168, 67, 0.25)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "#FFFFFF",
                outline: "none",
                textAlign: "center"
              }}
            />
            {loginError && <div style={{ color: "#E8889A", fontSize: "0.75rem", fontWeight: 600 }}>{loginError}</div>}
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-button)",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                border: "none",
                padding: "14px",
                borderRadius: 50,
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(255,120,0,0.25)",
                marginTop: 8
              }}
            >
              Verify Passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-dark)",
        color: "var(--text-ivory)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "var(--font-body)"
      }}
    >
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 199,
            transition: "all 0.3s ease"
          }}
        />
      )}

      {/* ── Left Sidebar Navigation ── */}
      <aside
        style={{
          width: 260,
          background: "var(--bg-deep)",
          borderRight: "1px solid rgba(212, 168, 67, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 200,
          padding: "24px 16px",
          transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-260px)") : "none",
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div>
          {/* Sidebar Header / Logo */}
          <div style={{ padding: "8px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 24 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", color: "var(--gold-primary)", fontWeight: "bold" }}>Royal Sweet</h1>
            <span style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.12em", display: "block", marginTop: 4 }}>
              CMS Concierge Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                )
              },
              {
                id: "products",
                label: "Mithai Catalog",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                )
              },
              {
                id: "inquiries",
                label: "Inquiries",
                badge: inquiries.length,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )
              },
              {
                id: "reviews",
                label: "Reviews",
                badge: reviews.length,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                )
              },
              {
                id: "orders",
                label: "Orders Tracking",
                badge: orders.length,
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                )
              },
              {
                id: "settings",
                label: "Store Settings",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                )
              }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id as any);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  fontFamily: "var(--font-button)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  background: activeTab === link.id ? "var(--gold-primary)" : "transparent",
                  color: activeTab === link.id ? "var(--bg-dark)" : "var(--text-muted)",
                  transition: "all 0.25s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {link.icon}
                  <span style={{ fontWeight: activeTab === link.id ? "bold" : "normal" }}>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    style={{
                      background: activeTab === link.id ? "var(--bg-dark)" : "rgba(255,255,255,0.08)",
                      color: activeTab === link.id ? "#FFFFFF" : "var(--text-muted)",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: 50
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Card & Logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 10px 14px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-primary), var(--saffron))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg-dark)", fontWeight: "bold", fontSize: "0.95rem" }}>
              A
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-ivory)" }}>Atelier Chef</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Administrator</div>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
              if (isMobile) setSidebarOpen(false);
            }}
            style={{
              background: "none",
              border: "1.5px solid rgba(232, 136, 154, 0.25)",
              color: "#E8889A",
              width: "100%",
              padding: "10px",
              borderRadius: 12,
              fontSize: "0.75rem",
              fontFamily: "var(--font-button)",
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontWeight: "bold",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(232, 136, 154, 0.05)";
              e.currentTarget.style.borderColor = "#E8889A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(232, 136, 154, 0.25)";
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 260,
          padding: isMobile ? "24px 16px" : "40px 48px",
          minHeight: "100vh",
          overflowY: "auto",
          paddingTop: isMobile ? "84px" : "40px",
        }}
      >
        {/* Floating Mobile Top Header Bar */}
        {isMobile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "var(--bg-deep)",
              borderBottom: "1px solid rgba(212, 168, 67, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 98,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-ivory)",
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--gold-primary)", fontWeight: "bold" }}>
              Royal Sweet CMS
            </div>
            <div style={{ width: 40 }} />
          </div>
        )}
        {loading ? (
          <div style={{ padding: "120px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem", fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>
            Loading Royal Archives...
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* ── 1. Dashboard Overview ── */}
            {activeTab === "dashboard" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Dashboard Overview</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Atelier operational pulse and live metrics summary.</p>
                </div>

                {/* KPI Metrics Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                  {[
                    { label: "Active Sweets", value: products.length, desc: "Handcrafted catalog items", color: "var(--gold-primary)" },
                    { label: "Active Inquiries", value: inquiries.length, desc: "Pending concierge requests", color: "var(--saffron)" },
                    { label: "Guest Rating", value: `${averageRating} / 5.0`, desc: `Based on ${reviews.length} reviews`, color: "var(--pistachio)" },
                    { label: "Kitchen Status", value: settings.kitchenOpen ? "KITCHEN OPEN" : "KITCHEN CLOSED", desc: `Hours: ${settings.storeHours}`, color: settings.kitchenOpen ? "var(--pistachio)" : "#E8889A" }
                  ].map((card, idx) => (
                    <div key={idx} style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24 }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 600 }}>{card.label}</span>
                      <div style={{ fontSize: "1.8rem", color: card.color, fontWeight: "bold", margin: "10px 0 4px", fontFamily: "var(--font-display)" }}>{card.value}</div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{card.desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 28 }}>
                  {/* Left Column: Alerts & Recent activity */}
                  <div>
                    {/* Low Stock Alerts */}
                    <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24, marginBottom: 28 }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold-primary)", marginBottom: 16, fontWeight: "bold" }}>
                        Kitchen Production & Stock Alerts
                      </h4>
                      {lowStockSweets.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>✓ All sweets are well stocked and preparing on schedule.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {lowStockSweets.map((sweet) => (
                            <div key={sweet.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ color: sweet.stockCount === 0 ? "#E8889A" : "var(--saffron)" }}>⚠️</span>
                                <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{sweet.name}</span>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: sweet.stockCount === 0 ? "#E8889A" : "var(--saffron)", fontWeight: 600, marginLeft: "auto" }}>
                                {sweet.stockCount === 0 ? "OUT OF STOCK" : `${sweet.stockCount} pcs remaining`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Inquiries */}
                    <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24 }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold-primary)", marginBottom: 16, fontWeight: "bold" }}>
                        Recent Concierge Requests
                      </h4>
                      {inquiries.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No customer requests recorded yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {inquiries.slice(0, 3).map((inq) => (
                            <div key={inq._id} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{inq.name}</span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{new Date(inq.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Type: <strong style={{ color: "var(--gold-primary)" }}>{inq.type}</strong> | Phone: {inq.phone}</div>
                              {inq.message && <p style={{ fontSize: "0.8rem", color: "var(--text-cream)", lineHeight: 1.4, margin: "2px 0 0" }}>"{inq.message}"</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Settings active status & Recent reviews */}
                  <div>
                    {/* Active Announcement Banner */}
                    <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24, marginBottom: 28 }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold-primary)", marginBottom: 12, fontWeight: "bold" }}>
                        Promotional Site Announcement
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: settings.bannerActive ? "var(--pistachio)" : "#E8889A" }}></span>
                        <span style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>{settings.bannerActive ? "Banner Active on Site" : "Banner Hidden"}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-cream)", lineHeight: 1.4, background: "#FFFFFF", padding: 12, borderRadius: 8, border: "1px solid rgba(212, 168, 67, 0.15)" }}>
                        {settings.bannerText}
                      </p>
                    </div>

                    {/* Recent Reviews */}
                    <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24 }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold-primary)", marginBottom: 16, fontWeight: "bold" }}>
                        Recent Testimonials
                      </h4>
                      {reviews.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No customer reviews posted yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {reviews.slice(0, 3).map((rev) => (
                            <div key={rev._id} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{rev.name} ({rev.location || "Mumbai"})</span>
                                <span style={{ color: "var(--saffron)", fontSize: "0.85rem" }}>{"★".repeat(rev.rating)}</span>
                              </div>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, fontStyle: "italic" }}>"{rev.review}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. Sweets Catalog (CMS) ── */}
            {activeTab === "products" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <div>
                    <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Mithai Catalog (CMS)</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Manage items showcased inside the luxury Boutique Mithai Atelier.</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    style={{
                      background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "12px 24px",
                      borderRadius: 50,
                      fontFamily: "var(--font-button)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Custom Sweet
                  </button>
                </div>

                {products.length === 0 ? (
                  <div style={{ padding: "60px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, textAlign: "center", color: "var(--text-muted)" }}>
                    No sweets available. Click "Add Custom Sweet" to begin seeding.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        style={{
                          background: "var(--bg-deep)",
                          border: "1px solid rgba(134, 169, 107, 0.15)",
                          borderRadius: 20,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ padding: 20 }}>
                          <div style={{ display: "flex", gap: 14, alignItems: "start" }}>
                            <div style={{ position: "relative", width: 64, height: 64, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
                              <img
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                  e.currentTarget.src = "/images/sweets/motichoor_ladoo.webp";
                                }}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: "0.65rem", textTransform: "uppercase", background: product.category === "Sugar-Free" ? "rgba(134,169,107,0.15)" : "rgba(212,168,67,0.15)", color: product.category === "Sugar-Free" ? "var(--pistachio)" : "var(--gold-primary)", padding: "2px 8px", borderRadius: 4, fontWeight: "bold" }}>
                                {product.category}
                              </span>
                              <h4 style={{ fontSize: "1.05rem", color: "var(--text-ivory)", marginTop: 6, fontWeight: 600 }}>{product.name}</h4>
                              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2, fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>{product.tagline}</p>
                            </div>
                          </div>

                          <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 12 }}>
                            <div>
                              <span style={{ color: "var(--text-muted)" }}>Price:</span>
                              <span style={{ color: "var(--gold-primary)", fontWeight: "bold", marginLeft: 4 }}>₹{product.pricePerPiece} / pc</span>
                            </div>
                            <div>
                              <span style={{ color: "var(--text-muted)" }}>Stock:</span>
                              <span style={{ color: "var(--text-ivory)", fontWeight: "semibold", marginLeft: 4 }}>{product.stockCount} {product.stockCount === 0 ? "(Out)" : `pcs`}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.15)", padding: "12px 20px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                          <button
                            onClick={() => openEditModal(product)}
                            style={{
                              background: "none",
                              border: "1.5px solid rgba(212,168,67,0.3)",
                              color: "var(--gold-primary)",
                              padding: "6px 14px",
                              borderRadius: 50,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              fontFamily: "var(--font-button)",
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              background: "none",
                              border: "1.5px solid rgba(232,136,154,0.3)",
                              color: "#E8889A",
                              padding: "6px 14px",
                              borderRadius: 50,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              fontFamily: "var(--font-button)",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 3. Customer Inquiries ── */}
            {activeTab === "inquiries" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Customer Inquiries</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Bespoke wedding orders, corporate catering requests, and live kitchen queries.</p>
                </div>

                {inquiries.length === 0 ? (
                  <div style={{ padding: "60px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, textAlign: "center", color: "var(--text-muted)" }}>
                    No inquiries recorded in database yet.
                  </div>
                ) : isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {inquiries.map((inq) => (
                      <div key={inq._id} style={{ background: "var(--bg-deep)", border: "1px solid rgba(212, 168, 67, 0.15)", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(inq.createdAt).toLocaleDateString()}</span>
                          <span style={{ background: "var(--gold-primary)", color: "var(--bg-dark)", padding: "2px 8px", borderRadius: 4, fontSize: "0.65rem", fontWeight: "bold" }}>{inq.type}</span>
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text-ivory)", marginBottom: 6 }}>{inq.name}</h4>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-cream)", marginBottom: 2 }}>Phone: {inq.phone}</div>
                        {inq.email && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>Email: {inq.email}</div>}
                        <p style={{ fontSize: "0.8rem", color: "var(--text-cream)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4, borderLeft: "2px solid var(--gold-primary)", paddingLeft: 10 }}>
                          "{inq.message || "(No additional details provided)"}"
                        </p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                          <button
                            onClick={() => handleDeleteInquiry(inq._id)}
                            style={{
                              background: "none",
                              border: "1px solid rgba(232,136,154,0.3)",
                              color: "#E8889A",
                              padding: "6px 14px",
                              borderRadius: 50,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "var(--font-button)"
                            }}
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(212, 168, 67, 0.15)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Date</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Client</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Contact Number</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Type</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Concierge Request Details</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)", textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.map((inq) => (
                            <tr key={inq._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                              <td style={{ padding: "16px 20px", whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ padding: "16px 20px", fontWeight: "bold" }}>{inq.name}</td>
                              <td style={{ padding: "16px 20px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span>{inq.phone}</span>
                                  {inq.email && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{inq.email}</span>}
                                </div>
                              </td>
                              <td style={{ padding: "16px 20px" }}>
                                <span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 4, fontSize: "0.75rem" }}>{inq.type}</span>
                              </td>
                              <td style={{ padding: "16px 20px", color: "var(--text-muted)", lineHeight: 1.4, maxWidth: 350 }}>
                                {inq.message || "(No additional details provided)"}
                              </td>
                              <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                <button
                                  onClick={() => handleDeleteInquiry(inq._id)}
                                  style={{
                                    background: "none",
                                    border: "1px solid rgba(232,136,154,0.3)",
                                    color: "#E8889A",
                                    padding: "6px 14px",
                                    borderRadius: 50,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-button)"
                                  }}
                                >
                                  Archive
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. Reviews Moderation ── */}
            {activeTab === "reviews" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Reviews Moderation</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Moderate customer testimonials showing on the main landing page.</p>
                </div>

                {reviews.length === 0 ? (
                  <div style={{ padding: "60px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, textAlign: "center", color: "var(--text-muted)" }}>
                    No reviews in database.
                  </div>
                ) : isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {reviews.map((rev) => (
                      <div key={rev._id} style={{ background: "var(--bg-deep)", border: "1px solid rgba(212, 168, 67, 0.15)", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-ivory)" }}>{rev.name}</span>
                          <span style={{ color: "var(--saffron)", fontSize: "0.85rem" }}>{"★".repeat(rev.rating || 5)}</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>{rev.location || "Mumbai"}</div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-cream)", lineHeight: 1.4, fontStyle: "italic", borderLeft: "2px solid var(--gold-primary)", paddingLeft: 10 }}>
                          "{rev.review}"
                        </p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            style={{
                              background: "none",
                              border: "1px solid rgba(232,136,154,0.3)",
                              color: "#E8889A",
                              padding: "6px 14px",
                              borderRadius: 50,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "var(--font-button)"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(212, 168, 67, 0.15)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Client</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Location</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Rating</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)" }}>Testimonial Detail</th>
                            <th style={{ padding: "16px 20px", color: "var(--gold-primary)", textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.map((rev) => (
                            <tr key={rev._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                              <td style={{ padding: "16px 20px", fontWeight: "bold" }}>{rev.name}</td>
                              <td style={{ padding: "16px 20px" }}>{rev.location || "Mumbai"}</td>
                              <td style={{ padding: "16px 20px", color: "var(--saffron)" }}>
                                {"★".repeat(rev.rating || 5)}
                              </td>
                              <td style={{ padding: "16px 20px", color: "var(--text-muted)", lineHeight: 1.4, maxWidth: 400 }}>
                                "{rev.review}"
                              </td>
                              <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                <button
                                  onClick={() => handleDeleteReview(rev._id)}
                                  style={{
                                    background: "none",
                                    border: "1px solid rgba(232, 136, 154, 0.25)",
                                    color: "#E8889A",
                                    padding: "6px 14px",
                                    borderRadius: 50,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-button)"
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 5. Operational Settings ── */}
            {activeTab === "settings" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Store Operational Settings</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Configure shop contact details, operational hours, and promotional announcement banners.</p>
                </div>

                <div style={{ background: "var(--bg-deep)", border: "1px solid rgba(212, 168, 67, 0.15)", borderRadius: 24, padding: "32px 40px", maxWidth: 750 }}>
                  <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* WhatsApp Configuration */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontWeight: "bold" }}>
                        WhatsApp Business Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        style={{ width: "100%", background: "#FFFFFF", border: "1px solid rgba(45, 37, 30, 0.15)", borderRadius: 8, padding: 12, color: "var(--text-ivory)", outline: "none" }}
                      />
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: 4 }}>Used to redirect clients for custom box orders and inquiries.</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                      {/* Store hours */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontWeight: "bold" }}>
                          Store Opening Hours
                        </label>
                        <input
                          type="text"
                          required
                          value={settings.storeHours}
                          onChange={(e) => setSettings({ ...settings, storeHours: e.target.value })}
                          style={{ width: "100%", background: "#FFFFFF", border: "1px solid rgba(45, 37, 30, 0.15)", borderRadius: 8, padding: 12, color: "var(--text-ivory)", outline: "none" }}
                        />
                      </div>

                      {/* Store / Kitchen operational status */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, fontWeight: "bold" }}>
                          Kitchen Status
                        </label>
                        <select
                          value={settings.kitchenOpen ? "open" : "closed"}
                          onChange={(e) => setSettings({ ...settings, kitchenOpen: e.target.value === "open" })}
                          style={{ width: "100%", background: "#FFFFFF", border: "1px solid rgba(45, 37, 30, 0.15)", borderRadius: 8, padding: 12, color: "var(--text-ivory)", outline: "none" }}
                        >
                          <option value="open">Open (Serving Fresh Sweets)</option>
                          <option value="closed">Closed (Kitchen Offline)</option>
                        </select>
                      </div>
                    </div>

                    {/* Banner Settings */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>
                          Homepage Announcement Banner
                        </label>
                        {/* Custom styled toggle switch */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{settings.bannerActive ? "Active" : "Inactive"}</span>
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, bannerActive: !settings.bannerActive })}
                            style={{
                              width: 44,
                              height: 22,
                              borderRadius: 50,
                              background: settings.bannerActive ? "var(--gold-primary)" : "rgba(255,255,255,0.1)",
                              border: "none",
                              position: "relative",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              padding: 0
                            }}
                          >
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: settings.bannerActive ? "var(--bg-dark)" : "#FFFFFF",
                                position: "absolute",
                                top: 3,
                                left: settings.bannerActive ? 25 : 3,
                                transition: "all 0.3s ease"
                              }}
                            />
                          </button>
                        </div>
                      </div>
                      <textarea
                        required
                        rows={3}
                        value={settings.bannerText}
                        onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                        style={{ width: "100%", background: "#FFFFFF", border: "1px solid rgba(45, 37, 30, 0.15)", borderRadius: 8, padding: 12, color: "var(--text-ivory)", outline: "none", fontFamily: "var(--font-body)", resize: "none", lineHeight: 1.4 }}
                      />
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: 4 }}>Displayed as a marquee ribbon on the very top of the homepage.</span>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                      <button
                        type="submit"
                        style={{
                          background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                          border: "none",
                          color: "#FFFFFF",
                          padding: "12px 36px",
                          borderRadius: 50,
                          fontFamily: "var(--font-button)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 4px 10px rgba(255,120,0,0.2)"
                        }}
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── 6. Orders Tracking Ledger ── */}
            {activeTab === "orders" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>Orders Tracking Ledger</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Review customer transactions and WhatsApp orders registered in MongoDB.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div
                    style={{
                      background: "var(--bg-deep)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 20,
                      padding: "80px 24px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.2rem",
                    }}
                  >
                    No orders registered in the ledger yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        style={{
                          background: "var(--bg-deep)",
                          border: "1.5px solid rgba(212, 168, 67, 0.15)",
                          borderRadius: 20,
                          padding: 24,
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        {/* Header Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: 12,
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            paddingBottom: 12,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text-ivory)" }}>
                              {order.clientName}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                              📞 {order.clientPhone} {order.clientEmail ? `| ✉️ ${order.clientEmail}` : ""}
                            </div>
                            {order.deliveryAddress && (
                              <div style={{ fontSize: "0.8rem", color: "var(--text-gold)", marginTop: 4 }}>
                                📍 Address: <span style={{ color: "var(--text-ivory)" }}>{order.deliveryAddress}</span>
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                padding: "4px 10px",
                                borderRadius: 50,
                                background: order.type === "Custom Box" ? "rgba(134, 169, 107, 0.12)" : "rgba(212, 168, 67, 0.12)",
                                color: order.type === "Custom Box" ? "var(--pistachio)" : "var(--gold-primary)",
                                border: order.type === "Custom Box" ? "1px solid rgba(134, 169, 107, 0.25)" : "1px solid rgba(212, 168, 67, 0.25)",
                              }}
                            >
                              {order.type}
                            </span>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                              Ordered on: {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Items Row */}
                        <div>
                          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 600, display: "block", marginBottom: 8 }}>
                            Order Items
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {order.items.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  background: "rgba(255,255,255,0.01)",
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(255,255,255,0.03)",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <div>
                                  <strong style={{ color: "var(--text-cream)" }}>{item.name}</strong>
                                  <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                                    ({item.weight >= 1000 ? `${item.weight / 1000} kg` : `${item.weight}g`})
                                  </span>
                                </div>
                                <div style={{ fontWeight: "bold" }}>
                                  {item.count > 0 && `${item.count} units | `} ₹{item.totalCost}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer Summary Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(255,255,255,0.02)",
                            padding: "12px 18px",
                            borderRadius: 12,
                            marginTop: 4,
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Weight:</span>
                            <strong style={{ marginLeft: 6, fontSize: "0.85rem", color: "var(--text-cream)" }}>
                              {order.totalWeight >= 1000 ? `${order.totalWeight / 1000} kg` : `${order.totalWeight}g`}
                            </strong>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Grand Total:</span>
                              <strong style={{ marginLeft: 6, fontSize: "1.2rem", color: "var(--gold-primary)" }}>
                                ₹{order.totalPrice}
                              </strong>
                            </div>

                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              style={{
                                background: "none",
                                border: "1.5px solid rgba(232, 136, 154, 0.3)",
                                color: "#E8889A",
                                padding: "6px 12px",
                                borderRadius: 8,
                                fontSize: "0.7rem",
                                fontFamily: "var(--font-button)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(232, 136, 154, 0.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              Complete / Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sweet Form Modal (Add / Edit) ── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          <div
            style={{
              background: "#161310",
              border: "1.5px solid var(--gold-primary)",
              borderRadius: 24,
              maxWidth: 750,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
              color: "#FFFFFF"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-display)", color: "var(--gold-primary)" }}>
                {editingProduct ? `Edit Catalog Sweet: ${editingProduct.name}` : "Create Handcrafted Sweet"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitProduct} style={{ padding: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Sweet Name *</label>
                  <input
                    type="text"
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Category *</label>
                  <select
                    value={formFields.category}
                    onChange={(e) => setFormFields({ ...formFields, category: e.target.value as any })}
                    style={{ width: "100%", background: "#161310", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  >
                    <option value="Traditional">Traditional</option>
                    <option value="Sugar-Free">Sugar-Free</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Tagline */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Tagline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A Symphony of Saffron"
                    value={formFields.tagline}
                    onChange={(e) => setFormFields({ ...formFields, tagline: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Product Image *</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ position: "relative", width: 44, height: 44, borderRadius: 8, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                      <img
                        src={formFields.image || "/images/sweets/motichoor_ladoo.webp"}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/images/sweets/motichoor_ladoo.webp";
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                        id="image-file-input"
                      />
                      <label
                        htmlFor="image-file-input"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid rgba(212, 168, 67, 0.3)",
                          background: "rgba(255, 255, 255, 0.02)",
                          color: "var(--gold-primary)",
                          fontFamily: "var(--font-button)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {uploading ? "Uploading to Atelier..." : "Upload New Image"}
                      </label>
                      {formFields.image && (
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: 220 }}>
                          Current: {formFields.image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formFields.desc}
                  onChange={(e) => setFormFields({ ...formFields, desc: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none", fontFamily: "var(--font-body)", resize: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Price */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Price Per Piece (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formFields.pricePerPiece}
                    onChange={(e) => setFormFields({ ...formFields, pricePerPiece: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>

                {/* Weight */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Weight Per Piece (g) *</label>
                  <input
                    type="number"
                    required
                    value={formFields.weightPerPiece}
                    onChange={(e) => setFormFields({ ...formFields, weightPerPiece: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>

                {/* Stock Count */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={formFields.stockCount}
                    onChange={(e) => setFormFields({ ...formFields, stockCount: Number(e.target.value) })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Availability */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Availability Status</label>
                  <select
                    value={formFields.availability}
                    onChange={(e) => setFormFields({ ...formFields, availability: e.target.value as any })}
                    style={{ width: "100%", background: "#161310", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Fresh Batch Preparing">Fresh Batch Preparing</option>
                  </select>
                </div>

                {/* Accent Color */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Accent Color (Hex) *</label>
                  <input
                    type="text"
                    required
                    value={formFields.accent}
                    onChange={(e) => setFormFields({ ...formFields, accent: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>

                {/* Badges */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Badges (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gluten Free, Low Sugar"
                    value={formFields.badges}
                    onChange={(e) => setFormFields({ ...formFields, badges: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#FFF", outline: "none" }}
                  />
                </div>
              </div>

              {/* Health Metrics */}
              <div style={{ margin: "24px 0 12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Health & Quality Gauges (1-10 scale)</h4>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>Sweetness</label>
                  <input type="number" min="1" max="10" value={formFields.sweetness} onChange={(e) => setFormFields({ ...formFields, sweetness: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>Richness</label>
                  <input type="number" min="1" max="10" value={formFields.richness} onChange={(e) => setFormFields({ ...formFields, richness: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>Protein Score</label>
                  <input type="number" min="1" max="10" value={formFields.proteinScore} onChange={(e) => setFormFields({ ...formFields, proteinScore: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>Fitness Score</label>
                  <input type="number" min="1" max="10" value={formFields.fitnessScore} onChange={(e) => setFormFields({ ...formFields, fitnessScore: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", outline: "none" }} />
                </div>
              </div>

              {/* Nutrition Facts */}
              <div style={{ margin: "24px 0 12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Nutrition Facts (per serving)</h4>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Calories (kcal)</label>
                  <input type="number" value={formFields.calories} onChange={(e) => setFormFields({ ...formFields, calories: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 6, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Energy (kJ)</label>
                  <input type="number" value={formFields.energy} onChange={(e) => setFormFields({ ...formFields, energy: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 6, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Sugar (g)</label>
                  <input type="number" step="0.1" value={formFields.sugar} onChange={(e) => setFormFields({ ...formFields, sugar: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 6, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Protein (g)</label>
                  <input type="number" step="0.1" value={formFields.protein} onChange={(e) => setFormFields({ ...formFields, protein: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 6, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Fat (g)</label>
                  <input type="number" step="0.1" value={formFields.fat} onChange={(e) => setFormFields({ ...formFields, fat: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 6, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Cholesterol (mg)</label>
                  <input type="number" value={formFields.cholesterol} onChange={(e) => setFormFields({ ...formFields, cholesterol: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Fiber (g)</label>
                  <input type="number" step="0.1" value={formFields.fiber} onChange={(e) => setFormFields({ ...formFields, fiber: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Carbohydrates (g)</label>
                  <input type="number" step="0.1" value={formFields.carbohydrates} onChange={(e) => setFormFields({ ...formFields, carbohydrates: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Serving Size Descriptor</label>
                  <input type="text" value={formFields.servingSize} onChange={(e) => setFormFields({ ...formFields, servingSize: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
              </div>

              {/* Freshness Info */}
              <div style={{ margin: "24px 0 12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>Freshness & Preparation Details</h4>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 30 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Time Handcrafted</label>
                  <input type="text" value={formFields.madeTime} onChange={(e) => setFormFields({ ...formFields, madeTime: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Freshness Score (%)</label>
                  <input type="number" value={formFields.freshnessScore} onChange={(e) => setFormFields({ ...formFields, freshnessScore: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Best Before (days)</label>
                  <input type="number" value={formFields.bestBeforeDays} onChange={(e) => setFormFields({ ...formFields, bestBeforeDays: Number(e.target.value) })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4 }}>Preparation Duration</label>
                  <input type="text" value={formFields.prepTime} onChange={(e) => setFormFields({ ...formFields, prepTime: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, color: "#FFF", fontSize: "0.8rem", outline: "none" }} />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "none",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    color: "var(--text-muted)",
                    padding: "10px 24px",
                    borderRadius: 50,
                    fontFamily: "var(--font-button)",
                    fontSize: "0.75rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, var(--saffron), #FF7722)",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "10px 28px",
                    borderRadius: 50,
                    fontFamily: "var(--font-button)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(255,120,0,0.2)"
                  }}
                >
                  {loading ? "Saving..." : editingProduct ? "Update Catalog Sweet" : "Seal Custom Sweet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
