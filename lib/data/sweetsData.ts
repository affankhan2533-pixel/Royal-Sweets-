export interface NutritionFacts {
  calories: number;
  energy: number; // in kJ
  sugar: number; // in g
  protein: number; // in g
  fat: number; // in g
  cholesterol: number; // in mg
  fiber: number; // in g
  carbohydrates: number; // in g
  servingSize: string;
}

export interface HealthTransparency {
  sweetness: number; // 1-10 scale
  richness: number; // 1-10 scale
  protein: number; // 1-10 scale
  fitnessScore: number; // 1-10 scale
}

export interface FreshnessInfo {
  madeTime: string;
  score: number; // percentage, e.g. 98
  bestBeforeDays: number;
  prepTime: string;
}

export interface SweetProduct {
  id: string;
  name: string;
  category: "Traditional" | "Sugar-Free";
  tagline: string;
  desc: string;
  pricePerPiece: number;
  pricePerKg: number;
  weightPerPiece: number; // in grams
  image: string;
  accent: string;
  availability: "In Stock" | "Limited Stock" | "Fresh Batch Preparing";
  stockCount: number;
  badges: string[];
  nutrition: NutritionFacts;
  health: HealthTransparency;
  freshness: FreshnessInfo;
}

export const SWEETS_DATA: SweetProduct[] = [
  {
    id: "motichoor-ladoo",
    name: "Motichoor Ladoo",
    category: "Traditional",
    tagline: "A Symphony of Saffron",
    desc: "Delicate chickpea flour droplets, fried golden in pure cow ghee and bound with aromatic sugar syrup, garnished with pistachios and saffron.",
    pricePerPiece: 20,
    pricePerKg: 400,
    weightPerPiece: 50,
    image: "/images/sweets/motichoor_ladoo.webp",
    accent: "#FF9933",
    availability: "In Stock",
    stockCount: 120,
    badges: ["Kids Friendly", "Festival Special"],
    health: {
      sweetness: 9,
      richness: 8,
      protein: 4,
      fitnessScore: 5
    },
    nutrition: {
      calories: 185,
      energy: 774,
      sugar: 18,
      protein: 3.2,
      fat: 9.5,
      cholesterol: 12,
      fiber: 1.2,
      carbohydrates: 22.5,
      servingSize: "1 piece (50g)"
    },
    freshness: {
      madeTime: "6:30 AM today",
      score: 98,
      bestBeforeDays: 7,
      prepTime: "25 mins"
    }
  },
  {
    id: "kaju-katli",
    name: "Kaju Katli",
    category: "Traditional",
    tagline: "Silver Leaf Elegance",
    desc: "Premium Goan cashews ground to a silky paste, slow-cooked with cardamom and adorned with pure silver leaf. The crown jewel of Indian craftsmanship.",
    pricePerPiece: 25,
    pricePerKg: 1000,
    weightPerPiece: 25,
    image: "/images/sweets/kaju_katli.webp",
    accent: "#D4A843",
    availability: "In Stock",
    stockCount: 250,
    badges: ["Gluten Free", "Wedding Collection", "Corporate Gifting"],
    health: {
      sweetness: 6,
      richness: 9,
      protein: 5,
      fitnessScore: 6
    },
    nutrition: {
      calories: 115,
      energy: 481,
      sugar: 9.2,
      protein: 2.8,
      fat: 6.8,
      cholesterol: 0,
      fiber: 0.8,
      carbohydrates: 11.2,
      servingSize: "1 piece (25g)"
    },
    freshness: {
      madeTime: "7:00 AM today",
      score: 96,
      bestBeforeDays: 15,
      prepTime: "20 mins"
    }
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "Traditional",
    tagline: "Dipped in Rose Syrup",
    desc: "Soft evaporated milk (khoya) spheres fried lightly and soaked in rose-cardamom sugar syrup, served warm and garnished with rose petals.",
    pricePerPiece: 27,
    pricePerKg: 450,
    weightPerPiece: 60,
    image: "/images/sweets/gulab_jamun.webp",
    accent: "#E8889A",
    availability: "Limited Stock",
    stockCount: 45,
    badges: ["Kids Favourite", "Festival Special"],
    health: {
      sweetness: 10,
      richness: 9,
      protein: 3,
      fitnessScore: 4
    },
    nutrition: {
      calories: 220,
      energy: 920,
      sugar: 24,
      protein: 4.0,
      fat: 10.2,
      cholesterol: 25,
      fiber: 0.5,
      carbohydrates: 28.5,
      servingSize: "1 piece (60g)"
    },
    freshness: {
      madeTime: "7:30 AM today",
      score: 99,
      bestBeforeDays: 5,
      prepTime: "30 mins"
    }
  },
  {
    id: "rasgulla",
    name: "Rasgulla",
    category: "Traditional",
    tagline: "Bengal's White Pearl",
    desc: "Spongy, light-as-air chhena spheres simmered in organic sugar syrup. Exceedingly delicate, airy, and refreshing.",
    pricePerPiece: 24,
    pricePerKg: 400,
    weightPerPiece: 60,
    image: "/images/sweets/rasgulla.webp",
    accent: "#86A96B",
    availability: "In Stock",
    stockCount: 150,
    badges: ["Low Fat", "Senior Citizen Friendly", "Kids Favourite"],
    health: {
      sweetness: 7,
      richness: 5,
      protein: 6,
      fitnessScore: 7
    },
    nutrition: {
      calories: 125,
      energy: 523,
      sugar: 15,
      protein: 5.5,
      fat: 1.8,
      cholesterol: 5,
      fiber: 0,
      carbohydrates: 22.0,
      servingSize: "1 piece (60g)"
    },
    freshness: {
      madeTime: "6:00 AM today",
      score: 97,
      bestBeforeDays: 3,
      prepTime: "15 mins"
    }
  },
  {
    id: "milk-cake",
    name: "Milk Cake",
    category: "Traditional",
    tagline: "Caramelised Heritage",
    desc: "Slow-cooked milk reduced over heavy flame to dual golden-brown caramelised layers. Indulgently granular and aromatic.",
    pricePerPiece: 35,
    pricePerKg: 700,
    weightPerPiece: 50,
    image: "/images/sweets/milk_cake.webp",
    accent: "#E6BF65",
    availability: "In Stock",
    stockCount: 80,
    badges: ["High Protein", "Wedding Collection"],
    health: {
      sweetness: 8,
      richness: 9,
      protein: 7,
      fitnessScore: 5
    },
    nutrition: {
      calories: 210,
      energy: 878,
      sugar: 16,
      protein: 6.8,
      fat: 11.5,
      cholesterol: 28,
      fiber: 0.2,
      carbohydrates: 19.8,
      servingSize: "1 piece (50g)"
    },
    freshness: {
      madeTime: "6:15 AM today",
      score: 95,
      bestBeforeDays: 10,
      prepTime: "40 mins"
    }
  },
  {
    id: "peda",
    name: "Kesar Peda",
    category: "Traditional",
    tagline: "Mathura's Finest Classic",
    desc: "Thick condensed milk solids (khoya) kneaded with kesar (saffron), cardamom powder, and hand-stamped with our royal seal.",
    pricePerPiece: 24,
    pricePerKg: 600,
    weightPerPiece: 40,
    image: "/images/sweets/peda.webp",
    accent: "#FFBB77",
    availability: "In Stock",
    stockCount: 160,
    badges: ["Senior Citizen Friendly", "Festival Special"],
    health: {
      sweetness: 7,
      richness: 8,
      protein: 5,
      fitnessScore: 6
    },
    nutrition: {
      calories: 145,
      energy: 606,
      sugar: 11.5,
      protein: 3.8,
      fat: 7.2,
      cholesterol: 18,
      fiber: 0.4,
      carbohydrates: 15.6,
      servingSize: "1 piece (40g)"
    },
    freshness: {
      madeTime: "8:00 AM today",
      score: 99,
      bestBeforeDays: 12,
      prepTime: "15 mins"
    }
  },
  {
    id: "barfi",
    name: "Almond Barfi",
    category: "Traditional",
    tagline: "Rich Almond Fudge",
    desc: "Premium ground almonds and pure condensed milk solids, slow-stirred to absolute smooth perfection, finished with sliced pistachios.",
    pricePerPiece: 43,
    pricePerKg: 950,
    weightPerPiece: 45,
    image: "/images/sweets/barfi.webp",
    accent: "#E8889A",
    availability: "Limited Stock",
    stockCount: 30,
    badges: ["Gluten Free", "Corporate Gifting", "High Protein"],
    health: {
      sweetness: 7,
      richness: 9,
      protein: 7,
      fitnessScore: 6
    },
    nutrition: {
      calories: 175,
      energy: 732,
      sugar: 12.0,
      protein: 5.2,
      fat: 11.8,
      cholesterol: 8,
      fiber: 1.8,
      carbohydrates: 14.5,
      servingSize: "1 piece (45g)"
    },
    freshness: {
      madeTime: "7:15 AM today",
      score: 94,
      bestBeforeDays: 14,
      prepTime: "25 mins"
    }
  },
  {
    id: "jalebi",
    name: "Shahi Jalebi",
    category: "Traditional",
    tagline: "Crispy Saffron Spirals",
    desc: "Intricately spun loops of fermented wheat batter fried crisp in ghee, immediately plunged into bubbling saffron sugar syrup.",
    pricePerPiece: 14,
    pricePerKg: 350,
    weightPerPiece: 40,
    image: "/images/sweets/jalebi.webp",
    accent: "#FF9933",
    availability: "Fresh Batch Preparing",
    stockCount: 0,
    badges: ["Kids Favourite", "Festival Special"],
    health: {
      sweetness: 10,
      richness: 7,
      protein: 2,
      fitnessScore: 4
    },
    nutrition: {
      calories: 150,
      energy: 627,
      sugar: 19.5,
      protein: 1.5,
      fat: 5.5,
      cholesterol: 10,
      fiber: 0.3,
      carbohydrates: 23.5,
      servingSize: "1 piece (40g)"
    },
    freshness: {
      madeTime: "10 mins ago",
      score: 100,
      bestBeforeDays: 2,
      prepTime: "10 mins"
    }
  },
  {
    id: "sf-kaju-katli",
    name: "Sugar Free Kaju Katli",
    category: "Sugar-Free",
    tagline: "Guilt-Free Splendor",
    desc: "Luxury cashews sweetened naturally with organic stevia and erythritol. Retains the exact premium texture and pure silver leaf shine.",
    pricePerPiece: 28,
    pricePerKg: 1100,
    weightPerPiece: 25,
    image: "/images/sweets/kaju_katli.webp",
    accent: "#e3b549ff",
    availability: "In Stock",
    stockCount: 180,
    badges: ["Sugar Free", "Diabetic Friendly", "Low Sugar", "No Added Sugar", "Senior Citizen Friendly", "Weight Conscious"],
    health: {
      sweetness: 4,
      richness: 9,
      protein: 6,
      fitnessScore: 9
    },
    nutrition: {
      calories: 82,
      energy: 343,
      sugar: 0.1,
      protein: 3.0,
      fat: 6.9,
      cholesterol: 0,
      fiber: 0.9,
      carbohydrates: 4.1,
      servingSize: "1 piece (25g)"
    },
    freshness: {
      madeTime: "7:45 AM today",
      score: 97,
      bestBeforeDays: 15,
      prepTime: "25 mins"
    }
  },
  {
    id: "sf-ladoo",
    name: "Sugar Free Motichoor Ladoo",
    category: "Sugar-Free",
    tagline: "Natural Stevia Sweetness",
    desc: "Fine besan flour droplets fried and bound with a natural stevia-saffron reduction, delivering the full traditional taste guilt-free.",
    pricePerPiece: 24,
    pricePerKg: 480,
    weightPerPiece: 50,
    image: "/images/sweets/motichoor_ladoo.webp",
    accent: "#FF9933",
    availability: "In Stock",
    stockCount: 95,
    badges: ["Sugar Free", "Diabetic Friendly", "No Added Sugar", "Low Sugar", "Weight Conscious", "Senior Citizen Friendly"],
    health: {
      sweetness: 5,
      richness: 7,
      protein: 4,
      fitnessScore: 8
    },
    nutrition: {
      calories: 120,
      energy: 502,
      sugar: 0.2,
      protein: 3.5,
      fat: 9.0,
      cholesterol: 10,
      fiber: 1.5,
      carbohydrates: 8.5,
      servingSize: "1 piece (50g)"
    },
    freshness: {
      madeTime: "6:30 AM today",
      score: 98,
      bestBeforeDays: 7,
      prepTime: "30 mins"
    }
  },
  {
    id: "sf-barfi",
    name: "Sugar Free Almond Barfi",
    category: "Sugar-Free",
    tagline: "Keto Almond Perfection",
    desc: "Rich blanched almonds ground and kneaded with milk solids, sweetened with monk fruit. High protein, gluten-free, and keto-friendly.",
    pricePerPiece: 47,
    pricePerKg: 1050,
    weightPerPiece: 45,
    image: "/images/sweets/barfi.webp",
    accent: "#E8889A",
    availability: "In Stock",
    stockCount: 60,
    badges: ["Sugar Free", "Diabetic Friendly", "Low Sugar", "No Added Sugar", "High Protein", "Weight Conscious"],
    health: {
      sweetness: 4,
      richness: 9,
      protein: 8,
      fitnessScore: 9
    },
    nutrition: {
      calories: 130,
      energy: 543,
      sugar: 0.3,
      protein: 6.0,
      fat: 11.2,
      cholesterol: 5,
      fiber: 2.0,
      carbohydrates: 3.8,
      servingSize: "1 piece (45g)"
    },
    freshness: {
      madeTime: "8:30 AM today",
      score: 96,
      bestBeforeDays: 14,
      prepTime: "35 mins"
    }
  },
  {
    id: "sf-peda",
    name: "Sugar Free Kesar Peda",
    category: "Sugar-Free",
    tagline: "Royal Saffron Without Sugar",
    desc: "Creamy cardamom and saffron khoya pedas slow-set without added sugar. Perfect for dietary restriction and mindful indulgence.",
    pricePerPiece: 26,
    pricePerKg: 650,
    weightPerPiece: 40,
    image: "/images/sweets/peda.webp",
    accent: "#FFBB77",
    availability: "Limited Stock",
    stockCount: 20,
    badges: ["Sugar Free", "Diabetic Friendly", "Low Sugar", "No Added Sugar", "Senior Citizen Friendly", "Weight Conscious"],
    health: {
      sweetness: 3,
      richness: 8,
      protein: 5,
      fitnessScore: 8
    },
    nutrition: {
      calories: 98,
      energy: 410,
      sugar: 0.1,
      protein: 4.2,
      fat: 7.0,
      cholesterol: 15,
      fiber: 0.5,
      carbohydrates: 5.2,
      servingSize: "1 piece (40g)"
    },
    freshness: {
      madeTime: "9:00 AM today",
      score: 98,
      bestBeforeDays: 12,
      prepTime: "20 mins"
    }
  },
  {
    id: "aflatoon",
    name: "Aflatoon",
    category: "Traditional",
    tagline: "The Royal Mumbai Classic",
    desc: "A rich, slow-cooked delicacy made with premium mawa (milk solids), ghee, semolina, sugar, and generously loaded with almonds, pistachios, and saffron.",
    pricePerPiece: 24,
    pricePerKg: 480,
    weightPerPiece: 50,
    image: "/images/sweets/aflatoon.png",
    accent: "#8B4513",
    availability: "In Stock",
    stockCount: 150,
    badges: ["Signature Sweet", "Mumbai Special", "Premium Quality"],
    health: {
      sweetness: 8,
      richness: 9,
      protein: 5,
      fitnessScore: 5
    },
    nutrition: {
      calories: 220,
      energy: 920,
      sugar: 15,
      protein: 4.5,
      fat: 12.0,
      cholesterol: 25,
      fiber: 1.0,
      carbohydrates: 20.0,
      servingSize: "1 piece (50g)"
    },
    freshness: {
      madeTime: "7:00 AM today",
      score: 98,
      bestBeforeDays: 20,
      prepTime: "30 mins"
    }
  },
  {
    id: "naan-khatai",
    name: "Naan Khatai",
    category: "Traditional",
    tagline: "Rich Cardamom Shortbread",
    desc: "Traditional rich cardamom-spiced melt-in-the-mouth Indian shortbread cookies baked with pure cow ghee and garnished with premium pistachios.",
    pricePerPiece: 5,
    pricePerKg: 200,
    weightPerPiece: 25,
    image: "/images/sweets/naan_khatai.png",
    accent: "#D2B48C",
    availability: "In Stock",
    stockCount: 300,
    badges: ["Eggless", "Signature Biscuit", "Kids Favourite"],
    health: {
      sweetness: 6,
      richness: 8,
      protein: 4,
      fitnessScore: 6
    },
    nutrition: {
      calories: 110,
      energy: 460,
      sugar: 6.0,
      protein: 1.8,
      fat: 6.2,
      cholesterol: 8,
      fiber: 0.5,
      carbohydrates: 12.0,
      servingSize: "1 piece (25g)"
    },
    freshness: {
      madeTime: "8:00 AM today",
      score: 99,
      bestBeforeDays: 30,
      prepTime: "20 mins"
    }
  },
  {
    id: "coconut-biscuit",
    name: "Coconut Biscuit",
    category: "Traditional",
    tagline: "Toasted Coconut Crunch",
    desc: "Crispy golden cookies packed with rich desiccated coconut, pure butter, and finished with a crispy toasted coconut crust on top.",
    pricePerPiece: 6,
    pricePerKg: 300,
    weightPerPiece: 20,
    image: "/images/sweets/coconut_biscuit.png",
    accent: "#EAE6DF",
    availability: "In Stock",
    stockCount: 250,
    badges: ["Signature Biscuit", "High Fiber", "Kids Favourite"],
    health: {
      sweetness: 7,
      richness: 7,
      protein: 3,
      fitnessScore: 7
    },
    nutrition: {
      calories: 95,
      energy: 397,
      sugar: 5.0,
      protein: 1.2,
      fat: 5.2,
      cholesterol: 5,
      fiber: 1.2,
      carbohydrates: 11.0,
      servingSize: "1 piece (20g)"
    },
    freshness: {
      madeTime: "8:30 AM today",
      score: 98,
      bestBeforeDays: 45,
      prepTime: "15 mins"
    }
  }
];
