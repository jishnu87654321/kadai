import { ArrowRight, ChevronRight, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Search, X } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Skiper50 } from './components/Skiper50';
import { LogoLoop } from './components/LogoLoop';
import ReactLenis from 'lenis/react';
import { StickyCard002 } from './components/StickyCard002';
import HoverMembers from './components/HoverMembers';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Reusable Image Component with fallbacks since Gemini quota missed
const LuxImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
  <img
    src={src}
    alt={alt}
    className={`object-cover ${className}`}
    referrerPolicy="no-referrer"
    loading="lazy"
  />
);

const Preloader = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0); // 0: enter, 1: exit-content, 2: slide-up

  useEffect(() => {
    // Stage 1: Wait 1.5s, then start fading out logo/text
    const t1 = setTimeout(() => {
      setStep(1);
    }, 1500);

    // Stage 2: Wait 2.0s (content fade done), start slide up
    const t2 = setTimeout(() => {
      setStep(2);
    }, 2000);

    // Stage 3: Wait 2.8s (slide up done), finish loading
    const t3 = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ y: "0%" }}
      animate={step === 2 ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-[#380b0b] via-obsidian to-[#1c0505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#cfa85e_1px,_transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={step >= 1 ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="relative w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_50px_rgba(212,175,55,0.5)] flex items-center justify-center mb-8"
        >
          <motion.img
            src="/kadai-logo-symbol.png"
            alt="Kadai Golden Emblem"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
          />
        </motion.div>
        
        <div className="flex flex-col items-center gap-3 font-sans relative z-10">
          <span className="font-serif italic tracking-widest text-3xl text-gold gold-text-gradient">KADAI</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-xs uppercase tracking-[0.4em] text-white/60 font-light">Awakening the Legend</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const allDishes = [
  { id: 1, name: "Kalmi Kabab", category: "Starters & Snacks", desc: "Tender chicken drumsticks marinated in rich spices (2 pieces).", price: "₹370", veg: false, spicy: false, chef: true, keywords: ["chicken", "kabab", "starter", "tandoori"] },
  { id: 2, name: "Reshmi Kabab", category: "Starters & Snacks", desc: "Juicy and tender tandoori kebabs with a smoky flavor that will leave your taste buds wanting more (8 pieces).", price: "₹330", veg: false, spicy: false, chef: false, keywords: ["reshmi", "kabab", "chicken", "tandoori"] },
  { id: 3, name: "Chicken Malai Tikka", category: "Starters & Snacks", desc: "A succulent and creamy grilled chicken marinated in a delicate blend of flavors, perfect for tandoori enthusiasts.", price: "₹340", veg: false, spicy: false, chef: true, keywords: ["chicken", "malai", "tikka", "creamy"] },
  { id: 4, name: "Prawns Pepper Dry", category: "Seafood Specialties", desc: "A succulent and flavorful dish showcasing the natural sweetness of prawns coated in rich, aromatic pepper seasoning.", price: "₹550", veg: false, spicy: true, chef: true, keywords: ["prawns", "pepper", "dry", "seafood"] },
  { id: 5, name: "Anjal Fry", category: "Seafood Specialties", desc: "Crispy and flavorful, this fish fry brings out the best of delicately fried Anjal fish.", price: "₹750", veg: false, spicy: false, chef: false, keywords: ["anjal", "fry", "fish", "seafood"] },
  { id: 6, name: "Crab Ghee Roast Spl", category: "Seafood Specialties", desc: "A delectable coastal delicacy that combines succulent crab with the rich flavors of ghee.", price: "₹780", veg: false, spicy: true, chef: true, keywords: ["crab", "ghee", "roast", "spl", "seafood"] },
  { id: 7, name: "Pomfret Masala Fry", category: "Seafood Specialties", desc: "Indulge in the tantalizing flavors of our mouthwatering fish fry, perfectly seasoned and fried to perfection.", price: "₹740", veg: false, spicy: true, chef: false, keywords: ["pomfret", "masala", "fry", "fish"] },
  { id: 8, name: "Mutton Rogan Ghosh", category: "Main Course", desc: "A delectable and aromatic traditional Mutton curry bursting with flavors from the North Indian region.", price: "₹470", veg: false, spicy: true, chef: true, keywords: ["mutton", "rogan", "ghosh", "curry"] },
  { id: 9, name: "Butter Chicken Boneless", category: "Main Course", desc: "Velvety, succulent chicken simmered in a rich, creamy tomato-based sauce, a perfect blend of aromatic spices.", price: "₹380", veg: false, spicy: false, chef: true, keywords: ["butter", "chicken", "boneless", "curry"] },
  { id: 10, name: "Chicken Ghee Roast SPECIAL", category: "Main Course", desc: "Aromatic and rich, this lip-smacking dish brings together tender chicken cooked in ghee with intense South Indian spices.", price: "₹440", veg: false, spicy: true, chef: true, keywords: ["chicken", "ghee", "roast", "special"] },
  { id: 11, name: "Kundapura Chicken Curry", category: "Main Course", desc: "An aromatic and flavorsome chicken curry from North India, prepared in the traditional Kundapur style.", price: "₹340", veg: false, spicy: true, chef: false, keywords: ["kundapura", "chicken", "curry"] },
  { id: 12, name: "Hydrabadi Mutton Biriyani Special", category: "Biryani & Rice", desc: "A flavorful and aromatic biryani with tender mutton, inspired by the royal cuisine of Hyderabad.", price: "₹450", veg: false, spicy: true, chef: true, keywords: ["hydrabadi", "mutton", "biriyani", "special", "biryani"] },
  { id: 13, name: "Chicken Fried Rice", category: "Biryani & Rice", desc: "A flavorful and aromatic rice dish infused with rich biryani spices and tender chicken.", price: "₹260", veg: false, spicy: false, chef: false, keywords: ["chicken", "fried", "rice"] },
  { id: 14, name: "Fish Biryani Anjal", category: "Biryani & Rice", desc: "A fragrant and flavorsome combination of tender fish and aromatic rice, creating a heavenly biryani experience.", price: "₹750", veg: false, spicy: true, chef: true, keywords: ["fish", "biryani", "anjal"] },
  { id: 15, name: "Egg Fried Rice", category: "Biryani & Rice", desc: "A flavorful and satisfying biryani-style rice dish featuring the richness of eggs and aromatic spices.", price: "₹240", veg: false, spicy: false, chef: false, keywords: ["egg", "fried", "rice"] },
  { id: 16, name: "Tandoori Roti", category: "Breads", desc: "A traditional Indian flatbread, cooked in a clay oven, bursting with delicate flavors and a soft, fluffy texture.", price: "₹55", veg: true, spicy: false, chef: false, keywords: ["tandoori", "roti", "bread"] },
  { id: 17, name: "Tandoori Parota", category: "Breads", desc: "Flavorful and aromatic flatbread cooked to perfection in a traditional Tandoor oven.", price: "₹70", veg: true, spicy: false, chef: false, keywords: ["tandoori", "parota", "bread"] },
  { id: 18, name: "Butter Naan", category: "Breads", desc: "Soft and fluffy flatbread brushed with butter, perfect for soaking up rich curries.", price: "₹65", veg: true, spicy: false, chef: true, keywords: ["butter", "naan", "bread"] },
  { id: 19, name: "Veg Clear Soup", category: "Starters & Snacks", desc: "Delight in a wholesome and comforting Chinese soup bursting with the natural flavors of vegetables.", price: "₹190", veg: true, spicy: false, chef: false, keywords: ["veg", "clear", "soup"] },
  { id: 20, name: "Veg 65", category: "Starters & Snacks", desc: "A delectable fusion dish bursting with flavors from Indian, Chinese, and Tandoori cuisines.", price: "₹240", veg: true, spicy: true, chef: false, keywords: ["veg", "65", "starter"] },
  { id: 21, name: "Mutton Kheema Ball Masala", category: "Main Course", desc: "Delicious mutton balls simmered in a rich and flavorful naaty style gravy.", price: "₹520", veg: false, spicy: true, chef: true, keywords: ["mutton", "kheema", "ball", "masala"] },
  { id: 22, name: "Chilly Chicken Boneless", category: "Starters & Snacks", desc: "Tender boneless chicken stir-fried to perfection, infused with savory flavors of China.", price: "₹350", veg: false, spicy: true, chef: false, keywords: ["chilly", "chicken", "boneless", "chinese"] },
  { id: 23, name: "Guntur Chicken Fry", category: "Main Course", desc: "A mouthwatering, traditional chicken dish bursting with bold flavors and authentic Naaty-style flair.", price: "₹320", veg: false, spicy: true, chef: true, keywords: ["guntur", "chicken", "fry", "naaty"] },
  { id: 24, name: "Mutton Boti Fry", category: "Starters & Snacks", desc: "A delectable and traditional South Indian starter packed with robust flavors.", price: "₹330", veg: false, spicy: true, chef: false, keywords: ["mutton", "boti", "fry"] }
];

const categories = [
  "Starters & Snacks",
  "Seafood Specialties",
  "Main Course",
  "Biryani & Rice",
  "Breads",
  "South Indian"
];

const MenuCardImage = ({ keywords, name }: { keywords?: string[]; name: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-[#1a1208] flex items-center justify-center font-serif text-4xl text-gold border border-gold/20">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80`}
      alt={name}
      width="400"
      height="300"
      loading="lazy"
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 will-change-transform"
    />
  );
};



const MenuOverlay = ({ onClose }: { onClose: () => void }) => {
  const [activeCategory, setActiveCategory] = useState("Starters & Snacks");
  const [selectedDish, setSelectedDish] = useState<typeof allDishes[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const categories = ["Starters & Snacks", "Seafood Specialties", "Main Course", "Biryani & Rice", "Breads", "South Indian"];
  const filterOptions = ["🌿 Veg Only", "⭐ Chef's Picks", "🌶️ Spicy", "💵 Under ₹200", "💵 Under ₹300"];

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  }, []);

  const filteredDishes = useMemo(() => {
    return allDishes.filter(dish => {
      if (searchTerm && !dish.name.toLowerCase().includes(searchTerm.toLowerCase()) && !dish.desc.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (activeFilters.includes("🌿 Veg Only") && !dish.veg) return false;
      if (activeFilters.includes("⭐ Chef's Picks") && !dish.chef) return false;
      if (activeFilters.includes("🌶️ Spicy") && !dish.spicy) return false;

      const priceVal = parseInt(dish.price.replace("₹", ""));
      if (activeFilters.includes("💵 Under ₹200") && priceVal >= 200) return false;
      if (activeFilters.includes("💵 Under ₹300") && priceVal >= 300) return false;

      return true;
    });
  }, [searchTerm, activeFilters]);

  const getCatPillText = (cat: string) => {
    switch (cat) {
      case "Starters & Snacks": return "🍢 Starters & Snacks";
      case "Seafood Specialties": return "🐟 Seafood Specialties";
      case "Main Course": return "🍲 Main Course";
      case "Biryani & Rice": return "🍚 Biryani & Rice";
      case "Breads": return "🫓 Breads";
      case "South Indian": return "🌴 South Indian";
      default: return cat;
    }
  };

  const getCatEyebrow = (cat: string) => {
    switch (cat) {
      case "Starters & Snacks": return "Appetizers & Quick Bites";
      case "Seafood Specialties": return "Fresh from the Coast";
      case "Main Course": return "Hearty Meals";
      case "Biryani & Rice": return "Aromatic Rice Delicacies";
      case "Breads": return "Oven-Baked Goodness";
      case "South Indian": return "Regional Classics";
      default: return "Selected Delicacies";
    }
  };

  const scrollToCat = (cat: string) => {
    setActiveCategory(cat);
    const el = document.getElementById(`cat-${cat.replace(/\s+/g, '-')}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Full Restaurant Menu"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full bg-gradient-to-br from-[#2a0808] via-[#0a0805] to-[#1a0404] text-[#f5edd6] font-sans selection:bg-gold/30 transform-gpu overflow-x-hidden"
    >
      {/* Top Right Close Button */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-[#0a0805]/80 border border-gold/40 text-gold font-serif text-2xl hover:bg-gold hover:text-[#0a0805] hover:scale-110 transition-all duration-300 shadow-2xl cursor-pointer"
      >
        ✕
      </button>

      {/* A) Menu Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[320px] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-[#2a0808] via-[#0f0a06] to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#c9a84c_1px,_transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
        <span className="font-sans font-light tracking-[0.4em] uppercase text-xs sm:text-sm text-gold mb-3 block">The Full Kadai Experience</span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#f5edd6] tracking-wide mb-3 drop-shadow-lg">Our Menu</h1>
        <p className="font-serif italic text-base sm:text-lg text-gold/80 max-w-xl mx-auto mb-4">Every dish a destination. Every bite a memory.</p>
        <div className="w-20 h-[1px] bg-gold/60 mx-auto" />
      </div>

      {/* B) Sticky Category Navigation Bar with Scroll Wheel & Button Support */}
      <div className="sticky top-0 z-40 bg-[#0a0805]/95 backdrop-blur-xl border-b border-gold/20 py-3 sm:py-4 px-4 sm:px-12 shadow-xl flex items-center justify-center">
        <button
          onClick={() => tabsRef.current?.scrollBy({ left: -250, behavior: 'smooth' })}
          aria-label="Scroll left"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black mr-3 transition-colors flex-shrink-0 cursor-pointer"
        >
          &lt;
        </button>
        <div
          ref={tabsRef}
          className="max-w-7xl w-full flex items-center justify-start gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1 px-2 scroll-smooth"
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => scrollToCat(cat)}
                className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans uppercase tracking-[0.2em] text-[11px] sm:text-xs transition-all duration-300 flex-shrink-0 cursor-pointer ${isActive
                  ? "bg-gold text-[#0a0805] font-semibold shadow-[0_0_15px_rgba(201,168,76,0.5)] scale-105"
                  : "bg-transparent text-[#f5edd6]/60 border border-gold/20 hover:border-gold hover:text-gold"
                  }`}
              >
                {getCatPillText(cat)}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => tabsRef.current?.scrollBy({ left: 250, behavior: 'smooth' })}
          aria-label="Scroll right"
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black ml-3 transition-colors flex-shrink-0 cursor-pointer"
        >
          &gt;
        </button>
      </div>

      {/* F) Search & Filter Bar */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-10">
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/80 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dishes, ingredients, cuisines..."
            className="w-full bg-gold/5 border border-gold/30 rounded-full pl-14 pr-12 py-3.5 text-sm sm:text-base text-[#f5edd6] placeholder:text-[#f5edd6]/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-sans tracking-wide transition-all shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f5edd6]/40 hover:text-gold p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filterOptions.map(filter => {
            const isSelected = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-1.5 sm:py-2 rounded-full font-sans text-xs tracking-wider transition-all duration-300 cursor-pointer ${isSelected
                  ? "bg-gold text-[#0a0805] font-semibold shadow-md"
                  : "border border-gold/30 text-[#f5edd6]/70 hover:border-gold hover:text-white"
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-24 space-y-20">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-20 font-serif italic text-xl text-gold/60">
            No dishes found. Try a different search.
          </div>
        ) : (
          categories.map(cat => {
            const catDishes = filteredDishes.filter(d => d.category === cat);
            if (catDishes.length === 0) return null;

            return (
              <div key={cat} id={`cat-${cat.replace(/\s+/g, '-')}`} className="scroll-mt-32">
                <div className="mb-8 text-center sm:text-left">
                  <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold/80 block mb-1 font-light">
                    {getCatEyebrow(cat)}
                  </span>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold/25 pb-4">
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#f5edd6] font-semibold tracking-wide">{cat}</h2>
                    <span className="font-sans text-xs tracking-widest uppercase text-gold/60 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                      {catDishes.length} {catDishes.length === 1 ? "Delicacy" : "Delicacies"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {catDishes.map(dish => (
                    <div
                      key={dish.id}
                      onClick={() => setSelectedDish(dish)}
                      className="group flex flex-col bg-[#1a1208] rounded-2xl border border-gold/15 overflow-hidden shadow-lg hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-gold transition-all duration-350 transform-gpu cursor-pointer"
                    >
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0a0805]">
                        <MenuCardImage keywords={dish.keywords} name={dish.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 bg-gold/90 text-[#0a0805] text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-md font-sans">
                          {dish.category}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-serif text-lg sm:text-xl text-[#f5edd6] font-semibold tracking-wide group-hover:text-gold transition-colors">
                              {dish.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm flex-shrink-0">
                              {dish.veg ? (
                                <span title="Vegetarian" className="text-emerald-400">🌿</span>
                              ) : null}
                              {dish.spicy ? (
                                <span title="Spicy" className="text-rose-500">🌶️</span>
                              ) : null}
                              {dish.chef ? (
                                <span title="Chef Special" className="text-amber-400">⭐</span>
                              ) : null}
                            </div>
                          </div>
                          <p className="font-sans text-xs sm:text-sm text-[#f5edd6]/65 leading-relaxed line-clamp-2 font-light">
                            {dish.desc}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gold/15 flex items-center justify-between">
                          <span className="font-serif text-lg sm:text-xl font-bold text-gold tracking-wider">
                            {dish.price}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-widest text-gold/50 group-hover:text-gold transition-colors flex items-center gap-1">
                            Explore <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* G) "Reserve a Table" CTA strip */}
      <div className="w-full bg-gradient-to-br from-[#1a1208] to-[#2d1810] border-t border-b border-gold/30 py-16 sm:py-20 text-center px-6 mt-12 shadow-2xl">
        <h3 className="font-serif text-3xl sm:text-4xl text-[#f5edd6] mb-6 tracking-wide drop-shadow">Ready to Experience This?</h3>
        <button
          onClick={() => {
            onClose();
            setTimeout(() => {
              const el = document.getElementById("footer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 300);
          }}
          className="bg-gold text-[#0a0805] font-sans font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm px-8 sm:px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(201,168,76,0.4)] hover:bg-white hover:shadow-[0_10px_35px_rgba(255,255,255,0.6)] transition-all duration-300 cursor-pointer"
        >
          Reserve Your Table
        </button>
      </div>

      {/* Dish Details Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#050505]/90 backdrop-blur-md"
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1208] to-obsidian border border-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all shadow-md cursor-pointer"
              >
                ✕
              </button>

              <div className="w-full h-56 sm:h-72 relative flex-shrink-0">
                <MenuCardImage keywords={selectedDish.keywords} name={selectedDish.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90 pointer-events-none" />
              </div>

              <div className="p-6 sm:p-8 relative z-10 flex-1 overflow-y-auto scrollbar-none">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-gold/20">
                    {selectedDish.category}
                  </span>
                  {selectedDish.veg && <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1.5 rounded-full border border-emerald-500/20">🌿 Veg</span>}
                  {selectedDish.spicy && <span className="bg-rose-500/10 text-rose-400 text-xs px-2 py-1.5 rounded-full border border-rose-500/20">🌶️ Spicy</span>}
                  {selectedDish.chef && <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1.5 rounded-full border border-amber-500/20">⭐ Chef's Special</span>}
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-[#f5edd6] font-bold mb-4">
                  {selectedDish.name}
                </h2>

                <p className="font-sans text-[#f5edd6]/80 text-sm sm:text-base leading-relaxed mb-8">
                  {selectedDish.desc}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gold/15 mt-auto">
                  <span className="font-serif text-3xl font-bold text-gold">
                    {selectedDish.price}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDish(null);
                    }}
                    className="bg-gold text-black px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-xs sm:text-sm hover:bg-[#f5edd6] transition-colors shadow-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const styleLogos1 = [
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🍗 HYDERABADI STYLE</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🔥 NATI STYLE</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🦐 MANGLORE STYLE</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🐟 COASTAL CUISINE</span> },
];

const styleLogos2 = [
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🌶️ ANDHRA STYLE</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🏺 TANDOORI DELIGHTS</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🥢 CHINESE FAVORITES</span> },
  { node: <span className="font-serif italic text-gold tracking-widest text-sm sm:text-base py-2 px-4 bg-gold/5 rounded-full border border-gold/25 hover:border-gold hover:bg-gold/10 transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-2">🍛 NORTH INDIAN CLASSICS</span> },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const navigation = ['THE JOURNEY', 'OUR CRAFT', 'THE MENU', 'THE ARTISANS'];

  // Scroll Lock & GSAP Refresh on load completion
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      
      // Let the main page fade-in complete, then refresh ScrollTrigger to align all coordinates
      const timer = setTimeout(() => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  // Parallax implementation
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);

  if (showMenu) {
    return <MenuOverlay onClose={() => setShowMenu(false)} />;
  }


  return (
    <ReactLenis root>
      <AnimatePresence mode="wait">
        {loading && <Preloader onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-[#380b0b] via-[#080202] to-[#1c0505] text-slate-light selection:bg-gold/30 flex flex-col relative overflow-hidden"
      >
        {/* Subtle cinematic red ambient light orbs in the background */}
        <div className="absolute top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-crimson/8 rounded-full blur-[220px] pointer-events-none z-0 animate-pulse will-change-transform transform-gpu" />
        <div className="absolute top-[45%] -right-[10%] w-[55vw] h-[55vw] bg-[#70100b]/8 rounded-full blur-[220px] pointer-events-none z-0 animate-pulse will-change-transform transform-gpu" />
        <div className="absolute bottom-[15%] left-[5%] w-[45vw] h-[45vw] bg-crimson/8 rounded-full blur-[220px] pointer-events-none z-0 animate-pulse will-change-transform transform-gpu" />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-serif italic text-3xl font-semibold tracking-wider gold-text-gradient">KADAI</span>
            <span className="hidden sm:inline font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 font-light border-l border-white/20 pl-3">Multicuisine Family Restaurant</span>
          </div>
          <nav className="hidden md:flex gap-6 lg:gap-10 uppercase text-[10px] tracking-[0.15em] font-semibold text-white/70 items-center">
            {navigation.map(nav => {
              if (nav === 'THE MENU') {
                return (
                  <button
                    key={nav}
                    onClick={() => setShowMenu(true)}
                    className="hover:text-gold transition-colors duration-300 uppercase text-[10px] tracking-[0.15em] font-semibold text-white/70 cursor-pointer"
                  >
                    {nav}
                  </button>
                );
              }
              let href = "#";
              if (nav === 'THE JOURNEY') href = "#story";
              else if (nav === 'OUR CRAFT') href = "#craft";
              else if (nav === "THE ARTISANS") href = "#artisans";
              return (
                <a key={nav} href={href} className="hover:text-gold transition-colors duration-300">{nav}</a>
              );
            })}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] w-full border-b border-white/10 flex flex-col justify-center overflow-hidden pt-8 md:pt-12 pb-16">
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-full h-[140%] -top-[20%]"
              style={{ y: yParallax }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
              >
                <source src="/kadai-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 px-8 md:px-16 lg:px-20 w-full max-w-6xl mr-auto font-sans">

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.08] tracking-tight text-white mb-8 max-w-5xl">
              Kadai: Where hearth met <span className="font-serif gold-text-gradient italic font-normal">Metal</span>, and flavor became legend.
            </h1>
            <p className="text-white/70 text-base md:text-lg tracking-wide max-w-xl mb-10 leading-relaxed font-light">
              Experience time-honored cuisine from the heart of the wok to the depths of the ocean.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#craft" className="group border border-gold/40 bg-obsidian/60 backdrop-blur-md text-gold text-sm tracking-wide px-8 py-4 flex items-center gap-4 hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-500 rounded-full font-medium shadow-xl">
                Explore Our Craft
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => setShowMenu(true)}
                className="group border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm tracking-wide px-8 py-4 flex items-center gap-4 hover:bg-white hover:text-obsidian transition-all duration-500 rounded-full font-medium shadow-xl cursor-pointer"
              >
                View Our Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <main className="w-full max-w-[1600px] mx-auto flex flex-col">

          {/* Text & Image Sequence */}
          <section id="story" className="p-8 md:p-16 xl:p-24 border-b border-white/10 flex flex-col gap-16 md:gap-24">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 tracking-tight text-white">
                  THE KADAI <span className="gold-text-gradient italic">STORY</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed font-light">
                  Established in 1999, Kadai is a premier multi-cuisine fine dine restaurant renowned for its rich culinary heritage and exceptional seafood specialties. Proudly serving the Yelahanka New Town community since 2021, Kadai offers a flavorful journey through Coastal cuisine, Tandoori delights, Chinese favorites, North Indian classics, Naati-style dishes, and authentic Andhra-style meals. With its elegant ambiance and unwavering commitment to quality, Kadai is the perfect destination for family gatherings, business lunches, and special occasions.
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden lux-border group">
                <LuxImage
                  src="/kadai-chef-story.jpg"
                  alt="Kadai master chef wok tossing over flame"
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Logo Loops in the gap in between */}
            <div className="w-full overflow-hidden py-10 bg-[#050303]/40 border-t border-b border-white/10 rounded-3xl relative my-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#cfa85e_1px,_transparent_1px)] bg-[size:32px_32px] opacity-5 pointer-events-none" />
              <div className="text-center mb-8 relative z-10">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-light block mb-1">Culinary Heritage</span>
                <h3 className="font-serif text-lg sm:text-2xl text-white font-medium tracking-wide">OUR SPECIALTIES</h3>
                <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-2" />
              </div>

              <div className="flex flex-col gap-6 w-full">
                {/* Loop 1: Left */}
                <div className="w-full overflow-hidden z-10">
                  <LogoLoop
                    logos={styleLogos1}
                    speed={40}
                    direction="left"
                    logoHeight={52}
                    gap={24}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="transparent"
                    ariaLabel="Kadai Food Styles Row 1"
                  />
                </div>

                {/* Loop 2: Right */}
                <div className="w-full overflow-hidden z-10">
                  <LogoLoop
                    logos={styleLogos2}
                    speed={40}
                    direction="right"
                    logoHeight={52}
                    gap={24}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="transparent"
                    ariaLabel="Kadai Food Styles Row 2"
                  />
                </div>
              </div>
            </div>

            <div id="craft">
              <Skiper50 />
            </div>
          </section>

          {/* Team Showcase */}
          <section id="artisans" className="relative border-b border-white/10 bg-gradient-to-b from-obsidian to-obsidian-light/50">
            {/* Header section overlay */}
            <div className="p-8 md:p-16 xl:px-24 xl:py-16 pb-0 md:pb-0 xl:pb-0">
              <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl leading-tight relative z-10 text-white pb-6 border-b border-white/10 inline-block pr-12">
                THE ARTISANS OF KADAI,<br />
                <span className="gold-text-gradient italic">MASTERS OF SPICE, FIRE, AND SOUL.</span>
              </h2>
            </div>
            
            <div className="w-full mt-8">
              <HoverMembers />
            </div>
          </section>

          {/* Menu Showcase Section with Cinematic Spices Background */}
          <section id="menu" className="relative isolate pt-40 md:pt-48 pb-64 md:pb-80 px-8 md:px-16 xl:px-24 border-b border-white/10 overflow-hidden min-h-[900px] md:min-h-[1000px] flex flex-col items-center justify-start text-center group">
            <div className="absolute inset-0 -z-10 overflow-hidden bg-obsidian">
              <LuxImage
                src="/kadai-spices.jpg"
                alt="Vibrant aromatic spices and wooden culinary board"
                className="w-full h-full opacity-85 group-hover:scale-105 transition-all duration-1000 object-cover object-center filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian opacity-90" />
              <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-[1px]" />
            </div>

            <div className="max-w-3xl mx-auto mt-12 md:mt-20 lg:mt-24 relative z-30 font-sans backdrop-blur-md bg-obsidian/60 py-8 md:py-10 px-8 sm:px-12 md:px-16 rounded-3xl border border-white/10 shadow-2xl transition-transform duration-500 text-center">
              <span className="text-xs uppercase tracking-[0.4em] text-gold font-light mb-2 block animate-pulse sm:inline-block">Experience Perfection</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight font-serif drop-shadow-2xl mb-4">
                Kadai <span className="italic gold-text-gradient font-normal">Multicuisine</span> Family Restaurant Menu
              </h2>
              <div className="w-24 h-[1px] bg-gold/50 mx-auto mt-2" />
            </div>

            {/* Explore Full Menu button & Golden Wok Logo Emblem in the lower wooden area */}
            <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto gap-6">
              <button
                onClick={() => setShowMenu(true)}
                className="group border border-gold/60 bg-obsidian/90 backdrop-blur-xl text-gold font-sans uppercase tracking-[0.25em] text-xs md:text-sm px-8 py-4 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.9)] hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-500 flex items-center gap-3 font-semibold cursor-pointer"
              >
                Explore Full Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="relative w-36 h-36 md:w-48 md:h-48 drop-shadow-[0_0_35px_rgba(212,175,55,0.6)] animate-pulse pointer-events-none">
                <img
                  src="/kadai-logo-symbol.png"
                  alt="Kadai Golden Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            {/* Cascading Biryani Dish Pop-out on the left side with gentle floating motion */}
            <div className="absolute -left-6 md:left-2 xl:left-8 top-[45%] md:top-[50%] z-20 pointer-events-none">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-64 h-64 md:w-80 md:h-80 xl:w-[380px] xl:h-[380px] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
              >
                <img
                  src="/kadai-cascading-dish.png"
                  alt="Signature Cascading Biryani"
                  className="w-full h-full object-contain filter contrast-110 brightness-105 object-center"
                />
              </motion.div>
            </div>

            {/* Royal Thali (Andhra Meal) Platter positioned in the upper right corner */}
            <div className="absolute -right-6 md:right-2 xl:right-8 -top-4 md:top-2 xl:top-6 z-20 pointer-events-none">
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                className="relative w-64 h-64 md:w-80 md:h-80 xl:w-[380px] xl:h-[380px] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
              >
                <img
                  src="/kadai-royal-thali-new.png"
                  alt="Kadai Royal Thali / Andhra Meal"
                  className="w-full h-full object-contain filter contrast-110 brightness-105 object-center"
                />
              </motion.div>
            </div>
          </section>

          {/* Atmosphere Section / Restaurant Life Sticky Showcase */}
          <section className="relative bg-obsidian py-12 md:py-20 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-8 mb-4 text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-light block mb-2">THE KADAI EXPERIENCE</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
                Behind the <span className="gold-text-gradient italic">Scenes</span>
              </h2>
              <div className="w-16 h-[1px] bg-gold/50 mx-auto mt-4" />
            </div>

            <div className="w-full">
              <StickyCard002
                cards={[
                  {
                    id: 1,
                    image: "/chef_team.png",
                    title: "The Culinary Maestros",
                    description: "Our team of award-winning chefs led by Executive Chef Raghavan, bringing decades of coastal and multi-cuisine culinary mastery to your table."
                  },
                  {
                    id: 2,
                    image: "/dining_hall.png",
                    title: "Sanctuary of Luxury",
                    description: "A meticulously crafted dining hall showcasing deep obsidian tables, warm candle glow, and rich hammered bronze accents for a cozy fine-dining aura."
                  },
                  {
                    id: 3,
                    image: "/kitchen_action.png",
                    title: "Flame & Wok Artistry",
                    description: "Watch our master chefs coordinate intense fire wok tossings and tandoori heat in our show kitchen, where raw ingredients become legendary."
                  },
                  {
                    id: 4,
                    image: "/plated_dish.png",
                    title: "Gourmet Seafood Showcase",
                    description: "Celebrating fresh catches from the local coast, exquisitely prepared and plated with precision sauce drizzles and aromatic herbs."
                  }
                ]}
              />
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer id="footer" className="w-full bg-[#030303] pt-20 pb-10 mt-auto">
          <div className="max-w-[1600px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-5 gap-16 text-sm font-light">

            <div className="md:col-span-2">
              <div className="font-serif italic text-5xl font-semibold tracking-wider gold-text-gradient mb-8">
                KADAI
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-md">
                Where hearth met metal, and flavor became legend. Join us for an unparalleled journey through spice and fire.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8">Contact</h4>
              <ul className="space-y-6 text-white/70">
                <li className="flex items-start gap-4 text-sm"><MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" /> Yelahanka New Town, Bengaluru, Karnataka 560064</li>
                <li className="flex items-center gap-4 text-sm"><Phone className="w-5 h-5 text-gold shrink-0" /> +91 80 2856 0198</li>
                <li className="flex items-center gap-4 text-sm hover:text-gold transition-colors"><Mail className="w-5 h-5 text-gold shrink-0" /> reservations@kadai.com</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8">Stay Connected</h4>
              <div className="flex gap-5 mb-10 text-white/60">
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-300"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-300"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-300"><Twitter className="w-5 h-5" /></a>
              </div>

              <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">Join our Society</h4>
              <div className="flex border-b border-white/20 pb-3 relative">
                <input type="email" placeholder="YOUR EMAIL ADDRESS" className="bg-transparent flex-1 text-sm text-white uppercase tracking-widest focus:outline-none" />
                <button className="text-gold uppercase text-xs tracking-[0.2em] hover:text-white transition-colors">Sign Up <ChevronRight className="inline w-4 h-4" /></button>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8">Explore</h4>
              <ul className="space-y-4 text-white/70 text-sm tracking-widest uppercase">
                {navigation.map(nav => (
                  <li key={nav}><a href="#" className="hover:text-gold transition-colors">{nav}</a></li>
                ))}
              </ul>
            </div>

          </div>

          <div className="max-w-[1600px] mx-auto px-8 md:px-12 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs uppercase tracking-widest text-white/30">
            <p>&copy; {new Date().getFullYear()} KADAI RESTAURANT. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-gold">PRIVACY POLICY</a>
              <a href="#" className="hover:text-gold">TERMS OF SERVICE</a>
            </div>
          </div>
        </footer>

      </motion.div>
    </ReactLenis>
  );
}

